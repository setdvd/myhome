import FlatButton from "material-ui/FlatButton";
import TextField from "material-ui/TextField";
import * as React from "react";
import Loader from "../PromiseLoader";

export interface ISensorCreateFormProps {
    onSubmit?: (...args: any[]) => any;
    loading?: boolean;
    error?: string;
}

interface ISensorCreateFormState {
    name: string;
}

export default Loader(class SensorCreateForm extends React.Component<ISensorCreateFormProps, ISensorCreateFormState> {

    constructor(props: any, context: any) {
        super(props, context);
        this.state = {name: ""};
    }

    public render() {
        return (
            <div>
                <TextField onChange={this.onPropertyChange} floatingLabelText="Sensor name"/>
                <FlatButton disabled={this.props.loading} label="CREATE" onClick={this.onSubmit}/>
                <p>{this.props.error}</p>
            </div>
        );
    }

    private onPropertyChange = (e: React.FormEvent<HTMLInputElement>) => {
        this.setState({name: e.currentTarget.value});
    };

    private onSubmit = () => {
        if (this.props.onSubmit) {
            this.props.onSubmit(this.state.name);
        }
    };
});
