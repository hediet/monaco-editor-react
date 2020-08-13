# @hediet/monaco-editor-react

[![](https://img.shields.io/static/v1?style=social&label=Sponsor&message=%E2%9D%A4&logo=GitHub&color&link=%3Curl%3E)](https://github.com/sponsors/hediet)
[![](https://img.shields.io/static/v1?style=social&label=Donate&message=%E2%9D%A4&logo=Paypal&color&link=%3Curl%3E)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=ZP5F38L4C88UY&source=url)
[![](https://img.shields.io/twitter/follow/hediet_dev.svg?style=social)](https://twitter.com/intent/follow?screen_name=hediet_dev)

This library exposes the monaco editor as a react component.
It also deals with loading monaco from a CDN if monaco is not bundled.

## Installation

Install this library and monaco with `yarn`:

```
yarn add @hediet/monaco-editor-react monaco-editor
```

## Usage

You can use this library like this:

```tsx
import {
	getLoadedMonaco,
	MonacoEditor,
	withLoadedMonaco,
} from "@hediet/monaco-editor-react";

/*
	Uncomment the following import to bundle monaco.
	This might significantly increase webpack build times, even with HMR.
	Without the import, monaco is loaded from cloudflare with zero build time delays.
*/
// import "monaco-editor";

export class MainView extends React.Component {
	render() {
		return <Foo />;
	}
}

class _Foo extends React.Component {
	// Use `getLoadedMonaco()` to get the bundled monaco or the monaco from CDN.
	// If you use `monaco` from `"monaco-editor"`, you will bundle monaco automatically.
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

// Make sure that monaco is loaded when mounting `_Foo`.
const Foo = withLoadedMonaco(_Foo);
```

## Bundling Monaco

If you bundle monaco using webpack (e.g. with `import "monaco-editor"`), you should add the monaco webpack plugin to your webpack config:

```js
const MonacoWebpackPlugin = require("monaco-editor-webpack-plugin");
module.exports = {
	plugins: [
		new MonacoWebpackPlugin({
			// available options are documented at https://github.com/Microsoft/monaco-editor-webpack-plugin#options
			languages: ["json"],
		}),
	],
};
```

This ensures that the webworkers are bundled and loaded too.

## Advantages over [`react-monaco-editor`](https://github.com/react-monaco-editor/react-monaco-editor)

-   Loads monaco from CDN if monaco is not bundled to increase webpack build times.
-   Uses a resize observer to trigger editor layouting rather than relying on `automaticLayout` (which has some glitches).
-   Supports dynamic height mode so that the editor has the height of its content.

## Notes

-   Use `overflow: visible` or `overflow: hidden` if you get scrollbar problems. Monaco's widgets (like the autocomplete window) may have a larger size than the editor.
-   If you get `Uncaught Error: Unexpected usage`, you probably forget to configure the webpack monaco plugin.
