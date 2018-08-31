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
            attractions: [],
            checkAttractions: [],
            lng: 0,
            lat: 0,
            name: this.props.name,
            photos: [],
            checkVal: [],
            attractionsList: [],
            id: "",
            key: []
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

                        const keys = snapshot.child(id[i]).child('attractions').val();
                        const key = Object.keys(keys);
                        let arrKey = [];
                        for(let j in key){

                            arrKey = [...arrKey,snapshot.child(id[i]).child('attractions').child(key[j]).val().attraction];

                            this.setState({
                                key: [...this.state.key,key[j]]
                            })
                        }
                            this.setState({
                                attractionsList: arrKey,
                            });
                    }
                }
            }
        });

        const city = this.state.name.split(',',1);

        fetch(`https://maps.googleapis.com/maps/api/place/textsearch/json?query=${city}+point+of+interest&language=en&key=AIzaSyCE8LD3Ng1fDgM5I0gjIckl-kSob6Tj2Sw`)
            .then(resp => resp.json()).then(attractions => {
                console.log(attractions);
                let lng=[];
                let lat=[];
                let attraction = [];

                for(let i=0;i<attractions.results.length;i++){
                    attraction = [...attraction,attractions.results[i]];
                    lng = [...lng,attractions.results[i].geometry.location.lng];
                    lat = [...lat,attractions.results[i].geometry.location.lat];

                }

            this.initMap(lat[0],lng[0]);
            this.setState({
                attractions: attraction,
                lng: lng,
                lat: lat
            });

        }).catch((e) => {
            console.log(e)
        });


    }

    initMap(val1,val2) {
        var coordinates = {
            lat: val1,
            lng: val2
        };

        this.map = new google.maps.Map(
            this.newMap, {zoom: 15, center: coordinates});

        var marker = new google.maps.Marker({position: coordinates, map: this.map});
    }

    handleOnSubmit=(e) => {
        e.preventDefault();
        let name = [];
        console.log(this.state.checkAttractions);
        for(let i in this.state.checkAttractions){
            console.log(i);
            name = [...name,this.state.checkAttractions[i].name]
        }

        this.setState({
            attractionsList: name
        });

        console.log(this.state.key.length);
        console.log(this.state.id);

        for(let i in this.state.checkAttractions) {
            const userData = firebase.database().ref('user2').child('travels').child(`${this.state.id}`).child('attractions');
            userData.push({
                attraction: this.state.checkAttractions[i].name,
            });

        }
    };

    handleOnDelete = (e,i) => {
        const tempTravel = this.state.attractionsList;
        const tempKey = this.state.key;
        console.log(tempKey[i]);
        console.log(tempTravel);
        const deleteId= firebase.database().ref(`user2/travels/${this.state.id}/attractions/${this.state.key[i]}/`);
        deleteId.remove();

        tempTravel.splice(i,1);
        tempKey.splice(i,1);

        this.setState({
            attractionsList: tempTravel,
            key: tempKey
        })
    };

    handleOnChange =(e,i) =>{

        let bool = true;
        let attraction = this.state.attractions[i];

        for(let i of this.state.attractions){
            if(this.state.checkAttractions[i]===attraction){
                bool = false;
            }
        }

        if(e.target.checked&&bool) {
            this.setState({
                checkAttractions: [...this.state.checkAttractions, this.state.attractions[i]]
            })
        }else{
            for(let i in this.state.checkAttractions){
                if(this.state.checkAttractions[i]===attraction){
                    const tempobj = this.state.checkAttractions[i];
                    const tempArr = this.state.checkAttractions;

                    tempArr.splice(tempobj.key,1);
                    this.setState({
                        checkAttractions: tempArr
                    })
                }
            }
        }
    };

    handleOnClick = (e,i) => {
        this.initMap(this.state.lat[i],this.state.lng[i]);
    };

    render(){
        console.log(this.state.key);
        console.log(this.state.attractionsList);

        const attractionsList =this.state.attractionsList.map((el,i) => {
            return <li key={i} className="main__submenu">
                <NavLink to={`/myTravel/${el}`} className="main__submenu--link" >{el}</NavLink>
                <button className="main__list--delete" onClick={e => this.handleOnDelete(e,i)}><i className="far fa-times-circle main__list--delete--icon"></i></button>
            </li>
        });

        const checkboxList = this.state.attractions.map((el,i) => {
            return <li key={i} className="main__attractions--list" onClick={e => this.handleOnClick(e,i)}>
                <div className="main__attractions--info">
                    <h2 className="main__attractions--info-text">{el.name}</h2>
                    <span className="main__attractions--info-adress">{el.formatted_address}</span>
                    <label className="main__attractions--label">
                        <input type="checkbox" onChange={e => this.handleOnChange(e,i)} className="main__attractions--checkbox"/>
                        <span className="main__attractions--checkmark"></span>
                    </label>
                </div>
                <div className="main__attractions--img">
                   <img className="main__attractions--images" src={`https://maps.googleapis.com/maps/api/place/photo?maxwidth=300&photoreference=${el.photos[0].photo_reference}&key=AIzaSyCE8LD3Ng1fDgM5I0gjIckl-kSob6Tj2Sw`}/>
                    <div className="main__attractions--info-rating">Rating:<span className="main__attractions--info-rating-val">{el.rating}</span></div>
                </div>
            </li>
        });

        return <section className="main">
            <div className="col-lg-2">
                <nav className="main__nav">
                    <h1 className="main__h1">{this.props.name}</h1>
                    <ul className="main__list">
                        <li className="main__myTravel">
                            <div className="main__attractions--link">Attractions</div>
                            <ul className="main__submenu">
                                {attractionsList}
                            </ul>
                        </li>
                        <li className="main__link">
                            <NavLink to={`/myTravel/${this.props.name}/restaurants`} className="main__link--style">Restaurants</NavLink>
                        </li>
                        <li className="main__link">
                            <NavLink to={`/myTravel/${this.props.name}/planYourWeek`} className="main__link--style">Plan When&Where</NavLink>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="col-lg-4">
                <form onSubmit={this.handleOnSubmit}>
                    <ul className="main__attractions--form">
                        {checkboxList}
                    </ul>
                    <input type="submit" value="Dodaj" className="main__attractions--button"/>
                </form>

            </div>
            <div className="col-lg-6">
                <div className="main__attractions--map" ref={map => this.newMap = map}></div>
            </div>
        </section>
    }
}


class attractions extends React.Component{

    render(){
        return <div>
            <Header name={this.props.match.params.name}/>
            <Main name={this.props.match.params.name}/>
            <Footer/>
        </div>
    }
}

export {attractions}