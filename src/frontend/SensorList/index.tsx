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

    public render() {
        const {sensors = [], onDelete} = this.props;
        return (
            <List>
                <Header>Sensor list</Header>
                {sensors.map((sensor) => <Sensor onDelete={onDelete} {...sensor}/>)}
            </List>
        );
    }
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
