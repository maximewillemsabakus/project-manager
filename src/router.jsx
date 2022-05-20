import { BrowserRouter, Route, Routes } from "react-router-dom"
import { Main } from "./pages/Main"
import { New } from "./pages/New"

function Router(){
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Main />} />
                <Route path="/new" element={<New />} />
            </Routes>
        </BrowserRouter>
    )
}

export { Router }