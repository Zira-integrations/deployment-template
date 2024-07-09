import middy from '@middy/core'
import parseEmail from 'zira_integ/lib/parseEmail'
import readCsv from 'zira_integ/lib/readCsv'

export const csvExample = async (event: any): Promise<void> => {
  console.log('event', JSON.stringify(event))

  const csvFile = event.email?.attachments[0]
  console.log('contentType is: ', csvFile?.contentType)
  console.log('readCsv: ', readCsv?.toString())

  if (csvFile?.contentType === 'text/csv') {
    const data = await readCsv(csvFile.content)
    console.log('Parsed: ', data)
  }
}

export const handler = middy(csvExample).use(parseEmail())
