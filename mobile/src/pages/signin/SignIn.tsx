import React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, StatusBar, Platform, ScrollView } from 'react-native';

import Router, {MainRouterProps, RouterProps, Redirect} from "../../components/Router/Router";
import AsyncStorage from '@react-native-community/async-storage';
import axios, {AxiosResponse} from "axios";

const URL: Array<string> = ["home", "signin"];

interface IProps extends RouterProps
{
    serverIp: string;
}

interface IState
{
    email: string;
    password: string;
    mounted: boolean;
    logged: boolean;
}

class SignIn extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            email: "",
            password: "",
            mounted: false,
            logged: false,
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
        this.setState({logged: true, mounted: true});
    }

    componentDidMount()
    {
        this.componentDidMount_async();
    }

    handleSubmit_cleanInfos = (): void =>
    {
        this.setState({email: "", password: ""});
    }

    handleSubmit_handleErrors = (error: any): void =>
    {
        if (error.status == 0)
            return alert("Erreur. Réassayez");
        if (error.status == 500)
            return alert("Erreur. Réassayez");
        if (error.status == 401 && "success" in error.response.data && "error" in error.response.data) {
            if (error.response.data.success == false && error.response.data.error == "Unknown user") {
                return alert("Le nom d'utilisateur ou le mot de passe est incorrect");
            } else {
                return alert("Erreur. Réassayez");
            }
        } else {
            return alert("Erreur. Réassayez");
        }
    }

    handleSubmit_handleToken = (data: AxiosResponse<any>): void =>
    {
        if (data.status !== 200)
            return alert("Erreur. Réassayez");
        if ("token" in data.data) {
            try {
                AsyncStorage.setItem("token", data.data.token, () => {
                    this.setState({logged: true});
                });    
            } catch (error) {
            }
        }
    }

    handleSubmit = async(): Promise<void> =>
    {
        let params = {
            email: this.state.email,
            password: this.state.password,
        };
        this.handleSubmit_cleanInfos();
        try {
            let data: AxiosResponse<any> = await axios.post(`http://${this.props.serverIp}:8080/signin`, params);
            this.handleSubmit_handleToken(data);
        } catch (error) {
            this.handleSubmit_handleErrors(error);
        }
    }

    display = (): JSX.Element =>
    {
        return (
            <ScrollView style={styles.root}>
                <View style={styles.signin}>
                    <Text style={styles.signin_logo}>AREA</Text>
                    <Image source={require('./_media/profiletwo.png')} style={{ width: 200, height: 200 }}/>
                    <Text style={styles.signin_subtext}>Connectez vous à votre compte</Text>
                    <View style={styles.signin_inputView} >
                        <TextInput  
                        style={styles.signin_inputView_inputText}
                        placeholder="E-mail" 
                        placeholderTextColor="black"
                        onChangeText={text => this.setState({email:text})}
                        value={this.state.email}
                        />
                    </View>
                    <View style={styles.signin_inputView} >
                        <TextInput  
                        secureTextEntry
                        style={styles.signin_inputView_inputText}
                        placeholder="Mot de passe" 
                        placeholderTextColor="black"
                        onChangeText={text => this.setState({password:text})}
                        value={this.state.password}
                        />
                    </View>
                    <TouchableOpacity>
                        <Text style={styles.signin_forgot}>Vous avez oublié votre mot de passe ?</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.signin_loginBtn} onPress={() => this.handleSubmit()}>
                        <Text style={styles.signin_loginText}>Se connecter</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.goTo(["home", "signup"], {serverIp: this.props.serverIp})}>
                        <Text style={styles.signin_signupText}>S'inscrire</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        )
    }

    render_opt = (): JSX.Element =>
    {
        if (!this.state.mounted)
            return <></>
        if (this.state.logged)
            return <Redirect goTo={this.props.goTo} to={["home"]} props={{serverIp: this.props.serverIp}}/>
        return this.display();
    }

    render = (): JSX.Element =>
    {
        return this.render_opt();
    }
}

const styles = StyleSheet.create({
    root: {
        width: "100%",
        height: "100%",
    },
    signin: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#222930",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    signin_logo:{
        fontWeight:"bold",
        fontSize:30,
        color:"white",
        marginBottom:10
    },
    signin_subtext:{
        //fontWeight:"bold",
        //fontFamily:"Zocial",
        fontSize:22,
        color:"white",
        marginBottom:45
    },
    signin_inputView:{
        width:"80%",
        backgroundColor:"white",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    signin_inputView_inputText:{
        height:50,
        color:"black"
    },
    signin_forgot:{
        color:"white",
        fontSize:15
    },
    signin_loginBtn:{
        width:"80%",
        backgroundColor:"#4EB1BA",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    signin_loginText:{
        color:"white"
    },
    signin_signupText:{
        marginTop:20,
        marginBottom:10,
        fontSize:15,
        color:"white"
    }
})

const SignInRouter = (props: MainRouterProps): JSX.Element =>
{
    return (
        <Router
            {...props}
            currentUrl={URL}
            currentComponent={SignIn}
            subpaths={[]}
        />
    )
}

export default SignInRouter;