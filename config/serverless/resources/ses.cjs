const extraResources = {
    "DomainIdentityResource": {
        "Type": "AWS::SES::EmailIdentity",
        "Properties": {
            "EmailIdentity": "int.zira.us"
        }
    },
    "ReceiptRuleSet": {
        "Type": "AWS::SES::ReceiptRuleSet",
        "Properties": {
            "RuleSetName": "ruleSet"
        }
    }
}


async function buildSesRules({ resolveVariable }) {
    try {
        const config = await resolveVariable('self:custom.context')
        const stage = await resolveVariable('self:provider.stage');
        const resources = config.reduce((acc, configItem, index) => {

            const newResource = {
                ['SESRule' + (index + 1)]: {
                    "Type": "AWS::SES::ReceiptRule",
                    "Properties": {
                        "RuleSetName": extraResources.ReceiptRuleSet.Properties.RuleSetName,
                        "Rule": {
                            "Name": "rule" + (index + 1),
                            "Enabled": true,
                            "ScanEnabled": true,
                            "Recipients": [
                                configItem.email
                            ],
                            "Actions": [
                                {
                                    "S3Action": {
                                        "BucketName": `integrations-data-zira-${stage}`,
                                        "ObjectKeyPrefix": configItem.prefix
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
