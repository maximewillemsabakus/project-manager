import { useState } from "react"
import { AiFillInfoCircle, AiOutlineInfoCircle } from "react-icons/ai"

const projects = ["Difra 11", "Difra 14", "Lepont", "Visual Impact", "Leporck", "CFN", "MMM"]
const branches = [{name: "test", type: "Production"}, {name: "test2", type: "Production"}, {name: "test3", type: "Production"}, {name: "test4", type: "Production"}, {name: "test5", type: "Production"}, {name: "test6", type: "Production"}]

export function New(){
    return <div className={`flex flex-row`}>
        <ProjectColumn list={projects}></ProjectColumn>
        <Project name="Difra 14" edition="enterprise" version="14.0" url="abakus-it/difra"></Project>
    </div>
}

// Main Blocks

function ProjectColumn({ list }){
    return (
        <div className="bg-gray-300 w-1/5 min-h-screen space-y-1 border-2">
            <ProjectCase className="bg-green-400" project="Create new Project">Create</ProjectCase>
            {list.map(project => 
                <ProjectCase className="bg-red-400" project={project} number="2"></ProjectCase>
            )}
        </div>
    )
}

function Project({ name, edition, version, url }) {
    return (
        <div className="w-4/5 bg-blue-400 min-h-screen">
            <ProjectInfo name={name} edition={edition} version={version} url={url}></ProjectInfo>
            <Branches brancheList={branches}></Branches>
        </div>
    )
}

// Elements

function Branches({ brancheList }){
    return (
        <Line className="bg-green-400 flex-wrap">
            {brancheList.map(branche =>
                <Branch name={branche.name} type={branche.type}></Branch>
            )}
        </Line>
    )
}

function Branch({ name, type }){
    const urls = ["main-difra.com", "difra.com", "difra.be", "dev-difra.be", "sh.abakus.dev-difra.com"]
    let description = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed non risus. Suspendisse lectus tortor, dignissim sit amet, adipiscing nec, ultricies sed, dolor. Cras elementum ultrices diam. Maecenas ligula massa, varius a, semper congue, euismod non, mi. Proin porttitor, orci nec nonummy molestie, enim est eleifend mi, non fermentum diam nisl sit amet erat. Duis semper. Duis arcu massa, scelerisque vitae, consequat in, pretium a, enim. Pellentesque congue. Ut in risus volutpat libero pharetra tempor. Cras vestibulum bibendum augue. Praesent egestas leo in pede. Praesent blandit odio eu enim. Pellentesque sed dui ut augue blandit sodales. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae; Aliquam nibh. Mauris ac mauris sed pede pellentesque fermentum. Maecenas adipiscing ante non diam sodales hendrerit."
    return (
        <Column className="justify-between w-1/2 h-52 border-2 space-y-1">
            <Line className="justify-around h-12">
                <Text>Name : {name}</Text>
                <Text>Type : {type}</Text>
                <Text>Status : Active</Text>
                <IButton description={description}></IButton>
            </Line>
            <Line className="justify-center space-x-4">
                {urls.map(url => <Text><Link url={url}>{url}</Link></Text>)}
            </Line>
            <Line className="flex-wrap justify-around pb-1">
                <Button className="bg-yellow-500">Stop</Button>
                <Button className="bg-yellow-500">Update</Button>
                <Button className="bg-blue-500">Import</Button>
                <Button className="bg-yellow-500">Rebuild</Button>
                <Button className="bg-yellow-500">Export</Button>
                <Button className="bg-blue-500">Modify</Button>
                <Button className="bg-yellow-500">Delete</Button>
                <Button className="bg-blue-500">Logs</Button>
            </Line>
        </Column>
    )
}

function IButton({description}){
    let [isHover, setIsHover] = useState(false)

    return (
        <div className="text-blue-500 cursor-pointer my-auto" title={description} onMouseEnter={() => setIsHover(true)} onMouseLeave={() => setIsHover(false)}>
            {isHover ? <AiFillInfoCircle size={20}></AiFillInfoCircle> : 
                <AiOutlineInfoCircle size={20}></AiOutlineInfoCircle>}
        </div>
    )
}

function ProjectCase({ project, className, number="" }){
    return (
        <Line className={`${className} p-2 ${number === "" ? "justify-center" : "justify-between"}`}>
            <Text>{project}</Text>
            {number !== "" ? <div className="bg-gray-600 rounded-full h-6 w-6 text-white text-center"><Text>{number}</Text></div> : ""}
        </Line>
    )
}

function ProjectInfo({ name, edition, version, url }){
    return (
        <Line className="justify-evenly bg-purple-300 h-14">
            <Line className="space-x-10">
                <Text>{name}</Text>
                <Text>{edition}</Text>
                <Text>{version}</Text>
                <Text><Link url={`https://github.com/${url}`}>{url}</Link></Text>
            </Line>
            <Line className="space-x-10">
                <Button className="bg-rose-300">Filter v</Button>
                <Button className="bg-green-500">Create new branch</Button>
                <Button className="bg-red-500">Delete</Button>
            </Line>
        </Line>
    )
}

function Text({ children, className="" }){
    return (
        <h3 className={`${className} my-auto`}>
            {children}
        </h3>
    )
}

function Line({ children, className="justify-start" }){
    return (
        <div className={`flex flex-row ${className}`}>
            {children}
        </div>
    )
}

function Column({ children, className="justify-start" }){
    return (
        <div className={`flex flex-col ${className}`}>
            {children}
        </div>
    )
}

function Button({ children, className="", onClick }) {
    return (
        <button className={`${className} pl-2 pr-2 pt-1 pb-1 h-10 rounded-lg my-auto`} onClick={onClick}>
            {children}
        </button>
    )
}

function Link({ url, children }){
    return (
        <a className="text-blue-500 hover:underline" href={`https://${url}`} target="_blank" rel="noreferrer">{children}</a>
    )
}