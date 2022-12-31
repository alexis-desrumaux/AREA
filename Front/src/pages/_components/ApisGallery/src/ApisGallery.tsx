import React from "react";

import "../styles/ApisGallery.css";

import Api, {Action} from "../components/Api/src/Api";

import areas from "../../../areas.json";

interface IProps
{
    displayingActions: boolean;
    onSelection?(api: string, id: number): void;
    onClickApi?(api: string): void;
}

interface IState
{

}

class ApisGallery extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {

        };
    }

    handle_onClickApi = (api: string): void =>
    {
        if (this.props.onClickApi !== undefined)
            this.props.onClickApi(api);
    }

    displayApis = (): JSX.Element =>
    {
        let jsxArray: Array<JSX.Element> = [];
        jsxArray =
        areas.apis.map((value, index: number) => {
            return (
                <Api
                key={index}
                backgroundColor={value.backgroundColor}
                txtColor={"white"}
                title={value.displayName}
                displayingActions={this.props.displayingActions}
                data={value}
                onSelection={this.props.onSelection}
                onClick={(api: string) => this.handle_onClickApi(api)}
                /> 
            ) 
        });
        let a: Array<Array<JSX.Element>> = [];
        let count: number = 0;
        let b: Array<JSX.Element> = [];
        for (let i = 0; i !== jsxArray.length;) {
            if (count < 3) {
                b.push(jsxArray[i]);
                count += 1;
                i += 1
            } else {
                a.push(b);
                count = 0;
                b = [];
            }
        }
        if (b.length !== 0) {
            a.push(b);
            b = [];
        }
        return (
            <>
                {
                    a.map((arr, i: number) => {
                        return (
                            <div className={"home_apisGallery_row"} key={i}>
                                {
                                    arr.map((value, j) => {
                                        return value
                                    })
                                }
                            </div>
                        )
                    })
                }
            </>
        )
    }

    render = (): JSX.Element =>
    {
        return (
            <div id={"home_apisGallery"}>
                {this.displayApis()}
            </div>
        )
    }
}

export default ApisGallery;