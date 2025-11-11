import { Input, Tag, Tooltip } from 'antd'
import { useTranslation } from 'react-i18next'
import { PlusOutlined } from '@ant-design/icons'
import {
  ChangeEvent,
  forwardRef,
  MutableRefObject,
  ReactNode,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from 'react'

interface EmailInputProps {
  initialEmails?: string[]
  onChange?: (emails: string[]) => void
  setValidationError?: (error: string | null) => void
}

const EmailInput = forwardRef((props: EmailInputProps, ref): ReactNode => {
  const { initialEmails = [], onChange, setValidationError } = props
  const [emails, setEmails] = useState<string[]>(initialEmails)
  const [isInputVisible, setIsInputVisible] = useState<boolean>(false)
  const [inputValue, setInputValue] = useState<string>('')
  const initialEmailsRef: MutableRefObject<string[]> = useRef<string[]>(initialEmails) // Save initial emails to compare later

  const { t } = useTranslation()

  useImperativeHandle(ref, () => ({
    getEmails: (): string[] => emails,
    setEmails: (newEmails: string[]): void => {
      const validEmails: string[] = newEmails.filter(
        (email: string): boolean => email.trim() !== '',
      )
      setEmails(validEmails)
    },
  }))

  useEffect(() => {
    const filteredEmails = initialEmails.filter((email: string): boolean => email.trim() !== '')
    if (JSON.stringify(initialEmailsRef.current) !== JSON.stringify(filteredEmails)) {
      setEmails(filteredEmails)
      initialEmailsRef.current = filteredEmails // update value
    }
  }, [initialEmails])

  const handleClose = (removedEmail: string): void => {
    const newEmails: string[] = emails.filter(
      (email: string): boolean => email !== removedEmail && email !== '',
    )
    setEmails(newEmails)
    onChange?.(newEmails)
    setValidationError?.(null) //Delete error message if deleted
  }

  const handleInputConfirm = (): void => {
    const trimmedValue: string = inputValue.trim()

    if (trimmedValue) {
      if (!isValidEmail(trimmedValue)) {
        setValidationError?.(t('EMAILS_INPUT.FORM.INVALID'))
        return
      }

      if (emails.includes(trimmedValue)) {
        setValidationError?.(t('EMAILS_INPUT.FORM.DUPLICATED'))
        return
      }

      const newEmails: string[] = [...emails, trimmedValue]
      setEmails(newEmails)
      onChange?.(newEmails)
      setValidationError?.(null) //Delete error message if success
    }

    setIsInputVisible(false)
    setInputValue('')
  }

  const isValidEmail = (email: string): boolean => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return emailRegex.test(email)
  }

  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
      {emails.map(
        (email: string): ReactNode => (
          <Tag
            key={email}
            closable
            onClose={(): void => handleClose(email)}
            style={{ display: 'inline-flex', alignItems: 'center' }}
          >
            {email}
          </Tag>
        ),
      )}
      {isInputVisible ? (
        <Input
          type='email'
          size='middle'
          style={{ width: 200 }}
          value={inputValue}
          onChange={(e: ChangeEvent<HTMLInputElement>): void => setInputValue(e.target.value)}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
          placeholder='Enter email'
        />
      ) : (
        <Tooltip title='Add email'>
          <Tag
            onClick={() => setIsInputVisible(true)}
            style={{ borderStyle: 'dashed', cursor: 'pointer' }}
          >
            <PlusOutlined /> New Email
          </Tag>
        </Tooltip>
      )}
    </div>
  )
})

EmailInput.displayName = 'EmailInput'

export default EmailInput
