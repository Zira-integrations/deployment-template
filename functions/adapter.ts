import middy from '@middy/core'
import { S3Event, SNSEvent } from 'aws-lambda'


export const adapter = async (event: SNSEvent): Promise<void> => {

}

export const handler = middy(adapter)

