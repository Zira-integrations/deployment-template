export interface EmailEvent {
  email: EmailFile
  addSuccess(): void
  addFailure(): void
}

interface EmailFile {
  attachments: Array<any>
  [x: string]: any
}
