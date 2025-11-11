import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import { StudentCareAssignmentService } from '#src/services/StudentCareAssignmentService.js'
import { UseMutationResult } from '@tanstack/react-query'
import {
  AddStudentCareAssignmentRequest,
  StudentCareAssignmentPercentRequest,
  UpdateStudentCareAssignmentRequest,
} from '#types/RequestModel/StudentCareAssignment.js'

// Mutation hook for auto assign officer to take care student
export const useAutoAssignStudentCareMutation = (): UseMutationResult<
  unknown,
  unknown,
  undefined,
  unknown
> =>
  useGenericMutation(
    async (): Promise<string> => {
      return await StudentCareAssignmentService.autoAssign()
    },
    'STUDENT_NEED_CARE.TOAST.SUCCESS.AUTO_ASSIGN', // Success toast translation key
    null, // Error toast translation key
    ['student-need-care-scan-list', 'student-need-care'], // Query keys to invalidate
  )

// Mutation hook for auto assign officer with percent to take care student
export const useAutoAssignPercentStudentCareMutation = (): UseMutationResult<
  unknown,
  unknown,
  StudentCareAssignmentPercentRequest,
  unknown
> =>
  useGenericMutation(
    async (body: StudentCareAssignmentPercentRequest): Promise<string> => {
      return await StudentCareAssignmentService.autoAssignWithPercent(body)
    },
    'STUDENT_NEED_CARE.TOAST.SUCCESS.AUTO_ASSIGN', // Success toast translation key
    null, // Error toast translation key
    ['student-need-care-scan-list', 'student-need-care'], // Query keys to invalidate
  )

// Mutation hook for update officer to take care student
export const useUpdateAssignStudentCareMutation = (): UseMutationResult<
  unknown,
  unknown,
  UpdateStudentCareAssignmentRequest,
  unknown
> =>
  useGenericMutation(
    async (body: UpdateStudentCareAssignmentRequest): Promise<string> => {
      return await StudentCareAssignmentService.updateAssign(body)
    },
    'STUDENT_NEED_CARE.TOAST.SUCCESS.AUTO_ASSIGN', // Success toast translation key
    'STUDENT_NEED_CARE.TOAST.FAIL.AUTO_ASSIGN', // Error toast translation key
    ['student-need-care'], // Query keys to invalidate
  )

// Mutation hook for add officer to take care student
export const useAddAssignStudentCareMutation = (): UseMutationResult<
  unknown,
  unknown,
  AddStudentCareAssignmentRequest,
  unknown
> =>
  useGenericMutation(
    async (body: AddStudentCareAssignmentRequest): Promise<string> => {
      return await StudentCareAssignmentService.createAssign(body)
    },
    'STUDENT_NEED_CARE.TOAST.SUCCESS.AUTO_ASSIGN', // Success toast translation key
    'STUDENT_NEED_CARE.TOAST.FAIL.AUTO_ASSIGN', // Error toast translation key
    ['student-need-care-scan-list'], // Query keys to invalidate
  )
