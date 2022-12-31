import React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';

interface IProps
{

}

interface IState
{

}

class NavBar extends React.Component<IProps, IState>
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
            <View style={styles.navBar}>
                <Text style={styles.navBar_txt}>
                    AREA
                </Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    navBar: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 70,
        backgroundColor: "black",
    },
    navBar_txt: {
        fontFamily: "sans-serif",
        fontSize: 20,
        color: "white",
    }
});

export default NavBar;