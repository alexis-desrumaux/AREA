import React from "react";

interface IProps
{
    goTo(url: Array<string>, props: any): void,
    to: Array<string>;
    props?: Object;
}

interface IState
{

}

class Redirect extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
    }

    componentDidMount()
    {
        this.props.goTo(this.props.to, this.props.props == undefined ? {} : this.props.props);
    }

    render = (): JSX.Element => <></>
}

export default Redirect;