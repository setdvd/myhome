module PlantGraph exposing (..)

import Date exposing (..)
import Sensor exposing (SensorReading)
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Visualization.Scale as Scale exposing (ContinuousScale, ContinuousTimeScale)
import Visualization.Axis as Axis exposing (..)
import Visualization.List as L
import Visualization.Shape as Shape

w: Float
w = 900

h: Float
h = 450

padding: Float
padding = 30


-- Helpers

toPx: Float -> String
toPx px = (toString px) ++ "px"

xAxisTransform: String
xAxisTransform = ("translate(" ++ toString (padding - 1) ++ ", " ++ toString (h - padding) ++ ")")

yAxisTransfrom: String
yAxisTransfrom = "translate(" ++ toString (padding - 1) ++ ", " ++ toString padding ++ ")"

xScale : List SensorReading -> ContinuousTimeScale
--xScale model = List.map (.createdAt >> String.toFloat) model
xScale model =
    model
        |> List.map (.createdAt >> Date.fromString)
        |> List.map (Result.withDefault (Date.fromTime 0))
        |> List.map Date.toTime
        |> L.extent
        |> Maybe.withDefault ( 0, 0 )
        |> Tuple.mapFirst Date.fromTime >> Tuple.mapSecond Date.fromTime
        |> flip Scale.time ( 0, w - 2 * padding )


toDate: SensorReading -> Date
toDate = .createdAt >> Date.fromString >> Result.withDefault (Date.fromTime 0)

yScale: ContinuousScale
yScale = Scale.linear (1024, 0) (0, h - 2 * padding)

xAxis: List SensorReading -> Svg msg
xAxis model = Axis.axis { defaultOptions | orientation = Axis.Bottom, tickCount = 10, tickFormat = Just(Date.minute >> toString)} (xScale model)

yAxis: List SensorReading -> Svg msg
yAxis model = Axis.axis { defaultOptions | orientation = Axis.Left, tickCount = 10 } yScale

line: List SensorReading -> ContinuousTimeScale -> Attribute msg
line model xScale =
    List.map (\r -> Just((Scale.convert xScale (toDate r), Scale.convert yScale (toFloat r.value)))) model
        |> Shape.line Shape.monotoneInXCurve
        |> d

view: List SensorReading -> Svg msg
view model =
    let
        xS = xScale model
    in
    svg [width (toPx w), height (toPx h)]
        [ g [ transform xAxisTransform ] [ xAxis model]
        , g [transform yAxisTransfrom] [yAxis model]
        , g [ transform ("translate(" ++ toString padding ++ ", " ++ toString padding ++ ")"), class "series" ]
                    [ Svg.path [ line model xS, stroke "red", strokeWidth "3px", fill "none" ] []
                    ]
        ]


--
--view model =
--    svg [ width (toString w ++ "px"), height (toString h ++ "px") ]
--        [ g [ transform ("translate(" ++ toString (padding - 1) ++ ", " ++ toString (h - padding) ++ ")") ]
--            [ xAxis model ]
--        , g [ transform ("translate(" ++ toString (padding - 1) ++ ", " ++ toString padding ++ ")") ]
--            [ yAxis ]
--        , g [ transform ("translate(" ++ toString padding ++ ", " ++ toString padding ++ ")"), class "series" ]
--            [ Svg.path [ area model, stroke "none", strokeWidth "3px", fill "rgba(255, 0, 0, 0.54)" ] []
--            , Svg.path [ line model, stroke "red", strokeWidth "3px", fill "none" ] []
--            ]
--        ]
