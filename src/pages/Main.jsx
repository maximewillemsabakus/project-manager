import { useEffect, useState } from "react"

import { Button } from "../components/Button"
import { Link, Text } from "../components/Text"
import { Checkbox, Input, Select } from "../components/Inputs"

import { BsPlusLg } from "react-icons/bs"

import { signInWithMicrosoft } from "../actions/connect"

import { createBranche, deleteBranch, getBranches, importBranch, rebuildBranch, startBranch, stopBranch, updateBranch } from "../actions/branch"
import { createProject, deleteProject, getProjects } from "../actions/project"
import { getTypes } from "../actions/type"
import { getConfigs } from "../actions/config"

// TODO Medium : Get les branches sur git
// TODO Medium : Stocker l'access token dans un cookie et le récupérer lors de la connexion

export function Main(){
    let [user, setUser] = useState({isConnected: false, message: "", user: {}})
    let [loading, setLoading] = useState(false)
    
    return <div className={`h-full text-white bg-stone overflow-hidden`}>
        <h1 className="flex font-medium text-6xl justify-center h-1/6"><div className="my-auto">Abakus.sh</div></h1>
        {loading ? <svg class="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24"></svg> : ""}
        {user.isConnected ? 
            <Projects user={user} setLoading={setLoading}/> : 
            <div className="flex justify-center">
                <Button onClick={async () => setUser(await signInWithMicrosoft())} color="blue">Connexion</Button>
            </div>
        }
        {user.isConnected ? "" : <h1 className="font-medium text-lg text-center m-2">{user.message}</h1>}
    </div>
}

function Projects({loading, user}){
    let [projects, setProjects] = useState([])
    let reloads = async () => setProjects(await getProjects(user))
    useEffect(() => {
        async function reload(){
            setProjects(await getProjects(user))
        }
        reload()
    }, [])

    return <div className="overflow-y-auto h-5/6">
        <CreationForm reload={reloads} user={user}></CreationForm>
        {projects.length === 0 ? <div className="m-2"><Text>Aucun projets</Text></div>: projects.map(project => 
            <Project key={project.id} user={user} reload={reloads} id={project.id} name={project.name} git={project.git} version={project.version} edition={project.edition}>
                <Branches project_id={project.id} user={user} />
            </Project>
        )}
    </div>
}

function CreationForm({reload, user}){
    let [name, setName] = useState("")
    let [url, setUrl] = useState("")
    let [version, setVersion] = useState("15.0")
    let [edition, setEdition] = useState("community")
    let [configs, setConfigs] = useState([])
    let [config, setConfig] = useState(0)

    useEffect(() => {
        async function reload(){
            setConfigs(await getConfigs(user))
        }
        reload()
    }, [])

    useEffect(() => {
        async function reload(){
            setConfig(configs[0]?.id)
        }
        reload()
    }, [configs])

    const versions = ["15.0", "14.0", "13.0", "12.0", "11.0"]
    const editions = ["community", "enterprise"]

    return <div className="flex flex-row justify-center border-2 h-52 ml-2 mr-2">
        <div className="flex flex-col justify-around">
            <div className="flex flex-row justify-between">
                <Input placeholder="Exemple : Mon projet" value={name} onChange={e => setName(e.target.value)}>Nom du projet</Input>
                <Input placeholder="Exemple : abakus-it/difra" value={url} onChange={e => setUrl(e.target.value)}>Url Git</Input>
            </div>
            <div className="flex flex-row justify-center space-x-8">
                <Select list={versions} onChange={e => setVersion(e.target.value)}>Version</Select>
                <Select list={editions} onChange={e => setEdition(e.target.value)}>Edition</Select>
                <Select list={configs.map(c => c.user)} onChange={e => setConfig(configs.find((c) => c.user === e.target.value).id)}>Config</Select>
            </div>
            <div className="mx-auto">
                <Button onClick={() => createProject(name, url, version, edition, config, user, reload)} color="green">Créer</Button>
            </div>
        </div>
    </div>
}

function Project({children, id, git, name, version, edition, user, reload}){
    return <div className="border-2 mt-2 ml-2 mr-2 p-2">
        <div className="flex flex-row space-x-8 mb-2 ">
            <Text>Nom : {name}</Text>
            <Text>Git : <Link href={`https://github.com/${git}`}>{git}</Link></Text>
            <Text>Version : {version}</Text>
            <Text>Edition : {edition}</Text>
            <Button onClick={() => deleteProject(id, user, reload)} color="red">Supprimer</Button>
        </div>
        {children}
    </div>
}


function Branches({project_id, user}){
    let [branches, setBranches] = useState([])
    let reloadsBranches = async (project_id) => await getBranches(project_id, user)

    useEffect(() => {
        async function reload(){
            setBranches(await getBranches(project_id, user))
        }
        reload()
    }, [project_id])
    
    return <div className="flex flex-row space-x-4">
        <BrancheCreator project_id={project_id} user={user} reload={async () => setBranches(await reloadsBranches(project_id, user))} />
        {branches.length === 0 ? "": branches.map(branch => 
            <Branche key={branch.name} user={user} project_id={project_id} name={branch.name} type={branch.type} url={branch.url} status={branch.status} reload={async () => setBranches(await reloadsBranches(project_id))} />
        )}
    </div>
}

function BrancheCreator({project_id, reload, user}){
    let [name, setName] = useState("")
    let [type, setType] = useState("")
    let [types, setTypes] = useState([])
    let [active, setActive] = useState(false)
    let [demoData, setDemoData] = useState(false)

    useEffect(() => {
        async function loadTypes(){
            setTypes(await getTypes(user))
        }
        loadTypes()
    }, [])

    useEffect(() => {
        setType(types[0])
    }, [types])

    return <div className={`flex flex-col justify-around h-60 w-60 bg-gradient-to-t rounded-3xl ${active ? (type === "Production" ? "bg-red-100" : type === "Development" ? "bg-green-100" : "bg-blue-100") : "cursor-pointer from-slate-400 to-blue-200"}`} onClick={() => active ? "" : setActive(true)} >
        {active ? <>
            <div>
                <Input color={`text-black`} value={name} onChange={e => setName(e.target.value)}>Nom de la branche</Input>
                <Select color={"text-black"} list={types} onChange={(e) => setType(e.target.value)}>Type</Select>
                <Checkbox color={"text-black"} value={demoData} onChange={(e) => setDemoData(e.target.value)}>Demo data</Checkbox>
            </div>
            <div className="flex justify-center">
                <Button onClick={() => {
                    if(name.trim() !== ""){
                        createBranche(project_id, name, type, demoData, user, reload)
                        setName("")
                        setType(types[0])
                    }
                    setActive(false)
                }} color="green">Créer</Button>
            </div>
        </> : <BsPlusLg className="w-full text-black transform transition-transform ease-in-out hover:scale-100 scale-90" size={100}></BsPlusLg>
        }
     </div>
}

function Branche({project_id, name, type, url, status, user, reload}){
    let [mode, setMode] = useState("base")
    let [file, setFile] = useState("")
    let [db, setDb] = useState("")
    
    return <div className={`flex flex-col justify-between h-60 w-[30%] ${type === "Production" ? "bg-red-100": type === "Development" ? "bg-green-100" : "bg-blue-100"} rounded-3xl text-black pt-3 pb-3 pl-4 pr-4`}>
        {mode === "base" ? 
            <>
                <BrancheInfos name={name} type={type} url={url} status={status} />
                <Buttons project_id={project_id} user={user} type={type} branch_name={name} status={status} setMode={setMode} reload={reload}></Buttons>
            </> : mode === "delete" ? 
            <>
                <div className="text-center font-medium text-lg">
                    <Text>Veux-tu vraiment supprimer ?</Text>
                </div>
                <Button onClick={() => deleteBranch(project_id, name, user, reload)} color="red">Supprimer</Button>
                <Button onClick={() => setMode("base")} color="yellow">Annuler</Button>
            </>
            :
            <>
                <div className="flex flex-row">
                    <Input value={file} onChange={(e) => setFile(e.target.value)}>File name</Input>
                    <Input value={db} onChange={(e) => setDb(e.target.value)}>DB name</Input>
                </div>
                <Button color="blue" onClick={() => {
                    if(file.trim() !== "" && db.trim() !== ""){
                        importBranch(project_id, name, file, db, user, reload)
                        setFile("")
                        setDb("")
                    }
                }}>Import</Button>
                <Button color="yellow" onClick={() => setMode("base")}>Annuler</Button>
            </>
        }
    </div>
}

function BrancheInfos({name, type, status, url}){
    return <div className="space-y-4">
        <Text>BRANCHE : {name}</Text>
        <Text>TYPE : {type}</Text>
        <Text>URL : {status === "active" ? <Link href={url}>{url}</Link> : <span>{url}</span>}</Text>
        <Text>STATUS :
            <span className={`${status === "active" ? `text-green-500` : `text-red-500`}`}> {status}</span>
        </Text>
    </div>
}

function Buttons({status, branch_name, project_id, type, setMode, user, reload}){
    return <div className="flex justify-between space-x-4 p-2">
        {status === "active" ? 
            <Button onClick={() => stopBranch(project_id, branch_name, user, reload)} color="yellow" description="Arrête la branche">Stop</Button> :
            <Button onClick={() => startBranch(project_id, branch_name, user, reload)} color="green" description="Démarre la branche">Start</Button>  
        }
        <Button onClick={() => updateBranch(project_id, branch_name, user, reload)} color="orange" description="Met à jour le code de la branche">Update</Button>
        {type === "Production" ? 
            <Button onClick={() => setMode("import")} color="blue" description="Permet d'importer une base de donnée dans la branche">Import</Button> : 
            type === "Test" ?
                <Button onClick={() => rebuildBranch(project_id, branch_name, user, reload)} color="violet" description="Reconstruit la branche sur base de la branche de production">Rebuild</Button> : 
                ""
        }
        <Button onClick={() => setMode("delete")} color="red" description="Supprime la branche">Supprimer</Button>
    </div>
}