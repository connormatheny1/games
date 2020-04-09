import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import "@blueprintjs/core/lib/css/blueprint.css"
import { BrowserRouter } from 'react-router-dom'
import { Socket } from "react-socket-io"

ReactDOM.render((
    <BrowserRouter>
        <App />
    </BrowserRouter>
), document.getElementById('root'));