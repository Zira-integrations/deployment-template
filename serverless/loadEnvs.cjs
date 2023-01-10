
async function mergeObjs(){
    let localEnvs = {} 
    let secrets = {}
    try{
        localEnvs = (await import("./environment.json", { assert: { type: "json" } })).default
        console.log(JSON.stringify(localEnvs))
    } catch(err){
        console.error(err)
        console.info('no local roles file')
    }
    try{
        secrets = (await import("../config/secrets.json", { assert: { type: "json" } })).default
        console.log('secrets', JSON.stringify(secrets))

    } catch(err){
        console.error(err)
    }
	 
    if(localEnvs){
        return { ...localEnvs, ...(secrets || {}) }
    } else{
        return []
    }
}

module.exports = mergeObjs
