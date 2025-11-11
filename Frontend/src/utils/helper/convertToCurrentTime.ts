import { DateTime } from 'luxon'

export const convertToLocalDate: (dateTimeString: string) => string = (
  dateTimeString: string,
): string => {
  try {
    const date: DateTime<true> | DateTime<false> = DateTime.fromISO(dateTimeString, {
      zone: 'utc',
    }).setZone('Asia/Ho_Chi_Minh')

    return date.toFormat('d/M/yyyy HH:mm:ss')
  } catch (error) {
    return 'Null'
  }
}

export const convertToLocalDateTime: (dateTimeString: string) => string = (
  dateTimeString: string,
): string => {
  try {
    const date: DateTime<true> | DateTime<false> = DateTime.fromISO(dateTimeString, {
      zone: 'utc',
    }).setZone('Asia/Ho_Chi_Minh')

    return date.toFormat('d/M/yyyy')
  } catch (error) {
    return 'Null'
  }
}
