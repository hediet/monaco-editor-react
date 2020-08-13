import * as React from "react";
import classnames = require("classnames");
import { observer } from "mobx-react";
import { hotComponent } from "../utils/hotComponent";
import {
	getLoadedMonaco,
	MonacoEditor,
	withLoadedMonaco,
} from "@hediet/monaco-editor-react";
// Uncomment the import to bundle monaco. This might dramatically increase webpack build times, even with HMR.
// Without the import, monaco is loaded from cloudflare with zero build time delays.
// import "monaco-editor";

@hotComponent(module)
@observer
export class MainView extends React.Component {
	render() {
		return (
			<div>
				<Foo />
			</div>
		);
	}
}

class _Foo extends React.Component {
	private readonly model = getLoadedMonaco().editor.createModel(
		'{ "foo": true }',
		"json"
	);
	render() {
		return (
			<div style={{ border: "1px solid black" }}>
				<MonacoEditor model={this.model} height={{ kind: "dynamic" }} />
			</div>
		);
	}
}

const Foo = withLoadedMonaco(_Foo);
