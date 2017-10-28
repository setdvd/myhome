import {IGraphqlContext} from "./index";

interface ISensor {
    name?: string;
    id: string;
}

export default {

    Mutation: {
        createSensor: async (_: any, {name, description}: { name: string, description: string }, {db}: IGraphqlContext) => {
            const {rows: [sensor]} = await db.query(`
                insert into general.t_sensor (name, description)
                values ($1, $2)
                returning *;
            `, [name, description]);
            return sensor;
        },
    },
    Query   : {
        sensors: async (_: any, __: any, {db}: IGraphqlContext) => {
            const {rows} = await db.query(`select * from general.t_sensor`);
            return rows;
        },
    },
    Sensor  : {
        name          : (sensor: ISensor) => sensor.name || sensor.id,
        sensorReadings: async (sensor: ISensor, __: any, {db}: IGraphqlContext) => {
            const {rows: readings} = await db.query(`
                select *
                from general.t_sensor_reading
                where sensor = $1
            `, [sensor.id]);
            return readings;
        },
    },
};
