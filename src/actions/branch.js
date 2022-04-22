async function createBranche(project_id, name, type, demoData, user, reload){
    demoData = FirstLetterUpperCase(`${demoData}`)
    
    let key = await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/create`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
        body: JSON.stringify({"name": name, "type": type, "demo_data": demoData})
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    .then(e => e.key)

    // Wait for the branch to be created
    let status = await getBranchCreationStatus(project_id, user, key)
    while(status == "PENDING"){
        console.log("Branch creation status : " + status)
        await sleep(3000)
        status = await getBranchCreationStatus(project_id, user, key)
    }
    if(status === "FAILED"){
        alert("Branch creation failed")
    }
    reload()
}

function FirstLetterUpperCase(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function sleep(time){
    return new Promise(resolve => setTimeout(resolve, time))
}

async function getBranchCreationStatus(project_id, user, key){
    return await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/creation_status`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
        body: JSON.stringify({"key": key})
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    .then(e => e.status)
}

async function getBranchRebuildStatus(project_id, user, key){
    return await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/rebuild_status`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
        body: JSON.stringify({"key": key})
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    .then(e => e.status)
}
 
async function getBranches(project_id, user){
    return await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/`, {
        method: "GET",
        headers: new Headers({
            'Authorization': user.accessToken
        }),
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
}

async function startBranch(project_id, branch_name, user, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/start`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
    })
    reload()
}

async function stopBranch(project_id, branch_name, user, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/stop`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
    })
    reload()
}

async function deleteBranch(project_id, branch_name, user, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/delete`, {
        method: 'DELETE',
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
    })
    reload()
}

async function rebuildBranch(project_id, branch_name, user, setState, reload){
    let key = await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/rebuild`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    .then(e => e.key)
    console.log(key)

    // Wait for the branch to be rebuilt
    let status = await getBranchRebuildStatus(project_id, user, key)
    setState(status === "PENDING" ? "rebuilding ..." : status === "FAILED" ? "rebuild failed" : "active")
    while(status == "PENDING"){
        console.log("Branch rebuild status : " + status)
        await sleep(3000)
        status = await getBranchRebuildStatus(project_id, user, key)
        setState(status === "PENDING" ? "rebuilding ..." : status === "FAILED" ? "rebuild failed" : "active")
    }
    if(status === "FAILED"){
        setState("rebuild failed")
        alert("Branch rebuild failed")
    }
    setState(status === "FAILED" ? "rebuild failed" : "active")
    reload()
}

async function importBranch(project_id, branch_name, file_name, db_name, user, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/import`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
        body: JSON.stringify({"file_name": file_name, "db_name": db_name})
    })
    reload()
}

async function updateBranch(project_id, branch_name, user, reload){
    await fetch(`https://api.sh.abakus.be/projects/${project_id}/branches/${branch_name}/update`, {
        method: "POST",
        headers: new Headers({
            'Authorization': user.accessToken
        }),
    })
    reload()
}

export { getBranches, createBranche, startBranch, stopBranch, deleteBranch, rebuildBranch, importBranch, updateBranch }