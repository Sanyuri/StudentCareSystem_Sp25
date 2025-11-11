export type SubEmailRequest = {
  currentPage?: number
  pageSize?: number
  subject?: string
  emailType: string | undefined
}

type BaseSubEmailRequest = {
  name: string
  content: string
  vietnameseDescription: string
  englishDescription: string
  emailType: string
}

export type AddSubEmailRequest = BaseSubEmailRequest

export type UpdateSubEmailRequest = BaseSubEmailRequest & {
  id: string
}

export type SubEmailDetailRequest = {
  id: string
}
