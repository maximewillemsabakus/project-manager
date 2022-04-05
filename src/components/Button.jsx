function Button({children, onClick, color}){
    let btn_color = getColor(color)
    return <button className={`${btn_color} text-black rounded-md pr-3 pl-3 pt-2 pb-2`} onClick={onClick}>{children}</button>
}

function getColor(color){
    switch(color){
        case "blue":
            return "bg-gradient-to-t from-cyan-700 to-sky-400 hover:from-cyan-800 hover:to-sky-500"
        case "green":
            return "bg-gradient-to-t from-green-600 to-emerald-400 hover:from-green-700 hover:to-emerald-500"
        case "red":
            return "bg-gradient-to-t from-rose-700 to-rose-500 hover:from-rose-800 hover:to-rose-600"
        case "purple":
            return "bg-gradient-to-t from-fuchsia-800 to-purple-400 hover:from-fuchsia-900 hover:to-purple-500"
        case "violet":
            return "bg-gradient-to-t from-fuchsia-700 to-purple-300 hover:from-fuchsia-800 hover:to-purple-400"
        case "yellow":
            return "bg-gradient-to-t from-amber-400 to-yellow-300 hover:from-amber-500 hover:to-yellow-400"
        case "orange":
            return "bg-gradient-to-t from-orange-500 to-amber-400 hover:from-orange-600 hover:to-amber-500"
        default:
            return "bg-white"
    }
}

// 

export { Button }