import React from "react";

import "../styles/InputLabel.css";

interface IProps
{
    title: string;
    placeholder: string;
    onChange(e: React.ChangeEvent<HTMLInputElement>): void;
    isPassword?: boolean;
    value?: string;
}

interface IState
{

}

class InputLabel extends React.Component<IProps, IState>
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
            <div className={"block"}>
                <div className={"block_label"}>
                    {this.props.title}
                </div>
                <input value={this.props.value} onChange={this.props.onChange} type={this.props.isPassword == undefined ? undefined : "password"} className={"block_input"} placeholder={this.props.placeholder}/>
            </div>
        )
    }
}

export default InputLabel;