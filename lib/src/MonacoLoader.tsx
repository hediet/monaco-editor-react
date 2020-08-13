import * as React from "react";
import { loadMonaco, getMonaco } from "./monaco-loader";
import * as monacoTypes from "monaco-editor";

/**
 * Can be used to render content only when monaco is loaded.
 */
export class MonacoLoader extends React.Component<
	{ children: (m: typeof monacoTypes) => React.ReactChild },
	{ monaco: typeof monacoTypes | undefined }
> {
	constructor(props: any) {
		super(props);

		this.state = { monaco: getMonaco() };

		if (!this.state.monaco) {
			loadMonaco().then(monaco => {
				this.setState({
					monaco,
				});
			});
		}
	}

	render() {
		if (!this.state.monaco) {
			return null;
		}
		return this.props.children(this.state.monaco);
	}
}

/**
 * Decorates a component so that it only gets mounted when monaco is loaded.
 */
export function withLoadedMonaco<TProps>(
	Component: React.FunctionComponent<TProps> | React.ComponentClass<TProps>
): React.FunctionComponent<TProps> {
	return (props: TProps) => (
		<MonacoLoader>{() => <Component {...props} />}</MonacoLoader>
	);
}
