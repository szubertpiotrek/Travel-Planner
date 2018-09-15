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
     return <HashRouter>
           <Switch>
               <Route exact path={'/'} component={Introduction}/>
               <Route path={'/:id/:user/home'} component={Home}/>
               <Route exact path={'/:id/:user/planTravel'} component={planTravel}/>
               <Route exact path={'/:id/:user/myTravel/:name'} component={myTravel}/>
               <Route path={'/:id/:user/myTravel/:name/attractions'} component={attractions}/>
               <Route path={'/:id/:user/myTravel/:name/restaurants'} component={restaurants}/>
               <Route path={'/:id/:user/myTravel/:name/planYourWeek'} component={planYourWeek}/>
           </Switch>
       </HashRouter>
   }
 }

document.addEventListener("DOMContentLoaded", function(){

  ReactDOM.render(
      <App />,
    document.getElementById('app')
  )

});

