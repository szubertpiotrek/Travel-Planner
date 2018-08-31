import React from 'react';
import ReactDOM from 'react-dom';
import * as firebase from 'firebase';
import {
    PopupboxManager,
    PopupboxContainer
} from 'react-popupbox';
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

const images = [
    '//placekitten.com/1500/500',
    '//placekitten.com/4000/3000',
    '//placekitten.com/800/1200',
    '//placekitten.com/1500/1500',
];

class Header extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            login: "piotrek"
        }
    }

    render(){
        return <header className="header">
            <div className="row">
                <div className="col-lg-4">
                    <div className="header__login">
                        <Link to={`/myTravel/${this.props.name}`} className="header__return--button"><i className="far fa-arrow-alt-circle-left"></i></Link>
                        <div className="header__login--name">
                            <h2 className="header__login--name-h2">user: {this.state.login}</h2>
                        </div>
                    </div>
                </div>
                <div className="col-lg-8">
                    <div className="header__logout">
                        <NavLink exact to={"/"} className="header__logout--link">Log out</NavLink>
                    </div>
                </div>
            </div>
        </header>
    }
}

class Main extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            name: this.props.name,
            attractionsList: [],
            restaurantsList: [],
            id: "",
            keyRestaurant: [],
            keyAttraction: [],
            clickRest: -1,
            clickAttr: -1
        }
    }

    componentDidMount(){

        let ref = firebase.database().ref('user2').child('travels');
        ref.on("value", (snapshot) => {
            if (snapshot.val()) {
                const ids = snapshot.val();
                const id = Object.keys(ids);
                console.log(id);
                for(let i in id){

                    if(snapshot.child(id[i]).val().travel===this.props.name){
                        this.setState({
                            id: id[i],
                        });
                        console.log(id[i]);

                        const keysAttraction = snapshot.child(id[i]).child('attractions').val();
                        const keyAttraction = Object.keys(keysAttraction);

                        const keysRestaurant = snapshot.child(id[i]).child('restaurants').val();
                        const keyRestaurant = Object.keys(keysRestaurant);

                        let arrKeyAttraction = [];
                        let arrKeyRestaurant = [];

                        for(let j in keyAttraction){

                            arrKeyAttraction = [...arrKeyAttraction,snapshot.child(id[i]).child('attractions').child(keyAttraction[j]).val().attraction];

                            this.setState({
                                keyAttraction: [...this.state.keyAttraction,keyAttraction[j]]
                            })
                        }
                        for(let j in keyRestaurant){

                            arrKeyRestaurant = [...arrKeyRestaurant,snapshot.child(id[i]).child('restaurants').child(keyRestaurant[j]).val().restaurant];

                            this.setState({
                                keyRestaurant: [...this.state.keyRestaurant,keyRestaurant[j]]
                            })
                        }
                        this.setState({
                            attractionsList: arrKeyAttraction,
                            restaurantsList: arrKeyRestaurant
                        });
                    }
                }
            }
        });
    }

    handleOnClickRest = (e,i) => {
        console.log("klikam")
        console.log(this.state.clicRestk)
        this.setState({
            clickRest: i
        })
    };

    handleOnClickAttr = (e,i) => {
        console.log("klikam")
        console.log(this.state.clickAttr)
        this.setState({
            clickAttr: i
        })
    };

    render(){

        const style = {
            boxShadow: "inset 2px -5px 25px 0px rgba(43, 102, 154, 1)",
            color: "rgba(240, 255, 34,0.8)"
        };

        const attractionsList =this.state.attractionsList.map((el,i) => {
            return <tr key={i} onClick={e => this.handleOnClickAttr(e,i)}><td className="main__link--style" style={this.state.clickAttr===i ? style : null}>{el}</td></tr>
        });

        const restaurantsList =this.state.restaurantsList.map((el,i) => {
            return <tr key={i}  onClick={e => this.handleOnClickRest(e,i)}><td className="main__link--style" style={this.state.clickRest===i ? style : null}>{el}</td></tr>
        });

        return <section className="main">
            <div className="col-lg-2">
                <nav className="main__nav">
                    <h1 className="main__h1">{this.props.name}</h1>
                    <ul className="main__list">
                        <li className="main__link">
                            <NavLink to={`/myTravel/${this.props.name}/attractions`} className="main__link--style">Attractions</NavLink>
                        </li>
                        <li className="main__link">
                            <NavLink to={`/myTravel/${this.props.name}/restaurants`} className="main__link--style">Restaurants</NavLink>
                        </li>
                        <li className="main__link">
                            <div className="main__link--style">Plan When&Where</div>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="col-lg-5">
                <div className="main__plans">
                    <div className="main__plan--text">plan new day <i className="fas fa-plus-circle"></i></div>
                    <div className="main__plan">
                    <table className="main__plan--list">
                        <thead>
                        <tr>
                            <th className="main__form--table--header">Day 1</th>
                        </tr>
                        </thead>
                        <tbody>
                        <div className="main__scrollList">
                            {attractionsList}
                        </div>
                        </tbody>
                        <tfoot>
                        </tfoot>
                    </table>
                    </div>
                </div>
            </div>
            <div className="col-lg-5">
                <div className="main__form--table">
                    <div>
                        <table className="main__countriesList">
                            <thead>
                            <tr>
                                <th className="main__form--table--header">Attractions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <div className="main__scrollList">
                                {attractionsList}
                            </div>
                            </tbody>
                            <tfoot>
                            </tfoot>
                        </table>
                    </div>
                    <div>
                        <table className="main__countriesList">
                            <thead>
                            <tr>
                                <th className="main__form--table--header">Restaurants</th>
                            </tr>
                            </thead>
                            <tbody>
                            <div className="main__scrollList">
                                {restaurantsList}
                            </div>
                            </tbody>
                            <tfoot>
                            </tfoot>
                        </table>
                    </div>
                </div>
            </div>
        </section>
    }
}


class planYourWeek extends React.Component{

    render(){
        return <div>
            <Header name={this.props.match.params.name}/>
            <Main name={this.props.match.params.name}/>
            <Footer/>
        </div>
    }
}

export {planYourWeek}