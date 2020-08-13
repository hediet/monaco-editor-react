import React = require("react");
import { MainView } from "./MainView";
import { hotComponent } from "../utils/hotComponent";

@hotComponent(module)
export class App extends React.Component {
	render() {
		return <MainView />;
	}
}
