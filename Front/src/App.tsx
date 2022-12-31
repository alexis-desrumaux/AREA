import React from "react"
import {
    BrowserRouter as ReactRouter,
    Switch,
    Route,
    Link
  } from "react-router-dom";

import HomeRouter from "./pages/Home";

interface IProps
{

}

interface IState
{

}

class App extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {

        }
    }

    render = (): JSX.Element =>
    {
        return (
            <div>
                <ReactRouter>
                    <Switch>
                        <Route path={"/"} render={(props) => <HomeRouter {...props}/>}/>
                    </Switch>
                </ReactRouter>
            </div>
        )
    }
}

export default App;