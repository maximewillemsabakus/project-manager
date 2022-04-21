export async function getTypes(user){
    return fetch(`https://api.sh.abakus.be/types/`, {
        method: "GET",
        headers: new Headers({
            'Authorization': user.accessToken
        }),
    })
    .then(e => e.text())    
    .then(e => JSON.parse(e))   
    .then(types =>     
            types.map(type => type.name)    
    ).then(types => {   
            types.sort()   
            return types   
    })
}