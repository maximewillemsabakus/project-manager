function Text({children}){
    return <h3 className="my-auto">{children}</h3>
}

function Link({href, children}){
    return <a className={`text-blue-500 hover:text-blue-400 hover:underline`} target="_blank" href={href}>{children}</a>
}

export { Text, Link }