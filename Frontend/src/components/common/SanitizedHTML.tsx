import React, { ReactNode } from 'react'
import DOMPurify from 'dompurify'
import { SanitizedHTMLProps } from '#src/types/Props/PropTypes.js'

// Component to sanitize and render HTML content safely
const SanitizedHTML: React.FC<SanitizedHTMLProps> = ({
  htmlContent,
}: SanitizedHTMLProps): ReactNode => {
  // Sanitize the HTML content to prevent XSS attacks
  const sanitizedContent: string = DOMPurify.sanitize(htmlContent)

  return <span dangerouslySetInnerHTML={{ __html: sanitizedContent }} />
}

export default SanitizedHTML
