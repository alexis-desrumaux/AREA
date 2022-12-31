import React from "react"
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  useParams,
  Redirect
} from "react-router-dom";
import axios from "axios";
import GoogleLogin from 'react-google-login';
import FacebookLogin, {ReactFacebookLoginInfo, ReactFacebookFailureResponse} from 'react-facebook-login';

import "./Home.css";

import NavBar from "../components/NavBar/NavBar#1/src/NavBar";
import ActionsReactions, {IActionReaction} from "./_components/ActionsReactions/src/ActionsReactions";
import ApisGallery from "./_components/ApisGallery/src/ApisGallery";
import Footer from "../components/Footer/Footer#1/src/Footer";

import SignUpRouter from "./signup/SignUp";
import SignInRouter from "./signin/SignIn";

import areas from "./areas.json";

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

interface IProps
{
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
        };
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
        let token = localStorage.getItem("token");
        if (token == null) {
            this.pushEmptyCombinationArray();
            return;
        }
        try {
            let res = await axios.get(`http://localhost:8080/get_combination`, {
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
        let token = localStorage.getItem("token");
        if (token == null) {
            return false;
        }
        try {
            let res = await axios.get(`http://localhost:8080/signin`, {
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

    componentDidMount = () =>
    {
        this.componentDidMount_async();
    }

    sendCombinaison_sendAxios = async(indexActionApi: number, indexReactionApi: number, actionReaction: IActionReaction): Promise<void> =>
    {
        let token = localStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        let res = await axios.post("http://localhost:8080/create_combination", {
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
        console.log(res);
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

    handle_onSuccessAuthDiscord_sendAxios = async(accessToken: string) =>
    {
        let token = localStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post("http://localhost:8080/discord/connect", {
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
            if (!error.status)
                alert("Authentication failed. Try again");
            return;
        }
    }

    handle_onClickApi_discord_checkResponse = (urlToken: string) =>
    {
        if (urlToken.includes("code=")) {
            let token = urlToken.replace("code=", "");
            this.handle_onSuccessAuthDiscord_sendAxios(token);
        } else {
            alert("Authentication failure. Try again");
            this.setState({auth: API_TYPE.NONE});
        }
    }

    handle_onClickApi_discord = () =>
    {
        let popup = window.open("https://discord.com/api/oauth2/authorize?client_id=816787519239618603&redirect_uri=http%3A%2F%2Flocalhost%3A8081&response_type=code&scope=identify%20email%20connections%20messages.read%20guilds%20guilds.join%20gdm.join%20messages.read", "Connect to discord", "width=800,height=800");
        if (popup) {
            var loop = setInterval(() => {
                if (popup) {
                    try {
                        if (popup.location.href.includes("http://localhost:8081/?")) {
                            let url = popup.location.href;
                            let urlToken = url.replace("http://localhost:8081/?", "");
                            console.log(urlToken);
                            popup.close();
                            this.handle_onClickApi_discord_checkResponse(urlToken);
                            clearInterval(loop);
                        }
                    } catch (error) {
                        
                    }
                }
            }, 1000)
        }
    }

    handle_onSuccessAuthTwitch_sendAxios = async(accessToken: string) =>
    {
        let token = localStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post("http://localhost:8080/twitch/connect", {
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
            if (!error.status)
                alert("Authentication failed. Try again");
            return;
        }
    }

    handle_onClickApi_twitch_checkResponse = (urlToken: string) =>
    {
        if (urlToken.includes("code=") && urlToken.includes("&scope=user%3Aedit+user%3Aread%3Aemail+user_read+user%3Aedit%3Afollows")) {
            let urltoken2 = urlToken.replace("code=", "");
            let token = urltoken2.replace("&scope=user%3Aedit+user%3Aread%3Aemail+user_read+user%3Aedit%3Afollows", "");
            this.handle_onSuccessAuthTwitch_sendAxios(token);
        } else {
            alert("Authentication failure. Try again");
            this.setState({auth: API_TYPE.NONE});
        }
    }

    handle_onClickApi_twitch = () =>
    {
        let popup = window.open("https://id.twitch.tv/oauth2/authorize?client_id=j4enk9uoarsrk2xqrshxnubi61cqzf&redirect_uri=http://localhost:8081&response_type=code&scope=user:edit%20user:read:email%20user_read%20user:edit:follows", "Connect to twitch", "width=800,height=800");
        if (popup) {
            var loop = setInterval(() => {
                if (popup) {
                    try {
                        console.log(popup.location.href);
                        if (popup.location.href.includes("http://localhost:8081/?")) {
                            let url = popup.location.href;
                            let urlToken = url.replace("http://localhost:8081/?", "");
                            popup.close();
                            this.handle_onClickApi_twitch_checkResponse(urlToken);
                            clearInterval(loop);
                        }
                    } catch (error) {
                        
                    }
                }
            }, 1000)
        }
    }

    handle_onSuccessAuthYammer_sendAxios = async(accessToken: string) =>
    {
        let token = localStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post("http://localhost:8080/yammer/connect", {
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
            if (!error.status)
                alert("Authentication failed. Try again");
            return;
        }
    }

    handle_onClickApi_yammer_checkResponse = (urlToken: string) =>
    {
        if (urlToken.includes("code=")) {
            let token = urlToken.replace("code=", "");
            this.handle_onSuccessAuthYammer_sendAxios(token);
        } else {
            alert("Authentication failure. Try again");
            this.setState({auth: API_TYPE.NONE});
        }
    }

    handle_onClickApi_yammer = () =>
    {
        let popup = window.open("https://www.yammer.com/oauth2/authorize?client_id=NhvEd91DlKJshZKAUyEVaQ&response_type=code&redirect_uri=http://localhost:8081/", "Connect to yammer", "width=800,height=800");
        if (popup) {
            var loop = setInterval(() => {
                if (popup) {
                    try {
                        if (popup.location.href.includes("http://localhost:8081/?")) {
                            let url = popup.location.href;
                            let urlToken = url.replace("http://localhost:8081/?", "");
                            console.log(urlToken);
                            popup.close();
                            this.handle_onClickApi_yammer_checkResponse(urlToken);
                            clearInterval(loop);
                        }
                    } catch (error) {
                        
                    }
                }
            }, 1000)
        }
    }

    handle_onSuccessAuthGdrive_sendAxios = async(accessToken: string) =>
    {
        let token = localStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post("http://localhost:8080/drive/connect", {
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
            if (!error.status)
                alert("Authentication failed. Try again");
            return;
        }
    }

    handle_onClickApi_gdrive_checkResponse = (urlToken: string): void =>
    {
        if (urlToken.includes("access_token=")) {
            let urlToken2 = urlToken.replace("access_token=", "");
            let indexOfTokenType: number = urlToken2.indexOf("&token_type=");
            let token = urlToken2.slice(0, indexOfTokenType);
            this.handle_onSuccessAuthGdrive_sendAxios(token);
        } else {
            alert("Authentication failure. Try again");
            this.setState({auth: API_TYPE.NONE});
        }
    }

    handle_onClickApi_gdrive = (): void =>
    {
        let popup = window.open("https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20https://www.googleapis.com/auth/drive%20https://www.googleapis.com/auth/drive.file%20https://www.googleapis.com/auth/drive.readonly%20https://www.googleapis.com/auth/drive.metadata.readonly&include_granted_scopes=true&response_type=token&redirect_uri=http://localhost:8081&client_id=898544528420-ol65drk9mha8tqjru5mu7u1d6qc3tsgf.apps.googleusercontent.com", "Connect to google", "width=800,height=800");
        if (popup) {
            var loop = setInterval(() => {
                if (popup) {
                    try {
                        if (popup.location.href.includes("http://localhost:8081/#")) {
                            let url = popup.location.href;
                            let urlToken = url.replace("http://localhost:8081/#", "");
                            popup.close();
                            this.handle_onClickApi_gdrive_checkResponse(urlToken);
                            clearInterval(loop);
                        }
                    } catch (error) {
                        
                    }
                }
            }, 1000)
        }
    }

    handle_onSuccessAuthFacebook_sendAxios = async(accessToken: string) =>
    {
        console.log(accessToken);
        let token = localStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post("http://localhost:8080/facebook/connect", {
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
            if (!error.status)
                alert("Authentication failed. Try again");
            return;
        }
    }

    handle_onClickApi_facebook_checkResponse = (urlToken: string) =>
    {
        console.log(urlToken);
        if (urlToken.includes("code=")) {
            let urlToken2 = urlToken.replace("code=", "");
            let indexOfTokenType: number = urlToken2.indexOf("&state=");
            let token = urlToken2.slice(0, indexOfTokenType);
            this.handle_onSuccessAuthFacebook_sendAxios(token);
        } else {
            alert("Authentication failure. Try again");
            this.setState({auth: API_TYPE.NONE});
        }
    }

    handle_onClickApi_facebook = (): void =>
    {
        let popup = window.open("https://www.facebook.com/v9.0/dialog/oauth?client_id=511179156521503&redirect_uri=http://localhost:8081/&state='state-param'", "Connect to facebook", "width=800,height=800");
        if (popup) {
            var loop = setInterval(() => {
                if (popup) {
                    try {
                        if (popup.location.href.includes("http://localhost:8081/?")) {
                            let url = popup.location.href;
                            let urlToken = url.replace("http://localhost:8081/?", "");
                            popup.close();
                            this.handle_onClickApi_facebook_checkResponse(urlToken);
                            clearInterval(loop);
                        }
                    } catch (error) {
                        
                    }
                }
            }, 1000)
        }
    }

    handle_onSuccessAuthGmail_sendAxios = async(accessToken: string) =>
    {
        let token = localStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post("http://localhost:8080/gmail/connect", {
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
            alert("Authentication failed. Try again");
            return;
        }
    }

    handle_onClickApi_gmail_checkResponse = (urlToken: string): void =>
    {
        if (urlToken.includes("access_token=")) {
            let urlToken2 = urlToken.replace("access_token=", "");
            let indexOfTokenType: number = urlToken2.indexOf("&token_type=");
            let token = urlToken2.slice(0, indexOfTokenType);
            this.handle_onSuccessAuthGmail_sendAxios(token);
        } else {
            alert("Authentication failure. Try again");
            this.setState({auth: API_TYPE.NONE});
        }
    }

    handle_onClickApi_gmail = (): void =>
    {
        let popup = window.open("https://accounts.google.com/o/oauth2/v2/auth?scope=profile%20https://mail.google.com/%20https://www.googleapis.com/auth/gmail.modify%20https://www.googleapis.com/auth/gmail.compose%20https://www.googleapis.com/auth/gmail.readonly&include_granted_scopes=true&response_type=token&redirect_uri=http://localhost:8081&client_id=898544528420-ol65drk9mha8tqjru5mu7u1d6qc3tsgf.apps.googleusercontent.com", "Connect to google", "width=800,height=800");
        if (popup) {
            var loop = setInterval(() => {
                if (popup) {
                    try {
                        if (popup.location.href.includes("http://localhost:8081/#")) {
                            let url = popup.location.href;
                            let urlToken = url.replace("http://localhost:8081/#", "");
                            popup.close();
                            this.handle_onClickApi_gmail_checkResponse(urlToken);
                            clearInterval(loop);
                        }
                    } catch (error) {
                        
                    }
                }
            }, 1000)
        }
    }

    handle_onClickApi = (api: string) =>
    {
        switch (api) {
            case "gmail":
                if (!this.state.authGmail) {
                    this.setState({auth: API_TYPE.GMAIL});
                    this.handle_onClickApi_gmail();
                }
                break;
            case "gdrive":
                if (!this.state.authGdrive) {
                    this.setState({auth: API_TYPE.GDRIVE});
                    this.handle_onClickApi_gdrive();
                }
                break;
            case "facebook":
                if (!this.state.authFacebook) {
                    this.setState({auth: API_TYPE.FACEBOOK});
                    this.handle_onClickApi_facebook();
                }
                break;
            case "yammer":
                if (!this.state.authYammer) {
                    this.setState({auth: API_TYPE.YAMMER});
                    this.handle_onClickApi_yammer();
                }
                break;
            case "twitch":
                if (!this.state.authTwitch) {
                    this.setState({auth: API_TYPE.TWITCH});
                    this.handle_onClickApi_twitch();
                }
                break;
            case "discord":
                if (!this.state.authDiscord) {
                    this.setState({auth: API_TYPE.DISCORD});
                    this.handle_onClickApi_discord();
                }
                break;
            default:
                break;
        }
    }

    displayAuth_Other = (): JSX.Element =>
    {
        return (
            <></>
        )
    }

    /*handle_onSuccessAuthFacebook_sendAxios = async(userInfo: any) =>
    {
        let token = localStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post("http://localhost:8080/facebook/connect", {
                user: {
                    id: userInfo.id,
                    token: userInfo.accessToken,
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
            if (!error.status)
                alert("Authentication failed. Try again");
            return;
        }
    }*/

    /*handle_onSuccessAuthFacebook = (userInfo: ReactFacebookLoginInfo | ReactFacebookFailureResponse) =>
    {
        console.log(userInfo);
        if ("accessToken" in userInfo == false || "id" in userInfo == false) {
            alert("Authentication failure. Try again");
            return;
        }
        this.handle_onSuccessAuthFacebook_sendAxios(userInfo);
    }*/

    /*displayAuth_Facebook = (): JSX.Element =>
    {
        return (
            <FacebookLogin
            appId="511179156521503"
            autoLoad={true}
            fields="name,email,picture"
            scope="public_profile,email,pages_read_engagement,pages_show_list,pages_manage_posts"
            callback={(userInfo: any) => this.handle_onSuccessAuthFacebook(userInfo)}
            />
        )
    }*/

    /*handle_onFailureAuthGoogle = (response: any) =>
    {
        console.log("FAILURE !")
        console.log(response);
        this.setState(prevState => {
            return {
                auth: API_TYPE.NONE
            }
        })
    }*/

    /*handle_onSuccessAuthGoogle_sendAxios_url = async(url: string, token: string, googleAuthResponse: any): Promise<void> =>
    {
        const header = {
            'Authorization': token
        }
        try {
            let authRes = await axios.post(url, {
                user: {
                    id: googleAuthResponse.googleId,
                    token: googleAuthResponse.accessToken,
                }
            }, {
                headers: header
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }*/

    /*handle_onSuccessAuthGoogle_sendAxios = async(googleAuthResponse: any): Promise<void> =>
    {
        let token = localStorage.getItem("token");
        if (token == null) {
            this.setState({logged: false});
            return;
        }
        if (this.state.auth == API_TYPE.GMAIL) {
            try {
                await this.handle_onSuccessAuthGoogle_sendAxios_url("http://localhost:8080/gmail/connect", token, googleAuthResponse);
                this.setState(prevState => {
                    return {
                        auth: API_TYPE.NONE,
                        authGmail: true,
                    }
                })
            } catch (error) {
                if (!error.status)
                    alert("Authentication failed. Try again");
                return;
            }
        } else if (this.state.auth == API_TYPE.GDRIVE) {
            try {
                await this.handle_onSuccessAuthGoogle_sendAxios_url("http://localhost:8080/drive/connect", token, googleAuthResponse);
                this.setState(prevState => {
                    return {
                        auth: API_TYPE.NONE,
                        authGdrive: true,
                    }
                })
            } catch (error) {
                if (!error.status)
                    alert("Authentication failed. Try again");
                return;
            }
        }
    }*/

    /*handle_onSuccessAuthGoogle = (googleAuthResponse: any) =>
    {        
        if ("accessToken" in googleAuthResponse == false || "googleId" in googleAuthResponse == false) {
            alert("Authentication failure. Try again");
            return;
        }
        console.log(googleAuthResponse.accessToken, googleAuthResponse.googleId);
        this.handle_onSuccessAuthGoogle_sendAxios(googleAuthResponse);
    } */

    /*displayAuth_Google = (): JSX.Element =>
    {
        return (
            <GoogleLogin
            clientId="898544528420-ol65drk9mha8tqjru5mu7u1d6qc3tsgf.apps.googleusercontent.com"
            buttonText="Login"
            onSuccess={(googleAuthResponse) => this.handle_onSuccessAuthGoogle(googleAuthResponse)}
            onFailure={(response) => this.handle_onFailureAuthGoogle(response)}
            cookiePolicy={'single_host_origin'}
            scope={"profile https://mail.google.com/  https://www.googleapis.com/auth/gmail.modify https://www.googleapis.com/auth/gmail.compose https://www.googleapis.com/auth/gmail.readonly"}
            />
        )
    }*/

    displayApp = (): JSX.Element =>
    {
        return (
            <div>
                <NavBar/>
                <ActionsReactions actionsReactions={this.state.actionsReactions}/>
                <div id={"home_sepSection"}><div id={"home_sepSection_sep"}/></div>
                <ApisGallery
                displayingActions={this.state.isSelectionAction}
                onSelection={(api: string, id: number) => this.pushInArrayActionReaction(api, id)}
                onClickApi={(api: string) => this.handle_onClickApi(api)}
                />
                <Footer/>
            </div>
        )
    }

    display_opt = (): JSX.Element =>
    {
        switch (this.state.auth) {
            case API_TYPE.NONE:
                return this.displayApp();                
            case API_TYPE.GMAIL:
                return this.displayAuth_Other();
            case API_TYPE.GDRIVE:
                return this.displayAuth_Other();
            case API_TYPE.FACEBOOK:
                return this.displayAuth_Other();
            case API_TYPE.YAMMER:
                return this.displayAuth_Other();
            case API_TYPE.TWITCH:
                return this.displayAuth_Other();
            case API_TYPE.DISCORD:
                return this.displayAuth_Other();
            default:
                return this.displayApp();
        }
    }

    redirect_signup = (): JSX.Element =>
    {
        return (
            <Redirect to={{pathname:"/signin", state:{}}}/>
        )
    }

    render_opt = (): JSX.Element =>
    {
        if (!this.state.mounted)
            return <></>
        if (!this.state.logged)
            return this.redirect_signup();
        return this.display_opt();
    }

    render = (): JSX.Element =>
    {
        return this.render_opt();
    }
}

class HomeRouter extends React.Component
{
    constructor(props: any)
    {
        super(props);
    }

    render = (): JSX.Element =>
    {
        return (
            <div>
                <Route exact path={"/"}>
                    <Home {...this.props}/>
                </Route>
                <Switch>
                    <Route path={'/signup'} render={(props) => <SignUpRouter {...props}/>}/>
                    <Route path={'/signin'} render={(props) => <SignInRouter {...props}/>}/>
                </Switch>
            </div>
        )
    }
}

export default HomeRouter;