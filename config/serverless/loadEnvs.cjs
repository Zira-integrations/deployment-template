
async function mergeObjs(){
    const cwd = process.cwd()
    let localEnvs = {}, globalEnvs = {}, vaultEnvs = {}

    try{
        localEnvs = (await import("./environment.json", { assert: { type: "json" } })).default
        console.log(JSON.stringify(localEnvs))
    } catch(err){
        console.error(err)
        console.info('no local roles file')
    }
    try{
        vaultEnvs = await import("secrets.json", { assert: { type: "json" } })
    } catch(err){
        console.info('no vault roles file')
    }
    if(vaultEnvs.SECRETS_JSON){
        vaultEnvs.SECRETS_JSON = JSON.stringify(vaultEnvs.SECRETS_JSON)
    }
	 
    if(globalEnvs && localEnvs && vaultEnvs){
        return { ...globalEnvs, ...localEnvs, ...vaultEnvs }
    } else{
        return []
    }
}

module.exports = mergeObjs