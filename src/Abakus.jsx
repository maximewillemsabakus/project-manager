import { useEffect, useState } from "react"
import { BsPlusLg } from "react-icons/bs"
import { copyBranch, createBranche, deleteBranch, getBranches, startBranch, stopBranch } from "./actions/branch"
import { createProject, deleteProject, getProjects } from "./actions/project"
import { signInWithGoogle } from "./actions/connect"

export function Abakus(){
    let [user, setUser] = useState({})
    let [data, setData] = useState([])
    let reload = (setData) => getProjects(setData)
    useEffect(() => reload(setData), [])

    return <div className={`pt-20 text-white bg-stone overflow-hidden`}>
        {!user.isConnected ? 
            <Projects reload={() => reload(setData)} projects={data} /> : 
            <div>
                <Button onClick={() => signInWithGoogle()} color={"bg-blue-500 hover:bg-blue-600"}>Connect</Button>
            </div>
        }
    </div>
}

function Projects({projects, reload}){
    return <div className="overflow-auto">
        <CreationForm reload={reload}></CreationForm>
        {projects.length === 0 ? <Text>No projects</Text>: projects.map(project => 
            <Project key={project.id} reload={reload} id={project.id} name={project.name} git={project.git} version={project.version} edition={project.edition}>
                <Branches project_id={project.id} />
            </Project>
        )}
    </div>
}

function BrancheCreator({project_id, reload}){
    let [name, setName] = useState("")
    let [type, setType] = useState("")
    let [active, setActive] = useState(false)

    return <div className={`flex flex-col justify-around h-60 w-60 bg-gray-200 rounded-3xl ${active ? "" : "cursor-pointer"}`} onClick={() => active ? "" : setActive(true)} >
        {active ? <>
            <div>
                <Input color={`text-black`} value={name} onChange={e => setName(e.target.value)}>Name</Input>
                <Input color={`text-black`} value={type} onChange={e => setType(e.target.value)}>Type</Input>
            </div>
            <div className="flex justify-center">
                <Button onClick={() => {
                    if(name.trim() !== "" && type.trim() !== ""){
                        createBranche(project_id, name, type, reload)
                    }
                    setActive(false)
                }} color={`bg-green-500 hover:bg-green-600`}>Create</Button>
            </div>
        </> : <BsPlusLg className="w-full text-black transform transition-transform ease-in-out hover:scale-100 scale-90" size={100}></BsPlusLg>
        }
     </div>
}

function Input({children, value, onChange, color}){
    return <div className={`flex flex-col ${color} m-2`}>
        <label className="pl-1">{children}</label>
        <input className={`bg-gray-800 rounded-md text-white border-2 border-black h-8 pl-1 pr-1`} value={value} onChange={onChange}></input>
    </div>
}

function Branches({project_id}){
    let [branches, setBranches] = useState([])
    let reloadBranches = (setBranches, project_id) => getBranches(setBranches, project_id)
    useEffect(() => reloadBranches(setBranches, project_id), [project_id])
    
    return <div className="flex flex-row space-x-4">
        <BrancheCreator project_id={project_id} reload={() => reloadBranches(setBranches, project_id)} />
        {branches.length === 0 ? "": branches.map(branch => 
            <Branche key={branch.name} project_id={project_id} name={branch.name} type={branch.type} url={branch.url} status={branch.status} reload={() => reloadBranches(setBranches, project_id)} />
        )}
    </div>
}

function Project({children, id, git, name, version, edition, reload}){
    return <div className="border-2 mt-2 ml-2 mr-2 p-2">
        <div className="flex flex-row space-x-8 mb-2">
            <Text>Name : {name}</Text>
            <Text>Git : <Link href={`https://github.com/${git}`}>{git}</Link></Text>
            <Text>version : {version}</Text>
            <Text>Edition : {edition}</Text>
            <Button onClick={() => deleteProject(id, reload)} color={`bg-red-500 hover:bg-red-600`}>Delete</Button>
            <Button onClick={() => print()} color={`bg-purple-500 hover:bg-purple-600`}>Copy</Button>
        </div>
        {children}
    </div>
}

function Text({children}){
    return <h3 className="my-auto">{children}</h3>
}

function Branche({project_id, name, type, url, status, reload}){
    return <div className={`flex flex-col justify-between h-60 bg-gray-200 rounded-3xl text-black pt-3 pb-3 pl-4 pr-4`}>
        <div className="space-y-4">
            <Text>BRANCHE : {name}</Text>
            <Text>TYPE : {type}</Text>
            <Text>URL : {status === "active" ? <Link href={url}>{url}</Link> : <span>{url}</span>}</Text>
            <Text>Status : <span className={`${status === "active" ? `text-green-500` : `text-red-500`}`}>{status}</span></Text>
        </div>
        <Buttons project_id={project_id} branch_name={name} status={status} reload={reload}></Buttons>
    </div>
}

function Link({href, children}){
    return <a className={`text-blue-500 hover:text-blue-400 hover:underline`} href={href}>{children}</a>
}

function Buttons({status, branch_name, project_id, reload}){
    return <div className="flex justify-between space-x-4 p-2">
        {status === "active" ? 
            <Button onClick={() => stopBranch(project_id, branch_name, reload)} color={`bg-yellow-300 hover:bg-yellow-400`}>Stop</Button> :
            <Button onClick={() => startBranch(project_id, branch_name, reload)} color={`bg-green-500 hover:bg-green-600`}>Start</Button>  
        }
        <Button color={`bg-yellow-500 hover:bg-yellow-600`}>Edit</Button>
        <Button color={`bg-purple-500 hover:bg-purple-600`}>Rebuild</Button>
        <Button onClick={() => deleteBranch(project_id, branch_name, reload)} color={`bg-red-500 hover:bg-red-600`}>Delete</Button>
    </div>
}

function CopyForm({reload}){
    let [srcName, setSrcName] = useState("")
    let [destName, setDestName] = useState("")
    let [srcDbName, setSrcDbName] = useState("")
    let [destDbName, setDestDbName] = useState("")

    return <div className="bg-gray-500 p-4 space-x-3">
        <label>Source project name</label>
        <input value={srcName} onChange={e => setSrcName(e.target.value)}></input>

        <label>Source database name</label>
        <input value={srcDbName} onChange={e => setSrcDbName(e.target.value)}></input>

        <label>Destination project name</label>
        <input value={destName} onChange={e => setDestName(e.target.value)}></input>

        <label>Destination database name</label>
        <input value={destDbName} onChange={e => setDestDbName(e.target.value)}></input>

        <button className={`bg-blue-500 p-1 rounded-lg`} onClick={() => {
            copyBranch(srcName, srcDbName, destName, destDbName, reload)
        }}>Copy</button>
    </div>
}

function Button({children, onClick, color}){
    return <button className={`${color} text-black rounded-md pr-3 pl-3 pt-2 pb-2`} onClick={onClick}>{children}</button>
}

function Select({list, children, onChange}){
    return <div className="flex flex-col my-auto">
        <label className="pl-1">{children}</label>
        <select className={`bg-gray-800 rounded-md text-white border-2 border-black h-8 pl-1 pr-1`} onChange={onChange}>
            {list.map(e => <option key={e}>{e}</option>)}
        </select>
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
        <Input value={name} onChange={e => setName(e.target.value)}>Name</Input>
        <Input value={url} onChange={e => setUrl(e.target.value)}>Url</Input>

        <Select list={versions} onChange={e => setVersion(e.target.value)}>Version</Select>
        <Select list={editions} onChange={e => setEdition(e.target.value)}>Edition</Select>

        <div className="my-auto">
            <Button onClick={() => createProject(name, url, version, edition, reload)} color={`bg-green-500 hover:bg-green-600`}>Create</Button>
        </div>
    </div>
}

function print(str=""){
    console.log(str)
}