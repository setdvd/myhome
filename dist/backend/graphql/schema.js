"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = "\n\n    type Sensor {\n        id:Int!\n        name:String!\n        description:String!\n        sensorReadings:[SensorReading]!\n    }\n\n    type SensorReading {\n        id:Int!\n        value:Int!\n        sensor:Sensor!\n        createdAt:Int!\n    }\n\n    type Query{\n        sensors:[Sensor]!\n    }\n\n    schema {\n        query: Query\n    }\n\n";
//# sourceMappingURL=schema.js.map