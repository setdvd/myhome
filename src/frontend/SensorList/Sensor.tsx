import gql from "graphql-tag";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import {ListItem} from "material-ui/List";
import Paper from "material-ui/Paper";
import IconDelete from "material-ui/svg-icons/action/delete";
import * as moment from "moment";
import * as React from "react";
import {Line} from "react-chartjs-2";

export interface ISensor {
    id: string;
    name: string;
    description: string;
    sensorReadings: ISensorReadings[],
}

export interface ISensorProps extends ISensor {
    onDelete: (id: string) => any;
    open: boolean;
    onClick: (...args: any[]) => any;
}

export interface ISensorReadings {
    id: string;
    value: number;
    createdAt: string;
}

export default class Sensor extends React.PureComponent<ISensorProps> {
    public static query = gql`
        fragment Sensor on Sensor{
            id
            name
            description
            sensorReadings{
                id
                value
                createdAt
            }
        }
    `;

    public render() {
        const {name, id, open, description, onDelete, onClick, sensorReadings} = this.props;
        return (
            <Paper zDepth={open ? 3 : 0}>
                <ListItem
                    onClick={onClick}
                    key={id}
                    primaryText={name}
                    secondaryText={`${id}: ${description}`}
                    secondaryTextLines={3}
                    rightIconButton={(
                        <IconButton onClick={() => onDelete(id)}>
                            <IconDelete/>
                        </IconButton>
                    )}
                />
                <Divider/>
                <Line data={this.sensorReadingsToGraphPoints(sensorReadings)}/>
            </Paper>
        );
    }

    private sensorReadingsToGraphPoints(data: ISensorReadings[]) {
        return {
            datasets: [{
                backgroundColor          : "rgba(75,192,192,0.4)",
                borderCapStyle           : "butt",
                borderColor              : "rgba(75,192,192,1)",
                borderDash               : [],
                borderDashOffset         : 0.0,
                borderJoinStyle          : "miter",
                data                     : data.map((sensorReading) => ({
                    x: new Date(sensorReading.createdAt),
                    y: sensorReading.value,
                })),
                fill                     : false,
                label                    : "My First dataset",
                pointBackgroundColor     : "#fff",
                pointBorderColor         : "rgba(75,192,192,1)",
                pointBorderWidth         : 1,
                pointHitRadius           : 10,
                pointHoverBackgroundColor: "rgba(75,192,192,1)",
                pointHoverBorderColor    : "rgba(220,220,220,1)",
                pointHoverBorderWidth    : 2,
                pointHoverRadius         : 5,
                pointRadius              : 1,
            }],
            labels  : data.map((r) => moment(r.createdAt).format("Do MMM")),
            options : {
                scales: {
                    xAxes: [{
                        time: {
                            unit        : "day",
                            unitStepSize: 1,
                        },
                    }],
                },
            },
        };
    }
}
