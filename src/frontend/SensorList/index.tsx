import gql from "graphql-tag";
import {List} from "material-ui/List";
import Header from "material-ui/Subheader";
import * as React from "react";
import {graphql} from "react-apollo";
import CircularProgress from "../CircularProgress";
import DeleteSensorContainer from "./DeleteSensorContainer";
import Sensor, {ISensor} from "./Sensor";

export const QUERY_SENSORS = gql`
    query sensorList {
        sensors{
            id
            ...Sensor
        }
    }
    ${Sensor.query}
`;

export interface IResponce {
    sensors: ISensor[]
}

export interface ISensorListProps {
    sensors?: ISensor[];
    loading?: boolean,
    onDelete: (id: string) => any;
}

class SensorList extends React.PureComponent<ISensorListProps> {

    public state: {
        openedSensorId: string | null;
    };

    constructor(props: any) {
        super(props);
        this.state = {openedSensorId: null};
    }

    public render() {
        const {sensors = [], onDelete} = this.props;
        return (
            <List>
                <Header>Sensor list:</Header>
                {sensors.map((sensor) => <Sensor onClick={this.onSensorClick.bind(this, sensor.id)}
                                                 open={this.state.openedSensorId === sensor.id}
                                                 onDelete={onDelete}
                                                 {...sensor}/>)}
            </List>
        );
    }

    private onSensorClick(openedSensorId: string) {
        this.setState({openedSensorId});
    };
}

const Container = graphql<IResponce, { onDelete: (id: string) => any }, ISensorListProps>(QUERY_SENSORS, {
    props: ({data, ownProps}): ISensorListProps => {
        const {onDelete} = ownProps;
        return {
            loading: data && data.loading,
            onDelete,
            sensors: data && data.sensors,
        };
    },
});

export default DeleteSensorContainer(Container(CircularProgress<ISensorListProps>(SensorList)));
