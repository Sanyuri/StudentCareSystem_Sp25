export type CreateProgressCriteriaRequest = {
  studentNeedCareId: string
  score: number
  progressCriterionTypeId: string
}

export type UpdateProgressCriteriaRequest = {
  id?: string
  score: number
  studentNeedCareId: string
  progressCriterionTypeId: string
}

export type UpdateAllProgressCriteriaRequest = UpdateProgressCriteriaRequest[]

export type UpdateParamProgressCriteriaRequest = {
  studentNeedCareId: string
  body: UpdateAllProgressCriteriaRequest
}
