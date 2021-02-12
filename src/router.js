import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import Login from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import { isSignedIn } from "./services/security";

function PrivateRoute({children}) {
    if(isSignedIn()) {
        return <Route>{children}</Route>;
    } else {
        return <Redirect to="/"/>;
    }
};

function Router () {
    return (
        <BrowserRouter>
            <Switch>
                <Route exact path="/">
                    <Login/>
                </Route>

                <Route path="/register">
                    <Register/>
                </Route>

                <PrivateRoute path="/home">
                    <Home/>
                </PrivateRoute>
            </Switch>
        </BrowserRouter>
    );
};

export default Router;