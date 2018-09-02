import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink,
} from 'react-router-dom';

require("../bootstrap/css/bootstrap.css");
require("../bootstrap/css/bootstrap-theme.min.css");
require("../scss/main.scss");

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
            auth: false
        }
    }

    handleOnLogin = (event) => {
        this.setState({
            login: event.target.value
        })
    };

    handleOnPassword = (event) => {
        this.setState({
            password: event.target.value
        })
    };

    handleOnSubmit = () => {
        const dbRef = firebase.database().ref();
        const dataRef = dbRef.child('user1');

        const user = `${this.state.login} ${this.state.password}`;
        console.log(user);


        dataRef.on('value',(snapshot) => {
            console.log(snapshot.val());
            if(user === snapshot.val()){
                this.setState({
                    auth: true
                })
            }
        });
    };

    render(){
        return <header className="header">
                <div className="row">
                    <div className="col-lg-4">
                        <figure>
                            <img/>
                        </figure>
                    </div>
                    <div className="col-lg-8">
                        <form onSubmit={this.handleOnSubmit} className="header__form" action="Travel-Planner/dist/#/home" method="GET">
                            <label className="header__label"> Login
                                <input type="name" value={this.state.login} onChange={this.handleOnLogin}
                                       placeholder="login" className="header__input"/>
                            </label>
                            <label className="header__label"> Password
                                <input type="password" value={this.state.password} onChange={this.handleOnPassword}
                                       placeholder="password" className="header__input"/>
                            </label>
                            <input type="submit" value="Sign In" className="header__button"/>
                        </form>
                    </div>
                </div>
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
