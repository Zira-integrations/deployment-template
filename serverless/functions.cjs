async function buildFunctions({ resolveVariable }) {
    try {
        const config = await resolveVariable('self:custom.context')
        const functions = config.reduce((acc, configItem) => {
            if (!configItem.adapter) return acc
            const newFunction = {
                [configItem.adapter]: {
                    "handler": `adapters/${configItem.adapter}.handler`,
                    "timeout": 600,
                    "memorySize": 512
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
