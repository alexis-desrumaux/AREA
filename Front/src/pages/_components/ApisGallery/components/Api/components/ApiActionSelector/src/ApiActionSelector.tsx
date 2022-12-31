import React from "react";

import "../styles/ApiActionSelector.css";

import Action from "../components/Action/src/Action";

interface IProps
{
    borderColor: string;
    closePopupCallback(): void;
}

interface IState
{
    mounted: boolean;
}

class ApiActionSelector extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            mounted: false,
        }
    }

    componentDidMount()
    {
        this.setState({mounted: true});
    }

    handle_onClick = (e: any): void =>
    {
        if (e.target.name == "action") {
            e.preventDefault();
            e.stopPropagation();
        } else {
            this.props.closePopupCallback();
        }
    }

    displayChildren = (): JSX.Element =>
    {
        let nbChildren: number = React.Children.count(this.props.children);
        let count: number = 0;
        return (
            <>
            {
                React.Children.map(this.props.children, (child) => {
                    if (count != nbChildren - 1) {
                        count += 1;
                        return (
                            <div style={{overflow: "auto"}}>
                                {child}
                                <div className={"apiActionSelector_box_sepLineSection"}>
                                    <div className={"apiActionSelector_box_sepLineSection_line"}/>
                                </div>
                            </div>
                        )
                    }
                    else {
                        count += 1;
                        return (
                            <div>
                                {child}
                            </div>
                        )
                    }
                })
            }
            </>
        )
    }

    render = (): JSX.Element =>
    {
        if (!this.state.mounted)
            return <></>
        return (
            <button
            className={"apiActionSelector__noneColorButton apiActionSelector"}
            onClick={(e) => this.handle_onClick(e)}
            >
                <div style={{borderColor: this.props.borderColor}} className={"apiActionSelector_box"}>
                    {this.displayChildren()}
                </div>
            </button>
        )
    }
}

export {Action};
export default ApiActionSelector;