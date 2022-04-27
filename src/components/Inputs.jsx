function Input({children, value, onChange, color, placeholder}){
    return <div className={`flex flex-col ${color} m-2`}>
        <Label>{children}</Label>
        <input placeholder={placeholder} className={`bg-gray-800 rounded-md text-white border-2 border-black h-8 pl-1 pr-1`} value={value} onChange={onChange}></input>
    </div>
}

function Select({list, children, color, onChange}){
    return <div className="flex flex-col my-auto m-2 w-40">
        <Label color={color}>{children}</Label>
        <select className={`bg-gray-800 rounded-md text-white border-2 border-black h-8 pl-1 pr-1`} onChange={onChange}>
            {list.map(e => <option key={e}>{e}</option>)}
        </select>
    </div>
}

function Checkbox({value, color, onChange, children}){
    return <div className="flex flex-row m-2">
        <Label color={color}>{children}</Label>
        <input className="my-auto h-5 w-5 ml-2" type="checkbox" value={value} onChange={onChange} />
    </div>
}

function TextArea({value, color, onChange, children}){
    return <div className="flex flex-col my-auto m-2">
        <Label color={color}>{children}</Label>
        <textarea rows="2" className={`bg-gray-800 rounded-md text-white border-2 border-black pl-1 pr-1 h-12`} value={value} onChange={onChange}></textarea>
    </div>
}

function Label({children, color}){
    return <label className={`pl-1 pb-1 my-auto ${color}`}>{children}</label>
}

export { Input, Select, Checkbox, TextArea }