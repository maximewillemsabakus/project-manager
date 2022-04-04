import React from 'react';
import * as ReactDOMClient from 'react-dom/client';
import { Abakus } from './Abakus';
import "./css/index.css"

const root = ReactDOMClient.createRoot(document.getElementById('root'));

root.render(<Abakus />);