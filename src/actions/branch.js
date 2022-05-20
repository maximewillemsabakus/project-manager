import { API_URL } from "../index.js"

async function createBranche(project_id, name, type, demoData, description, urls, user, reload){
    demoData = FirstLetterUpperCase(`${demoData}`)
    
    let key = await fetch(`${API_URL}/projects/${project_id}/branches/create`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
        body: JSON.stringify({"name": name, "type": type, "demo_data": demoData, "description": description, "urls": urls})
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

    if(status === "FAILURE"){
        alert("Branch creation failed")
    }
    reload()
}

async function logBranch(project_id, branch_name, user){
    let logs = await fetch(`${API_URL}/projects/${project_id}/branches/${branch_name}/logs`, {
        method: "GET",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    .then(e => e.logs)

    printLogs(logs.app, "APP")
    printLogs(logs.db, "DB")
}

function printLogs(text, type){
    console.log(`------------------ LOGS ${type} START ------------------`)
    console.log(text)
    console.log(`------------------ LOGS ${type} END ------------------`)
}

function FirstLetterUpperCase(string){
    return string.charAt(0).toUpperCase() + string.slice(1);
}

function sleep(time){
    return new Promise(resolve => setTimeout(resolve, time))
}

async function getBranchCreationStatus(project_id, user, key){
    return await fetch(`${API_URL}/projects/${project_id}/branches/creation_status`, {
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
    return await fetch(`${API_URL}/projects/${project_id}/branches/rebuild_status`, {
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
    let branches = await fetch(`${API_URL}/projects/${project_id}/branches/`, {
        method: "GET",
        headers: new Headers({
            'Authorization': user.accessToken
        }),
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))

    for(let branch of branches){
        branch.urls = await getBranchesUrl(project_id, branch.name, user)
    }

    return branches
}

async function getBranchesUrl(project_id, branch_name, user){
    return await fetch(`${API_URL}/projects/${project_id}/branches/${branch_name}/urls`, {
        method: "GET",
        headers: new Headers({
            'Authorization': user.accessToken
        }),
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    .then(e => e.urls)
    .then(urls => urls.map(e => e.url))
}

async function startBranch(project_id, branch_name, user, reload){
    await fetch(`${API_URL}/projects/${project_id}/branches/${branch_name}/start`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
    })
    reload()
}

async function stopBranch(project_id, branch_name, user, reload){
    await fetch(`${API_URL}/projects/${project_id}/branches/${branch_name}/stop`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
    })
    reload()
}

async function deleteBranch(project_id, branch_name, user, reload){
    await fetch(`${API_URL}/projects/${project_id}/branches/${branch_name}/delete`, {
        method: 'DELETE',
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
    })
    reload()
}

async function rebuildBranch(project_id, branch_name, user, setState, reload){
    let key = await fetch(`${API_URL}/projects/${project_id}/branches/${branch_name}/rebuild`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    .then(e => e.key)

    // Wait for the branch to be rebuilt
    let status = await getBranchRebuildStatus(project_id, user, key)
    setState(status === "PENDING" ? "rebuilding ..." : status === "FAILURE" ? "rebuild failed" : "active")
    while(status == "PENDING"){
        console.log("Branch rebuild status : " + status)
        await sleep(3000)
        status = await getBranchRebuildStatus(project_id, user, key)
        setState(status === "PENDING" ? "rebuilding ..." : status === "FAILURE" ? "rebuild failed" : "active")
    }
    if(status === "FAILURE"){
        setState("rebuild failed")
        alert("Branch rebuild failed")
    }
    setState(status === "FAILURE" ? "rebuild failed" : "active")
}

async function importBranch(project_id, branch_name, file_name, user, setState){
    let key = await fetch(`${API_URL}/projects/${project_id}/branches/${branch_name}/import`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
        body: JSON.stringify({"file_name": file_name})
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    .then(e => e.key)

    // Wait for the branch to be rebuilt
    let status = await getBranchImportStatus(project_id, user, key)
    setState(status === "PENDING" ? "importing ..." : status === "FAILURE" ? "import failed" : "active")
    while(status == "PENDING"){
        console.log("Branch import status : " + status)
        await sleep(3000)
        status = await getBranchImportStatus(project_id, user, key)
        setState(status === "PENDING" ? "importing ..." : status === "FAILURE" ? "import failed" : "active")
    }
    if(status === "FAILURE"){
        setState("import failed")
        alert("Branch import failed")
    }
    setState(status === "FAILURE" ? "import failed" : "active")
}

async function getBranchImportStatus(project_id, user, key){
    return await fetch(`${API_URL}/projects/${project_id}/branches/import_status`, {
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

async function updateBranch(project_id, branch_name, user, reload){
    await fetch(`${API_URL}/projects/${project_id}/branches/${branch_name}/update`, {
        method: "POST",
        headers: new Headers({
            'Authorization': user.accessToken
        }),
    })
    reload()
}

async function getBranchesFromGit(project_id, url, user){
    let config = await getConfig(project_id, user)

    let response = await fetch(`https://api.github.com/repos/${url}/branches`, {
        method: "GET",
        headers: new Headers({
            'Authorization': `token ${config.token}`,
            'Accept': 'application/vnd.github.v3+json'
        }),
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
    .then(e => e.map(e => e.name))

    return response
}

async function getConfig(project_id, user){
    return await fetch(`${API_URL}/configs/${project_id}`, {
        method: "GET",
        headers: new Headers({
            'Authorization': user.accessToken
        }),
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
}

async function exportBranch(project_id, branch_name, user){
    await fetch(`${API_URL}/projects/${project_id}/branches/${branch_name}/export`, {
        method: "POST",
        headers: new Headers({
            'Authorization': user.accessToken
        }),
    })
    alert("Export finished")
}

async function modifyBranch(project_id, branch_name, description, user, reload){
    await fetch(`${API_URL}/projects/${project_id}/branches/${branch_name}/modify`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
        body: JSON.stringify({"description": description})
    })
    reload()
}



export { getBranches, createBranche, startBranch, stopBranch, deleteBranch, rebuildBranch, importBranch, updateBranch, logBranch, getBranchesFromGit, exportBranch, modifyBranch }