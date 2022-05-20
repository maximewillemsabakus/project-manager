import { API_URL } from "../index.js"

async function getConfigs(user){
    return await fetch(`${API_URL}/configs/`, {
        method: "GET",
        headers: new Headers({
            'Authorization': user.accessToken
        }),
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
}

export { getConfigs }