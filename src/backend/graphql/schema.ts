export default `

    type Sensor {
        id:Int!
        name:String!
        description:String
        sensorReadings:[SensorReading]!
    }

    type SensorReading {
        id:Int!
        value:Int!
        sensor:Sensor!
        createdAt:String!
    }

    type Mutation{
        createSensor(name:String! description:String):Sensor!
        deleteSensor(id:String!):Sensor!
        submitSensorReading(sensorId:String! value:Int):SensorReading!
    }

    type Query{
        sensors:[Sensor]!
    }

    schema {
        query: Query
        mutation:Mutation
    }

`;
