async function createBranche(project_id, name, type, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/create`, {
         method: "POST",
         headers: new Headers({"Content-Type": "application/json"}),
         body: JSON.stringify({"name": name, "type": type})
     }).then(e => e.text())
     reload()
 }
 
async function getBranches(setData, project_id){
    setData(
        JSON.parse(
            await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/`)
                .then(e => e.text())
        )
    )
}

async function startBranch(project_id, branch_name, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/start`, {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
    }).then(e => console.log(e))
    reload()
}

async function stopBranch(project_id, branch_name, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/stop`, {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
    }).then(e => console.log(e))
    reload()
}

async function deleteBranch(project_id, branch_name, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/delete`, {
        method: 'DELETE',
        headers: new Headers({"Content-Type": "application/json"}),
    }).then(e => console.log(e))
    reload()
}

async function copyBranch(srcName, srcDbName, destName, destDbName, reload){
    await fetch("https://api.sh.abakus.be/applications/copy", {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({"srcName": srcName, "destName": destName, "srcDbName": srcDbName, "destDbName": destDbName})
    }).then(e => console.log(e))
    reload()
}

export { getBranches, createBranche, startBranch, stopBranch, deleteBranch, copyBranch }