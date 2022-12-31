import React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';

import Action from "../components/Action/src/Action";

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
    onClick?(): void;
}

interface IState
{
    mounted: boolean;
}

class Api extends React.Component<IProps, IState>
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

    handle_onClickBtn = (): void =>
    {
        if (this.props.onClick !== undefined)
            this.props.onClick();
    }

    render = (): JSX.Element =>
    {
        if (!this.state.mounted)
            return <></>
        return (
            <View>
                <TouchableOpacity
                onPress={() => this.handle_onClickBtn()}
                >
                    <View style={[styles.home_api, {backgroundColor: this.props.backgroundColor}]}>
                        <Text style={[styles.home_api_txt, {color: this.props.txtColor}]}>
                            {this.props.title}
                        </Text>
                    </View>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    home_api: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: 90,
        height: 90,
        borderRadius: 30,
    },
    home_api_txt: {
        fontFamily: "sans-serif",
        fontSize: 10,
        fontWeight: "bold",
    }
})

export {Action};
export default Api;