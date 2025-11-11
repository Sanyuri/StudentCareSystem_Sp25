import { FC, ReactNode, useState } from 'react'

export { Counter }

const Counter: FC = (): ReactNode => {
  const [count, setCount] = useState(0)
  const handleCount = (): void => {
    setCount((count: number) => count + 1)
  }
  return (
    <button type='button' onClick={handleCount}>
      Counter {count}
    </button>
  )
}

export default Counter
