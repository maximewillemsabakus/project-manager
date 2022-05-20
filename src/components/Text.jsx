function Text({children, className, color="", truncate = false}){
    return <h3 className={`my-auto ${color} ${className} ${truncate ? "truncate" : ""}`}>{children}</h3>
}

function Link({href, description, children}){
    return <a title={description} className={`text-blue-500 hover:text-blue-400 hover:underline`} target="_blank" rel="noreferrer" href={href}>{children}</a>
}

export { Text, Link }