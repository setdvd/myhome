import {IGraphqlContext} from "./index";

interface ISensor {
    name?: string;
    id: string;
}

export default {

    Mutation: {
        createSensor: async (_: any, props: any, {db}: any, info: any) => {
            const {rows: [sensor]} = await db.query(`
                insert into general.t_sensor (name, description)
                values ($1, $2)
                returning *;
            `, [props.name, props.description]);
            return sensor;
        },

        deleteSensor: async (_: any, {id}: { id: string }, {db}: IGraphqlContext) => {
            const {rows: [sensor]} = await db.query(`
                delete from general.t_sensor
                where id = $1
                returning *;
            `, [id]);
            console.log(sensor);
            return sensor;
        },

        submitSensorReading: async (_: any, {sensorId, value}: { sensorId: string, value: number }, {db}: IGraphqlContext) => {
            const {rows: [sensorReading]} = await db.query(`
                insert into general.t_sensor_reading (value, sensor)
                values ($1, $2)
                returning *;
            `, [value, sensorId]);

            const {rows: [sensor]} = await db.query(`
                select * from general.t_sensor
                where id = $1;
            `, [sensorId]);
            sensorReading.sensor   = sensor;
            return sensorReading;
        },

    },
    Query   : {
        sensors: async (_: any, __: any, {db}: IGraphqlContext) => {
            const {rows} = await db.query(`select * from general.t_sensor`);
            return rows;
        },
    },
    Sensor  : {
        id            : (sensor: ISensor) => {
            console.log("sensor", sensor);
            return sensor.id;
        },
        name          : (sensor: ISensor) => sensor.name || sensor.id,
        sensorCount   : async (sensor: ISensor, __: any, {db}: IGraphqlContext) => {
            const {rows: [{count}]} = await db.query(`
               select count(id)
               from general.t_sensor_reading
               where general.t_sensor_reading.sensor = $1`, [sensor.id]);
            console.log("count", count);
            return count;
        },
        sensorReadings: async (sensor: ISensor, {limit}: any, {db}: IGraphqlContext) => {
            const {rows: readings} = await db.query(`
                select *
                from general.t_sensor_reading
                where sensor = $1
                order by created_at DESC
                limit $2
            `, [sensor.id, limit || 500]);
            readings.forEach((reading) => reading.sensor = sensor);
            return readings;
        },
    },
};
