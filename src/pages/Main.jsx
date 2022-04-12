import { useEffect, useState } from "react"

import { Button } from "../components/Button"
import { Link, Text } from "../components/Text"
import { Input, Select } from "../components/Inputs"

import { BsPlusLg } from "react-icons/bs"

import { isValid, signInWithMicrosoft } from "../actions/connect"

import { createBranche, deleteBranch, getBranches, importBranch, rebuildBranch, startBranch, stopBranch, updateBranch } from "../actions/branch"
import { createProject, deleteProject, getProjects } from "../actions/project"
import { getTypes } from "../actions/type"

export function Main(){
    let [valid, setValid] = useState(false)

    return <div className={`pt-20 h-full text-white bg-stone overflow-hidden`}>
        {valid ? 
            <Projects /> : 
            <div className="flex justify-center">
                <Button onClick={async () => setValid(isValid(await signInWithMicrosoft()))} color="blue">Connexion</Button>
            </div>
        }
    </div>
}

function Projects(){
    let [projects, setProjects] = useState([])
    let reloads = async () => setProjects(await getProjects())
    useEffect(() => {
        async function reload(){
            setProjects(await getProjects())
        }
        reload()
    }, [])

    return <div className="overflow-y-auto h-full">
        <CreationForm reload={reloads}></CreationForm>
        {projects.length === 0 ? <div className="m-2"><Text>Aucun projets</Text></div>: projects.map(project => 
            <Project key={project.id} reload={reloads} id={project.id} name={project.name} git={project.git} version={project.version} edition={project.edition}>
                <Branches project_id={project.id} />
            </Project>
        )}
    </div>
}

function BrancheCreator({project_id, reload}){
    let [name, setName] = useState("")
    let [type, setType] = useState("")
    let [types, setTypes] = useState([])
    let [active, setActive] = useState(false)

    useEffect(() => {
        async function loadTypes(){
            setTypes(await getTypes())
        }
        loadTypes()
    }, [])

    return <div className={`flex flex-col justify-around h-60 w-60 bg-gradient-to-t rounded-3xl ${active ? "from-white to-white" : "cursor-pointer from-slate-400 to-blue-200"}`} onClick={() => active ? "" : setActive(true)} >
        {active ? <>
            <div>
                <Input color={`text-black`} value={name} onChange={e => setName(e.target.value)}>Nom</Input>
                <Select color={"text-black"} list={types} onChange={(e) => setType(e.target.value)}>Type</Select>
            </div>
            <div className="flex justify-center">
                <Button onClick={() => {
                    if(name.trim() !== ""){
                        if(type.trim() === ""){
                            type = types[0]
                        }
                        createBranche(project_id, name, type, reload)
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

function Branches({project_id}){
    let [branches, setBranches] = useState([])
    let reloadsBranches = async (project_id) => await getBranches(project_id)

    useEffect(() => {
        async function reload(){
            setBranches(await getBranches(project_id))
        }
        reload()
    }, [project_id])
    
    return <div className="flex flex-row space-x-4">
        <BrancheCreator project_id={project_id} reload={async () => setBranches(await reloadsBranches(project_id))} />
        {branches.length === 0 ? "": branches.map(branch => 
            <Branche key={branch.name} project_id={project_id} name={branch.name} type={branch.type} url={branch.url} status={branch.status} reload={async () => setBranches(await reloadsBranches(project_id))} />
        )}
    </div>
}

function Project({children, id, git, name, version, edition, reload}){
    return <div className="border-2 mt-2 ml-2 mr-2 p-2">
        <div className="flex flex-row space-x-8 mb-2 ">
            <Text>Nom : {name}</Text>
            <Text>Git : <Link href={`https://github.com/${git}`}>{git}</Link></Text>
            <Text>Version : {version}</Text>
            <Text>Edition : {edition}</Text>
            <Button onClick={() => deleteProject(id, reload)} color="red">Supprimer</Button>
        </div>
        {children}
    </div>
}

function Branche({project_id, name, type, url, status, reload}){
    let [mode, setMode] = useState("base")
    let [file, setFile] = useState("")
    let [db, setDb] = useState("")
    
    return <div className={`flex flex-col justify-between h-60 ${type === "Production" ? "bg-red-100": type === "Development" ? "bg-green-100" : "bg-blue-100"} rounded-3xl text-black pt-3 pb-3 pl-4 pr-4`}>
        {mode === "base" ? 
            <>
                <BrancheInfos name={name} type={type} url={url} status={status} />
                <Buttons project_id={project_id} type={type} branch_name={name} status={status} setMode={setMode} reload={reload}></Buttons>
            </> : 
            <>
                <div className="flex flex-row">
                    <Input value={file} onChange={(e) => setFile(e.target.value)}>File name</Input>
                    <Input value={db} onChange={(e) => setDb(e.target.value)}>DB name</Input>
                </div>
                <Button color="blue" onClick={() => {
                    if(file.trim() !== "" && db.trim() !== ""){
                        importBranch(project_id, name, file, db, reload)
                        setFile("")
                        setDb("")
                    }
                }}>Import</Button>
                <Button color="red" onClick={() => setMode("base")}>Close</Button>
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

function Buttons({status, branch_name, project_id, type, setMode, reload}){
    return <div className="flex justify-between space-x-4 p-2 bg-">
        {status === "active" ? 
            <Button onClick={() => stopBranch(project_id, branch_name, reload)} color="yellow">Stop</Button> :
            <Button onClick={() => startBranch(project_id, branch_name, reload)} color="green">Start</Button>  
        }
        <Button onClick={() => updateBranch(project_id, branch_name, reload)} color="orange">Update</Button>
        {type === "Production" ? 
            <Button onClick={() => setMode("import")} color="blue">Import</Button> :
            <Button onClick={() => rebuildBranch(project_id, branch_name, reload)} color="violet">Rebuild</Button>
        }
        <Button onClick={() => deleteBranch(project_id, branch_name, reload)} color="red">Supprimer</Button>
    </div>
}

function CreationForm({reload}){
    let [name, setName] = useState("visualimpact")
    let [url, setUrl] = useState("abakus-it/visualimpact")
    let [version, setVersion] = useState("15.0")
    let [edition, setEdition] = useState("community")

    const versions = ["15.0", "14.0", "13.0", "12.0", "11.0"]
    const editions = ["community", "enterprise"]

    return <div className="flex flex-row space-x-8 border-2 m-2 p-2">
        <Input value={name} onChange={e => setName(e.target.value)}>Nom</Input>
        <Input value={url} onChange={e => setUrl(e.target.value)}>Url</Input>

        <Select list={versions} onChange={e => setVersion(e.target.value)}>Version</Select>
        <Select list={editions} onChange={e => setEdition(e.target.value)}>Edition</Select>

        <div className="my-auto space-x-8">
            <Button onClick={() => createProject(name, url, version, edition, reload)} color="green">Créer</Button>
        </div>
    </div>
}