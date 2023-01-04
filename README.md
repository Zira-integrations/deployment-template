# Integration template
This example project contain the configuration and code-examples in order to deploy email or sftp integration (Muli will complete)

# Architecture and data flow (Muli add image)

# How to use?

1.  Create new repo based on Sandbox
* Create new repo in githab usinng as template https://github.com/Zira-integrations/sandbox
* Rename 

2. modify context.json 

```
[
    {
        "prefix": "test1",
        "apiKey": "2f6ace0c-e460-45d2-a417-e9fc1e5ff677",
        "email": "test@int.zira.us",
        "lambdaName": "adapter"
    },
    {
        "prefix": "test2",
        "email": "test2@int.zira.us",
        "apiKey": "2f6ace0c-e460-45d2-a417-e9fc1e5ff677",
        "lambdaName": "adapter2"
    }
]
```

Muli to add a table with properties

This file is a collection of adapters. Each object configures a corresponding adapter. This object includes: 
* `prefix` (Required). Coming files with this prefix will trigger a corresponding adapter.
* `lambdaName` (Required). A file name of adapter funnction without extension (e.g. lambdaName for adapter.ts is adapter).
* `email` (Optional). An email address from which all emails will be sent to the appropriate folder (prefix) in S3. Must have doamin int.zira.us
* `apiKey` (Optional). An api key that will be passed into an adapter function


3. Create new adapters

```
import middy from '@middy/core'
import httpHeaderNormalizer from '@middy/http-header-normalizer'
import parseEmail from '@lightapp-public/common/lib/parseEmail'
import readCsv from '@lightapp-public/common/lib/readCsv'

export const adapter = async (event: any): Promise<void> => {
    console.log('event', JSON.stringify(event))
    // your code here   
}

```

# zira/common

Muli to Wright docs for functions inside commomn


Example 1: parce csv file
```

```

Example 2 parse xlsx file

```

```


Deloyment
* Create a new function in functions using adapter.ts as template

Muli to explain that adapter is a lambda function



# Deployment 
* dev stage: `npx npm run deploy-dev`
* prod stage `npx npm run deploy-prod`

# AWS services
* S3 bucket: integrations-data-zira-${stage}
* need to add instructions regarding access to S3, Email, Cloudwatch

#
