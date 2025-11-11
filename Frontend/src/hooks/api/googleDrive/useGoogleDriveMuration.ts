import { DriveRequest } from '#src/types/RequestModel/DriveRequest.js'
import { UseMutationResult } from '@tanstack/react-query'
import { useGenericMutation } from '../useGenericMutation'
import { GoogleDriveService } from '#src/services/GoogleDriveService.js'
import { UploadGoogleDriveResponse } from '#src/types/ResponseModel/ApiResponse.js'

export const useGoogleDriveMutation = (): UseMutationResult<
  UploadGoogleDriveResponse,
  unknown,
  DriveRequest,
  unknown
> => useGenericMutation(GoogleDriveService.createNewFolder, null, null, [])
