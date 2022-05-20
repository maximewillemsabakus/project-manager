import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import "./css/index.css"
import { Router } from './router';

const API_URL = "https://api.sh.abakus.be"

const root = ReactDOMClient.createRoot(
    document.getElementById('root')
)

root.render(
    <Router />
)

export { API_URL }