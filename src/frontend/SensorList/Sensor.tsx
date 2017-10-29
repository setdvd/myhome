import gql from "graphql-tag";
import IconButton from "material-ui/IconButton";
import {ListItem} from "material-ui/List";
import IconDelete from "material-ui/svg-icons/action/delete";
import * as React from "react";

export interface ISensor {
    id: string;
    name: string;
    description: string;
}

export interface ISensorProps extends ISensor {
    onDelete: (id: string) => any;
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
        const {name, id, description, onDelete} = this.props;
        return (
            <ListItem
                key={id}
                primaryText={name}
                secondaryText={`${id}: ${description}`}
                secondaryTextLines={1}
                rightIconButton={(
                    <IconButton onClick={() => onDelete(id)}>
                        <IconDelete/>
                    </IconButton>
                )}
            />
        );
    }
}
