# Sandbox
This is a template (project) that would  serve as R&amp;D environment

# Structure
* Sandbox acts like a company
* Sandbox includes 2 adapters that might act like sites (to serve one or more data-sources)

# Create new repo based on Sandbox
* Create new repo in githab usinng as template https://github.com/Zira-integrations/sandbox
* Change a package name in package.json

# Creation new adapters
* Create a new function in functions using adapter.ts as template
* Add a new config object into contextConfig.json file


# ContextConfig.json file structure
This file is a collection of adapters. Each object configures a corresponding adapter. This object includes: 
* `prefix` (Required). Coming files with this prefix will trigger a corresponding adapter.
* `lambdaName` (Required). A file name of adapter funnction without extension (e.g. lambdaName for adapter.ts is adapter).
* `email` (Optional). An email address from which all emails will be sent to the appropriate folder (prefix) in S3. Must have doamin int.zira.us
* `apiKey` (Optional). An api key that will be passed into an adapter function

# Deployment 
* dev stage: `npm run deploy-dev`
* prod stage `npm run deploy-prod`

# AWS services
* S3 bucket: integrations-data-zira-${stage}
