import gql from "graphql-tag";
import {ListItem} from "material-ui/List";
import * as React from "react";

export interface ISensorProps {
    id: string;
    name: string;
    description: string;
}

export default class Sensor extends React.PureComponent<ISensorProps> {
    public static query = gql`
        fragment Sensor on Sensor{
            id
            name
            description
        }
    `;

    public render() {
        const {name, id, description} = this.props;
        return (
            <ListItem
                key={id}
                primaryText={name}
                secondaryText={description}
                secondaryTextLines={1}
            />
        );
    }
}
