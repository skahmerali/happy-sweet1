


import React from 'react'
import Login from '../login/Login'
import Signup from '../signup/SignUp'
import Dashboard from '../dashboard/Dashboard'
import Home from "../home/Home";
import AddShopCard from '../admin/AddShopCard'
import AppRoute from '../routes/AppRouting'
import Allorders from '../admin/Allorders'
import AcceptedOrder from '../admin/AcceptedOrder'
import DeliveringOrder from '../admin/DeliveringOrder'
import MyOrders from '../my orders/MyOrders';
import { UseGlobalState, UseGlobalStateUpdate } from "../../context/context"


import {
  BrowserRouter as Router,
  Route,
  Redirect
} from "react-router-dom";


function Navigation() {

  const globalState = UseGlobalState();
  const setGlobalState = UseGlobalStateUpdate()




  return (
    <>
      <Router>
        <AppRoute />
        {globalState.role === null ?
          <>
            <Route exact path="/">
              <Login />
            </Route>
            <Route path="/signup">
              <Signup />
            </Route>
            {/* <Route exact path="/">
              <Home />
            </Route> */}
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </>
          : null}
        {globalState.role === "user" ?
          <>
            <Route exact path="/">
              <Dashboard />
            </Route>
            <Route path="/my-all-orders">
              <MyOrders />
            </Route>
            <Route  path="*">
              <Redirect to="/" />
            </Route>
          </>
          : null}
        {globalState.role === "admin" ?
          <>
            <Route path="/AddShopCard">
              <AddShopCard />
            </Route>
            <Route exact path="/">
              <Allorders />
            </Route>
            <Route exact path="/Accepted-order">
              <AcceptedOrder />
            </Route>
            <Route exact path="/Delivered-order">
              <DeliveringOrder />
            </Route>
            <Route path="*">
              <Redirect to="/" />
            </Route>
          </>

          : null}
      </Router>
    </>
  )
}


export default Navigation;

