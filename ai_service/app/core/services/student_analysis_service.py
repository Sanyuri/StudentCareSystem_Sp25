import re
import logging
import datetime
import numpy as np
from typing import Dict, List
from app.core.dtos.Pagination import Pagination
from app.core.services.model_manager import model_manager
from app.core.dtos.StudentPointDto import StudentPointDto
from app.core.dtos.StudentAnalysisFilter import StudentAnalysisFilter
from app.core.async_session_manager import AsyncMongoDbManager

class StudentAnalysisService:
    def __init__(self):
        self.logger = logging.getLogger(__name__)
        
    async def _get_mongodb_session(self) -> AsyncMongoDbManager:
        """Get MongoDB session with async context manager"""
        return AsyncMongoDbManager()
        
    def _get_query_match_conditions(self, tenant_name: str, filter: StudentAnalysisFilter) -> dict:
        """Build match conditions for the query"""
        match_conditions = {
            "Campus": tenant_name
        }
        
        if filter.ignored_student_codes:
            match_conditions["StudentCode"] = {"$nin": filter.ignored_student_codes}
            
        if filter.ignored_status_codes:
            match_conditions["StatusCode"] = {"$nin": filter.ignored_status_codes}
        
        if filter.status_codes:
            match_conditions["StatusCode"] = {"$in": filter.status_codes}
            
        if filter.query:
            match_conditions["$or"] = [
                { "StudentName": { "$regex": filter.query, "$options": "i" } },
                { "StudentCode": { "$regex": filter.query, "$options": "i" } }
            ]
        
        return match_conditions

    def _get_range_match_conditions(self, filter: StudentAnalysisFilter) -> dict:
        """Build match conditions for GpaGap, NumberOfRemainingFailSubjects, CurrentTermNo"""
        match_conditions = {"StudentAchievements.0": {"$exists": 'true'}}
            
        if filter.min_gpa_gap is not None:
            match_conditions["StudentAchievements.0.GpaGap"] = {"$gte": filter.min_gpa_gap}
        if filter.max_gpa_gap is not None:
            match_conditions["StudentAchievements.0.GpaGap"] = match_conditions.get("StudentAchievements.0.GpaGap", {}) | {"$lte": filter.max_gpa_gap}
        if filter.min_fail_subjects is not None:
            match_conditions["StudentAchievements.0.NumberOfRemainingFailSubjects"] = {"$gte": filter.min_fail_subjects}
        if filter.max_fail_subjects is not None:
            match_conditions["StudentAchievements.0.NumberOfRemainingFailSubjects"] = match_conditions.get("StudentAchievements.0.NumberOfRemainingFailSubjects", {}) | {"$lte": filter.max_fail_subjects}
        if filter.min_current_term_no is not None:
            match_conditions["CurrentTermNo"] = {"$gte": filter.min_current_term_no}
        if filter.max_current_term_no is not None:
            match_conditions["CurrentTermNo"] = match_conditions.get("CurrentTermNo", {}) | {"$lte": filter.max_current_term_no}
            
        return match_conditions
        
    def _build_attendance_filter_pipeline(self, filter: StudentAnalysisFilter) -> List[dict]:
        """Build pipeline stages for filtering by attendance"""
        attendance_lookup_stage = {
            "$lookup": {
                "from": "student_attendances",
                "let": {"studentCode": "$StudentCode"},
                "pipeline": [
                    {
                        "$match": {
                            "$expr": {
                                "$eq": ["$StudentCode", "$$studentCode"]
                            }
                        }
                    },
                    {
                        "$project": {
                            "StudentAchievements": {
                                "$filter": {
                                    "input": "$StudentAchievements",
                                    "as": "achievement",
                                    "cond": {
                                        "$eq": ["$$achievement.SemesterName", filter.semester_name]
                                    }
                                }
                            },
                            "_id": 0
                        }
                    }
                ],
                "as": "attendance_info"
            }
        }
        
        # Add $match stage if any attendance filter is applied
        match_conditions = None
        if (filter.min_absence_rate is not None or 
            filter.max_absence_rate is not None or 
            filter.is_attendance_exempted is not None):
            
            match_conditions = {
                "attendance_info.0.StudentAchievements.0": {"$exists": True}
            }

            if filter.min_absence_rate is not None:
                match_conditions["attendance_info.0.StudentAchievements.0.AbsenceRate"] = {
                    "$gte": filter.min_absence_rate
                }

            if filter.max_absence_rate is not None:
                existing = match_conditions.get("attendance_info.0.StudentAchievements.0.AbsenceRate", {})
                match_conditions["attendance_info.0.StudentAchievements.0.AbsenceRate"] = {
                    **existing,
                    "$lte": filter.max_absence_rate
                }

            if filter.is_attendance_exempted is not None:
                match_conditions["attendance_info.0.StudentAchievements.0.IsAttendanceExempted"] = (
                    filter.is_attendance_exempted
                )

        # Return full list of pipeline stages
        stages = [attendance_lookup_stage]
        if match_conditions:
            stages.append({"$match": match_conditions})
        
        return stages

    async def get_student_analysis(self, tenant_name: str, 
                                  filter: StudentAnalysisFilter) -> Pagination[StudentPointDto]:
        """
        Get student analysis results based on filter criteria
        """
        try:
            async with await self._get_mongodb_session() as db_session:
                pipeline = []
                
                # Match by campus name and search value
                match_conditions = self._get_query_match_conditions(tenant_name, filter)
                pipeline.append({"$match": match_conditions})
                
                # Stage 2: extract StudentAchievements by semester_name
                pipeline.append({
                    "$addFields": {
                        "StudentAchievements": {
                            "$filter": {
                                "input": "$StudentAchievements",
                                "as": "achievement",
                                "cond": {"$eq": ["$$achievement.SemesterName", filter.semester_name]}
                            }
                        }
                    }
                })
                
                # Stage 3: Match by StudentAchievements.0 exists and filter by GpaGap, NumberOfRemainingFailSubjects
                match_conditions = self._get_range_match_conditions(filter)
                pipeline.append({"$match": match_conditions})
                
                # Add attendance filter pipeline
                pipeline.extend(self._build_attendance_filter_pipeline(filter))
                
                # Project fields needed for output
                pipeline.append({
                    "$project": {
                        "student_code": "$StudentCode",
                        "student_name": "$StudentName",
                        "gpa_gap": {"$arrayElemAt": ["$StudentAchievements.GpaGap", 0]},
                        "number_of_remaining_failed_subjects": {"$arrayElemAt": ["$StudentAchievements.NumberOfRemainingFailSubjects", 0]},
                        "absence_rate": {
                            "$convert": {
                                "input": {
                                    "$cond": {
                                        "if": {"$isArray": {"$arrayElemAt": ["$attendance_info.StudentAchievements.AbsenceRate", 0]}},
                                        "then": {"$arrayElemAt": [{"$arrayElemAt": ["$attendance_info.StudentAchievements.AbsenceRate", 0]}, 0]},
                                        "else": {"$ifNull": [{"$arrayElemAt": ["$attendance_info.StudentAchievements.AbsenceRate", 0]}, 0.0]}
                                    }
                                },
                                "to": "double",
                                "onError": 0.0
                            }
                        },
                        "is_attendance_exempted": {
                            "$convert": {
                                "input": {
                                    "$cond": {
                                        "if": {"$isArray": {"$arrayElemAt": ["$attendance_info.StudentAchievements.IsAttendanceExempted", 0]}},
                                        "then": {"$arrayElemAt": [{"$arrayElemAt": ["$attendance_info.StudentAchievements.IsAttendanceExempted", 0]}, 0]},
                                        "else": {"$ifNull": [{"$arrayElemAt": ["$attendance_info.StudentAchievements.IsAttendanceExempted", 0]}, 'false']}
                                    }
                                },
                                "to": "bool",
                                "onError": 'false'
                            }
                        },
                        "created_at": {"$arrayElemAt": ["$StudentAchievements.CreatedAt", 0]},
                        "topsis_score": {"$arrayElemAt": ["$StudentAchievements.TopsisScore", 0]},
                        "care_reason": {
                            "$ifNull": [
                                {"$arrayElemAt": ["$StudentAchievements.CareReason", 0]},
                                None
                            ]
                        }
                    }
                })
                
                # Sorting
                if filter.order_by_topsis_score is None:
                    pipeline.append({"$sort": {"created_at": -1}})
                else:
                    sort_direction = 1 if filter.order_by_topsis_score else -1
                    pipeline.append({"$sort": {"topsis_score": sort_direction}})
                
                # Save pipeline for count before pagination
                count_pipeline = pipeline.copy()
                count_pipeline.append({"$count": "total"})
                
                # Add pagination
                pipeline.append({"$skip": (filter.page_number - 1) * filter.page_size})
                pipeline.append({"$limit": filter.page_size})
                
                # Execute aggregation with index hint
                cursor = db_session.student_points.aggregate(
                    pipeline,
                    hint={"StudentCode": 1, "Campus": 1}  # Guarantee that the index is created
                )
                
                rows = await cursor.to_list(length=None)
                
                if not rows:
                    return Pagination(
                        page_index=filter.page_number,
                        page_size=filter.page_size,
                        total_items=0,
                        items=[]
                    )
                
                # Get total count for pagination
                total_items_cursor = db_session.student_points.aggregate(count_pipeline)
                total_items_result = await total_items_cursor.to_list(length=1)
                total_items = total_items_result[0].get("total", 0) if total_items_result else 0
                
                # Apply clustering model
                student_points = await self._apply_clustering_model(rows)
                
                return Pagination(
                    page_index=filter.page_number,
                    page_size=filter.page_size,
                    total_items=total_items,
                    items=student_points
                )
        except Exception as e:
            self.logger.error(f"Error in get_student_analysis: {str(e)}")
            raise
            
    async def _apply_clustering_model(self, rows: List[dict]) -> List[StudentPointDto]:
        """Apply clustering model to the query results"""
        try:
            scaler = model_manager.get_model(name="scaler")
            kmeans_model = model_manager.get_model(name="kmeans_model")

            data_for_clustering = np.array([
                [row["gpa_gap"], row["number_of_remaining_failed_subjects"], row["absence_rate"]]
                for row in rows
            ])
            data_scaled = scaler.transform(data_for_clustering)
            cluster_labels = kmeans_model.predict(data_scaled)

        except Exception as e:
            self.logger.warning(f"Clustering fallback: {str(e)}")
            cluster_labels = [0] * len(rows)
        
        return [
            StudentPointDto(
                student_code=row["student_code"],
                student_name=row["student_name"],
                gpa_gap=row["gpa_gap"],
                number_of_remaining_fail_subjects=row["number_of_remaining_failed_subjects"],
                absence_rate=float(row["absence_rate"]),
                is_attendance_exempted=bool(row["is_attendance_exempted"]),
                topsis_score=row["topsis_score"],
                cluster=int(cluster_labels[i]),
                care_reason=row["care_reason"]
            ) for i, row in enumerate(rows)
        ]
        
    STUDENT_CARE_SELECTION_REASON_PROMPT_TYPE = "explain selection reasons"
    async def generate_and_save_student_care_reasons(
        self,
        tenant_name: str,
        semester_name: str,
        number_of_students: int = 200,
        ignored_student_codes: list[str] = None,
        ignored_status_codes: list[str] = None
    ):
        if not tenant_name:
            self.logger.error("Tenant name is null or empty")
            return
        
        total_reason_map: Dict[str, str] = {}
        
        # Loop every 10 students
        for i in range(0, number_of_students, 10):
            student_filter = StudentAnalysisFilter( 
                page_number= (i // 10) + 1,
                page_size=10,
                semester_name=semester_name,
                ignored_student_codes=ignored_student_codes,
                ignored_status_codes=ignored_status_codes,
                order_by_topsis_score=True
            )
            
            result = await self.get_student_analysis(tenant_name, student_filter)
            
            if not result or not result.items:
                break
    
        if not total_reason_map:
            self.logger.warning("No valid LLM reasons to update.")
            return
    
        async with await self._get_mongodb_session() as db:
            await self.update_care_reasons(db, total_reason_map, semester_name)
    
        self.logger.info(f"✅ Updated {len(total_reason_map)} students with LLM reasons in MongoDB.")
        
    def _extract_json_from_llm_response(self, raw: str) -> str:
        """Clean LLM output to extract JSON string from Markdown-style formatting."""
        cleaned = re.sub(r"^```json\s*|\s*```$", "", raw.strip(), flags=re.MULTILINE)
        return cleaned.strip()
    
    async def update_care_reasons(self, target_uow, reason_map: dict, semester_name: str):
        """Update CareReason for each student in the database based on the provided reason map."""
        for student_code, reason in reason_map.items():
            try:
                student = await target_uow.student_points.find_one({"StudentCode": student_code})
    
                if not student or "StudentAchievements" not in student:
                    continue
                
                semester_achievements = []
                for i, achievement in enumerate(student.get("StudentAchievements", [])):
                    if achievement.get("SemesterName") == semester_name:
                        semester_achievements.append((i, achievement))
                
                if not semester_achievements:
                    continue
    
                latest_index = -1
                latest_date = datetime.min
                
                for idx, achievement in semester_achievements:
                    created_at = achievement.get("CreatedAt", datetime.min)
                    if created_at > latest_date:
                        latest_date = created_at
                        latest_index = idx
                
                if latest_index >= 0:
                    result = await target_uow.student_points.update_one(
                        {"_id": student["_id"]},
                        {"$set": {f"StudentAchievements.{latest_index}.CareReason": reason}}
                    )
                    if result.modified_count > 0:
                        self.logger.info(f"✅ Updated CareReason for {student_code}")
                    else:
                        self.logger.warning(f"⚠️ No update applied for {student_code}")
            
            except Exception as e:
                self.logger.error(f"❌ Error updating CareReason for {student_code}: {str(e)}")


# Create a singleton instance for the service
student_analysis_service = StudentAnalysisService()