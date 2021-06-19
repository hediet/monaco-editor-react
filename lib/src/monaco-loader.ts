import * as monacoTypes from "monaco-editor";

export type Monaco = typeof monacoTypes;

/**
 * Loads monaco from CDN if monaco is not already loaded.
 */
export async function loadMonaco(): Promise<typeof monacoTypes> {
	const m = getMonaco();
	if (m) {
		return m;
	}
	console.warn("Loading monaco from CDN...");

	const baseUrl =
		"https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.25.2/min/vs";
	await loadScript(`${baseUrl}/loader.min.js`);
	const $require = eval("require"); // to prevent webpack from compiling the require
	$require.config({
		paths: {
			vs: baseUrl,
		},
	});

	return new Promise(res => {
		$require(["vs/editor/editor.main"], function() {
			res(getLoadedMonaco());
		});
	});
}

export function getMonaco(): typeof monacoTypes | undefined {
	return (window as any).monaco;
}

/**
 * Throws if monaco has not been loaded yet.
 */
export function getLoadedMonaco(): typeof monacoTypes {
	const m = getMonaco();
	if (!m) {
		throw new Error("Monaco was not loaded");
	}
	return m;
}

function loadScript(url: string) {
	const pluginScript = document.createElement("script");
	pluginScript.type = "text/javascript";
	const p = new Promise(res => {
		pluginScript.onload = res;
	});
	pluginScript.src = url;
	document.getElementsByTagName("head")[0].appendChild(pluginScript);
	return p;
}
