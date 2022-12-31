import React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView } from 'react-native';

interface IProps
{
    title: string;
    onClick?(): void;
}

interface IState
{

}

class Action extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {

        }
    }

    handleOnClick = (): void =>
    {
        if (this.props.onClick !== undefined)
            this.props.onClick();
    }

    render = (): JSX.Element =>
    {
        return (
            <View style={styles.action}>
                <TouchableOpacity
                onPress={() => this.handleOnClick()}
                >
                    <Text style={styles.action_btn}>
                        {this.props.title}
                    </Text>
                </TouchableOpacity>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    action: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        paddingVertical: 15,
        borderRadius: 10,
    },
    action_btn: {
        textAlign: "center",
        fontFamily: "sans-serif",
        color: "black",
        fontSize: 16,
    },
});

export default Action;