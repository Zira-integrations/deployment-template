import middy from '@middy/core'
import parseEmail from 'zira_integ/lib/parseEmail'
import readXls from 'zira_integ/lib/readXls'
import logger from 'zira_integ/lib/logger'
import got from 'got'
import { EmailEvent } from './types/event'

export const xlsExample = async (event: EmailEvent, context): Promise<void> => {
  const xlsFile = event.email?.attachments[0]
  console.log('contentType: ', xlsFile?.contentType)
  const parsedXls = readXls(xlsFile.content)
  console.log('parsedXls file', JSON.stringify(parsedXls))

  // some preparing to post

  const adaptedValues = parsedXls[0].map((metricId, i) => ({
    metricId: String(metricId),
    value: parsedXls[1][i],
  }))
  const readingData = [
    {
      meterId: process.env.DEVICE_ID,
      values: adaptedValues,
    },
  ]

  // post reading
  try {
    const response = await got
      .post('https://api.zira.us/public/reading/ids/', {
        json: readingData,
        headers: { 'x-api-key': process.env.API_KEY },
      })
      .json()
    if (response) event.addSuccess()
  } catch (error) {
    event.addFailure('Error uploading to Zira', readingData)
  }
}

export const handler = middy(xlsExample).use(parseEmail()).use(logger())
