import CircularProgress from "material-ui/CircularProgress";
import * as React from "react";

interface ILoadable {
    loading?: boolean;
}

export default function Loader<X extends ILoadable>(Component: React.ComponentClass<X>) {
    return class InternalLoader extends Component {
        public render() {
            const {loading} = this.props;
            if (loading) {
                return (
                    <CircularProgress/>
                );
            }
            return super.render();
        }
    };
}
