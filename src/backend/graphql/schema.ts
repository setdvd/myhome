export default `

    type Sensor {
        id:Int!
        name:String!
        description:String!
        sensorReadings:[SensorReading]!
    }

    type SensorReading {
        id:Int!
        value:Int!
        sensor:Sensor!
        createdAt:String!
    }

    type Query{
        sensors:[Sensor]!
    }

    schema {
        query: Query
    }

`
