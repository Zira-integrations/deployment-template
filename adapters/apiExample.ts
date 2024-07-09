import middy from '@middy/core'

export const apiExample = async (event: any): Promise<any> => {
  console.log('event', JSON.stringify(event))
  return {
    statusCode: 200,
    body: 'OK',
  }
}

export const handler = middy(apiExample)
