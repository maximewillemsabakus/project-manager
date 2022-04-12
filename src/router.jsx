import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Import } from "./pages/Import";
import { Main } from "./pages/Main";

function Router(){
    return <BrowserRouter>
        <Routes>
            <Route path="/" element={<Main />} />
            <Route path="/import" element={<Import />} />
        </Routes>
    </BrowserRouter>
}

export { Router }