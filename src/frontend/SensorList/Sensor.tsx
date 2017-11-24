import gql from "graphql-tag";
import Divider from "material-ui/Divider";
import IconButton from "material-ui/IconButton";
import {ListItem} from "material-ui/List";
import Paper from "material-ui/Paper";
import IconDelete from "material-ui/svg-icons/action/delete";
import * as moment from "moment";
import * as R from "ramda";
import * as React from "react";
import {Line} from "react-chartjs-2";

interface ICreatedAt {
    createdAt: string;
}

const groupCreatedAtByDayFormat = R.curry((format: string, list: ICreatedAt[]) => R.groupBy(({createdAt}) => moment(createdAt).format(format), list));

const averageValueByGroup   = R.map(R.compose(R.mean, R.pluck("value")));
const averageValueByFormant = (format: string) => R.compose(averageValueByGroup, groupCreatedAtByDayFormat(format) as any);

const averageValueByDay  = averageValueByFormant("MMM DD YYYY");
const averageValueByHour = averageValueByFormant("MMM DD YYYY hh");
const averageValueByMin  = averageValueByFormant("MMM DD YYYY hh:mm");

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
                    secondaryTextLines={2}
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
        const poins   = averageValueByMin(data);
        const labels  = R.keys(poins);
        const dataset = R.compose(R.map(([x, y]) => ({x, y})), R.zip(labels), R.values);

        return {
            datasets: [{
                backgroundColor          : "rgba(75,192,192,0.4)",
                borderCapStyle           : "butt",
                borderColor              : "rgba(75,192,192,1)",
                borderDash               : [],
                borderDashOffset         : 0.0,
                borderJoinStyle          : "miter",
                data                     : dataset(poins),
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
            labels,
        };
    }
}
