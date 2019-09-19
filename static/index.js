import React from "react";
import ReactDOM from "react-dom";
import App from "../app/App";
import "./index.css";
import 'bootstrap/dist/css/bootstrap.css';
import Options from "../app/Options";

if(window.location.href.indexOf('options.html')!==-1){
    ReactDOM.render(<Options />, document.querySelector("#root"));
}else{
    ReactDOM.render(<App />, document.querySelector("#root"));
}
