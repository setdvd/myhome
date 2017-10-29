import gql from "graphql-tag";
import {graphql} from "react-apollo";
import {ISensorListProps, QUERY_SENSORS} from "../SensorList";
import {ISensorCreateFormProps} from "./CreateSensorComponent";

interface ISensor {
    id: string;
    name: string;
    description?: string;
}

export const mutation = gql`
    mutation createSensor($name:String! $description:String){
        createSensor(name:$name description:$description){
            id
            name
            description
        }
    }
`;

export default graphql<ISensor, ISensorCreateFormProps>(mutation, {
    props: (props) => {
        const {mutate, ...other} = props;
        return {
            onSubmit: (name: string, description: string) => {
                if (!mutate) {
                    throw new Error("No mutate function");
                }
                return mutate({
                    optimisticResponse: {
                        createSensor: {
                            __typename: "Sensor",
                            description,
                            id        : "new one",
                            name,
                        },
                    },
                    update            : (store, {data: {createSensor: data}}: any) => {
                        // read list
                        const dataFromQuery   = store.readQuery({query: QUERY_SENSORS}) as ISensorListProps;
                        dataFromQuery.sensors = dataFromQuery.sensors || [];
                        dataFromQuery.sensors.push(data as any);
                        store.writeQuery({query: QUERY_SENSORS, data: dataFromQuery});
                    },
                    variables         : {
                        description,
                        name,
                    },
                });
            },
            ...other,
        };
    },
});
