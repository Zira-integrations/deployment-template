import middy from '@middy/core'
import readXls from 'zira_integ/lib/readXls'
import getS3Object from 'zira_integ/lib/getS3Object'

export const manualUploadExample = async (event: any): Promise<void> => {
  console.log('event', JSON.stringify(event))
  const s3Object = event.s3Object
  console.log('s3Object', JSON.stringify(s3Object))
  const parsedXls: any = readXls(s3Object.Body)
  console.log('parsedXls', JSON.stringify(parsedXls))
}

export const handler = middy(manualUploadExample).use(getS3Object())
