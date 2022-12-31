import React from "react";

import "../styles/Footer.css";

interface IProps
{

}

interface IState
{

}

class Footer extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {

        };
    }

    render = (): JSX.Element =>
    {
        return (
            <div className={"footer"}>

            </div>
        )
    }
}

export default Footer;