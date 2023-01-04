const extraResources = {}

async function buildEvents({ resolveVariable }) {
    try {
        const config = await resolveVariable('self:custom.context')
        const stage = await resolveVariable('self:provider.stage');
        
        const resources = config.reduce((acc, configItem, index) => {
            if (!configItem.lambdaName || configItem.prefix) return acc
            const lambdaResource = `${configItem.lambdaName.charAt(0).toUpperCase() + configItem.lambdaName.slice(1)}LambdaFunction`
            const newResource = {
                ['EventRule' + (index + 1)]: {
                    "Type": "AWS::Events::Rule",
                    "Properties": {
                        "Description": "Catches S3 ObjectCreated events",
                        "State": "ENABLED",
                        "EventPattern": {
                            "detail-type": ["Object Created"],
                            "source": ["aws.s3"],
                            "detail": {
                                "bucket": {
                                    "name": [`integrations-data-zira-${stage}`]
                                },
                                "object": {
                                    "key": [
                                        {
                                            "prefix": configItem.prefix
                                        }
                                    ]
                                }
                            }
                        },
                        "Targets": [
                            {
                                "Id": lambdaResource + 'Target',
                                "Arn": {
                                    "Fn::GetAtt": [lambdaResource, "Arn"]
                                }
                            }
                        ]
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

module.exports = buildEvents
