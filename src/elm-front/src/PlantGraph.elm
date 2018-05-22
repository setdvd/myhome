module PlantGraph exposing (..)

import Date exposing (..)
import Sensor exposing (SensorReading)
import Svg exposing (..)
import Svg.Attributes exposing (..)
import Visualization.Scale as Scale exposing (ContinuousScale, ContinuousTimeScale)
import Visualization.Axis as Axis exposing (..)
import Visualization.List as L
import Visualization.Shape as Shape

-- Helpers

toPx: Int -> String
toPx px = (toString px) ++ "px"

xAxisTransform: Options -> String
xAxisTransform options = ("translate(" ++ toString (options.padding - 1) ++ ", " ++ toString (options.height - options.padding) ++ ")")

yAxisTransfrom: Options -> String
yAxisTransfrom options = "translate(" ++ toString (options.padding - 1) ++ ", " ++ toString options.padding ++ ")"

monthToString: Month -> String
monthToString m =
    case m of
        Jan -> "01"
        Feb -> "02"
        Mar -> "03"
        Apr -> "04"
        May -> "05"
        Jun -> "06"
        Jul -> "07"
        Aug -> "08"
        Sep -> "09"
        Oct -> "10"
        Nov -> "11"
        Dec -> "12"

formatDate: Date -> String
formatDate date =
    let
        day = toString (Date.day date)
        month = monthToString(Date.month date)
    in
        day ++ "-" ++ month

toDate: SensorReading -> Date
toDate = .createdAt >> Date.fromString >> Result.withDefault (Date.fromTime 0)

xScale : Options -> List DatePoint -> ContinuousTimeScale
-- todo review pefomance
xScale options model =
    model
        |> List.map (.x >> Date.toTime)
        |> L.extent
        |> Maybe.withDefault ( 0, 0 )
        |> Tuple.mapFirst Date.fromTime >> Tuple.mapSecond Date.fromTime
        |> flip Scale.time ( 0, toFloat (options.width - 2 * options.padding))


swap: (a,b) -> (b,a)
swap (a,b) = (b,a)

converge:(a -> b) -> (a -> c) -> a -> (b, c)
converge toB toC a = (toB(a), toC(a))

yScale: Options -> List DatePoint -> ContinuousScale
yScale options model =
    let
        {height, padding} = options
    in
    model
        |> List.map (.y >> toFloat)
        |> L.extent
        |> Maybe.withDefault (0, 0)
        |> swap
        |> flip Scale.linear (0, toFloat (height - 2*padding))

xAxis: Options -> List DatePoint -> Svg msg
xAxis options model =
        Axis.axis { defaultOptions | orientation = Axis.Bottom, tickCount = 10, tickFormat = Just(formatDate)} (xScale options model)

yAxis: Options -> List DatePoint -> Svg msg
yAxis options model =
       Axis.axis { defaultOptions | orientation = Axis.Left, tickCount = 10 } (yScale options model)

line: List DatePoint -> ContinuousTimeScale -> ContinuousScale -> Attribute msg
line model xScale yScale =
    let
       convert = Scale.convert
       x = .x >> convert xScale
       y = .y >> toFloat >> convert yScale
    in
       model
        |> List.map ((converge x y) >> Just)
        |> Shape.line Shape.monotoneInXCurve
        |> d

type alias DatePoint =
    { x:Date
    , y:Int
    }

type alias Options =
    { width: Int
    , height:  Int
    , padding: Int
    , xTick: Int
    , yTick: Int
    , formatDate: Date -> String
    , title: String
    }

options: Options
options =
    { width = 900
    , height = 450
    , padding = 30
    , xTick = 10
    , yTick = 10
    , formatDate = formatDate
    , title = ""
    }


view: Options -> List DatePoint -> Svg msg
view options model =
    let
        w = options.width
        h = options.height
        {title, padding} = options
        x = xScale options model
        y = yScale options model
        xAxisT = xAxisTransform options
        yAxisT = yAxisTransfrom options
        graphLine = line model x y
    in
        svg [width (toPx w), height (toPx h)]
            [g [transform xAxisT]
               [xAxis options model]
            ,g [transform yAxisT]
               [yAxis options model]
            ,g [ transform ("translate(" ++ toString padding ++ ", " ++ toString padding ++ ")"), class "series" ]
               [ Svg.path [ graphLine , stroke "red", strokeWidth "3px", fill "none" ] []
               ]
            , g [ transform ("translate(" ++ toString (w - padding) ++ ", " ++ toString (padding + 20) ++ ")") ]
                             [ text_ [ fontFamily "sans-serif", fontSize "20", textAnchor "end" ]
                                      [ text title ]
                             ]
            ]
