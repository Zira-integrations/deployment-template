const extraResources = {

}


async function buildSesRules({ resolveVariable }) {
    try {
        const config = await resolveVariable('self:custom.context')
        const stage = await resolveVariable('self:provider.stage');
        const resources = config.reduce((acc, configItem, index) => {
            if (!configItem.emailPrefix || !configItem.s3Prefix) return acc
            const capitalizedLambdaName = configItem.adapter.charAt(0).toUpperCase() + configItem.adapter.slice(1)
            const newResource = {
                [capitalizedLambdaName + 'SESRule']: {
                    "Type": "AWS::SES::ReceiptRule",
                    "Properties": {
                        "RuleSetName": "ruleSet",
                        "Rule": {
                            "Name": capitalizedLambdaName + "Rule" + (index + 1),
                            "Enabled": true,
                            "ScanEnabled": true,
                            "Recipients": [
                                configItem.emailPrefix + "@int.zira.us"
                            ],
                            "Actions": [
                                {
                                    "S3Action": {
                                        "BucketName": `integrations-data-zira-${stage}`,
                                        "ObjectKeyPrefix": configItem.s3Prefix
                                    }
                                }
                            ]
                        }

                    }
                }
            }
            return { ...acc, ...newResource }
        }, {})

        return {
            Resources: {
                ...resources,
                ...extraResources
            }
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports = buildSesRules
