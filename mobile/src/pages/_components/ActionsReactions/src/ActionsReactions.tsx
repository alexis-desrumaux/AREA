import React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';

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
                        <View style={styles.home_areas_row} key={index}>
                            <View style={styles.home_areas_row_center}>
                                <TouchableOpacity
                                onPress={() => alert(nameAction)}
                                style={{width: "40%"}}
                                >
                                    <View style={[styles.home_areas_row_center_sideBlock, {backgroundColor: apiActionInfo.apiActionBackgroundColor}]}>
                                        <Text style={styles.home_areas_row_center_sideBlock_txt}>
                                            {apiActionInfo.apiActionTitle}
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                                <View style={styles.home_areas_row_center_rightArrow}>
                                    <Image source={require("../../../_media/right-arrow.png")} style={styles.home_areas_row_center_rightArrow_img}/>
                                </View>
                                <TouchableOpacity
                                onPress={() => alert(nameReaction)}
                                style={{width: "40%"}}
                                >
                                    <View style={[styles.home_areas_row_center_sideBlock, {backgroundColor: apiReactionInfo.apiReactionBackgroundColor}]}>
                                        <Text style={styles.home_areas_row_center_sideBlock_txt}>
                                            {apiReactionInfo.apiReactionTitle}    
                                        </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    )
                })
            }
            </>
        )
    }

    render = (): JSX.Element =>
    {
        return (
            <View style={styles.home_areas}>
                {this.displayArea()}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    home_areas: {
        display: "flex",
        flexDirection: "column",
        width: "100%",
        paddingBottom: 30,
    },
    home_areas_row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 70,
        marginTop: 30,
    },
    home_areas_row_center: {
        display: "flex",
        flexDirection: "row",
        width: 270,
        height: 70,
    },
    home_areas_row_center_sideBlock: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 70,
    },
    home_areas_row_center_sideBlock_txt: {
        color: "white",
        fontFamily: "sans-serif",
        fontSize: 13,
    },
    home_areas_row_center_rightArrow: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "20%",
        height: 70,
    },
    home_areas_row_center_rightArrow_img: {
        width: "70%",
        height: "50%",
    }
});

export default ActionsReactions;