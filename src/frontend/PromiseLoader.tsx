import * as React from "react";

export interface IFormProps<T> {
    onSubmit: (...args: any[]) => Promise<T>;
    res?: T;
}

export default function Loader<T>(Component: React.ComponentClass<T>): React.ComponentClass<T> {
    return class extends React.Component <T> {
        constructor() {
            super();
            this.state = {
                error  : "",
                loading: false,
            };
        }

        public render() {
            const newProps = {
                ...this.props as object,
                onSubmit: this.onSubmit,
                ...this.state,
            } as any;
            return <Component {...newProps}/>;
        }

        private onSubmit = async (...args: any[]) => {
            try {
                const {onSubmit} = this.props as any;
                this.setState({
                    error  : "",
                    loading: true,
                    res    : void 0,
                });
                const res = await onSubmit(...args);
                this.setState({res});
            } catch (e) {
                this.setState({error: e.message});
            } finally {
                this.setState({loading: false});
            }
        };
    };

}
