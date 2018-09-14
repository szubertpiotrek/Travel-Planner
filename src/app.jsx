import React from 'react';
import ReactDOM from 'react-dom';
import {Introduction} from './components/introduction.jsx';
import {Home} from "./components/home.jsx";
import {myTravel} from "./components/myTravel.jsx";
import {planTravel} from "./components/planTravel.jsx";
import {attractions} from "./components/attractions.jsx";
import {restaurants} from "./components/restaurants.jsx";
import {planYourWeek} from "./components/planYourWeek.jsx"
import {
    HashRouter,
    Route,
    Link,
    Switch,
    NavLink,
    BrowserRouter
} from 'react-router-dom';


require('./scss/main.scss');


class App extends React.Component {
   render() {
     return <BrowserRouter>
           <Switch>
               <Route exact path={'/'} component={Introduction}/>
               <Route path={'/home'} component={Home}/>
               <Route path={'/planTravel'} component={planTravel}/>
               <Route exact path={'/myTravel/:name'} component={myTravel}/>
               <Route path={'/myTravel/:name/attractions'} component={attractions}/>
               <Route path={'/myTravel/:name/restaurants'} component={restaurants}/>
               <Route path={'/myTravel/:name/planYourWeek'} component={planYourWeek}/>
           </Switch>
       </BrowserRouter>
   }
 }

document.addEventListener("DOMContentLoaded", function(){

  ReactDOM.render(
      <App />,
    document.getElementById('app')
  )

});

