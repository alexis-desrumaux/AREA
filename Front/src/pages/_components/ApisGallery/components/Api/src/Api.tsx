import React from "react";

import "../styles/Api.css";

import ApiActionSelector, {Action} from "../components/ApiActionSelector/src/ApiActionSelector";

interface IData
{
    name: string;
    displayName: string;
    backgroundColor: string;
    actions: Array<string>;
    reactions: Array<string>;
}

interface IProps
{
    backgroundColor: string;
    txtColor: string;
    title: string;
    onClick?(api: string): void;
    onSelection?(api: string, id: number): void;
    displayingActions: boolean;
    data: IData;
}

interface IState
{
    displayOverlay: boolean;
    mounted: boolean;
}

class Api extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            displayOverlay: false,
            mounted: false,
        }
    }

    componentDidMount()
    {
        this.setState({mounted: true});
    }

    handle_onClickBtn = (): void =>
    {
        this.setState({displayOverlay: true});
        if (this.props.onClick !== undefined)
            this.props.onClick(this.props.data.name);
    }

    handle_onClickOnItem = (api: string, id: number) =>
    {
        this.setState({displayOverlay: false});
        if (this.props.onSelection !== undefined)
            this.props.onSelection(api, id);
    }

    displayItems = (): JSX.Element =>
    {
        if (this.props.displayingActions) {
            return (
                <>
                {
                    this.props.data.actions.map((value, indexAction) => {
                        return (
                            <Action key={indexAction} title={value} onClick={() => this.handle_onClickOnItem(this.props.data.name, indexAction)}/>
                        )
                    })
                }
                </>
            )
        } else {
            return (
                <>
                {
                    this.props.data.reactions.map((value, indexReaction) => {
                        return (
                            <Action key={indexReaction} title={value} onClick={() => this.handle_onClickOnItem(this.props.data.name, indexReaction)}/>
                        )
                    })
                }
                </>
            )
        }
    }

    displayOverlay = (): JSX.Element =>
    {
        let body = document.getElementById("body");
        if (!this.state.displayOverlay) {
            if (body)
                body.style.overflow = "auto";
            return <></>
        }
        if (body)
            body.style.overflow = "hidden";
        return (
            <div>
                <ApiActionSelector
                closePopupCallback={() => this.setState({displayOverlay: false})}
                borderColor={this.props.backgroundColor}
                >
                    {this.displayItems()}
                </ApiActionSelector>
            </div>
        )
    }

    render = (): JSX.Element =>
    {
        if (!this.state.mounted)
            return <></>
        return (
            <div>
                {this.displayOverlay()}
                <button
                className={"home_api"}
                style={{backgroundColor: this.props.backgroundColor}}
                onClick={() => this.handle_onClickBtn()}
                >
                    <div className={"home_api_txt"} style={{color: this.props.txtColor}}>
                        {this.props.title}
                    </div>
                </button>
            </div>
        )
    }
}

export {Action};
export default Api;