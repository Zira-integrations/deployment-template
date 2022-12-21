import middy from '@middy/core'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import parseEmail from '@lightapp-public/common/lib/parseEmail'
import readCsv from '@lightapp-public/common/lib/readCsv'

export const adapter = async (event: any): Promise<void> => {
    const csvFile = event.email?.attachments[0]
    console.log('contentType: ', csvFile?.contentType)

    if (csvFile?.contentType === 'text/csv') {
        const data = await readCsv(csvFile.content)
        console.log('Parsed: ',data)
    }
}

export const handler = middy(adapter)
    .use(httpHeaderNormalizer())
    .use(parseEmail())
