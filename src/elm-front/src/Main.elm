module Main exposing (..)

import Html exposing (Html, text, div, h1, img)
import Html.Attributes exposing (src)
import Html.Events exposing (onClick)
import Http
import Sensor exposing (sensorList, SensorList, SensorReading, Sensor)
import PlantGraph exposing (view)

---- MODEL ----


type alias Model =
    { sensors: Maybe SensorList
    }


init : ( Model, Cmd Msg )
init =
    ( {sensors = Nothing}, Cmd.none )


first: Maybe SensorList -> List SensorReading
first = Maybe.map (.sensors ) >> Maybe.andThen List.head >> Maybe.map .sensorReadings >> Maybe.withDefault [] >> Debug.log "first"

---- UPDATE ----


type Msg
    = NoOp
    | Click
    | QueryResult (Result Http.Error SensorList)


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        NoOp -> ( model, Cmd.none )
        Click -> (model, Http.send QueryResult sensorList)
        QueryResult (Ok sensorList) ->
            let list = (Debug.log "[main][info]: get sensor list " sensorList)
            in ({model | sensors = Just(sensorList)}, Cmd.none)
        QueryResult (Err err) ->
                    let list = (Debug.log "[main][error]: get error fetching sensor list " err)
                    in (model, Cmd.none)



---- VIEW ----


view : Model -> Html Msg
view model =
    div []
        [ img [ src "/logo.svg" ] []
        , h1 [] [ text "Your Elm App is working!" ]
        , div [onClick Click] [text "Click"]
        , PlantGraph.view (first model.sensors)
        ]



---- PROGRAM ----


main : Program Never Model Msg
main =
    Html.program
        { view = view
        , init = init
        , update = update
        , subscriptions = always Sub.none
        }
