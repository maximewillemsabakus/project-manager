async function getConfigs(user){
    return await fetch(`https://api.sh.abakus.be/configs/`, {
        method: "GET",
        headers: new Headers({
            'Authorization': user.accessToken
        }),
    })
    .then(e => e.text())
    .then(e => JSON.parse(e))
}

export { getConfigs }