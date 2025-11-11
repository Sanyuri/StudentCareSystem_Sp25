import { useMutation, UseMutationResult, useQueryClient } from '@tanstack/react-query'
import useLoadingStore from '#stores/loadingState.js'
import {
  ChangePasswordRequest,
  ForgetPasswordRequest,
  StudentPsychology,
  StudentPsychologyByStudentCode,
  VerifyStudentPsychologyRequest,
} from '#src/types/RequestModel/StudentPsychologyRequest.js'
import { StudentPsychologyService } from '#src/services/StudentPsychologyService.js'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import {
  StudentPsychologyResponse,
  VerifyStudentPsychologyResponse,
} from '#types/RequestModel/StudentPsychologyRequest.js'

// Mutation hook for adding an psychology note type
export const useStudentPsychologyMutation = (): UseMutationResult<
  StudentPsychologyResponse,
  unknown,
  StudentPsychology,
  unknown
> =>
  useGenericMutation(
    StudentPsychologyService.addStudentPsychology,
    'STUDENT_PSYCHOLOGY.TOAST.SUCCESS.ADD', // Success toast translation key
    'STUDENT_PSYCHOLOGY.TOAST.ERROR.ADD', // Error toast translation key
    ['student-psychology'], // Query keys to invalidate
  )

export const useCurrentStudentPsychologyMutation = (
  studentCode: StudentPsychologyByStudentCode,
) => {
  const { setLoading } = useLoadingStore()
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async () => {
      return await StudentPsychologyService.getStudentPsychology(studentCode)
    },
    onMutate: () => {
      setLoading(true)
    },
    onSuccess: async () => {
      const delay = new Promise((resolve) => setTimeout(resolve, 1000))
      await delay
      setLoading(false)
      void queryClient.invalidateQueries({ queryKey: ['student-psychology'] })
    },
    onError: () => {
      setLoading(false)
      return null
    },
  })
}

// Mutation hook for Verify Student Psychology
export const useVerifyStudentPsychologyMutation = (): UseMutationResult<
  VerifyStudentPsychologyResponse,
  unknown,
  VerifyStudentPsychologyRequest,
  unknown
> =>
  useGenericMutation(
    StudentPsychologyService.verifyStudentPsychology,
    'STUDENT_PSYCHOLOGY.TOAST.SUCCESS.VERIFY', // Success toast translation key
    'STUDENT_PSYCHOLOGY.TOAST.ERROR.VERIFY', // Error toast translation key
    ['student-psychology'], // Query keys to invalidate
  )

// Mutation hook for Change Password
export const useChangePasswordMutation = (): UseMutationResult<
  unknown,
  unknown,
  ChangePasswordRequest,
  unknown
> =>
  useGenericMutation(
    StudentPsychologyService.changePassword,
    'STUDENT_PSYCHOLOGY.TOAST.SUCCESS.CHANGE_PASSWORD', // Success toast translation key
    'STUDENT_PSYCHOLOGY.TOAST.ERROR.CHANGE_PASSWORD', // Error toast translation key
    ['student-psychology'], // Query keys to invalidate
  )

// Mutation hook for Forget Password
export const useForgetPasswordMutation = (): UseMutationResult<
  unknown,
  unknown,
  ForgetPasswordRequest,
  unknown
> =>
  useGenericMutation(
    StudentPsychologyService.forgetPassword,
    'STUDENT_PSYCHOLOGY.TOAST.SUCCESS.CHANGE_PASSWORD', // Success toast translation key
    'STUDENT_PSYCHOLOGY.TOAST.ERROR.CHANGE_PASSWORD', // Error toast translation key
    ['student-psychology'], // Query keys to invalidate
  )
