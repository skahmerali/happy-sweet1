import React, { useEffect, useState } from 'react'
import BaseURL from '../Url/BaseURL'
import { makeStyles } from '@material-ui/core/styles';
import Moment from 'react-moment';
import 'moment-timezone';
import axios from 'axios'





const useStyles = makeStyles((theme) => ({
  root: {
    maxWidth: 345,
    width: 70,
    height: 60,
  },
  media: {
    height: 100,
  },
  fontSize: {
    fontSize: 18,
  },
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    background:'black'
  },
  header: {
    width: "15%",
    textAlign: 'center',
    margin: '0px',
  
  }
}));



export default function MyOrders() {
  const classes = useStyles()


  const [order, setOrder] = useState([])


  useEffect(() => {

    axios({
      method: "get",
      url: BaseURL + '/getorders',
      withCredentials: true
    })
      .then(function (response) {
        console.log(response.data)
        if (response.status === 200) {
          setOrder(response.data.data)
        }
      })
      .catch(function (response) {
        console.log(response)
      })

  }, [])


  console.log(order)

  return (
    <div style={{ margin: 20 }}>

      <h1 style={{ color: 'black' }}> Orders Detail</h1>
      <div maxWidth="xl">
      
        <div style={{  borderRadius: '10px' }}>
          {order.map((product, idx) => {
            return <div key={idx} style={{ border: '2px solid black', backgroundColor: 'pink', margin: 20, padding: 20, borderRadius: 10 }} >
              <div style={{ margin: "15px", display: 'flex', justifyContent: 'space-between', height: 70 }}>
                <div className={classes.header}><h3>Image</h3></div>
                <div className={classes.header}><h3>Sweet Name</h3></div>
                <div className={classes.header}><h3>sweet description</h3></div>
                <div className={classes.header}><h3>Sweet Price</h3></div>
                <div className={classes.header}><h3>Sweet Quantity in kg</h3></div>
                <div className={classes.header}><h3>total</h3></div>
              </div>
              {/* <div>
                Name:  {product.createdOn}
              </div> <br />
              <div>
                <b>Ordered Time</b>
                <br />
                <Moment format="dddd, MMMM Do YYYY, h:mm:ss a">{product.createdOn}</Moment>
              </div>
              <br /> */}
              <div>
                <p style={{ color: 'red' }}><b>Order Status : </b> {product.status} </p>
              </div>
              <div style={{ color: 'red' }}>
                <b>Ordered Time : </b>
                <Moment fromNow>{product.createdOn}</Moment>
              </div>
              <br />

              {
                product.orders.map((order, index) => {
                  {/* console.log(order) */ }

                  return (
                    <>
                      <div key={index}>

                        <div style={{ margin: "0px", display: 'flex', justifyContent: 'space-between', textAlign: 'center', height: 70 }}>

                          <div className={classes.header} >
                            <img
                              className={`products ${classes.root}`}
                              style={{ borderRadius: '5px' }}
                              src={order.cartimage}
                              alt={order.cartimage}
                            />
                          </div>
                          <div className={classes.header}>
                            <span style={{ lineHeight: "100px", padding: "10px" }} variant="h5" id="title" component="h2">
                              {order.title}
                            </span>
                          </div>
                          <div className={classes.header}>
                            <span style={{ lineHeight: "100px", padding: "10px" }} variant="h5" id="title" component="h2">
                              {order.description}
                            </span>
                          </div>
                          <div className={classes.header}>
                            <span style={{ lineHeight: "100px", padding: "10px" }} id="price" variant="body2" component="h2">
                              {order.price}
                            </span>
                          </div>
                          <div className={classes.header}>
                            <span style={{ lineHeight: "100px", padding: "10px" }} id="price" variant="body2" component="h2">
                              {order.quantity}kg
                            </span>
                          </div>
                          <div className={classes.header}>
                            <span style={{ lineHeight: "100px", padding: "10px" }} id="price" variant="body2" component="h2">
                              {order.quantity * order.price}
                            </span>
                          </div>
                        </div>
                      </div>

                    </>
                  )
                })}
              <div style={{ textAlign: 'right', paddingRight: 90 }}>
                <h2>{product.total}</h2>
              </div>
            </div>
          })}



        </div>
      </div>
    </div>
  )
}
