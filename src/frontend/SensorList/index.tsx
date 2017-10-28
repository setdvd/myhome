import gql from "graphql-tag";
import {List} from "material-ui/List";
import Header from "material-ui/Subheader";
import * as React from "react";
import {graphql} from "react-apollo";
import CircularProgress from "../CircularProgress"
import Sensor, {ISensorProps} from "./Sensor";

export const query = gql`
    query sensorList {
        sensors{
            ...Sensor
        }
    }
    ${Sensor.query}
`;

export interface ISensorListProps {
    sensors?: ISensorProps[];
    loading?: boolean
}

class SensorList extends React.PureComponent<ISensorListProps> {

    public render() {
        const {sensors = []} = this.props;
        return (
            <List>
                <Header>Sensor list</Header>
                {sensors.map((sensor) => <Sensor {...sensor}/>)}
            </List>
        );
    }
}

const Container = graphql<ISensorListProps, ISensorListProps>(query, {
    props: ({data: {loading = false, sensors = []} = {}}) => {
        return {
            loading,
            sensors,
        };
    },
});

export default Container(CircularProgress<ISensorListProps>(SensorList));
