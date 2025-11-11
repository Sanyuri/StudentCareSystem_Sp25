import logging
import numpy as np
import pandas as pd
from sqlalchemy import text
from datetime import datetime
from app.utils.config import BATCH_SIZE
from app.core.database import get_async_db_session
from app.core.async_session_manager import AsyncMongoDbManager

async def get_semester_by_name(db_session, semester_name):
    semester_query = text("""
        SELECT Id, StartDate, EndDate
        FROM Semesters
        WHERE SemesterName = :semester_name
    """)
    semester_results = await db_session.execute(semester_query, {"semester_name": semester_name})
    selected_semester = semester_results.fetchone()
    
    return selected_semester

async def get_student_code_list_by_semester(db_session, start_row, end_row):
    student_query = text("""
                    WITH StudentRanked AS (
                        SELECT StudentCode, ROW_NUMBER() OVER (ORDER BY StudentCode) AS RowNum
                        FROM Students
                    )
                    SELECT UPPER(StudentCode)
                    FROM StudentRanked
                    WHERE RowNum >= :start_row AND RowNum <= :end_row
                """)

    result = await db_session.execute(student_query, {
        "start_row": start_row + 1,
        "end_row": end_row
    })
    student_codes = [row[0] for row in result.fetchall()]
    
    return student_codes

async def get_student_points(uow, semester_name, student_codes):
    try:
        pipeline = [
            {
                "$match": {
                    "StudentCode": {"$in": student_codes},
                    "StudentAchievements": {"$exists": True, "$not": {"$size": 0}}
                }
            },
            {
                "$lookup": {
                    "from": "student_attendances",
                    "localField": "StudentCode",
                    "foreignField": "StudentCode",
                    "as": "attendance_info"
                }
            },
            {
                "$addFields": {
                    "filtered_achievements": {
                        "$filter": {
                            "input": "$StudentAchievements",
                            "as": "achievement",
                            "cond": {"$eq": ["$$achievement.SemesterName", semester_name]}
                        }
                    }
                }
            },
            {
                "$match": {
                    "filtered_achievements": {"$not": {"$size": 0}}
                }
            },
            {
                "$addFields": {
                    "latest_achievement": {
                        "$arrayElemAt": [
                            {
                                "$sortArray": {
                                    "input": "$filtered_achievements",
                                    "sortBy": {"CreatedAt": -1}
                                }
                            },
                            0
                        ]
                    }
                }
            },
            {
                "$project": {
                    "Id": "$_id",
                    "gpa_gap": {"$ifNull": ["$latest_achievement.GpaGap", 0]},
                    "number_of_remaining_failed_subjects": {"$ifNull": ["$latest_achievement.NumberOfRemainingFailSubjects", 0]},
                    "absence_rate": {
                        "$ifNull": [
                            {"$arrayElemAt": ["$attendance_info.AbsenceRate", 0]},
                            0.0
                        ]
                    }
                }
            }
        ]
        
        cursor = uow.student_points.aggregate(pipeline)
        return await cursor.to_list(length=None)
    except Exception as e:
        logging.error(f"Error in get_student_points: {str(e)}")
        return []

from pymongo import UpdateOne

async def update_topsis_scores(target_uow, df, semester_name):
    if df.empty:
        return

    df["topsis_score"] = df["topsis_score"].fillna(0.0)
    
    # Update TopsisScore for each student
    for row in df.itertuples():
        student_id = row.Id
        topsis_score = float(row.topsis_score)
        
        try:
            # Query and update each student
            student = await target_uow.student_points.find_one({"_id": student_id})
            
            if not student or "StudentAchievements" not in student:
                continue
                
            semester_achievements = []
            for i, achievement in enumerate(student.get("StudentAchievements", [])):
                if achievement.get("SemesterName") == semester_name:
                    semester_achievements.append((i, achievement))
            
            if not semester_achievements:
                continue
                
            # Find the latest achievement based on CreatedAt
            latest_index = -1
            latest_date = datetime.min
            
            for idx, achievement in semester_achievements:
                created_at = achievement.get("CreatedAt", datetime.min)
                if created_at > latest_date:
                    latest_date = created_at
                    latest_index = idx
            
            if latest_index >= 0:
                # Update the TopsisScore for the latest achievement
                result = await target_uow.student_points.update_one(
                    {"_id": student_id},
                    {"$set": {f"StudentAchievements.{latest_index}.TopsisScore": topsis_score}}
                )
                
                if result.modified_count > 0:
                    logging.info(f"Updated TopsisScore for student {student_id}")
                
        except Exception as e:
            logging.error(f"Error updating student {student_id}: {str(e)}")
            
async def rank_students_by_topsis(tenant_name:str, semester_name = 'Fall2024', weights = np.array([1/3,1/3,1/3])):
    benefit_cost_flags = np.array([0,0,0]) # 0 => cost, 1 => benefit
    
    start_row = 0
    async with await get_async_db_session(tenant_name) as db_session:
        async with AsyncMongoDbManager() as uow:
            # Get Semester Id
            selected_semester = await get_semester_by_name(db_session, semester_name)

            if not selected_semester:
                return
            
            while True:
                student_codes = await get_student_code_list_by_semester(db_session, start_row, start_row + BATCH_SIZE)

                if not student_codes:
                    break
                
                # Get student points and attendance from database
                rows = await get_student_points(uow, semester_name, student_codes)
                
                if not rows:
                    start_row += BATCH_SIZE
                    continue
                
                df = pd.DataFrame(rows, columns=[
                    "Id",
                    "gpa_gap",
                    "number_of_remaining_failed_subjects",
                    "absence_rate"
                ])
                
                decision_matrix = df[[
                    'gpa_gap',
                    'number_of_remaining_failed_subjects',
                    'absence_rate'
                ]].values
                
                # Get norms:
                norms = np.sqrt((decision_matrix**2).sum(axis=0))
                norms[norms == 0] = 1
                normalized_matrix = decision_matrix / norms
                normalized_matrix = np.nan_to_num(normalized_matrix, nan=0.0)

                weighted_matrix = normalized_matrix * weights
                
                ideal_best = np.zeros(weighted_matrix.shape[1])
                ideal_worst = np.zeros(weighted_matrix.shape[1])
                
                for j in range(weighted_matrix.shape[1]):
                    if benefit_cost_flags[j] == 1:
                        # Benefit -> best = max, worst = min
                        ideal_best[j] = weighted_matrix[:, j].max()
                        ideal_worst[j] = weighted_matrix[:, j].min()
                    else:
                        # Cost -> best = min, worst = max
                        ideal_best[j] = weighted_matrix[:, j].min()
                        ideal_worst[j] = weighted_matrix[:, j].max()
                        
                dist_best = np.sqrt(((weighted_matrix - ideal_best) ** 2).sum(axis=1))
                dist_worst = np.sqrt(((weighted_matrix - ideal_worst) ** 2).sum(axis=1))
                
                denominator = dist_best + dist_worst
                denominator[denominator == 0] = 1
                cc = dist_worst / denominator
                
                df["topsis_score"] = cc
                
                df["topsis_rank"] = df["topsis_score"].rank(method="dense", ascending=False)
                
                # Update to database
                await update_topsis_scores(uow, df, semester_name)
                    
                start_row += BATCH_SIZE