import React, {
  ChangeEvent,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useState,
} from 'react'
import { Input } from 'antd'
import { debounce } from 'lodash'
import { Variant } from 'antd/es/config-provider/index.js'
import { DELAY_DEBOUNCE_INPUT } from '#src/configs/WebConfig.js'

const InputDebounce = ({
  value: initialValue,
  variant,
  onDebouncedChange,
  debounceDelay = DELAY_DEBOUNCE_INPUT,
  placeholder,
  style,
  className,
  prefix,
}: {
  value: string
  variant: Variant
  onDebouncedChange: Dispatch<SetStateAction<string>>
  debounceDelay?: number
  placeholder: string
  style?: object
  className: string
  prefix: ReactNode
}): ReactNode => {
  const [value, setValue] = useState(initialValue)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounceDropDown = useCallback(
    debounce((nextValue: string) => onDebouncedChange(nextValue), debounceDelay),
    [],
  )
  const handleChange = (input: string): void => {
    setValue(input)
    debounceDropDown(input)
  }
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      onDebouncedChange(value)
    }
  }

  return (
    <Input
      type='text'
      value={value}
      variant={variant}
      onChange={(e: ChangeEvent<HTMLInputElement>) => handleChange(e.target.value)}
      placeholder={placeholder}
      onKeyDown={handleKeyDown}
      style={style}
      className={className}
      prefix={prefix}
    />
  )
}

export default InputDebounce
