from datetime import datetime
import uuid
from typing import Any, Dict
from app.utils.audit import AuditMixin
from app.core.dtos.Pagination import Pagination
from app.core.dtos.PromptDto import ModelPromptsDto, Prompt, PromptFilter
from app.core.async_session_manager import AsyncMongoDbManager

async def save_prompt(model: str, prompt:Prompt) -> Dict[str, Any]:
    async with AsyncMongoDbManager() as db:
        #check if prompt is existed
        existing_prompt = await db.prompts.find_one({"model": model})
        
        if not existing_prompt: 
            new_prompt = {
                "_id": str(uuid.uuid4()),
                "model": model,
                "prompts": [{
                    "prompt_type": prompt.prompt_type,
                    "content": prompt.content
                    }],
                **AuditMixin().generate_audit_fields(created_by="system")
            }
            await db.prompts.insert_one(new_prompt)
            return new_prompt
        else:
            for p in existing_prompt['prompts']:
                if p['prompt_type'] == prompt.prompt_type:
                    p['content'] = prompt.content
                    break
            else:
                existing_prompt['prompts'].append({
                    "prompt_type": prompt.prompt_type,
                    "content": prompt.content
                })
            existing_prompt['UpdatedAt'] = datetime.now()
            existing_prompt['UpdatedBy'] = "system"
                
            await db.prompts.update_one({"model": model}, {"$set": {"prompts": existing_prompt['prompts']}})
            return existing_prompt
        
async def get_prompt(filter: PromptFilter) -> Pagination[ModelPromptsDto]:
    async with AsyncMongoDbManager() as db:
        query = {}
        
        if filter.query:
            query = {
                "$or": [
                    {"model": {"$regex": filter.query, "$options": "i"}},
                    {"prompts.prompt_type": {"$regex": filter.query, "$options": "i"}},
                    {"prompts.content": {"$regex": filter.query, "$options": "i"}}
                ]
            }
        
        total_items = await db.prompts.count_documents(query)    
        
        skip_amount = (filter.page_number - 1) * filter.page_size
        
        cursor = db["prompts"].find(query).sort("_id", 1).skip(skip_amount).limit(filter.page_size)
        prompts = await cursor.to_list(length=filter.page_size)
        
        return Pagination(
            page_index=filter.page_number,
            page_size=filter.page_size,
            total_items=total_items,
            items=prompts
        )
        
async def get_prompts_by_model_and_type(model: str, prompt_type: str, parameters: list[str]) -> str:
    async with AsyncMongoDbManager() as db:
        existing_model_prompts = await db.prompts.find_one({"model":model})
        
        if existing_model_prompts:
            for p in existing_model_prompts['prompts']:
                if p['prompt_type'] == prompt_type:
                    content = p['content']
                    #Replace placeholders with arguments
                    placeholder_count = content.count('{{}}')
                    
                    if placeholder_count == 0:
                        return content
                    
                    if len(parameters) != placeholder_count:
                        raise ValueError(
                            f"Mismatched parameters: Expected {placeholder_count} placeholders, "
                            f"but got {len(parameters)} arguments"
                        )
                    formatted_content = content
                    for param in parameters:
                        formatted_content = formatted_content.replace('{{}}', param, 1)
                    return formatted_content
                
        raise ValueError(f"Prompt with model {model} and type {prompt_type} not found")
    
async def delete_prompts_by_model(model: str):
    async with AsyncMongoDbManager() as db:
        await db.prompts.find_one_and_delete({"model": model})
        
async def delete_prompt(model: str, prompt_type: str):
    async with AsyncMongoDbManager() as db:
        existing_model_prompts = await db.prompts.find_one({"model":model})
        
        if existing_model_prompts:
            for p in existing_model_prompts['prompts']:
                if p['prompt_type'] == prompt_type:
                    existing_model_prompts['prompts'].remove(p)
                    if(len(existing_model_prompts['prompts']) == 0):
                        await db.prompts.find_one_and_delete({"model": model})
                        return
                    break
                
            await db.prompts.update_one({"model": model}, {"$set": {"prompts": existing_model_prompts['prompts']}})
        
