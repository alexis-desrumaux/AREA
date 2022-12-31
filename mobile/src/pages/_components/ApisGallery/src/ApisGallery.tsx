import React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';

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
    displayActions: boolean;
    displayActions_indexApi: number;
}

class ApisGallery extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            displayActions: false,
            displayActions_indexApi: 0,
        };
    }

    handle_onClickApi = (api: string, index: number): void =>
    {
        this.setState({displayActions: true, displayActions_indexApi: index});
        if (this.props.onClickApi !== undefined)
            this.props.onClickApi(api);
    }

    handle_onClickOnItem = (api: string, id: number) =>
    {
        this.setState({displayActions: false});
        if (this.props.onSelection !== undefined)
            this.props.onSelection(api, id);
    }

    displayItems_displayActions_displaySepLine = (currentIndex: number, size: number): JSX.Element =>
    {
        if (currentIndex < size - 1) {
            return (
                <View style={styles.home_actions_center_sepLineSection}>
                    <View style={styles.home_actions_center_sepLineSection_line}/>
                </View>
            )
        }
        return <></>
    }

    displayItems_displayActions = (apiName: string, actions: Array<string>): JSX.Element =>
    {
        return (
            <>
                {
                    actions.map((action: string, index: number) => {
                        return (
                            <View key={index}>
                                <Action title={action} onClick={() => this.handle_onClickOnItem(apiName, index)}/>
                                {this.displayItems_displayActions_displaySepLine(index, actions.length)}
                            </View>
                        )
                    })
                }

            </>
        )
    }

    displayItems = (): JSX.Element =>
    {
        if (this.props.displayingActions) {
            return (
                <>
                    {this.displayItems_displayActions(areas.apis[this.state.displayActions_indexApi].name, areas.apis[this.state.displayActions_indexApi].actions)}
                </>
            )
        } else {
            return (
                <>
                    {this.displayItems_displayActions(areas.apis[this.state.displayActions_indexApi].name, areas.apis[this.state.displayActions_indexApi].reactions)}
                </>
            )
        }
    }

    displayActions = (): JSX.Element =>
    {
        return (
            <View style={styles.home_actions}>
                <View style={styles.home_actions_center}>
                    <View style={styles.home_actions_center_itemsBox}>
                        {this.displayItems()}
                    </View>
                    <TouchableOpacity onPress={() => this.setState({displayActions: false})}>
                        <View style={styles.home_actions_center_backBtn}>
                            <Text style={styles.home_actions_center_backBtn_txt}>
                                Retour
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
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
                onClick={() => this.handle_onClickApi(value.name, index)}
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
                            <View style={styles.home_apisGallery_row} key={i}>
                                {
                                    arr.map((value, j) => {
                                        return value
                                    })
                                }
                            </View>
                        )
                    })
                }
            </>
        )
    }

    render_opt = (): JSX.Element =>
    {
        if (this.state.displayActions)
            return this.displayActions();
        return (
            <View style={styles.home_apisGallery}>
                {this.displayApis()}
            </View>
        )
    }

    render = (): JSX.Element =>
    {
        return this.render_opt();
    }
}

const styles = StyleSheet.create({
    home_apisGallery: {
        width: "100%",
        paddingBottom: 35,
    },
    home_apisGallery_row: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-around",
        width: "100%",
        marginTop: 45,
        height: 90,
    },
    home_actions: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        width: "100%",
        marginTop: 35,
    },
    home_actions_center: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 300,
    },
    home_actions_center_itemsBox: {
        width: "100%",
        borderStyle: "solid",
        borderColor: "black",
        borderWidth: 1,
        borderRadius: 5,
    },
    home_actions_center_backBtn: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "blue",
        marginTop: 30,
        paddingVertical: 12,
        paddingHorizontal: 25,
    },
    home_actions_center_backBtn_txt: {
        fontFamily: "sans-serif",
        fontSize: 15,
        color: "white",
    },
    home_actions_center_sepLineSection: {
        width: "100%",
        height: 1,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: 1,
    },
    home_actions_center_sepLineSection_line: {
        width: "40%",
        height: 1,
        backgroundColor: "black",
    }
});

export default ApisGallery;