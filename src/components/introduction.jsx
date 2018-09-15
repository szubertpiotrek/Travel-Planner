import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink,
    Redirect
} from 'react-router-dom';
import StyledFirebaseAuth from "react-firebaseui/StyledFirebaseAuth"

require("../bootstrap/css/bootstrap.css");
require("../bootstrap/css/bootstrap-theme.min.css");
require("../scss/main.scss");

var config = {
    apiKey: "AIzaSyBKHgtr0EAgXkczl_ftsIDlRPFyyUOHwuM",
    authDomain: "travel-planner-38a29.firebaseapp.com",
    databaseURL: "https://travel-planner-38a29.firebaseio.com",
    projectId: "travel-planner-38a29",
    storageBucket: "travel-planner-38a29.appspot.com",
    messagingSenderId: "288533296906"
};

firebase.initializeApp(config);

class Footer extends React.Component{
    render(){
        return <div className="footer">
            <h3>&copy P.Sz.</h3>
        </div>;
    }
}

class Main extends React.Component{

    render(){
            return <section className="main">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12">
                            <h1 className="main__text">Plan Your Unforgettable Travel</h1>
                            <div className="main__earth">
                                <div className="earth">
                                    <div></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
        </section>
    }
}

class Header extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            login: "",
            password: "",
            auth: false,
            user: "",
            id: ""
        }
    }

    uiConfig = {
        signInFlow: "popup",
        signInOptions: [
            firebase.auth.GoogleAuthProvider.PROVIDER_ID,
            firebase.auth.FacebookAuthProvider.PROVIDER_ID,
        ],
        callbacks: {
            signInSuccess: () => false
        }
    };

    componentDidMount(){
        firebase.auth().onAuthStateChanged(user => {
            this.setState({
                auth: !!user,
                id: user.uid,
                user: firebase.auth().currentUser.displayName
            });
            console.log("user", user);
            console.log(user.uid)
        })
    }

    render(){
        console.log(this.state.auth);
        return <header className="header__intro">
                <div className="row">
                    <div className="col-lg-12">
                        <div className="header__login-intro">
                            <StyledFirebaseAuth
                                uiConfig={this.uiConfig}
                                firebaseAuth={firebase.auth()}
                            />
                        </div>
                    </div>
                </div>
            {this.state.auth===true ? <Redirect to={`/${this.state.id}/${this.state.user}/home`}/> : null}
        </header>
    }
}

class Introduction extends React.Component{

    render(){
        return <div>
            <Header/>
            <Main/>
            <Footer/>
        </div>
    }
}

export {Introduction}