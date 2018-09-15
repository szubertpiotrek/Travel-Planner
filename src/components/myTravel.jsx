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

import {Footer} from "./home.jsx";

require("../bootstrap/css/bootstrap.css");
require("../bootstrap/css/bootstrap-theme.min.css");
require("../scss/main.scss");

class Header extends React.Component{

    handleOnLogOut = () => {
        firebase.auth().signOut()
    };

    render(){
        return <header className="header">
            <div className="row">
                <div className="col-lg-4">
                    <div className="header__login">
                        <Link to={`/${this.props.id}/${this.props.user}/home`} className="header__return--button"><i className="far fa-arrow-alt-circle-left"></i></Link>
                        <div className="header__login--name">
                            <h2 className="header__login--name-h2">user: {this.props.user}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="header__logout">
                        <NavLink exact to={"/"} className="header__logout--link" onClick={this.handleOnLogOut}>Log out</NavLink>
                    </div>
                </div>
            </div>
        </header>
    }
}

class Main extends React.Component{

    render(){
        return <section className="main">
            <div className="col-lg-2">
                <nav className="main__nav">
                    <h1 className="main__h1">{this.props.name}</h1>
                    <ul className="main__list">
                        <li className="main__link">
                            <NavLink to={`/${this.props.id}/${this.props.user}/myTravel/${this.props.name}/attractions`} className="main__link--style">Attractions</NavLink>
                        </li>
                        <li className="main__link">
                            <NavLink to={`/${this.props.id}/${this.props.user}/myTravel/${this.props.name}/restaurants`} className="main__link--style">Restaurants</NavLink>
                        </li>
                        <li className="main__link">
                            <NavLink to={`/${this.props.id}/${this.props.user}/myTravel/${this.props.name}/planYourWeek`} className="main__link--style">Plan When&Where</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="col-lg-10">

            </div>
        </section>
    }
}

class myTravel extends React.Component{

    render(){
        return <div>
            <Header name={this.props.match.params.name} user={this.props.match.params.user} id={this.props.match.params.id}/>
            <Main name={this.props.match.params.name} user={this.props.match.params.user} id={this.props.match.params.id}/>
            <Footer/>
        </div>
    }
}

export {myTravel}