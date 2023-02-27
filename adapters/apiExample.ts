import middy from '@middy/core'

export const apiExample = async (event: any): Promise<void> => {
    console.log('event', JSON.stringify(event))
}

export const handler = middy(apiExample)