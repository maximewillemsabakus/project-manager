function Row({children, className=""}){
    return <div className={`flex flex-row ${className}`}>
        {children}
    </div>
}

function Col({children, className=""}){
    return <div className={`flex flex-col ${className}`}>
        {children}
    </div>
}

export { Row, Col }