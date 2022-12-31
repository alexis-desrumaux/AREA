import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

import HomeRouter from "./src/pages/Home";
import { TouchableOpacity } from 'react-native-gesture-handler';

const RCTNetworking = require('react-native/Libraries/Network/RCTNetworking')
RCTNetworking.clearCookies(() => { })


interface IProps
{

}

interface IState
{
    ip: string;
    submit: boolean;
    error: boolean;
}

export default class App extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            ip: "",
            submit: false,
            error: false,
        };
    }

    checkInput = (): void =>
    {
        if (this.state.ip == "")
            this.setState({error: true});
        else
            this.setState({submit: true});
    }

    displayInput = (): JSX.Element =>
    {
        return (
            <View style={styles.root}>
                <View>
                    <TextInput
                    style={[styles.root_input, this.state.error ? {borderColor: "red"} : {borderColor: "black"}]}
                    onChangeText={(text: string) => this.setState({ip: text})}
                    placeholder={"Veuillez entrer l'adresse ip du serveur"}/>
                    <TouchableOpacity onPress={() => this.checkInput()}>
                        <View style={styles.root_submit}>
                            <Text style={styles.root_submit_txt}>
                                Valider
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render_opt = (): JSX.Element =>
    {
        if (!this.state.submit)
            return this.displayInput();
        return (
            <HomeRouter goToUrl={["home"]} props={{serverIp: this.state.ip}}/>
        )
    }

    render = (): JSX.Element =>
    {
        return (
            <SafeAreaView style={{flex: 1}}>
                {this.render_opt()}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    root: {
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
    },
    root_input: {
        width: 180,
        height: 40,
        borderStyle: "solid",
        borderWidth: 1,
        fontSize: 10,
        fontFamily: "sans-serif",
        paddingLeft: 3,
    },
    root_submit: {
        display: 'flex',
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: 180,
        height: 40,
        marginTop: 30,
        borderRadius: 2,
        backgroundColor: "blue",
    },
    root_submit_txt: {
        fontFamily: "sans-serif",
        fontSize: 12,
        color: "white",
    }
})