import moment, { Moment } from 'moment'
import { FilterTime } from '#types/RequestModel/ActivityRequest.js'

export function convertToDateOption(filter: FilterTime) {
  const today: Moment = moment().startOf('day')
  let fromDate: Date | undefined = today.toDate()
  let toDate: Date | undefined = new Date()

  switch (filter) {
    case '':
      fromDate = undefined // Ngày bắt đầu từ 1970-01-01
      toDate = undefined // Kết thúc là ngày mai để bao gồm hôm nay
      break
    case 'today':
      fromDate = today.toDate()
      toDate = today.add(1, 'days').toDate()
      break
    case 'this-week':
      fromDate = today.startOf('isoWeek').toDate()
      toDate = today.endOf('isoWeek').toDate()
      break
    case 'this-month':
      fromDate = today.startOf('month').toDate()
      toDate = today.endOf('month').toDate()
      break
    case 'this-year':
      fromDate = today.startOf('year').toDate()
      toDate = today.endOf('year').toDate()
      break
    case 'date-range':
      // Logic for date range if needed
      break
  }

  return { fromDate, toDate }
}
