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

import NavBar from "../../components/NavBar/NavBar#1/src/NavBar";
import InputLabel from "../../components/Input/InputLabel/src/InputLabel";
import "./SignUp.css";

interface IProps
{

}

interface IState
{
    email: string;
    username: string;
    password: string;
    logged: boolean;
    mounted: boolean;
}

class SignUp extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            email: "",
            username: "",
            password: "",
            logged: false,
            mounted: false,
        };
    }

    fetch_isUserLogged = async() =>
    {
        let token = localStorage.getItem("token");
        if (token == null)
            return;
        try {
            let res = await axios.get("http://localhost:8080/signin", {
                headers: {
                  'Authorization': token
                }
            });
            if ("success" in res.data && res.data.success == true) {
                console.log("Already Logged !");
                this.setState({logged: true});
                return;
            }
        } catch (error) {
            if (error.status == 0)
                return console.log("Erreur");
            if (error.status == 500)
                return console.log("Erreur serveur");
            if (error.status == 401) {
                if ("success" in error.response.data && "error" in error.response.data) {
                    if (error.response.data.success == false) {
                        console.log(error.response.data.error);
                        return;
                    }
                }
                else {
                    console.log("401 - Erreur");
                    return;
                }
            }
            return;
        }
    }

    componentDidMount_async = async() =>
    {
        await this.fetch_isUserLogged();
        this.setState({mounted: true});
    }

    componentDidMount()
    {
        this.componentDidMount_async();
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
            localStorage.setItem("token", data.data.token);
            this.setState({logged: true});
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
            let data = await axios.post("http://localhost:8080/signup", params);
            this.handleSubmit_handleToken(data);
        } catch (error) {
            this.handleSubmit_handleErrors(error);
        }
    }

    handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>): void =>
    {
        this.setState({password: e.target.value});
    }

    handleUsernameInput = (e: React.ChangeEvent<HTMLInputElement>): void =>
    {
        this.setState({username: e.target.value});
    }

    handleEmailInput = (e: React.ChangeEvent<HTMLInputElement>): void =>
    {
        this.setState({email: e.target.value});
    }

    redirectHome = (): JSX.Element =>
    {
        return <Redirect to={{pathname:"/", state:{}}}/>
    }

    display = (): JSX.Element =>
    {
        return (
            <div>
                <NavBar/>
                <div id={"signup_formBody"}>
                    <div id={"signup_formBody_center"}>
                        <div id={"signup_formBody_center_inputs"}>
                            <InputLabel value={this.state.email} title={"Email:"} placeholder={"Votre email"} onChange={(e) => this.handleEmailInput(e)}/>
                            <InputLabel value={this.state.username} title={"Nom d'utilisateur:"} placeholder={"Votre nom d'utilisateur"} onChange={(e) => this.handleUsernameInput(e)}/>
                            <InputLabel value={this.state.password} title={"Mot de passe:"} placeholder={"Votre mot de passe"} onChange={(e) => this.handlePasswordInput(e)} isPassword={true}/>
                        </div>
                        <div id={"signup_formBody_center_submit"}>
                            <button onClick={() => this.handleSubmit()} className={"none_color_button"} id={"signup_formBody_center_submit_btn"}>
                                S'inscrire
                            </button>
                        </div>
                        <div id={"signup_formBody_center_login"}>
                            Vous avez déjà un compte ? Connectez vous en <Link to={"/signin"}><span id={"signup_formBody_center_login_link"}>cliquant ici</span></Link>
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    render_opt = (): JSX.Element =>
    {
        if (this.state.mounted == false)
            return <></>
        if (this.state.logged == true)
            return this.redirectHome();
        return this.display();
    }

    render = (): JSX.Element =>
    {
        return (
            <div>
                {this.render_opt()}
            </div>
        )
    }
}

class SignUpRouter extends React.Component
{
    constructor(props: any)
    {
        super(props);
    }

    render = (): JSX.Element =>
    {
        return (
            <div>
                <Route exact path={"/signup"}>
                    <SignUp/>
                </Route>
            </div>
        )
    }
}

export default SignUpRouter;