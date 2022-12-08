import middy from '@middy/core'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import readCsv from '../common/readCsv'
import getApiKey from '../middlewares/getApiKey'
import parseEmail from '../middlewares/parseEmail'

export const adapter = async (event: any): Promise<void> => {
    const csvFile = event.email?.attachments[0]
    if (csvFile?.contentType === 'text/csv') {
        const data = await readCsv(csvFile.content)
        console.log('Parsed: ',data)
    }
}

export const handler = middy(adapter)
    .use(httpHeaderNormalizer())
    .use(parseEmail())
    .use(getApiKey())
    // .use(getCollectors())
