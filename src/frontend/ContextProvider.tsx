import ApolloClient from "apollo-client";
import MuiThemeProvider from "material-ui/styles/MuiThemeProvider";
import * as React from "react";
import {ApolloProvider, createNetworkInterface} from "react-apollo";
import MyRawTheme from "./Theme";

const networkInterface = createNetworkInterface({
    opts: {
        credentials: "same-origin",
    },
    uri : "/graphql",
});

const client = new ApolloClient({
    networkInterface,
});

export default ({children}: { children: any }) => (
    <MuiThemeProvider muiTheme={MyRawTheme}>
        <ApolloProvider client={client}>
            {children}
        </ApolloProvider>
    </MuiThemeProvider>
);
