import { Link } from "react-router-dom";
import { Button } from "../components/Button";

export function Import(){
    return <div className={`pt-20 h-full text-white bg-stone overflow-hidden`}>
        <Link to="/"><Button>{"<--"}</Button></Link>
    </div>
}