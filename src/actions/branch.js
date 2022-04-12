async function createBranche(project_id, name, type, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/create`, {
         method: "POST",
         headers: new Headers({"Content-Type": "application/json"}),
         body: JSON.stringify({"name": name, "type": type})
     }).then(e => e.text()).catch(err => console.log(err))
     reload()
 }
 
async function getBranches(project_id){
    return await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/`)
        .then(e => e.text())
        .then(e => JSON.parse(e))
}

async function startBranch(project_id, branch_name, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/start`, {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
    })
    reload()
}

async function stopBranch(project_id, branch_name, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/stop`, {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
    })
    reload()
}

async function deleteBranch(project_id, branch_name, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/delete`, {
        method: 'DELETE',
        headers: new Headers({"Content-Type": "application/json"}),
    })
    reload()
}

async function rebuildBranch(project_id, branch_name, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/rebuild`, {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
    })
    reload()
}

async function importBranch(project_id, branch_name, file_name, db_name, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/import`, {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({"file_name": file_name, "db_name": db_name})
    })
    reload()
}

async function updateBranch(project_id, branch_name, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/update`, {
        method: "POST"
    })
    reload()
}

export { getBranches, createBranche, startBranch, stopBranch, deleteBranch, rebuildBranch, importBranch, updateBranch }