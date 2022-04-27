import { useEffect, useState } from "react"

import { Button, InfoButton, PlusButton } from "../components/Button"
import { Link, Text } from "../components/Text"
import { Checkbox, Input, Select, TextArea } from "../components/Inputs"

import { signInWithMicrosoft } from "../actions/connect"

import { createBranche, deleteBranch, getBranches, getBranchesFromGit, importBranch, logBranch, rebuildBranch, startBranch, stopBranch, updateBranch } from "../actions/branch"
import { createProject, deleteProject, getProjects } from "../actions/project"
import { getTypes } from "../actions/type"
import { getConfigs } from "../actions/config"
import jwt_decode from "jwt-decode"
import { Col, Row } from "../components/Spacement"

// TODO Filtrer les branches par type

export function Main(){
    let [user, setUser] = useState({isConnected: false, message: ""})
    
    useEffect(() => {
        async function reload(){
            let token = sessionStorage.getItem("token")
            if(token !== null){
                var decoded = jwt_decode(token);
                if(Date.now() > (decoded.exp * 1000)){
                    setUser({isConnected: false, message: "Votre session a expiré"})
                } else {
                    setUser({isConnected: true, message: "", accessToken: token})
                }
            } else {
                setUser({isConnected: false, message: ""})
            }
        }
        setInterval(reload, 60000)
        reload()
        return () => {
            clearInterval(reload)
        }
    }, [])
    
    return <div className={`h-full text-white bg-stone overflow-hidden`}>
        <h1 className="flex font-medium text-6xl justify-center h-1/6"><div className="my-auto">Abakus.sh</div></h1>
        {user.isConnected ? 
            <Projects user={user} /> : 
            <div className="flex justify-center">
                <Button onClick={async () => setUser(await signInWithMicrosoft())} color="blue">Connexion</Button>
            </div>
        }
        {user.isConnected ? "" : <h1 className="font-medium text-lg text-center m-2">{user.message}</h1>}
    </div>
}

function Projects({user}){
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
                <Branches project_id={project.id} project_url={project.git} user={user} />
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
                <Select list={editions} onChange={e => setEdition(e.target.value)}>Édition</Select>
                <Select list={configs.map(c => c.user)} onChange={e => setConfig(configs.find((c) => c.user === e.target.value).id)}>Config</Select>
            </div>
            <div className="mx-auto">
                <Button onClick={() => createProject(name, url, version, edition, config, user, reload)} color="green">Créer</Button>
            </div>
        </div>
    </div>
}

function Project({children, id, git, name, version, edition, user, reload}){
    return <div className="border-2 mt-2 ml-2 mr-2 p-2 overflow-x-auto">
        <div className="flex flex-row space-x-8 mb-2 ">
            <Text>Nom : {name}</Text>
            <Text>Git : <Link href={`https://github.com/${git}`}>{git}</Link></Text>
            <Text>Version : {version}</Text>
            <Text>Édition : {edition}</Text>
            <Button onClick={() => deleteProject(id, user, reload)} color="red">Supprimer</Button>
        </div>
        {children}
    </div>
}

function Branches({project_id, project_url, user}){
    let [branches, setBranches] = useState([])
    let reloadsBranches = async () => setBranches(await getBranches(project_id, user))

    useEffect(() => {
        async function reload(){
            setBranches(await getBranches(project_id, user))
        }
        reload()
    }, [project_id])
    
    return <div className="flex flex-row space-x-4">
        <BrancheCreator project_id={project_id} project_url={project_url} user={user} reload={reloadsBranches} />
        {branches.length === 0 ? "": branches.map(branch => 
            <Branche key={branch.name} user={user} project_id={project_id} name={branch.name} type={branch.type} description={branch.description} url={branch.url} status={branch.status} reload={reloadsBranches} />
        )}
    </div>
}

function BrancheCreator({project_id, project_url, reload, user}){
    let [name, setName] = useState("")
    let [type, setType] = useState("")
    let [types, setTypes] = useState([])
    let [active, setActive] = useState(false)
    let [demoData, setDemoData] = useState(false)
    let [description, setDescription] = useState("")
    let [names, setNames] = useState([])

    useEffect(() => {
        async function loadTypes(){
            setTypes(await getTypes(user))
        }
        loadTypes()
    }, [])

    useEffect(() => {
        setType(types[0])
    }, [types])

    useEffect(() => {
        async function loadNames(){
            setNames(await getBranchesFromGit(project_id, project_url, user))
        }
        loadNames()
    }, [])

    useEffect(() => {
        setName(names[0])
    }, [names])

    return <div className="bg-gradient-to-b from-sky-100 to-slate-300 w-96 h-60 rounded-3xl">
        {active ? <Col className="justify-around h-full">
            <Row className="justify-around">
                <Select color={"text-black"} list={names} onChange={(e) => setName(e.target.value)}>Nom de la branche</Select>
                <Select color={"text-black"} list={types} onChange={(e) => setType(e.target.value)}>Type de branche</Select>
            </Row>
            <Row className="justify-center">
                <TextArea color={"text-black"} value={description} onChange={(e) => setDescription(e.target.value)}>Description</TextArea>
                <Checkbox color={"text-black"} value={demoData} onChange={(e) => setDemoData(e.target.checked)}>Demo data</Checkbox>
            </Row>
            <Row className="justify-center space-x-8">
                <Button color="yellow" onClick={() => setActive(false)}>Annuler</Button>
                <Button onClick={() => {
                    if(name.trim() !== "" && type.trim() !== ""){
                        createBranche(project_id, name, type, demoData, description, user, reload)
                        setName(names[0])
                        setType(types[0])
                    }
                    setActive(false)
                    setDemoData(false)
                    setDescription("")
                }} color="green">Créer</Button>
            </Row>
        </Col> : <PlusButton onClick={() => setActive(true)}/>}
    </div>
}

function Branche({project_id, name, type, url, status, description, user, reload}){
    let [mode, setMode] = useState("base")
    let [file, setFile] = useState("")
    let [db, setDb] = useState("")
    let [state, setState] = useState(status)

    useEffect(() => {
        setState(status)
    }, [status])
    
    return <div className={`flex flex-col justify-between h-60 w-[31%] ${type === "Production" ? "bg-red-100": type === "Development" ? "bg-green-100" : "bg-blue-100"} rounded-3xl text-black pt-3 pb-3 pl-4 pr-4`}>
        {mode === "base" ? 
            <>
                <BrancheInfos name={name} type={type} url={url} status={state} description={description} />
                <Buttons project_id={project_id} setState={setState} user={user} type={type} branch_name={name} status={state} setMode={setMode} reload={reload}></Buttons>
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
                    <Input value={file} onChange={(e) => setFile(e.target.value)}>Nom du fichier</Input>
                    <Input value={db} onChange={(e) => setDb(e.target.value)}>Nom de la BD</Input>
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

function BrancheInfos({name, type, status, url, description}){
    return <div className="space-y-4">
        <Row className="justify-between">
            <Text>BRANCHE : {name}</Text>
            {description.trim() === "" ? <></> : 
                <InfoButton description={description}></InfoButton>
            }
        </Row>
        <Text>TYPE : {type}</Text>
        <Text>URL : {status === "active" ? <Link href={url}>{url}</Link> : <span>{url}</span>}</Text>
        <Text>STATUS :
            <span className={`${status === "active" ? `text-green-500` : status === "inactive" ? `text-red-500` : `text-purple-500`}`}> {status}</span>
        </Text>
    </div>
}

function Buttons({status, branch_name, project_id, type, setMode, user, setState, reload}){
    return <div className="flex justify-between space-x-4 p-2">
        {status === "active" ? 
            <Button onClick={() => stopBranch(project_id, branch_name, user, reload)} color="yellow" description="Arrête la branche">Stop</Button> :
            <Button onClick={() => startBranch(project_id, branch_name, user, reload)} color="green" description="Démarre la branche">Start</Button>  
        }
        <Button onClick={() => updateBranch(project_id, branch_name, user, reload)} color="orange" description="Met à jour le code de la branche">Update</Button>
        {type === "Production" ? 
            <Button onClick={() => setMode("import")} color="blue" description="Permet d'importer une base de donnée dans la branche">Import</Button> : 
            type === "Test" ?
                <Button onClick={() => rebuildBranch(project_id, branch_name, user, setState, reload)} color="violet" description="Reconstruit la branche sur base de la branche de production">Rebuild</Button> : 
                ""
        }
        <Button onClick={() => setMode("delete")} color="red" description="Supprime la branche">Supprimer</Button>
        <Button onClick={() => logBranch(project_id, branch_name, user)} color="blue" description="Affiche les logs de la branche">Log</Button>
    </div>
}