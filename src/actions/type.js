export async function getTypes(){
    return fetch(`https://api.sh.abakus.be/types/`)
        .then(e => e.text())
        .then(e => JSON.parse(e))
        .then(types => 
            types.map(type => type.name)
        )
}