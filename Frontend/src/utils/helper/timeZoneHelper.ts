/**
 * Function to get the user's current timezone
 * @returns {string} User's timezone (e.g., "America/New_York")
 */
export const getTimezone = (): string => {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}
