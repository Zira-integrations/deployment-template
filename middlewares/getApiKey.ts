
import { MiddlewareObj } from '@middy/core'
// import * as config from '../config/contextConfig/config'
import fs from 'fs'



const getApiKey = (): MiddlewareObj => ({
    before: async (handler: any): Promise<void> => {
        const key = handler.event.detail.object.key
    }
})

export default getApiKey
