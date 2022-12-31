import React from "react";

import "../styles/NavBar.css";

interface IProps
{

}

interface IState
{

}

class NavBar extends React.Component<IProps, IState>
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
            <div id={"navBar"}>
                <div id={"navBar_center"}>
                    <div id={"navBar_center_txt"}>
                        AREA
                    </div>
                </div>
            </div>
        )
    }
}

export default NavBar;