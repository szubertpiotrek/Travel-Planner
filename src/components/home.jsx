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

var config = {
    apiKey: "AIzaSyBKHgtr0EAgXkczl_ftsIDlRPFyyUOHwuM",
    authDomain: "travel-planner-38a29.firebaseapp.com",
    databaseURL: "https://travel-planner-38a29.firebaseio.com",
    projectId: "travel-planner-38a29",
    storageBucket: "",
    messagingSenderId: "288533296906"
};

firebase.initializeApp(config);


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

    constructor(props) {
        super(props);
        this.state = {
            travel: [],
            style: "none"
        }
    }

    componentDidMount(){
        let ref = firebase.database().ref('user2').child('travels');

        ref.on("value", snapshot => {
            if (snapshot.val()) {
                const collections = snapshot.val();

                let travels = [];

                for(let i in collections){
                    travels = [...travels,collections[i].travel];
                }

                this.setState({
                    travel: [...travels]
                });
            }
        });
    }

    handleOnClick =() => {
        this.setState({
            style: this.state.style==="none" ? "block" : "none"
        })
    };

    render(){
        const style = {
            display: this.state.style,
            padding: "20px",
        };

        const rotate = {
            transition: "0.4s",
            transform: "rotate(180deg)"
        }
        const travelList =this.state.travel.map((el,i) => {
            return <li key={i} style={style} className="main__submenu"><NavLink to={`/myTravel/${el}`} className="main__submenu--link" >{el}</NavLink></li>
        });

        return <section className="main">
            <div className="col-lg-2">
                <nav className="main__nav">
                    <ul className="main__list">
                        <li className="main__link">
                            <NavLink to={"/planTravel"} className="main__link--style">Plan Your Travel</NavLink>
                        </li>
                        <li className="main__myTravel" onClick={this.handleOnClick}>
                            <span className="main__myTravel--text">My Travels</span><i className="fas fa-angle-up" style={this.state.style==="none" ? rotate : null}></i>
                            <ul className="main__submenu">
                                {travelList}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="col-lg-10">

            </div>
        </section>
    }
}

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
                        <div className="header__login--name">
                            <h2 className="header__login--name-h2">user:  {this.state.login}</h2>
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

class Home extends React.Component{

    render(){
        return <div>
            <Header/>
            <Main/>
            <Footer/>
        </div>
    }
}

export {Footer}
export {Header}
export {Home}