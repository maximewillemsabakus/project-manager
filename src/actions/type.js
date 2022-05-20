import { API_URL } from "../index.js"

export async function getTypes(user){
    return fetch(`${API_URL}/types/`, {
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