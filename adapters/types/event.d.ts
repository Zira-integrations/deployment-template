export interface EmailEvent {
  email: EmailFile
  addSuccess(): void
  addFailure(failData: any): void
}

interface EmailFile {
  attachments: Array<any>
  [x: string]: any
}
