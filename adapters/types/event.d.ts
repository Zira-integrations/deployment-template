export interface EmailEvent {
  email: EmailFile
  addSuccess(): void
  addFailure(reason: string, failData: any): void
}

interface EmailFile {
  attachments: Array<Attachment>
  headers: Map<string, any>
  [x: string]: any
}

interface Attachment {
  content: any
  filename: string
  [x: string]: any
}