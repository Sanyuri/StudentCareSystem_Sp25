import logging
import pandas as pd
from app.utils.config import BATCH_SIZE
from app.core.async_session_manager import AsyncMongoDbManager

async def preprocessing_async():
    async with AsyncMongoDbManager() as session:
        last_id = None
        
        final_df = pd.DataFrame()
        
        while True:
            # Load data from the database
            data_chunk, last_id = await get_data_async(session, last_id)
            if data_chunk.empty:
                break
            
            final_df = pd.concat([final_df, data_chunk], ignore_index=True)
        
        if final_df.empty:
            logging.error("No data loaded from database")
            return None, None
        
        X = prepare_data(final_df)
        
        return final_df, X
            
import pandas as pd

async def get_data_async(target_uow, last_student_code: str = None) -> pd.DataFrame:
    """
    Query data from student_points collection in MongoDB.
    
    Args:
        target_uow: Unit of Work to query data.
        last_student_code: StudentCode of the last record in the previous batch.
    
    Returns:
        Tuple that contains DataFrame and the last student_code for pagination.
    """
    # Define match_stage to filter data
    match_stage = {"StudentCode": {"$gt": last_student_code}} if last_student_code else {}
    
    # Combine with StudentAchievements.0 to ensure data exists
    if last_student_code:
        match_stage["StudentAchievements.0"] = {"$exists": True}
    else:
        match_stage = {"StudentAchievements.0": {"$exists": True}}

    # Define pipeline
    pipeline = [
        # Match stage first to filter data
        {"$match": match_stage},
        
        {"$project": {
            "student_code": "$StudentCode",
            "student_id": "$_id",
            "gpa_gap": {"$arrayElemAt": ["$StudentAchievements.GpaGap", 0]},
            "number_of_remaining_failed_subjects": {"$arrayElemAt": ["$StudentAchievements.NumberOfRemainingFailSubjects", 0]},
            "created_at": {"$arrayElemAt": ["$StudentAchievements.CreatedAt", 0]}
        }},
        
        # Sort by student_code
        {"$sort": {"student_code": 1}},
        
        # Limit the number of records
        {"$limit": int(BATCH_SIZE)},
        
        # Lookup student_attendances collection
        {"$lookup": {
            "from": "student_attendances",
            "let": {"studentCode": "$student_code"},
            "pipeline": [
                {"$match": {"$expr": {"$eq": ["$StudentCode", "$$studentCode"]}}},
                {"$project": {
                    "absence_rate": {"$arrayElemAt": ["$StudentAchievements.AbsenceRate", 0]},
                    "is_attendance_exempted": {"$arrayElemAt": ["$StudentAchievements.IsAttendanceExempted", 0]},
                    "_id": 0
                }}
            ],
            "as": "attendance_data"
        }},
        
        #   Project fields
        {"$project": {
            "_id": "$student_id",
            "student_code": 1,
            "gpa_gap": 1,
            "number_of_remaining_failed_subjects": 1,
            "absence_rate": {
                "$ifNull": [
                    {"$toDouble": {"$arrayElemAt": ["$attendance_data.absence_rate", 0]}},
                    0.0
                ]
            },
            "is_attendance_exempted": {
                "$ifNull": [
                    {"$toBool": {"$arrayElemAt": ["$attendance_data.is_attendance_exempted", 0]}},
                    'false'
                ]
            },
            "created_at": 1
        }}
    ]

    #await target_uow.student_points.create_index([("StudentCode", 1)])

    # Add hint to use index
    cursor = target_uow.student_points.aggregate(
        pipeline,
        hint={"StudentCode": 1}  # Ensure the index is created
    )
    
    rows = await cursor.to_list(length=None)

    # Check if there is no data
    if not rows:
        return pd.DataFrame(), None

    # Convert to DataFrame
    df = pd.DataFrame(rows)
    
    # Take the last student_code for pagination
    last_student_code = df["student_code"].iloc[-1] if not df.empty else None

    return df, last_student_code


def prepare_data(df: pd.DataFrame):
    df['gpa_gap'] = df['gpa_gap'].fillna(0)
    df['number_of_remaining_failed_subjects'] = df['number_of_remaining_failed_subjects'].fillna(0)
    df['absence_rate'] = df['absence_rate'].fillna(0)
    
    features = df[['gpa_gap', 'number_of_remaining_failed_subjects', 'absence_rate']]
    
    x_unscaled = features.values
    
    return x_unscaled