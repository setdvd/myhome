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
    }

    type Query{
        sensors:[Sensor]!
    }

    schema {
        query: Query
        mutation:Mutation
    }

`;
