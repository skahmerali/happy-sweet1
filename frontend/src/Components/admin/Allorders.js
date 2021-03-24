import React, { useEffect, useState } from 'react'
import axios from 'axios'
import BaseURL from '../Url/BaseURL'
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import Card from '@material-ui/core/Card';
import { makeStyles } from '@material-ui/core/styles';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import { Table } from '@material-ui/core';
import CardActions from '@material-ui/core/CardActions';
import { UseGlobalState, UseGlobalStateUpdate } from '../../context/context'



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
    },
    header: {
        width: "15%",
        textAlign: 'center',
        margin: '0px'
    }
}));


export default function Allorders() {
    const globalState = UseGlobalState()
    const globalStateUpdate = UseGlobalStateUpdate()

    const classes = useStyles()

    const [order, setorder] = useState([])

    useEffect(() => {

        axios({
            method: "get",
            url: BaseURL + '/admin/getorders/review',
            withCredentials: true
        })
            .then(function (response) {

                if (response.status === 200) {
                    // console.log(response.data.data)
                    // console.log("lkdflasdfkj ", response.data.data)
                    setorder(response.data.data)

                }
            })
            .catch(function (error) {
                console.log(error)

            })
    }, [])


    const AcceptOrder = (product) => {


        axios({
            method: "post",
            url: BaseURL + '/admin/getorders/updatestatus',
            data: {
                id: product._id,
                status: 'Your Order Accepeted'
            },
            withCredentials: true
        })
            .then(function (response) {

                if (response.status === 200) {
                    // console.log(response.data.data)
                    // console.log("lkdflasdfkj ", response.data.data)
                    console.log(response.data.message)
                    alert(response.data.message)

                }
            })
            .catch(function (error) {
                console.log(error)

            })

    }


    const removeFromCart = (productToRemove) => {
        setorder(
            order.filter((product) => product !== productToRemove)
        );
    };

    console.log(globalState)

    return (
        <div style={{ margin: 20 }}>

            <h1>All Order With delever detail</h1>
            <div maxWidth="xl">
                <div style={{ border: '2px solid black', borderRadius: '10px' }}>
                    {order.map((product, idx) => {
                        return <div style={{ border: '2px solid black', backgroundColor: 'pink', margin: 20, padding: 20, borderRadius: 10 }} key={idx} value={product.id}>


                            <h1>Order Detail</h1>
                            <div style={{ margin: "15px", display: 'flex', justifyContent: 'space-between', height: 70 }}>
                                <div className={classes.header}><h2>Image</h2></div>
                                <div className={classes.header}><h2>Sweet Name</h2></div>
                                <div className={classes.header}><h2>sweet description</h2></div>
                                <div className={classes.header}><h2>Sweet Price</h2></div>
                                <div className={classes.header}><h2>Sweet Quantity in kg</h2></div>
                                <div className={classes.header}><h2>Total</h2></div>
                            </div>

                            {
                                product.orders.map((order, index) => {
                                    {/* console.log(order) */ }

                                    return (
                                        <>
                                            <div key={index} value={order.id}  >

                                                <div style={{ margin: "0px", display: 'flex', justifyContent: 'space-between', textAlign: 'center', height: 70 }}>

                                                    <div className={classes.header} >
                                                        <img
                                                            className={`products ${classes.root}`}
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
                                })
                            }

                            <h1>Reciever Detail</h1>
                            <div style={{ padding: 20, textAlign: 'left' }} >
                                <div>
                                    Name:  {product.name}
                                </div> <br />
                                <div>
                                    Phone Number:  {product.phone}
                                </div> <br />
                                <div>
                                    Email: {product.email}
                                </div> <br />
                                <div>
                                    Address: {product.address}
                                </div> <br />
                                <div>
                                    {product.total}
                                </div> <br />
                                <div>
                                    <button
                                        style={{ margin: '20px', backgroundColor: 'black', border: 'none', padding: '10px', borderRadius: '4px', color: '#ffff' }}
                                        size="small" onClick={() => AcceptOrder(product)} color="primary">
                                        Accept Order
                                    </button>
                                    <button
                                        style={{ margin: '20px', backgroundColor: 'black', border: 'none', padding: '10px', borderRadius: '4px', color: '#ffff' }}
                                        size="small" onClick={() => removeFromCart(product)} color="primary">
                                        Remove Order
                                    </button>
                                </div>
                            </div>
                        </div>
                    })}



                </div>
            </div>
        </div>
    )
}
