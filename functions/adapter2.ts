import parseEmail from '@lightapp-public/common/lib/parseEmail'
import middy from '@middy/core'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import readXls from '@lightapp-public/common/lib/readXls'

export const adapter2 = async (event: any, context): Promise<void> => {
    const xlsFile = event.email?.attachments[0]
    console.log('contentType: ', xlsFile?.contentType)

    const parsedXls = readXls(xlsFile.content)
    console.log('parsedXls file', JSON.stringify(parsedXls))
    
}

export const handler = middy(adapter2)
    .use(httpHeaderNormalizer())
    .use(parseEmail())
