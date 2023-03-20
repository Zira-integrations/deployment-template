async function buildLogGroups({ resolveVariable }) {
    try {
        const config = await resolveVariable('self:custom.context')
        
        const resources = config.reduce((acc, configItem, index) => {
            if (!configItem.adapter) return acc
            const capitalizedLambdaName = configItem.adapter.charAt(0).toUpperCase() + configItem.adapter.slice(1)
            const newResource = {
                [capitalizedLambdaName + 'LogGroup']: {
                    "Type": "AWS::Logs::LogGroup",
                    "Properties": {
                        "RetentionInDays": "30"
                    }
                }

            }
            return { ...acc, ...newResource }
        }, {})

        return {
            Resources: {
                ...resources
            }
        }
    } catch (err) {
        console.error(err)
    }
}

module.exports = buildLogGroups
