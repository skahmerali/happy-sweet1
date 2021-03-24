
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import Icon from '@material-ui/core/Icon';
import LogoutRequest from '../logout/Logout'
import { UseGlobalState, UseGlobalStateUpdate } from "../../context/context"
import CheckOut from '../checkOut/CheckOut'



import {
  Link,
  useHistory
} from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },

}));



function AppRoute() {

  const globalState = UseGlobalState();
  const setGlobalState = UseGlobalStateUpdate()


  const classes = useStyles();



  let history = useHistory()



  return (
    <>
      <form>
        <AppBar position="static" style={{backgroundColor:'black'}} >
          <Toolbar>
            {(globalState.role === null) ?
              <>
                {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"> <MenuIcon /> </IconButton> */}
                <Typography variant="h6" className={classes.title}> Happy-Sweet </Typography>
                <Link style={{ color: 'white', textDecoration: 'none' }} to="/">  <Button color="inherit" style={{ textTransform: 'capitalize'}}>Login</Button></Link>
                <Link style={{ color: 'white', textDecoration: 'none' }} to="/signup">  <Button color="inherit"  style={{ textTransform: 'capitalize'}}>Sign up</Button></Link>
                {/* <Link style={{ color: 'black' }} to="/">  <Button color="inherit">Home</Button></Link> */}
                {/* <CheckOut /> */}
              </>
              : null}
            {(globalState.role === "user") ?
              <>
                {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"> <MenuIcon /> </IconButton> */}
                <Typography variant="h6" className={classes.title}>  Happy-Sweet (Order Place) </Typography>
                <Link style={{ textDecoration: 'none' }} to="/" ><Button style={{ color: 'white',fontSize:'30px', textDecoration: 'none', textTransform: 'capitalize' }}>Dashboard</Button></Link>
                <Link style={{ textDecoration: "none" }} to="/my-all-orders" ><Button style={{ backgroundColor: 'pink',color: 'white',fontSize:'30px', textDecoration: 'none', textTransform: 'capitalize' }}>my orders</Button></Link>
                <LogoutRequest />

              </> : null}


            {(globalState.role === "admin") ?
              <>
                {/* <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu"> <MenuIcon /> </IconButton> */}
                <Typography variant="h6" className={classes.title}>  Happy-Sweet (Admin pannel)  </Typography>
                <Link style={{ textDecoration: 'none' }} to="/">  <Button style={{ color: 'white', textDecoration: 'none', textTransform: 'capitalize' }}>Allorders</Button></Link>
                <Link style={{ textDecoration: 'none' }} to="/AddShopCard">  <Button style={{ color: 'white', textDecoration: 'none', textTransform: 'capitalize' }}>AddShop Card</Button></Link>
                <Link style={{ textDecoration: 'none' }} to="/Accepted-order">  <Button style={{ color: 'white', textDecoration: 'none', textTransform: 'capitalize' }}>Accepted Order</Button></Link>
                <Link style={{ textDecoration: 'none' }} to="/Delivered-order">  <Button style={{ color: 'white', textDecoration: 'none', textTransform: 'capitalize' }}>Delivered Order</Button></Link>
                <LogoutRequest />

              </>
              : null}
          </Toolbar>
        </AppBar>



      </form>


    </>
  )

}


export default AppRoute




