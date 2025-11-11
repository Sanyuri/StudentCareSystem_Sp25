// Mutation hook for adding a StudentNeedCare
import { UseMutationResult } from '@tanstack/react-query'
import {
  StudentCareAddManualRequest,
  StudentCareAnalyzeRequest,
  StudentCareFinalEvaluateRequest,
  StudentNeedCareUpdateRequest,
} from '#types/RequestModel/StudentNeedCareRequest.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import { StudentNeedCateService } from '#src/services/StudentNeedCateService.js'

export const useAddStudentCareManualMutation = (): UseMutationResult<
  unknown,
  unknown,
  StudentCareAddManualRequest,
  unknown
> =>
  useGenericMutation(
    StudentNeedCateService.addManual,
    'STUDENT_NEED_CARE.TOAST.SUCCESS.ADD', // Success toast translation key
    null, // Error toast translation key
    ['student-need-care', 'student-need-care-status-count'], // Query keys to invalidate
  )

// Mutation hook for updating a StudentNeedCare
export const useUpdateStudentNeedCareMutation = (): UseMutationResult<
  unknown,
  unknown,
  StudentNeedCareUpdateRequest,
  unknown
> =>
  useGenericMutation(
    async (updateStudentNeedCare: StudentNeedCareUpdateRequest): Promise<unknown> => {
      return await StudentNeedCateService.update(updateStudentNeedCare.id, updateStudentNeedCare)
    },
    'STUDENT_NEED_CARE.TOAST.SUCCESS.UPDATE', // Success toast translation key
    'STUDENT_NEED_CARE.TOAST.FAIL.UPDATE', // Error toast translation key
    ['student-need-care', 'student-need-care-status-count'], // Query keys to invalidate
  )

// Mutation hook for deleting a StudentNeedCare
export const useDeleteStudentNeedCareMutation = (): UseMutationResult<
  unknown,
  unknown,
  {
    id: string
  },
  unknown
> =>
  useGenericMutation(
    async ({ id }: { id: string }): Promise<unknown> => {
      return await StudentNeedCateService.delete(id)
    },
    'STUDENT_NEED_CARE.TOAST.SUCCESS.DELETE', // Success toast translation key
    'STUDENT_NEED_CARE.TOAST.FAIL.DELETE', // Error toast translation key
    ['student-need-care', 'student-need-care-status-count'], // Query keys to invalidate
  )

// Mutation hook for deleting a StudentNeedCare
export const useDeleteStudentCareScanMutation = (): UseMutationResult<
  unknown,
  unknown,
  {
    studentCode: string
  },
  unknown
> =>
  useGenericMutation(
    async ({ studentCode }: { studentCode: string }): Promise<unknown> => {
      return await StudentNeedCateService.deleteScan(studentCode)
    },
    'STUDENT_NEED_CARE.TOAST.SUCCESS.DELETE', // Success toast translation key
    'STUDENT_NEED_CARE.TOAST.FAIL.DELETE', // Error toast translation key
    ['student-need-care-scan-list'], // Query keys to invalidate
  )

// Mutation hook for scan a StudentNeedCare
export const useScanStudentNeedCareMutation = (): UseMutationResult<
  unknown,
  unknown,
  number,
  unknown
> =>
  useGenericMutation(
    async (numberOfStudentNeedCare: number): Promise<unknown> => {
      return await StudentNeedCateService.scan(numberOfStudentNeedCare)
    },
    'STUDENT_NEED_CARE.TOAST.SUCCESS.SCAN', // Success toast translation key
    'STUDENT_NEED_CARE.TOAST.FAIL.SCAN', // Error toast translation key
    ['student-need-care'], // Query keys to invalidate
  )

// Mutation hook for confirm a StudentNeedCare
export const useConfirmStudentNeedCareMutation = (): UseMutationResult<
  unknown,
  unknown,
  undefined,
  unknown
> =>
  useGenericMutation(
    async (): Promise<unknown> => {
      return await StudentNeedCateService.confirm()
    },
    'STUDENT_NEED_CARE.TOAST.SUCCESS.CONFIRM', // Success toast translation key
    'STUDENT_NEED_CARE.TOAST.FAIL.CONFIRM', // Error toast translation key
    ['student-need-care', 'student-need-care-status-count'], // Query keys to invalidate
  )

// Mutation hook for analyze StudentNeedCare
export const useAnalyzeStudentNeedCareMutation = (): UseMutationResult<
  unknown,
  unknown,
  StudentCareAnalyzeRequest,
  unknown
> =>
  useGenericMutation(
    async (body: StudentCareAnalyzeRequest): Promise<unknown> => {
      return await StudentNeedCateService.analyze(body)
    },
    'STUDENT_NEED_CARE.TOAST.SUCCESS.ANALYZE', // Success toast translation key
    'STUDENT_NEED_CARE.TOAST.FAIL.ANALYZE', // Error toast translation key
    ['student-need-care'], // Query keys to invalidate
  )

// Mutation hook for final evaluate a StudentNeedCare
export const useFinalEvaluateStudentCareMutation = (): UseMutationResult<
  unknown,
  unknown,
  StudentCareFinalEvaluateRequest,
  unknown
> =>
  useGenericMutation(
    async (updateStudentNeedCare: StudentNeedCareUpdateRequest): Promise<unknown> => {
      return await StudentNeedCateService.finalEvaluate(
        updateStudentNeedCare.id,
        updateStudentNeedCare,
      )
    },
    'STUDENT_NEED_CARE.TOAST.SUCCESS.FINAL_EVALUATE', // Success toast translation key
    'STUDENT_NEED_CARE.TOAST.FAIL.FINAL_EVALUATE', // Error toast translation key
    ['student-need-care', 'student-need-care-status-count'], // Query keys to invalidate
  )
