import * as React from "react";
import { getLoadedMonaco } from "./monaco-loader";
import * as monacoTypes from "monaco-editor";
import { withLoadedMonaco } from "./MonacoLoader";

class MonacoEditorImpl extends React.Component<
	{
		model: monacoTypes.editor.ITextModel;
		onEditorLoaded?: (
			editor: monacoTypes.editor.IStandaloneCodeEditor
		) => void;
		height?:
			| { /* Fills the entire space. */ kind: "fill" }
			| {
					/* Use the content as height. */ kind: "dynamic";
					maxHeight?: number;
			  };
		/**
		 * Initial theme to be used for rendering.
		 * The current out-of-the-box available themes are: 'vs' (default), 'vs-dark', 'hc-black'.
		 * You can create custom themes via `monaco.editor.defineTheme`.
		 * To switch a theme, use `monaco.editor.setTheme`
		 */
		theme?: string;
		readOnly?: boolean;
	},
	{ contentHeight: number | undefined }
> {
	public editor: monacoTypes.editor.IStandaloneCodeEditor | undefined;

	private get height() {
		if (this.state.contentHeight === undefined) {
			return undefined;
		}
		return Math.min(200, this.state.contentHeight);
	}

	private readonly divRef = React.createRef<HTMLDivElement>();
	private readonly resizeObserver = new ResizeObserver(() => {
		if (this.editor) {
			this.editor.layout();
		}
	});

	constructor(props: any) {
		super(props);
		this.state = { contentHeight: undefined };
	}

	render() {
		const heightInfo = this.props.height || { kind: "fill" };
		const height = heightInfo.kind === "fill" ? "100%" : this.height;

		return (
			<div
				style={{
					height,
					minHeight: 0,
					minWidth: 0,
				}}
				className="monaco-editor-react"
				ref={this.divRef}
			/>
		);
	}

	componentDidMount() {
		const div = this.divRef.current;
		if (!div) {
			throw new Error("unexpected");
		}

		this.resizeObserver.observe(div);
		this.editor = getLoadedMonaco().editor.create(div, {
			model: this.props.model,
			scrollBeyondLastLine: false,
			minimap: { enabled: false },
			automaticLayout: false,
			theme: this.props.theme,
			readOnly: this.props.readOnly,
		});
		this.editor.onDidContentSizeChange(e => {
			this.setState({ contentHeight: e.contentHeight });
		});
		if (this.props.onEditorLoaded) {
			this.props.onEditorLoaded(this.editor);
		}
	}

	componentDidUpdate(newProps: this["props"]) {
		if (newProps.model !== this.props.model) {
			this.editor!.setModel(newProps.model);
		}
	}

	componentWillUnmount() {
		if (!this.editor) {
			console.error("unexpected state");
		} else {
			this.editor.dispose();
		}
	}
}

export const MonacoEditor = withLoadedMonaco(MonacoEditorImpl);
