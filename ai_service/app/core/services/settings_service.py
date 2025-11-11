import uuid
from datetime import datetime
from app.utils.audit import AuditMixin
from app.core.async_session_manager import AsyncMongoDbManager

async def get_settings():
    async with AsyncMongoDbManager() as db:
        existing_prompt = await db.settings.find_one()
        return existing_prompt

async def save_settings(provider: str, model_id: str):
    async with AsyncMongoDbManager() as db:
        #check if prompt is existed
        existing_prompt = await db.settings.count_documents({})
        
        if existing_prompt == 0: 
            new_prompt = {
                "_id": str(uuid.uuid4()),
                "provider": provider,
                "model_id": model_id,
                **AuditMixin().generate_audit_fields(created_by="system")
            }
            await db.settings.insert_one(new_prompt)
            return new_prompt
        else:
            existing_prompt = await db.settings.find_one()
            existing_prompt['provider'] = provider
            existing_prompt['model_id'] = model_id
            existing_prompt['UpdatedAt'] = datetime.now()
            existing_prompt['UpdatedBy'] = "system"
            
            await db.settings.update_one({}, {"$set": existing_prompt})
            return existing_prompt
            
            