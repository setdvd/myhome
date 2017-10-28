import * as React from "react";
import {render} from "react-dom";
import ContextProvider from "./ContextProvider";
import SensorCreateForm from "./CreateSensor";
import SensorList from "./SensorList";

const id = "app";

const App = ({children}: any) => <div>{children}</div>;

render(
    <ContextProvider>
        <App>
            <SensorCreateForm/>
            <SensorList/>
        </App>
    </ContextProvider>
    , document.getElementById(id));
