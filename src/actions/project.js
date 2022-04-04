async function getProjects(){
    return await fetch("https://api.sh.abakus.be/projects/")
        .then(e => e.text())
        .then(e => JSON.parse(e))
}

async function createProject(name, url, version, edition, reload){
    await fetch("https://api.sh.abakus.be/projects/create", {
        method: "POST",
        headers: new Headers({"Content-Type": "application/json"}),
        body: JSON.stringify({"name": name, "url": url, "version": version, "edition": edition})
    })
    reload()
}

async function deleteProject(id, reload) {
    await fetch(`https://api.sh.abakus.be/projects/${id}/delete`, {
        method: 'DELETE',
        headers: new Headers({"Content-Type": "application/json"}),
    })
    reload()
}

export { getProjects, createProject, deleteProject }