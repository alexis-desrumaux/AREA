import React from "react";

import "../styles/ActionsReactions.css";

import areas from "../../../areas.json";

export interface IActionReaction
{
    action: {
        api: string,
        id: number,
    },
    reaction: {
        api: string,
        id: number,
    }
}

interface IProps
{
    actionsReactions: Array<IActionReaction>;
}

interface IState
{

}

class ActionsReactions extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {

        };
    }

    displayArea_getApiReactionInfos = (actionReaction: IActionReaction, ): {apiReactionTitle: string, apiReactionBackgroundColor: string} =>
    {
        let apiReactionBackgroundColor: string = "";
        let apiReactionTitle: string = "";
        for (let i = 0; i !== areas.apis.length; i += 1) {
            if (areas.apis[i].name == actionReaction.reaction.api) {
                apiReactionBackgroundColor = areas.apis[i].backgroundColor;
                apiReactionTitle = areas.apis[i].displayName;
                break;
            }
        }
        if (apiReactionBackgroundColor == "")
            apiReactionBackgroundColor = "#939393";
        return {apiReactionBackgroundColor, apiReactionTitle};
    }

    displayArea_getApiActionInfos = (actionReaction: IActionReaction, ): {apiActionTitle: string, apiActionBackgroundColor: string} =>
    {
        let apiActionBackgroundColor: string = "";
        let apiActionTitle: string = "";
        for (let i = 0; i !== areas.apis.length; i += 1) {
            if (areas.apis[i].name == actionReaction.action.api) {
                apiActionBackgroundColor = areas.apis[i].backgroundColor;
                apiActionTitle = areas.apis[i].displayName;
                break;
            }
        }
        if (apiActionBackgroundColor == "")
            apiActionBackgroundColor = "#939393";
        return {apiActionBackgroundColor, apiActionTitle};
    }

    displayArea = (): JSX.Element =>
    {
        return (
            <>
            {
                this.props.actionsReactions.map((actionReaction: IActionReaction, index: number) => {
                    let apiActionInfo: {apiActionTitle: string, apiActionBackgroundColor: string} = this.displayArea_getApiActionInfos(actionReaction);
                    let apiReactionInfo: {apiReactionTitle: string, apiReactionBackgroundColor: string} = this.displayArea_getApiReactionInfos(actionReaction);
                    let nameAction: string = "";
                    let nameReaction: string = "";
                    for (let i = 0; i !== areas.apis.length; i += 1) {
                        for (let j = 0; j != areas.apis[i].actions.length; j += 1) {
                            if (j == actionReaction.action.id && actionReaction.action.api == areas.apis[i].name) {
                                nameAction = areas.apis[i].actions[j];
                                break;
                            }
                        }
                    }
                    for (let i = 0; i !== areas.apis.length; i += 1) {
                        for (let j = 0; j != areas.apis[i].reactions.length; j += 1) {
                            if (j == actionReaction.reaction.id && actionReaction.reaction.api == areas.apis[i].name) {
                                nameReaction = areas.apis[i].reactions[j];
                                break;
                            }
                        }
                    }
                    if (nameAction == "")
                        nameAction = "Veuillez sélectionner une action";
                    if (nameReaction == "")
                        nameReaction = "Veuillez sélectionner une réaction";
                    return (
                        <div className={"home_areas_row"} key={index}>
                            <div className={"home_areas_row_center"}>
                                <button
                                className={"none_color_button home_areas_row_center_sideBlock"}
                                style={{backgroundColor: apiActionInfo.apiActionBackgroundColor}}
                                onClick={() => alert(nameAction)}
                                >
                                    {apiActionInfo.apiActionTitle}
                                </button>
                                <div className={"home_areas_row_center_rightArrow"}>
                                    <img src={"/pages/right-arrow.png"} className={"home_areas_row_center_rightArrow_img"}/>
                                </div>
                                <button
                                className={"none_color_button home_areas_row_center_sideBlock"}
                                style={{backgroundColor: apiReactionInfo.apiReactionBackgroundColor}}
                                onClick={() => alert(nameReaction)}
                                >
                                    {apiReactionInfo.apiReactionTitle}    
                                </button>
                            </div>
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
            <div id={"home_areas"}>
                {this.displayArea()}
            </div>
        )
    }
}

export default ActionsReactions;