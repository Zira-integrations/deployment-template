async function buildFunctions({ resolveVariable }) {
    try {
        const config = await resolveVariable('self:custom.context')
        const functions = config.reduce((acc, configItem) => {
            if (!configItem.lambdaName) return acc
            const newFunction = {
                [configItem.lambdaName]: {
                    "handler": `functions/${configItem.lambdaName}.handler`,
                }
            }
            return { ...acc, ...newFunction }
        }, {})

        return functions

    } catch (err) {
        console.error(err)
    }
}

module.exports = buildFunctions
