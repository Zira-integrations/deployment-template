import { parseEmail } from '@lightapp-public/common/lib'
import middy from '@middy/core'
import httpHeaderNormalizer from '@middy/http-header-normalizer'


export const adapter2 = async (event: any, context): Promise<void> => {

}

export const handler = middy(adapter2)
    .use(httpHeaderNormalizer())
    .use(parseEmail())
