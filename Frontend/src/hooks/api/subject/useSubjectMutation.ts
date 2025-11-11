import { SubjectService } from '#src/services/SubjectService.js'
import {
  Subject,
  AddSubjectRequest,
  DeleteSubjectStudent,
} from '#src/types/RequestModel/SubjectRequest.js'
import { UseMutationResult } from '@tanstack/react-query'
import { useGenericMutation } from '#hooks/api/useGenericMutation.js'
import { SubjectResponse } from '#types/ResponseModel/SubjectResponse.js'
import { UpdateSubjectRequest } from '#types/RequestModel/SubjectRequest.js'

// Mutation hook for adding a subject
export const useAddSubjectMutation = (): UseMutationResult<
  SubjectResponse,
  unknown,
  AddSubjectRequest,
  unknown
> =>
  useGenericMutation(
    SubjectService.addSubject,
    'SUBJECT.TOAST.SUCCESS.ADD', // Success toast translation key
    'SUBJECT.TOAST.ERROR.ADD', // Error toast translation key
    ['add-subject', 'subject'], // Query keys to invalidate
  )

// Mutation hook for updating a subject
export const useUpdateSubjectMutation = (): UseMutationResult<
  unknown,
  unknown,
  {
    SubjectId: Subject
    updateSubjectRequest: UpdateSubjectRequest
  },
  unknown
> =>
  useGenericMutation(
    async ({
      SubjectId,
      updateSubjectRequest,
    }: {
      SubjectId: Subject
      updateSubjectRequest: UpdateSubjectRequest
    }): Promise<unknown> => {
      return await SubjectService.updateSubject(SubjectId, updateSubjectRequest)
    },
    'SUBJECT.TOAST.SUCCESS.UPDATE', // Success toast translation key
    'SUBJECT.TOAST.ERROR.UPDATE', // Error toast translation key
    ['subject-detail', 'subject'], // Query keys to invalidate
  )

// Mutation hook for deleting a subject
export const useDeleteSubjectMutation = (): UseMutationResult<
  unknown,
  unknown,
  {
    SubjectId: Subject
    deleteSubject: DeleteSubjectStudent
  },
  unknown
> =>
  useGenericMutation(
    async ({
      SubjectId,
      deleteSubject,
    }: {
      SubjectId: Subject
      deleteSubject: DeleteSubjectStudent
    }): Promise<unknown> => {
      return await SubjectService.deleteSubjectStudent(SubjectId, deleteSubject)
    },
    'SUBJECT.TOAST.SUCCESS.DELETE', // Success toast translation key
    'SUBJECT.TOAST.ERROR.DELETE', // Error toast translation key
    ['subject-detail', 'subject'], // Query keys to invalidate
  )
