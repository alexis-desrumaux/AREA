import React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, ScrollView, StatusBar, Platform } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import axios, {AxiosResponse} from "axios";

import ActionsReactions, {IActionReaction} from "./_components/ActionsReactions/src/ActionsReactions";
import ApisGallery from "./_components/ApisGallery/src/ApisGallery";
import NavBar from "./_components/NavBar/src/NavBar";
import WebViewLogin from "./_components/WebViewLogin/src/WebViewLogin";
import areas from "./areas.json";

import Router, {MainRouterProps, RouterProps, Redirect} from "../components/Router/Router";

import SignInRouter from "./signin/SignIn";
import SignUpRouter from "./signup/SignUp";

const URL: Array<string> = ["home"];

const res = {
    username: "Forcreust",
    actionsReactions: [
        {
            action: {
                api: "gmail",
                id: 0,
            },
            reaction: {
                api: "facebook",
                id: 0,
            }
        }
    ]
}

interface IResCombinations
{
    id: string;
    action: {
        api: number,
        id: number,
    };
    reaction: {
        api: number,
        id: number,
    }
}

enum API_TYPE
{
    NONE,
    GMAIL,
    FACEBOOK,
    GDRIVE,
    YAMMER,
    TWITCH,
    DISCORD,
}

interface IProps extends RouterProps
{
    serverIp: string,
}

interface IState
{
    mounted: boolean;
    logged: boolean;
    username: string;
    actionsReactions: Array<IActionReaction>;
    isSelectionAction: boolean;
    auth: API_TYPE;
    authGmail: boolean;
    authGdrive: boolean;
    authFacebook: boolean;
    authYammer: boolean;
    authTwitch: boolean;
    authDiscord: boolean;
}

class Home extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            mounted: false,
            logged: false,
            username: "",
            isSelectionAction: true,
            actionsReactions: [],
            auth: API_TYPE.NONE,
            authGmail: false,
            authGdrive: false,
            authFacebook: false,
            authYammer: false,
            authTwitch: false,
            authDiscord: false,
        }
    }

    pushEmptyCombinationArray = (): void =>
    {
        let actionsReactions = [...this.state.actionsReactions];
        actionsReactions.push({
            action: {
                api: "",
                id: 0,
            },
            reaction: {
                api: "",
                id: 0,
            }
        });
        this.setState({actionsReactions: actionsReactions});
    }

    getData = async(): Promise<void> =>
    {
        let token = await AsyncStorage.getItem("token");
        if (token == null) {
            this.pushEmptyCombinationArray();
            return;
        }
        try {
            let res = await axios.get(`http://${this.props.serverIp}:8080/get_combination`, {
                headers: {
                  'Authorization': token
                }
            });
            let stateCombinations = [...this.state.actionsReactions];
            let combinations: Array<IResCombinations> = res.data;
            combinations.map((combination, index: number) => {
                stateCombinations.push({
                    action: {
                        api: areas.apis[combination.action.api].name,
                        id: combination.action.id,
                    },
                    reaction: {
                        api: areas.apis[combination.reaction.api].name,
                        id: combination.reaction.id,
                    }
                });
            });
            stateCombinations.push({
                action: {
                    api: "",
                    id: 0,
                },
                reaction: {
                    api: "",
                    id: 0,
                }
            });
            this.setState({actionsReactions: stateCombinations});
            return;
        } catch (error) {
            this.pushEmptyCombinationArray();
            return;
        }
    }

    fetch_isUserLogged = async(): Promise<boolean> =>
    {
        let token = await AsyncStorage.getItem("token");
        if (token == null) {
            return false;
        }
        try {
            let res = await axios.get(`http://${this.props.serverIp}:8080/signin`, {
                headers: {
                  'Authorization': token
                }
            });
            if ("success" in res.data && res.data.success == true) {
                return true;
            }
        } catch (error) {
            return false;
        }
        return false;
    }

    componentDidMount_async = async() =>
    {
        let success = await this.fetch_isUserLogged();
        if (success == false) {
            this.setState({mounted: true});
            return;
        }
        await this.getData();
        this.setState({logged: true, mounted: true});
    }

    componentDidMount()
    {
        this.componentDidMount_async();
    }

    sendCombinaison_sendAxios = async(indexActionApi: number, indexReactionApi: number, actionReaction: IActionReaction): Promise<void> =>
    {
        let token = await AsyncStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        let res = await axios.post(`http://${this.props.serverIp}:8080/create_combination`, {
            action: {
                api: indexActionApi,
                id: actionReaction.action.id,
            },
            reaction: {
                api: indexReactionApi,
                id: actionReaction.reaction.id,
            }
        }, {
            headers: header,
        });
    }

    sendCombinaison = (actionReaction: IActionReaction): void =>
    {
        let indexActionApi: number = -1;
        let indexReactionApi: number = -1;

        for (let i = 0; i != areas.apis.length; i += 1) {
            if (areas.apis[i].name == actionReaction.action.api) {
                indexActionApi = i;
                break;
            }
        }
        for (let i = 0; i != areas.apis.length; i += 1) {
            if (areas.apis[i].name == actionReaction.reaction.api) {
                indexReactionApi = i;
                break;
            }
        }
        if (indexActionApi == -1 || indexReactionApi == -1)
            return;
        this.sendCombinaison_sendAxios(indexActionApi, indexReactionApi, actionReaction);
    }

    pushInArrayActionReaction = (api: string, id: number): void =>
    {
        let actionsReactions: Array<IActionReaction> = [...this.state.actionsReactions];
        let isSelectionAction: boolean = this.state.isSelectionAction;

        if (isSelectionAction == true) {
            actionsReactions[actionsReactions.length - 1].action.api = api;
            actionsReactions[actionsReactions.length - 1].action.id = id;
            isSelectionAction = false;
        } else if (isSelectionAction == false) {
            actionsReactions[actionsReactions.length - 1].reaction.api = api;
            actionsReactions[actionsReactions.length - 1].reaction.id = id;
            this.sendCombinaison(actionsReactions[actionsReactions.length - 1]);
            actionsReactions.push({
                action: {
                    api: "",
                    id: 0,
                },
                reaction: {
                    api: "",
                    id: 0,
                }
            })

            isSelectionAction = true;
        }
        this.setState({actionsReactions: actionsReactions, isSelectionAction: isSelectionAction});
    }

    handle_onClickApi = (api: string) =>
    {
        switch (api) {
            case "gmail":
                if (!this.state.authGmail)
                    this.setState({auth: API_TYPE.GMAIL});
                break;
            case "gdrive":
                if (!this.state.authGdrive)
                    this.setState({auth: API_TYPE.GDRIVE});
                break;
            case "facebook":
                if (!this.state.authFacebook)
                    this.setState({auth: API_TYPE.FACEBOOK});
                break;
            case "yammer":
                if (!this.state.authYammer) {
                    this.setState({auth: API_TYPE.YAMMER});
                }
                break;
            case "twitch":
                if (!this.state.authTwitch) {
                    this.setState({auth: API_TYPE.TWITCH});
                }
                break;
            case "discord":
                if (!this.state.authDiscord) {
                    this.setState({auth: API_TYPE.DISCORD});
                }
                break;
            default:
                break;
        }
    }

    handle_onSuccess_Discord_sendAxios = async(accessToken: string) =>
    {
        let token = await AsyncStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post(`http://${this.props.serverIp}:8080/discord/connect`, {
                user: {
                    id: "816787519239618603",
                    token: accessToken,
                }
            }, {
                headers: header
            });
            this.setState(prevState => {
                return {
                    auth: API_TYPE.NONE,
                    authDiscord: true,
                }
            })
        } catch (error) {
            alert("L'authentification a échoué. Réessayez");
            return;
        }
    }

    handleOnSuccess_Discord = (url: string): void =>
    {
        console.log(url);
        if (url.includes("?code=")) {
            let urlToken = url.replace("http://localhost:8081/?code=", "");
            console.log(urlToken);
            this.handle_onSuccess_Discord_sendAxios(urlToken);
            return;
        }
        alert("Erreur. Réesayez");
        this.setState({auth: API_TYPE.NONE});
        return;
    }

    displayAuth_Discord = (): JSX.Element =>
    {
        return (
            <WebViewLogin
            url={"https://discord.com/api/oauth2/authorize?client_id=816787519239618603&redirect_uri=http%3A%2F%2Flocalhost%3A8081&response_type=code&scope=identify%20email%20connections%20messages.read%20guilds%20guilds.join%20gdm.join%20messages.read"}
            successUrlMustInclude={"http://localhost:8081/?"}
            onSuccess={(url: string) => this.handleOnSuccess_Discord(url)}
            />
        )
    }

    handle_onSuccess_Twitch_sendAxios = async(accessToken: string) =>
    {
        let token = await AsyncStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post(`http://${this.props.serverIp}:8080/twitch/connect`, {
                user: {
                    id: "j4enk9uoarsrk2xqrshxnubi61cqzf",
                    token: accessToken,
                }
            }, {
                headers: header
            });
            this.setState(prevState => {
                return {
                    auth: API_TYPE.NONE,
                    authTwitch: true,
                }
            })
        } catch (error) {
            alert("L'authentification a échoué. Réessayez");
            return;
        }
    }

    handleOnSuccess_Twitch = (url: string): void =>
    {
        let urlToken = url.replace("http://localhost:8082/?", "");
        if (urlToken.includes("code=") && urlToken.includes("&scope=user%3Aedit+user%3Aread%3Aemail+user_read+user%3Aedit%3Afollows")) {
            let urltoken2 = urlToken.replace("code=", "");
            let token = urltoken2.replace("&scope=user%3Aedit+user%3Aread%3Aemail+user_read+user%3Aedit%3Afollows", "");
            console.log(token);
            this.handle_onSuccess_Twitch_sendAxios(token);
            return;
        } else {
            alert("Authentication failure. Try again");
            this.setState({auth: API_TYPE.NONE});
        }
    }

    displayAuth_Twitch = (): JSX.Element =>
    {
        return (
            <WebViewLogin
            url={"https://id.twitch.tv/oauth2/authorize?client_id=j4enk9uoarsrk2xqrshxnubi61cqzf&redirect_uri=http://localhost:8082&response_type=code&scope=user:edit%20user:read:email%20user_read%20user:edit:follows"}
            successUrlMustInclude={"http://localhost:8082/?"}
            onSuccess={(url: string) => this.handleOnSuccess_Twitch(url)}
            />
        )
    }

    handle_onSuccess_Yammer_sendAxios = async(accessToken: string) =>
    {
        let token = await AsyncStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post(`http://${this.props.serverIp}:8080/yammer/connect`, {
                user: {
                    id: "NhvEd91DlKJshZKAUyEVaQ",
                    token: accessToken,
                }
            }, {
                headers: header
            });
            this.setState(prevState => {
                return {
                    auth: API_TYPE.NONE,
                    authYammer: true,
                }
            })
        } catch (error) {
            alert("L'authentification a échoué. Réessayez");
            return;
        }
    }

    handleOnSuccess_Yammer = (url: string): void =>
    {
        if (url.includes("?code=")) {
            let urlToken = url.replace("http://localhost:8082/?code=", "");
            console.log(urlToken);
            this.handle_onSuccess_Yammer_sendAxios(urlToken);
            return;
        }
        alert("Erreur. Réesayez");
        this.setState({auth: API_TYPE.NONE});
        return;
    }

    displayAuth_Yammer = (): JSX.Element =>
    {
        return (
            <WebViewLogin
            url={"https://www.yammer.com/oauth2/authorize?client_id=NhvEd91DlKJshZKAUyEVaQ&response_type=code&redirect_uri=http://localhost:8082/"}
            successUrlMustInclude={"http://localhost:8082/?"}
            onSuccess={(url: string) => this.handleOnSuccess_Yammer(url)}
            />
        )
    }

    handle_onSuccess_Facebook_sendAxios = async(accessToken: string) =>
    {
        let token = await AsyncStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post(`http://${this.props.serverIp}:8080/facebook/connect`, {
                user: {
                    token: accessToken,
                }
            }, {
                headers: header
            });
            this.setState(prevState => {
                return {
                    auth: API_TYPE.NONE,
                    authFacebook: true,
                }
            })
        } catch (error) {
            alert("L'authentification a échoué. Réessayez");
            return;
        }
    }    

    handleOnSuccess_Facebook = (url: string): void =>
    {
        if (url.includes("code=")) {
            let urlToken = url.replace("http://localhost:8082/?code=", "");
            let indexOfTokenType: number = urlToken.indexOf("&state=");
            let token = urlToken.slice(0, indexOfTokenType);
            this.handle_onSuccess_Facebook_sendAxios(token);
            return;
        }
        alert("Erreur. Réesayez");
        this.setState({auth: API_TYPE.NONE});
        return;
    }

    displayAuth_Facebook = (): JSX.Element =>
    {
        return (
            <WebViewLogin
            url={"https://www.facebook.com/v9.0/dialog/oauth?client_id=511179156521503&redirect_uri=http://localhost:8082/&state='state-param'"}
            successUrlMustInclude={"http://localhost:8082/?"}
            onSuccess={(url: string) => this.handleOnSuccess_Facebook(url)}
            />
        )
    }

    handle_onSuccess_Gdrive_sendAxios = async(accessToken: string) =>
    {
        let token = await AsyncStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post(`http://${this.props.serverIp}:8080/drive/connect`, {
                user: {
                    token: accessToken,
                }
            }, {
                headers: header
            });
            this.setState(prevState => {
                return {
                    auth: API_TYPE.NONE,
                    authGdrive: true,
                }
            })
        } catch (error) {
            alert("L'authentification a échoué. Réessayez");
            return;
        }
    }

    handleOnSuccess_Gdrive = (url: string): void =>
    {
        if (url.includes("access_token=")) {
            let urlToken = url.replace("http://localhost:8081/#access_token=", "");
            let indexOfTokenType: number = urlToken.indexOf("&token_type=");
            let token = urlToken.slice(0, indexOfTokenType);
            this.handle_onSuccess_Gdrive_sendAxios(token);
            return;
        }
        alert("Erreur. Réesayez");
        this.setState({auth: API_TYPE.NONE});
        return;
    }

    displayAuth_Gdrive = (): JSX.Element =>
    {
        return (
            <WebViewLogin
            url={"https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20https://www.googleapis.com/auth/drive%20https://www.googleapis.com/auth/drive.file%20https://www.googleapis.com/auth/drive.readonly%20https://www.googleapis.com/auth/drive.metadata.readonly&include_granted_scopes=true&response_type=token&redirect_uri=http://localhost:8081&client_id=898544528420-ol65drk9mha8tqjru5mu7u1d6qc3tsgf.apps.googleusercontent.com"}
            successUrlMustInclude={"http://localhost:8081/#"}
            onSuccess={(url: string) => this.handleOnSuccess_Gdrive(url)}
            />
        )
    }

    handle_onSuccess_Gmail_sendAxios = async(accessToken: string) =>
    {
        let token = await AsyncStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post(`http://${this.props.serverIp}:8080/gmail/connect`, {
                user: {
                    token: accessToken,
                }
            }, {
                headers: header
            });
            this.setState(prevState => {
                return {
                    auth: API_TYPE.NONE,
                    authGmail: true,
                }
            })
        } catch (error) {
            alert("L'authentification a échoué. Réessayez");
            return;
        }
    }

    handleOnSuccess_Gmail = (url: string): void =>
    {
        if (url.includes("access_token=")) {
            let urlToken = url.replace("http://localhost:8081/#access_token=", "");
            let indexOfTokenType: number = urlToken.indexOf("&token_type=");
            let token = urlToken.slice(0, indexOfTokenType);
            this.handle_onSuccess_Gmail_sendAxios(token);
            return;
        }
        alert("Erreur. Réesayez");
        this.setState({auth: API_TYPE.NONE});
        return;
    }

    displayAuth_Gmail = (): JSX.Element =>
    {
        return (
            <WebViewLogin
            url={"https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20https://mail.google.com/%20https://www.googleapis.com/auth/gmail.modify%20https://www.googleapis.com/auth/gmail.compose%20https://www.googleapis.com/auth/gmail.readonly&include_granted_scopes=true&response_type=token&redirect_uri=http://localhost:8081&client_id=898544528420-ol65drk9mha8tqjru5mu7u1d6qc3tsgf.apps.googleusercontent.com"}
            successUrlMustInclude={"http://localhost:8081/#"}
            onSuccess={(url: string) => this.handleOnSuccess_Gmail(url)}
            />
        )
    }

    displayApp = (): JSX.Element =>
    {
        return (
            <View style={styles.root}>
                <View style={styles.statusBar}/>
                <NavBar/>
                <ScrollView style={styles.home}>
                    <ActionsReactions actionsReactions={this.state.actionsReactions}/>
                    <View style={styles.home_sepSection}><View style={styles.home_sepSection_sep}/></View>
                    <ApisGallery
                    displayingActions={this.state.isSelectionAction}
                    onSelection={(api: string, id: number) => this.pushInArrayActionReaction(api, id)}
                    onClickApi={(api: string) => this.handle_onClickApi(api)}
                    />
                    {/*<Footer/>*/}
                </ScrollView>
            </View>
        )
    }

    display_opt = (): JSX.Element =>
    {
        switch (this.state.auth) {
            case API_TYPE.NONE:
                return this.displayApp();                
            case API_TYPE.GMAIL:
                return this.displayAuth_Gmail();
            case API_TYPE.GDRIVE:
                return this.displayAuth_Gdrive();
            case API_TYPE.FACEBOOK:
                return this.displayAuth_Facebook();
            case API_TYPE.YAMMER:
                return this.displayAuth_Yammer();
            case API_TYPE.TWITCH:
                return this.displayAuth_Twitch();
            case API_TYPE.DISCORD:
                return this.displayAuth_Discord();
            default:
                return this.displayApp();
        }
    }

    redirect_signin = (): JSX.Element =>
    {
        return (
            <Redirect goTo={this.props.goTo} to={["home", "signin"]} props={{serverIp: this.props.serverIp}}/>
        )
    }

    render_opt = (): JSX.Element =>
    {
        if (!this.state.mounted)
            return <></>
        if (!this.state.logged)
            return this.redirect_signin();
        return this.display_opt();
    }

    render = (): JSX.Element =>
    {
        return this.render_opt();
    }
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
    statusBar: {
        width: "100%",
        height: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: "black",
    },
    home: {
        width: "100%",
        height: "100%",
    },
    home_sepSection: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "100%",
        height: 2,
    },
    home_sepSection_sep: {
        width: "60%",
        height: 2,
        backgroundColor: "black",
    }
})

const HomeRouter = (props: MainRouterProps): JSX.Element =>
{
    return (
        <Router
            {...props}
            currentUrl={URL}
            currentComponent={Home}
            subpaths={[
                {path: "signin", Component: SignInRouter},
                {path: "signup", Component: SignUpRouter},
            ]}
        />
    )
}

export default HomeRouter;