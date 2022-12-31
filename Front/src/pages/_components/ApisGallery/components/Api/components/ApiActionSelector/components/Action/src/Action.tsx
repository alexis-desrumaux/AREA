import React from "react";

import "../styles/Action.css";

interface IProps
{
    title: string;
    onClick?(): void;
}

interface IState
{

}

class Action extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {

        }
    }

    handleOnClick = (): void =>
    {
        if (this.props.onClick !== undefined)
            this.props.onClick();
    }

    render = (): JSX.Element =>
    {
        return (
            <div className={"action"}>
                <button
                className={"action_btn__noneColorButton action_btn"}
                name={"action"}
                onClick={() => this.handleOnClick()}
                >
                    {this.props.title}
                </button>
            </div>
        )
    }
}

export default Action;