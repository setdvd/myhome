import gql from "graphql-tag";
import * as React from "react";
import {graphql} from "react-apollo";
import {ISensorListProps, QUERY_SENSORS} from "./index";

export interface IDeleteSensorButtonProps {
    id: string;
}
export interface IDeleteSensorWrapperProps {
    onDelete: (id: string) => any;
}

export const DELETE_QUERY = gql`
    mutation deleteSensor ( $id: String!){
        deleteSensor(id:$id){
            id
        }
    }
`;

export default graphql<IDeleteSensorButtonProps, {}, IDeleteSensorWrapperProps>(DELETE_QUERY, {
    props: ({mutate}) => {
        if (!mutate) {
            throw new Error("DeleteSensorContainer: no mutate function");
        }
        return {
            onDelete: async (id: string) => {
                await mutate({
                    optimisticResponse: {
                        deleteSensor: {
                            __typename: "Sensor",
                            id,
                        },
                    },
                    update            : (store) => {
                        // read list
                        const dataFromQuery   = store.readQuery({query: QUERY_SENSORS}) as ISensorListProps;
                        dataFromQuery.sensors = dataFromQuery.sensors || [];
                        const index           = dataFromQuery.sensors.findIndex((sensor) => sensor.id === id);
                        if (index !== -1) {
                            dataFromQuery.sensors.splice(index, 1);
                            store.writeQuery({query: QUERY_SENSORS, data: dataFromQuery});
                        }

                    },
                    variables         : {
                        id,
                    },
                });
            },
        };

    },
});
