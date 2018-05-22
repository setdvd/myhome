{-
   This file was automatically generated by elm-graphql.
-}


module Sensor exposing (SensorList, sensorList, Sensor, SensorReading)

import GraphQL exposing (apply, maybeEncode, mutation, query)
import Http
import Json.Decode exposing (..)
import Json.Encode exposing (encode)


endpointUrl : String
endpointUrl =
    "http://localhost:3000/graphql"


type alias SensorReading =
    { id : Int
    , value : Int
    , createdAt : String
    }


sensorReadingDecoder : Decoder SensorReading
sensorReadingDecoder =
    map3
        SensorReading
        (field "id" int)
        (field "value" int)
        (field "createdAt" string)


type alias Sensor =
    { id : Int
    , name : String
    , description : Maybe String
    , sensorReadings : List SensorReading
    }


sensorDecoder : Decoder Sensor
sensorDecoder =
    map4
        Sensor
        (field "id" int)
        (field "name" string)
        (field "description" (maybe string))
        (field "sensorReadings" (list sensorReadingDecoder))


type alias SensorList =
    { sensors : List Sensor
    }


sensorListDecoder : Decoder SensorList
sensorListDecoder =
    map
        SensorList
        (at [ "data", "sensors" ] (list sensorDecoder))


sensorList : Http.Request SensorList
sensorList =
    let
        graphQLQuery =
            """query sensorList { sensors { id name description sensorReadings { id value createdAt } } }"""
    in
    let
        graphQLParams =
            Json.Encode.object
                []
    in
    query "POST" endpointUrl graphQLQuery "sensorList" graphQLParams sensorListDecoder