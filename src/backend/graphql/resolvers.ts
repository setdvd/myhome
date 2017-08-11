import {IGraphqlContext} from "./index";

export default {
    Query        : {
        sensors: async (_, __, {db}: IGraphqlContext) => {
            const {rows} = await db.query(`select * from general.t_sensor`);
            return rows;
        },
    },
    Sensor       : {
        name          : (sensor) => {
            return sensor.name || sensor.id;
        },
        sensorReadings: async (sensor, __, {db}) => {
            const {rows: readings} = await db.query(`
                select *
                from general.t_sensor_reading
                where sensor = $1
            `, [sensor.id]);
            return readings;
        },
    }
};

