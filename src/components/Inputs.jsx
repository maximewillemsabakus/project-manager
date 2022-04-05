function Input({children, value, onChange, color}){
    return <div className={`flex flex-col ${color} m-2`}>
        <label className="pl-1">{children}</label>
        <input className={`bg-gray-800 rounded-md text-white border-2 border-black h-8 pl-1 pr-1`} value={value} onChange={onChange}></input>
    </div>
}

function Select({list, children, color, onChange}){
    return <div className="flex flex-col my-auto m-2">
        <label className={`pl-1 ${color}`}>{children}</label>
        <select className={`bg-gray-800 rounded-md text-white border-2 border-black h-8 pl-1 pr-1`} onChange={onChange}>
            {list.map(e => <option key={e}>{e}</option>)}
        </select>
    </div>
}

export { Input, Select }