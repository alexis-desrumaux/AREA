import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import WebView from "react-native-webview";

interface IProps
{
    url: string;
    successUrlMustInclude: string;
    onSuccess(url: string): void;
}

interface IState
{
    display: boolean;
}

 class WebViewLogin extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            display: true,
        }
    }

    onNavigationStateChange = (webViewState: any): void =>
    {

        let url: string = webViewState.url;
        let urlToken: string = "";
        if (url.includes(this.props.successUrlMustInclude, 0)) {
            this.setState({display: false});
            this.props.onSuccess(url);
            /*urlToken = url.replace("http://localhost:8082/?code=", "");
            console.log(urlToken);
            this.setState({displayWebView: false});*/
        }
    }

    render = (): JSX.Element =>
    {
        if (!this.state.display)
            return <></>
        return (
            <View style={styles.root}>
                <WebView
                source={{uri: this.props.url}}
                onNavigationStateChange={this.onNavigationStateChange}
                javaScriptEnabled = {true}
                domStorageEnabled = {true}
                userAgent={"Mozilla/5.0 (Linux; Android 4.1.1; Galaxy Nexus Build/JRO03C) AppleWebKit/535.19 (KHTML, like Gecko) Chrome/18.0.1025.166 Mobile Safari/535.19"}
                />
            </View>
        )
    }
}


const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

export default WebViewLogin;