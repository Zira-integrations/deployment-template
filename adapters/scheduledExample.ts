import middy from '@middy/core'

export const scheduledExample = async (event: any): Promise<any> => {
  console.log('event', JSON.stringify(event))
}

export const handler = middy(scheduledExample)
