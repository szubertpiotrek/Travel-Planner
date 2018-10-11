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

class Header extends React.Component{

    handleOnLogOut = () => {
        firebase.auth().signOut()
    };

    render(){
        return <header className="header">
            <div className="row">
                <div className="col-lg-4">
                    <div className="header__login">
                        <Link to={`/${this.props.id}/${this.props.user}/myTravel/${this.props.name}`} className="header__return--button"><i className="far fa-arrow-alt-circle-left"></i></Link>
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

    constructor(props){
        super(props);
        this.state = {
            name: this.props.name,
            attractionsList: [],
            restaurantsList: [],
            id: "",
            keyRestaurant: [],
            keyAttraction: [],
            checkRestaurantList: [],
            checkAttractionList: [],
            clickRest: [],
            clickAttr: [],
            keyDay: [],
            checkDayList:[],
            dayList: [],
            day: []
        }
    }

    componentDidMount(){
        let ref = firebase.database().ref(`${this.props.id}`).child('travels');
        ref.on("value", (snapshot) => {
            if (snapshot.val()) {
                const ids = snapshot.val();
                const id = Object.keys(ids);
                for(let i in id){

                    if(snapshot.child(id[i]).val().travel===this.props.name){
                        this.setState({
                            id: id[i],
                        });

                        const keysDay = snapshot.child(id[i]).child('days').val();

                        if(keysDay!==null){

                            const keyDay = Object.keys(keysDay);

                            let arrKeyDay = [];

                            let arrCheckDay = [];

                            for(let j in keyDay){

                                arrKeyDay = [...arrKeyDay,snapshot.child(id[i]).child('days').child(keyDay[j]).val().day];
                                arrCheckDay = [...arrCheckDay, snapshot.child(id[i]).child('days').child(keyDay[j]).val().day];

                            }

                            if(arrKeyDay!==-1){
                                this.setState({
                                    keyDay: [...keyDay],
                                    checkDayList: [...arrCheckDay],
                                    day: [...arrKeyDay]
                                });
                            }

                        }else{
                            this.setState({
                                checkDayList: [[""]],
                                day: [[""]]
                            });
                        }
                    }
                }
            }
        });
    }

    componentWillMount(){

        let ref = firebase.database().ref(`${this.props.id}`).child('travels');
        ref.on("value", (snapshot) => {
            if (snapshot.val()) {
                const ids = snapshot.val();
                const id = Object.keys(ids);
                for(let i in id){

                    if(snapshot.child(id[i]).val().travel===this.props.name){
                        this.setState({
                            id: id[i],
                        });

                        const keysAttraction = snapshot.child(id[i]).child('attractions').val();
                        const keyAttraction = Object.keys(keysAttraction);

                        const keysRestaurant = snapshot.child(id[i]).child('restaurants').val();
                        const keyRestaurant = Object.keys(keysRestaurant);

                        let arrKeyAttraction = [];
                        let arrKeyRestaurant = [];

                        let arrCheckAttraction = [];
                        let arrCheckRestaurant = [];

                        for(let j in keyAttraction){

                            arrKeyAttraction = [...arrKeyAttraction,snapshot.child(id[i]).child('attractions').child(keyAttraction[j]).val().attraction];
                            arrCheckAttraction = [...arrCheckAttraction,(snapshot.child(id[i]).child('attractions').child(keyAttraction[j]).val().check === false ? false : true)];

                        }
                        for(let j in keyRestaurant){

                            arrKeyRestaurant = [...arrKeyRestaurant,snapshot.child(id[i]).child('restaurants').child(keyRestaurant[j]).val().restaurant];
                            arrCheckRestaurant = [...arrCheckRestaurant,(snapshot.child(id[i]).child('restaurants').child(keyRestaurant[j]).val().check === false ? false : true)];

                        }

                        this.setState({
                            keyAttraction: [...keyAttraction],
                            keyRestaurant: [...keyRestaurant],
                            attractionsList: arrKeyAttraction,
                            restaurantsList: arrKeyRestaurant,
                            checkRestaurantList: [...arrCheckRestaurant],
                            checkAttractionList: [...arrCheckAttraction],
                            clickRest: [...arrCheckRestaurant],
                            clickAttr: [...arrCheckAttraction]
                        });
                    }
                }
            }
        });
    }

    handleOnAddDay = () => {
        this.setState({
            day: [...this.state.day,[""]],
            checkDayList: [...this.state.checkDayList,[""]]
        })
    };

    handleOnClickRest = (e,i) => {

        let checkRestaurantList = this.state.checkRestaurantList;

        checkRestaurantList[i] = false;

        this.setState({
            checkRestaurantList: [...checkRestaurantList],
        })
    };

    handleOnClickAttr = (e,i) => {

        let checkAttractionList = this.state.checkAttractionList;

        checkAttractionList[i]= checkAttractionList[i] === true? false : true;

        this.setState({
            checkAttractionList: [...checkAttractionList],
        })
    };

    handleOnCheck = (e,i) => {

        let checkRest = this.state.checkRestaurantList;
        let checkAttr = this.state.checkAttractionList;

        let clickRest = this.state.clickRest;
        let clickAttr = this.state.clickAttr;

        let checkDayList = this.state.checkDayList;

        let newCheckDayList = checkDayList[i];

        for(let j in checkRest){
            if(checkRest[j]===false){
                if(this.state.checkRestaurantList[j] === false && this.state.clickRest[j] !== false){
                    newCheckDayList.push(this.state.restaurantsList[j]);
                }
                clickRest[j]=false;
            }
        }

        for(let j in checkAttr){
            if(checkAttr[j]===false){
                if(this.state.checkAttractionList[j] === false && this.state.clickAttr[j] !== false){
                    newCheckDayList.push(this.state.attractionsList[j]);
                }
                clickAttr[j]=false;
            }
        }

        this.setState({
            clickRest: [...clickRest],
            clickAttr: [...clickAttr],
            checkDayList: checkDayList
        })

    };

    handleOnDeleteDay = (e,i) => {
        const tempDay = this.state.checkDayList;
        const tempKey = this.state.day;
        const tempKeyDay = this.state.keyDay;

        let checkAttr = this.state.clickAttr;
        let checkRest = this.state.clickRest;
        let checkRestList = this.state.checkRestaurantList;
        let checkAttrList = this.state.checkAttractionList;

        for(let j in tempDay[i]){
            this.state.restaurantsList.forEach((el,k) =>{
                if(tempDay[i][j]===this.state.restaurantsList[k]){
                    checkRest[k]=true;
                    checkRestList[k]=true;
                    const userDataCheckRest = firebase.database().ref(`${this.props.id}/travels/${this.state.id}/restaurants/${this.state.keyRestaurant[k]}/`);
                    userDataCheckRest.set({
                        restaurant: this.state.restaurantsList[k],
                        check: checkRest[k]
                    });

                }
            });
        }

        for(let j in tempDay[i]){
            this.state.attractionsList.forEach((el,k)=>{
                if(tempDay[i][j]===this.state.attractionsList[k]){
                    checkAttr[k] = true;
                    checkAttrList[k] = true;
                    const userDataCheckAttr = firebase.database().ref(`${this.props.id}/travels/${this.state.id}/attractions/${this.state.keyAttraction[k]}/`);
                    userDataCheckAttr.set({
                        attraction: this.state.attractionsList[k],
                        check: checkAttr[k]
                    });
                }
            })
        }

        const deleteDay= firebase.database().ref(`${this.props.id}/travels/${this.state.id}/days/${this.state.keyDay[i]}/`);
        deleteDay.remove();

        tempDay.splice(i,1);
        tempKey.splice(i,1);
        tempKeyDay.splice(i,1);
        console.log(tempDay);
        if(tempDay.length>0){
            this.setState({
                checkDayList: tempDay,
                day: tempKey,
                clickAttr: checkAttr,
                clickRest: checkRest,
                checkAttractionList: checkAttrList,
                checkRestaurantList: checkRestList,
                keyDay: tempKeyDay
            })
        }else{
            this.setState({
                checkDayList: [[""]],
                day: [[""]],
                clickAttr: checkAttr,
                clickRest: checkRest,
                checkAttractionList: checkAttrList,
                checkRestaurantList: checkRestList,
                keyDay: tempKeyDay
            })
        }

    };

    handleOnDelete = (e,j,i) => {
        const tempDay = this.state.checkDayList;

        let checkAttr = this.state.clickAttr;
        let checkRest = this.state.clickRest;
        let checkAttractionList = this.state.checkAttractionList;
        let checkRestaurantList = this.state.checkRestaurantList;

        this.state.restaurantsList.forEach((el,k) =>{
            if(tempDay[i][j]===this.state.restaurantsList[k]){
                checkRest[k]=true;
                checkRestaurantList[k]=true;
                const userDataCheckRest = firebase.database().ref(`${this.props.id}/travels/${this.state.id}/restaurants/${this.state.keyRestaurant[k]}/`);
                userDataCheckRest.set({
                    restaurant: this.state.restaurantsList[k],
                    check: checkRest[k]
                });

            }
        });
        console.log(tempDay[i]);

        this.state.attractionsList.forEach((el,k)=>{
            if(tempDay[i][j]===this.state.attractionsList[k]){
                checkAttr[k] = true;
                checkAttractionList[k] = true;
                const userDataCheckAttr = firebase.database().ref(`${this.props.id}/travels/${this.state.id}/attractions/${this.state.keyAttraction[k]}/`);
                userDataCheckAttr.set({
                    attraction: this.state.attractionsList[k],
                    check: checkAttr[k]
                });
            }
        })


        tempDay[i].splice(j,1);
        console.log(tempDay[i]);

        this.setState({
            checkDayList: tempDay,
            clickAttr: checkAttr,
            clickRest: checkRest,
            checkAttractionList: checkAttractionList,
            checkRestaurantList: checkRestaurantList
        })
    };

    handleOnSaveDay = () => {
        console.log(this.state.checkDayList);
        for (let i in this.state.checkDayList) {

            const userDataPlan = firebase.database().ref(`${this.props.id}`).child('travels').child(`${this.state.id}`).child('days');
            userDataPlan.push({
                day: this.state.checkDayList[i]
            });

            if (this.state.attractionsList.length > 0) {
                this.state.checkDayList[i].forEach((el) => {
                    for(let k in this.state.attractionsList){
                        if (el === this.state.attractionsList[k]) {
                            const userDataCheckAttr = firebase.database().ref(`${this.props.id}/travels/${this.state.id}/attractions/${this.state.keyAttraction[k]}/`);
                            userDataCheckAttr.set({
                                attraction: this.state.attractionsList[k],
                                check: this.state.checkAttractionList[k]
                            });
                        }
                    }
                })

            }

            if(this.state.restaurantsList.length>0){
                this.state.checkDayList[i].forEach((el) => {
                    for(let k in this.state.restaurantsList){
                        if(el===this.state.restaurantsList[k]) {
                            const userDataCheckRest = firebase.database().ref(`${this.props.id}/travels/${this.state.id}/restaurants/${this.state.keyRestaurant[k]}/`);
                            userDataCheckRest.set({
                                restaurant: this.state.restaurantsList[k],
                                check: this.state.checkRestaurantList[k]
                            });
                        }
                    }
                })

            }

            const deleteDay= firebase.database().ref(`${this.props.id}/travels/${this.state.id}/days/${this.state.keyDay[i]}/`);
            deleteDay.remove();
        }

    };

    render(){
        const style = {
            boxShadow: "inset 2px -5px 25px 0px rgba(43, 102, 154, 1)",
            color: "rgba(240, 255, 34,0.8)"
        };

        const dayPlanStyle = {
            width: this.state.day.length<=4 ? "300px" : `${1200/this.state.day.length}px`
        };

        const planYourDay = this.state.day.map((el1,i) => {
            console.log(this.state.day[i]);
            console.log(this.state.checkDayList[i]);
            const dayPlanList = this.state.checkDayList[i].map((el2,j) => {
                if(j>0) {
                    return <div key={j} className="main__plan--list-items">
                        <div className="main__plan--list-item">{el2}</div>
                        <i className="far fa-times-circle main__plan--list-delete-item" onClick={e => this.handleOnDelete(e, j, i)}></i>
                    </div>
                }
            });

            return <div className="main__plan--list" key={i}>
                <div className="main__plan--list-title" style={dayPlanStyle}>
                    <span className="main__plan--list-title-span">Day {i+1}</span>
                    <button className="main__plan--list-delete" onClick={e => this.handleOnDeleteDay(e,i)}><i className="far fa-times-circle main__plan--list-delete-icon"></i></button>
                </div>
                <div className="main__plan--list-info" onClick={e => this.handleOnCheck(e,i)} style={dayPlanStyle}>
                    {dayPlanList}
                </div>
            </div>

        });

        const attractionsList = this.state.attractionsList.map((el,i) => {
            return <tr key={i} onClick={e => this.handleOnClickAttr(e,i)}>
                <td className="main__plan--link-style" style={this.state.checkAttractionList[i]===false ? style : null}>
                    <span>{el}</span>
                    {this.state.checkAttractionList[i] === false && this.state.clickAttr[i] === false ? <i className="fas fa-times main__plan--link-false"></i> : <i className="fas fa-check main__plan--link-check"></i>}
                </td>
            </tr>
        });

        const restaurantsList =this.state.restaurantsList.map((el,i) => {
            return <tr key={i}  onClick={e => this.handleOnClickRest(e,i)}>
                <td className="main__plan--link-style" style={this.state.checkRestaurantList[i]===false ? style : null}>
                    <span>{el}</span>
                    {this.state.checkRestaurantList[i] === false && this.state.clickRest[i] === false ? <i className="fas fa-times main__plan--link-false"></i> : <i className="fas fa-check main__plan--link-check"></i>}
                </td>
            </tr>
        });

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
                            <div className="main__link--style">Plan When&Where</div>
                        </li>
                    </ul>
                </nav>
            </div>
            <div className="col-lg-10">
                <div className="main__plans">
                    <div className="main__plan--table">
                        <div>
                            <table className="main__plan-day--table">
                                <thead>
                                <tr>
                                    <th className="main__form--table--header">Attractions</th>
                                </tr>
                                </thead>
                                <tbody>
                                <div className="main__plan--table-scroll">
                                    {attractionsList}
                                </div>
                                </tbody>
                                <tfoot>
                                </tfoot>
                            </table>
                        </div>
                        <div>
                            <table className="main__plan-day--table">
                                <thead>
                                <tr>
                                    <th className="main__form--table--header">Restaurants</th>
                                </tr>
                                </thead>
                                <tbody>
                                <div className="main__plan--table-scroll">
                                    {restaurantsList}
                                </div>
                                </tbody>
                                <tfoot>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <button className="main__plan--text" onClick={this.handleOnAddDay}>plan new day <i className="fas fa-plus-circle"></i></button>
                    <div className="main__plan--list-scroll">
                        {planYourDay}
                    </div>
                    <div>
                        <button onClick={this.handleOnSaveDay} className="main__attractions--button">Save</button>
                    </div>
                </div>
            </div>
        </section>
    }
}


class planYourWeek extends React.Component{

    render(){
        return <div>
            <Header name={this.props.match.params.name} id={this.props.match.params.id} user={this.props.match.params.user}/>
            <Main name={this.props.match.params.name} id={this.props.match.params.id} user={this.props.match.params.user}/>
            <Footer/>
        </div>
    }
}

export {planYourWeek}