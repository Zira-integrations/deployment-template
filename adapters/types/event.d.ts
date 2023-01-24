export interface EmailEvent {
  email: EmailFile
  addSuccess(): void
  addFailure(reason: string, failData: any): void
}

interface EmailFile {
  attachments: Array<any>
  [x: string]: any
}
