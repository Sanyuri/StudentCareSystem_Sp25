# Database Schema: AI-Database

## Collection: student_attendances

- Index: `_id` (default)
- Index: `StudentCode` — support filtering by student

## Collection: settings

- Index: `_id` (default)

## Collection: student_points

- Index: `_id` (default)
- Compound Index: `StudentCode + Campus`
- Index: `StudentCode`
- Index: `StudentAchivements.SemesterName`
- Index: `StudentAchivements.CreatedAt`
