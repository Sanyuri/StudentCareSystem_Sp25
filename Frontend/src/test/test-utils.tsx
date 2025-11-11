import React, { ReactElement } from 'react'
import { render, RenderOptions } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ConfigProvider } from 'antd'
import userEvent from '@testing-library/user-event'

// Create a custom render function that includes global providers
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  })

  const AllTheProviders = ({ children }: { children: React.ReactNode }) => {
    return (
      <QueryClientProvider client={queryClient}>
        <ConfigProvider>{children}</ConfigProvider>
      </QueryClientProvider>
    )
  }

  return {
    user: userEvent.setup(),
    ...render(ui, { wrapper: AllTheProviders, ...options }),
  }
}

// Re-export everything from testing-library
export * from '@testing-library/react'

// Override render method
export { customRender as render }
