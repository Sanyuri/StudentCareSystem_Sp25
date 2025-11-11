import axios from 'axios'
import { DriveRequest } from '#src/types/RequestModel/DriveRequest.js'
import { UploadGoogleDriveResponse } from '#src/types/ResponseModel/ApiResponse.js'
import { GOOGLE_SCRIPT_URL } from '#utils/constants/api.js'

export const GoogleDriveService = {
  createNewFolder(body: DriveRequest): Promise<UploadGoogleDriveResponse> {
    return axios
      .post<UploadGoogleDriveResponse>(GOOGLE_SCRIPT_URL, body)
      .then((response) => response.data)
  },
}
