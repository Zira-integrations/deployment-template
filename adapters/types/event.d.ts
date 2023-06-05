export interface EmailEvent {
  email: EmailFile
  addSuccess(count?: number): void
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

export interface APIEvent {
  body: string
}

interface Values {
  Cases: string
  'PTI Code': string
  'PO Number': string
  'Pallet Code': string
}
