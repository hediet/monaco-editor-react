import * as React from "react";
import * as ReactDOM from "react-dom";
import "./style.scss";
import { App } from "./components/App";

const elem = document.createElement("div");
document.body.append(elem);
ReactDOM.render(<App />, elem);
