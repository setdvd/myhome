module Main exposing (..)

import Date exposing (..)
import Html exposing (Html, text, div, h1, img)
import Html.Events exposing (onClick)
import Http
import Sensor exposing (sensorList, SensorList, SensorReading, Sensor)
import PlantGraph exposing (view, DatePoint, options)
import Svg exposing (Svg)
import Time exposing (Time)

---- MODEL ----


type alias Model =
    { sensors: Maybe SensorList
    }


init : ( Model, Cmd Msg )
init =
    ( {sensors = Nothing}, Cmd.none )


startOfTheTime: Date
startOfTheTime = Date.fromTime 0

toDatePoint: SensorReading -> DatePoint
toDatePoint reading =
    { x = Date.fromString reading.createdAt |> Result.withDefault startOfTheTime
    , y = reading.value
    }


toDataPoints: SensorList -> List (String, List DatePoint)
toDataPoints =
   .sensors >> List.map (PlantGraph.converge .name (.sensorReadings >> List.map toDatePoint))

noNameGraph: List DatePoint -> Svg msg
noNameGraph = PlantGraph.view options

dataGraph: List (String, List DatePoint) -> List (Svg Msg)
dataGraph =
    let
        view = PlantGraph.view
        mapper = \(title, list) -> view {options | title = title} list
    in
        List.map mapper

toGraphs: SensorList -> List (Svg Msg)
toGraphs = toDataPoints >> dataGraph

element: Int -> List a -> Maybe a
element index list =
        list
            |> List.take (index + 1)
            |> List.reverse
            |> List.head

nth: Int -> SensorList -> List DatePoint
nth index sensors =
    let
        n = .sensors >> element index >> Maybe.map .sensorReadings >> Maybe.withDefault [] >> List.map toDatePoint >> Debug.log "first"
    in
        n sensors


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
viewGraphs: Model -> Html Msg
viewGraphs model =
    case model.sensors of
        Just sensors ->  div [] [(Debug.log "to" ( sensors |> nth 3 |> Debug.log "log" |> noNameGraph))]
        Nothing -> div [] [text "нет данных"]


view : Model -> Html Msg
view model =
    div []
        [ h1 [] [ text "Sensors" ]
        , div [onClick Click] [text "Нажми меня"]
        , viewGraphs model
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
