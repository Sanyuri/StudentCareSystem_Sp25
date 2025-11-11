import { PermissionType } from '#src/types/Enums/PermissionType.js'

interface PermissionImageLinks {
  [key: string]: string
}

// Declare the list permission image links
export const permissionImageLinks: PermissionImageLinks = {
  // AbsenceRateBoundary
  [PermissionType.ReadAbsenceRateBoundary]:
    'https://drive.google.com/file/d/1aaytb9J4dXANmo4E-l5BZxbY1Yuuu-K8/view?usp=drive_link',
  [PermissionType.WriteAbsenceRateBoundary]:
    'https://drive.google.com/file/d/1aaytb9J4dXANmo4E-l5BZxbY1Yuuu-K8/view?usp=drive_link',

  // Activity
  [PermissionType.ReadActivity]:
    'https://drive.google.com/file/d/1U2xSasyRWblPxoaUN1G_hSFqFW48Jxmr/view?usp=drive_link',

  // Application Type
  [PermissionType.ReadApplicationType]:
    'https://drive.google.com/file/d/1fyg-qMCEpavGLYAqeoLlisuCXWkSQPPd/view?usp=drive_link',
  [PermissionType.WriteApplicationType]:
    'https://drive.google.com/file/d/1fyg-qMCEpavGLYAqeoLlisuCXWkSQPPd/view?usp=drive_link',

  // AppSettings
  [PermissionType.ReadAppSetting]:
    'https://drive.google.com/file/d/11zQtzrTDHUAyEAXbpCycyy8dwKjLXQPY/view?usp=drive_link',
  [PermissionType.WriteAppSetting]:
    'https://drive.google.com/file/d/11zQtzrTDHUAyEAXbpCycyy8dwKjLXQPY/view?usp=drive_link',

  // Email Sample
  [PermissionType.ReadEmailSample]:
    'https://drive.google.com/file/d/1fIXI7qUkMvUNff-TIPcSybGNcpUJH_C_/view?usp=drive_link',
  [PermissionType.WriteEmailSample]:
    'https://drive.google.com/file/d/1fIXI7qUkMvUNff-TIPcSybGNcpUJH_C_/view?usp=drive_link',

  // Email Log
  [PermissionType.ReadEmailLog]:
    'https://drive.google.com/file/d/16KXy5apy30FUaK4WnLzCYYDCLEMAapdi/view?usp=drive_link',

  // Note Type
  [PermissionType.ReadNoteType]:
    'https://drive.google.com/file/d/1jBCPrVHSln4W6Dzkl2Rx0qcsBkmupzXu/view?usp=drive_link',
  [PermissionType.WriteNoteType]:
    'https://drive.google.com/file/d/1jBCPrVHSln4W6Dzkl2Rx0qcsBkmupzXu/view?usp=drive_link',

  // Permission
  [PermissionType.ReadPermission]:
    'https://drive.google.com/file/d/18Q6lREbkLRCaml-R_9W27lcAbgHYdUNb/view?usp=drive_link',

  // Psychological Note
  [PermissionType.ReadPsychologicalNote]:
    'https://drive.google.com/file/d/1g4aJym8Oh4Qe58swGYUm2rnUmGFGJ43b/view?usp=drive_link',
  [PermissionType.WritePsychologicalNote]:
    'https://drive.google.com/file/d/1RzmcZ6iTj_sjJYBJMTmZTDcHudWGQNKO/view?usp=drive_link',

  // Role
  [PermissionType.ReadRole]:
    'https://drive.google.com/file/d/15CFlj_yBvrK2pwqF2YnknDc4U2RD22YK/view?usp=drive_link',
  [PermissionType.WriteRole]:
    'https://drive.google.com/file/d/15CFlj_yBvrK2pwqF2YnknDc4U2RD22YK/view?usp=drive_link',

  // Student Application
  [PermissionType.ReadStudentApplication]:
    'https://drive.google.com/file/d/1xb80hWTiuQTR-qPfSfHjyUve9Y_ih3wJ/view?usp=drive_link',
  [PermissionType.WriteStudentApplication]:
    'https://drive.google.com/file/d/158t0uh4KDOmBlZjt_U7QUujIj0Pck2Wq/view?usp=drive_link',

  // Student Attendance
  [PermissionType.ReadStudentAttendance]:
    'https://drive.google.com/file/d/1Z2XDHZlX22hmzI3BThoDSvGl1tFYuNo1/view?usp=drive_link',

  // Student
  [PermissionType.ReadStudent]:
    'https://drive.google.com/file/d/1ZfiSwcS835UyAqQubmawXrW15OhXPA3J/view?usp=drive_link',

  // Student Defer
  [PermissionType.ReadStudentDefer]:
    'https://drive.google.com/file/d/1-rv_f3yYCKIamY3tVp-1SG3toVavWSPf/view?usp=drive_link',

  // Student Note
  [PermissionType.ReadStudentNote]:
    'https://drive.google.com/file/d/1sVRQZtvXq8JCbt8vyy8Iq9LyDFbzsHh0/view?usp=drive_link',
  [PermissionType.WriteStudentNote]:
    'https://drive.google.com/file/d/1QDlydgl7mefhgKu18cj1krPlnBnmzlu_/view?usp=drive_link',

  // Student Point
  [PermissionType.ReadStudentPoint]:
    'https://drive.google.com/file/d/1lOwScZ-WN4ei-s3JqysF5HS-Wt-bkQJl/view?usp=drive_link',

  // Student Psychology
  [PermissionType.ReadStudentPsychology]:
    'https://drive.google.com/file/d/1cZ_CbZPCA8Tzgf9gWXL8JwUdhOBeNbg2/view?usp=drive_link',
  [PermissionType.WriteStudentPsychology]:
    'https://drive.google.com/file/d/1Vhum3WmWbkI7UOtpHTLQNvLZvDlskYra/view?usp=drive_link',

  // Student Subject
  [PermissionType.ReadStudentSubject]:
    'https://drive.google.com/file/d/1yqv8jF7U2vskQK1aJ2UqzhT7Gk9mb1qn/view?usp=drive_link',
  [PermissionType.WriteStudentSubject]:
    'https://drive.google.com/file/d/1cNdT0qcyp8sK5KSQQh2LqmVH_CDuP3Lt/view?usp=drive_link',

  // User
  [PermissionType.ReadUser]:
    'https://drive.google.com/file/d/1h2yKnrofezyp3yiVmjLBHamoAYKFopPS/view?usp=drive_link',
  [PermissionType.WriteUser]:
    'https://drive.google.com/file/d/1M-PBmNClxANh2SesyCMYbAUCxYP0DzV_/view?usp=drive_link',

  // Student Care
  [PermissionType.ReadStudentCare]:
    'https://drive.google.com/file/d/1hTqekHjBylgNHlBeyX8W0ujnyWzsV2Pl/view?usp=drive_link',
  [PermissionType.WriteStudentCare]:
    'https://drive.google.com/file/d/1kJJofCivm8lapNfaXtF-j1-MYUgbN8WG/view?usp=drive_link',

  // Student Care Type
  [PermissionType.ReadProgressCriterionType]:
    'https://drive.google.com/file/d/1wA4Uk27WOcZIVaj_r5OVk-A1kJ-z8_Hf/view?usp=drive_link',
  [PermissionType.WriteProgressCriterionType]:
    'https://drive.google.com/file/d/1EskfqJ1e01L1oQKabqZzOVOTesxRd2VI/view?usp=drive_link',

  // Scan Data
  [PermissionType.ScanData]:
    'https://drive.google.com/file/d/1ql1NUT7x4_DPDXCNYdR06H9j_lyfnzQQ/view?usp=drive_link',

  // Student Care Assignment
  [PermissionType.ReadStudentCareAssignment]:
    'https://drive.google.com/file/d/1OrU1649CarzV6TEXQ5_ylK_R2euTXu06/view?usp=drive_link',
  [PermissionType.WriteStudentCareAssignment]:
    'https://drive.google.com/file/d/10clSV05Hyry_ebX9oLxgXuvU2M5ubMoX/view?usp=drive_link',
}

// Function to get image URL based on permission type
export const getPermissionImageUrl = (permissionType: PermissionType | string | number): string => {
  // Xử lý các trường hợp khác nhau của permissionType
  let permissionKey: string | number = permissionType

  // Nếu permissionType là số, sử dụng nó trực tiếp làm key
  if (typeof permissionType === 'number') {
    permissionKey = permissionType
  }
  // Nếu permissionType là string, kiểm tra xem có phải là tên enum không
  else if (typeof permissionType === 'string') {
    // Kiểm tra xem permissionType có phải là tên của enum không
    const enumValue = PermissionType[permissionType as keyof typeof PermissionType]
    if (typeof enumValue === 'number') {
      permissionKey = enumValue
    } else {
      permissionKey = permissionType
    }
  }

  // Return the corresponding image URL or default URL if not found
  const originalUrl =
    permissionImageLinks[permissionKey] ||
    'https://drive.google.com/file/d/13MPne09UU-Uftntotso3-_jgLZ3DEf9X/view?usp=drive_link'

  // Convert to embeddable URL
  return convertGoogleDriveUrl(originalUrl)
}

// Function to get image URL based on permission ID
export const getPermissionImageUrlById = (permissionId: string): string => {
  // Assuming permissionId is in the format "1", "2", "3", ...
  // Convert to PermissionType enum
  const permissionTypeValue = parseInt(permissionId, 10)

  // Validate the permission type value
  if (isNaN(permissionTypeValue)) {
    return 'https://drive.google.com/file/d/13MPne09UU-Uftntotso3-_jgLZ3DEf9X/view?usp=drive_link'
  }

  // Get the image URL using the permission type value
  const originalUrl = getPermissionImageUrl(permissionTypeValue)

  // No need to convert here as getPermissionImageUrl already does it
  return originalUrl
}

// Function to convert Google Drive URL to embeddable URL
export const convertGoogleDriveUrl = (url: string): string => {
  // Check if the URL is from Google Drive
  if (url.includes('drive.google.com/file/d/')) {
    // Extract the file ID from the URL
    const fileId = url.split('/file/d/')[1].split('/')[0]

    if (fileId) {
      // Return a thumbnail URL that can be displayed directly
      return `https://drive.google.com/thumbnail?id=${fileId}&sz=w1000`
    }
  }

  // If it's not a Google Drive URL or can't be processed, return the original URL
  return url
}
