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
                        <Link to={"/home"} className="header__return--button"><i className="far fa-arrow-alt-circle-left"></i></Link>
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

    constructor(props) {
        super(props);
        this.state = {
            continents: "europe",
            country: "",
            cities: [],
            city: "",
            num: 0,
            countries: [],
            submit: false,
            travel: [],
            id: [],
            clickCity: -1,
            clickCountry: -1

        }
    }

    componentDidMount() {


        let ref = firebase.database().ref('user2').child('travels');

        ref.on("value", (snapshot) => {
            if (snapshot.val()) {
                const collections = snapshot.val();
                var key = Object.keys(collections);
                let travels = [];

                for(let i in collections){
                    travels = [...travels,collections[i].travel];
                }

                this.setState({
                    travel: [...travels],
                    id: [...key]
                });
            }
        });
    }

    handleOnChooseOrientation = (e,val) =>{
        this.setState({
            continents: val
        });

        fetch(`https://restcountries.eu/rest/v2/region/${val}/`).then(resp => resp.json()).then(countries => {
            this.setState({
                countries: countries
            })
        }).catch((e) => {
            console.log(e)
        })
    };

    handleOnSubmit = (e) => {
        e.preventDefault();
        if(this.state.city!=="" && this.state.country!==""){
            for(let i in this.state.travel){
                if(this.state.travel[i]===`${this.state.city},${this.state.country}`){
                    console.log("null");
                    return null;
                }
            }

            this.setState({
                submit: true,
                travel: [...this.state.travel,`${this.state.city},${this.state.country}`]
            });

            const userData = firebase.database().ref('user2').child('travels');
            userData.push ({
                travel: `${this.state.city},${this.state.country}`,
            });
        }
    };

    handleOnChooseCountry = (e,name,i) =>{
        fetch(`https://restcountries.eu/rest/v2/name/${name}/`).then(resp => resp.json()).then(country => {
            let cities = [...cities,country[0].capital];
            this.setState({
                country: country[0].name,
                cities: cities,
                clickCountry: i
            });

        }).catch((e) => {
            console.log(e)
        })
    };

    handleOnChooseCity = (e,city,i) => {

        this.setState({
            city: city,
            clickCity: i
        })
    };

    handleOnDelete = (e,i) => {
        const tempTravel = this.state.travel;
        const tempId = this.state.id;
        console.log(`${tempId[i]}/`);

        const deleteId= firebase.database().ref(`user2/travels/${tempId[i]}`);
        deleteId.remove();

        tempTravel.splice(i,1);
        tempId.splice(i,1);

        this.setState({
            travel: tempTravel,
            id: tempId
        })
    };

    render(){
        const style = {
            boxShadow: "inset 2px -5px 25px 0px rgba(43, 102, 154, 1)",
            color: "rgba(240, 255, 34,0.8)"
        };

        const countriesList = this.state.countries.map((el, i) => {
            return <tr key={i}><td onClick={e => this.handleOnChooseCountry(e,el.name,i)} className="main__link--style" style={this.state.clickCountry===i ? style : null}>{el.name}</td></tr>
        });

        const citiesList = this.state.cities.map((el, i) => {
            return <tr key={i}><td onClick={e => this.handleOnChooseCity(e,el,i)} className="main__link--style" style={this.state.clickCity===i ? style : null}>{el}</td></tr>
        });

        const travelList =this.state.travel.map((el,i) => {
            return <li key={i} className="main__submenu">
                <NavLink to={`/myTravel/${el}`} className="main__submenu--link">{el}</NavLink>
                <button className="main__list--delete" onClick={e => this.handleOnDelete(e,i)}><i className="far fa-times-circle main__list--delete--icon"></i></button>
            </li>
        });

        return <section className="main">
            <div className="col-lg-2">
                <nav className="main__nav">
                    <ul className="main__list">
                        <li className="main__link">
                            <div className="main__link--style">Plan Your Travel</div>
                        </li>
                        <li className="main__myTravel">
                            <span className="main__myTravel--text">My Travels</span>
                            <ul className="main__submenu">
                                {travelList}
                            </ul>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="col-lg-10">
                <div className="main__content">
                    <div className="main__content-map">
                        <div className="main__continents-map">
                            <div className="main__continents-map--div">
                                <div className="main__part">
                                    <div className="main__continents-map--itema" onClick={e => this.handleOnChooseOrientation(e,"americas")}>
                                        {this.state.continents==="americas" ?  <i className="fas fa-map-marker-alt main__continents-map--img"></i> : null}
                                    </div>
                                    <div className="main__continents-map--items" onClick={e => this.handleOnChooseOrientation(e,"europe")}>
                                        {this.state.continents==="europe" ?  <i className="fas fa-map-marker-alt main__continents-map--img"></i> : null}
                                    </div>
                                    <div className="main__continents-map--items" onClick={e => this.handleOnChooseOrientation(e,"asia")}>
                                        {this.state.continents==="asia" ?  <i className="fas fa-map-marker-alt main__continents-map--img"></i> : null}
                                    </div>
                                </div>
                                <div className="main__part">
                                    <div className="main__continents-map--itema" onClick={e => this.handleOnChooseOrientation(e,"americas")}>
                                    </div>
                                    <div className="main__continents-map--item" onClick={e => this.handleOnChooseOrientation(e,"africa")}>
                                        {this.state.continents==="africa" ?  <i className="fas fa-map-marker-alt main__continents-map--img"></i> : null}
                                    </div>
                                    <div className="main__continents-map--item" onClick={e => this.handleOnChooseOrientation(e,"oceania")}>
                                        {this.state.continents==="oceania" ? <i className="fas fa-map-marker-alt main__continents-map--img"></i> : null}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <form onSubmit={this.handleOnSubmit} className="main__forms">
                        <div className="main__form">
                            <div className="main__form--table">
                                <div>
                                    {this.state.countries.length !== 0 ? <table className="main__countriesList">
                                        <thead>
                                        <tr>
                                            <th className="main__form--table--header">Countries</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <div className="main__scrollList">
                                            {countriesList}
                                        </div>
                                        </tbody>
                                        <tfoot>
                                        </tfoot>
                                    </table> : null}
                                </div>
                                <div>
                                    {this.state.cities.length !== 0 ? <table className="main__countriesList">
                                        <thead>
                                        <tr>
                                            <th className="main__form--table--header">Cities</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <div className="main__scrollList">
                                            {citiesList}
                                        </div>
                                        </tbody>
                                        <tfoot>
                                        </tfoot>
                                    </table> : null}
                                </div>
                            </div>
                            {this.state.countries.length !== 0 ? <input type="submit" value="Dodaj" className="main__form--submit"/> : null}
                        </div>
                    </form>
                </div>
            </div>
        </section>
    }
}

class planTravel extends React.Component{

    render(){
        return <div>
            <Header/>
            <Main/>
            <Footer/>
        </div>
    }
}

export {planTravel}