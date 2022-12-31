import React from "react";
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

import "./SignIn.css";

interface IProps
{

}

interface IState
{
    email: string;
    password: string;
    logged: boolean;
    mounted: boolean;
}

class SignIn extends React.Component<IProps, IState>
{
    constructor(props: IProps)
    {
        super(props);
        this.state = {
            email: "",
            password: "",
            logged: false,
            mounted: false,
        }
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
            console.log("Test");
            if (error.response.data.success == false && error.response.data.error == "Unknown user") {
                return alert("Le nom d'utilisateur ou le mot de passe est incorrect");
            } else {
                return alert("Erreur. Réassayez");
            }
        } else {
            return alert("Erreur. Réassayez");
        }
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

    handleSubmit = async(): Promise<void> =>
    {
        let params = {
            email: this.state.email,
            password: this.state.password,
        };
        this.handleSubmit_cleanInfos();
        try {
            let data = await axios.post("http://localhost:8080/signin", params);
            this.handleSubmit_handleToken(data);
        } catch (error) {
            this.handleSubmit_handleErrors(error);
        }
    }

    handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>): void =>
    {
        this.setState({password: e.target.value});
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
                <div id={"signin_formBody"}>
                    <div id={"signin_formBody_center"}>
                        <div id={"signin_formBody_center_inputs"}>
                            <InputLabel value={this.state.email} title={"Email:"} placeholder={"Votre email"} onChange={(e) => this.handleEmailInput(e)}/>
                            <InputLabel value={this.state.password} title={"Mot de passe:"} placeholder={"Votre mot de passe"} onChange={(e) => this.handlePasswordInput(e)} isPassword={true}/>
                        </div>
                        <div id={"signin_formBody_center_submit"}>
                            <button onClick={() => this.handleSubmit()} className={"none_color_button"} id={"signin_formBody_center_submit_btn"}>
                                Se connecter
                            </button>
                        </div>
                        <div id={"signin_formBody_center_login"}>
                            Vous n'avez pas de compte ? Inscrivez vous en <Link to={"/signup"}><span id={"signin_formBody_center_login_link"}>cliquant ici</span></Link>
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

class SignInRouter extends React.Component
{
    constructor(props: any)
    {
        super(props);
    }

    render = (): JSX.Element =>
    {
        return (
            <div>
                <Route exact path={"/signin"}>
                    <SignIn/>
                </Route>
            </div>
        )
    }
}

export default SignInRouter;