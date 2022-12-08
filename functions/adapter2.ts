import middy from '@middy/core'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import getApiKey from '../middlewares/getApiKey'
import parseEmail from '../middlewares/parseEmail'


export const adapter2 = async (event: any, context): Promise<void> => {

}

export const handler = middy(adapter2)
    .use(httpHeaderNormalizer())
    .use(parseEmail())
    .use(getApiKey())
    // .use(getCollectors())
