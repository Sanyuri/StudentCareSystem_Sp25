// Function to generate a file name with timestamp
const generateFileName = (fileName: string): string => {
  const now = new Date()
  const year: number = now.getFullYear()
  const month: string = (now.getMonth() + 1).toString().padStart(2, '0')
  const day: string = now.getDate().toString().padStart(2, '0')
  const hour: string = now.getHours().toString().padStart(2, '0')
  const minute: string = now.getMinutes().toString().padStart(2, '0')

  // Return a file name in the format: fileName_YYYY-MM-DD_HH:MM.xlsx
  return `${fileName}_${year}-${month}-${day}_${hour}:${minute}.xlsx`
}

export { generateFileName }
