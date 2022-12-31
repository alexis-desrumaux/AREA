import React from "react";
import { StyleSheet, Text, View, TextInput, Image, TouchableOpacity, StatusBar, Platform } from 'react-native';

import Router, {MainRouterProps, RouterProps, Redirect} from "../../components/Router/Router";
import AsyncStorage from '@react-native-community/async-storage';
import axios, {AxiosResponse} from "axios";

const URL: Array<string> = ["home", "signup"];

interface IProps extends RouterProps
{
    serverIp: string;
}

interface IState
{
    username: string;
    password: string;
    email: string;
    phone_number: string;
    logged: boolean;
}

class SignUp extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            username: "",
            password: "",
            email: "",
            phone_number: "",
            logged: false,
        }
    }

    handleSubmit_cleanInfos = () =>
    {
        this.setState({
            username: "",
            password: "",
            email: "",
        });
    }

    handleSubmit_handleToken = (data: any): void =>
    {
        if (data.status !== 200)
            return alert("Erreur. Réassayez");
        if ("token" in data.data) {
            AsyncStorage.setItem("token", data.data.token, () => {
                this.setState({logged: true});
            });
        }
    }

    handleSubmit_handleErrors = (error: any): void =>
    {
        if (error.status == 0)
            return alert("Erreur. Réassayez");
        if (error.status == 500)
            return alert("Erreur. Réassayez");
        else if (error.status == 400) {
            if ("success" in error.response.data && "error" in error.response.data) {
                if (error.response.data.success == false && error.response.data.error == "user already exist")
                    return alert("Erreur, l'email ou le pseudo est déjà utilisé.");
                else
                    return alert("Erreur. Réassayez");
            }
            else
                return alert("Erreur. Réassayez");
        }
    }


    handleSubmit = async(): Promise<void> =>
    {
        let check: number = 0;

        if (this.state.email.length !== 0 && /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/.test(this.state.email))
            check++;
        else {
            this.handleSubmit_cleanInfos();
            alert("Email invalide");
            return;
        }
        if (this.state.password.length >= 6)
            check++;
        else {
            this.handleSubmit_cleanInfos();
            alert("Mot de passe invalide. Doit contenir des caractères alphanumérique et six caractères");
            return;
        }
        if (check !== 2) {
            this.handleSubmit_cleanInfos();
            alert("Erreur");
            return;
        }
        let params = {
            username: this.state.username,
            password: this.state.password,
            email: this.state.email,
        }
        this.handleSubmit_cleanInfos();
        try {
            let data = await axios.post(`http://${this.props.serverIp}:8080/signup`, params);
            this.handleSubmit_handleToken(data);
        } catch (error) {
            this.handleSubmit_handleErrors(error);
        }
    }

    display = (): JSX.Element =>
    {
        return (
            <View style={styles.root}>
                <View style={styles.signup}>
                    <Image source={require('./_media/registration.png')} style={{ width: 170, height: 170, marginBottom:50}} />
                    <View style={styles.signup_inputView}>
                        <TextInput
                        style={styles.signup_inputView_inputText}
                        placeholder='E-mail'
                        autoCapitalize="none"
                        placeholderTextColor='black'
                        onChangeText={val => this.setState({email: val})}
                        value={this.state.email}
                        />
                    </View>
                    <View style={styles.signup_inputView}>
                        <TextInput
                        style={styles.signup_inputView_inputText}
                        placeholder="Nom d'utilisateur"
                        autoCapitalize="none"
                        placeholderTextColor='black'
                        onChangeText={val => this.setState({username: val})}
                        value={this.state.username}
                        />
                    </View>
                    <View style={styles.signup_inputView}>
                        <TextInput
                        style={styles.signup_inputView_inputText}
                        placeholder="Mot de passe"
                        autoCapitalize="none"
                        placeholderTextColor='black'
                        secureTextEntry={true}
                        onChangeText={val => this.setState({password: val})}
                        value={this.state.password}
                        />
                    </View>
                    <TouchableOpacity onPress={() => this.handleSubmit()} style={styles.signup_signupBtn}>
                        <Text style={styles.signup_signupBtn_txt}>S'inscrire</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.props.goTo(["home", "signin"], {serverIp: this.props.serverIp})}>
                        <Text style={styles.signup_signinText}>Se connecter</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    render_opt = (): JSX.Element =>
    {
        if (this.state.logged)
            return <Redirect goTo={this.props.goTo} to={["home"]}/>
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
        backgroundColor: "#222930",
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0
    },
    signup: {
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        height: "100%",
        backgroundColor: "#222930",
    },
    signup_logo:{
        fontWeight:"bold",
        fontSize:50,
        color:"white",
        marginBottom:50
    },
    signup_inputView:{
        width:"80%",
        backgroundColor:"white",
        borderRadius:25,
        height:50,
        marginBottom:20,
        justifyContent:"center",
        padding:20
    },
    signup_inputView_inputText:{
        height:50,
        color:"black"
    },
    signup_signupBtn:{
        width:"80%",
        backgroundColor:"#4EB1BA",
        borderRadius:25,
        height:50,
        alignItems:"center",
        justifyContent:"center",
        marginTop:40,
        marginBottom:10
    },
    signup_signupBtn_txt: {
        color: "white",
    },
    signup_signinText:{
        marginTop:20,
        marginBottom:10,
        fontSize:15,
        color:"white"
    }
});

const SignUpRouter = (props: MainRouterProps) =>
{
    return (
        <Router
            {...props}
            currentUrl={URL}
            currentComponent={SignUp}
            subpaths={[]}
        />
    )
}

export default SignUpRouter;