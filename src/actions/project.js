import { API_URL } from "../index.js"

async function getProjects(user){
    return await fetch(`${API_URL}/projects/`, {
        method: "GET",
        headers: new Headers({
            'Authorization': user.accessToken
        }), 
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
}

async function createProject(name, url, version, edition, config, user, reload){
    await fetch(`${API_URL}/projects/create`, {
        method: "POST",
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
        body: JSON.stringify({"name": name, "url": url, "version": version, "edition": edition, "config_id": config})
    })
    reload()
}

async function deleteProject(id, user, reload) {
    await fetch(`${API_URL}/projects/${id}/delete`, {
        method: 'DELETE',
        headers: new Headers({
            "Content-Type": "application/json",
            'Authorization': user.accessToken
        }),
    })
    reload()
}

export { getProjects, createProject, deleteProject }