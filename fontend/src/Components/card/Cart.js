import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import  BaseURL  from '../Url/BaseURL'
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCart';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';
import TextField from '@material-ui/core/TextField';
import axios from 'axios'
import { yellow } from '@material-ui/core/colors';


const useStyles = makeStyles((theme) => ({
    root: {
        maxWidth: 345,
        width: 145,
        height: 100,
    },
    media: {
        height: 200,
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
        width: "20%",
        textAlign: 'center'
    },
    input: {
        width: "100%",
        height: "35px",
        border: "none",
        borderRadius: '5px',
        backgroundColor: "#3f51b5",
        opacity: 0.9,
        color: "#ffffff",
        paddingLeft: "5px",
        marginBottom: "10px"
    },
    button: {
        color: "#3f51b5",
        border: 'none',
        backgroundColor: 'none',
    },
}));

export default function Cart({ cart, setCart }) {
    const classes = useStyles();
    const [open, setOpen] = React.useState(false);

    const handleOpen = () => {
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    function SendOrder(event) {
        event.preventDefault()

        var name = document.getElementById('name').value
        var email = document.getElementById('email').value.toLowerCase()
        var phone = document.getElementById('phone').value
        var address = document.getElementById('address').value

        // console.log(userEmail)
        var orderData = {
            name: name,
            email: email,
            phone: phone,
            address: address,
            total: document.getElementById('Totalcost').innerHTML,
            orders: cart,
        }
        // console.log("order data ..... .>>>>>>>>>>>>>>>>..... ", orderData)
        axios({
            method: 'post',
            url: BaseURL + '/order',
            data: orderData,
            withCredentials: true

        })
            .then(function (response) {
                // console.log(response);
                if (response.data.status === 200) {
                    alert(response.data.message)
                } else {
                    alert(response.data.message)
                    // console.log(response.data)
                }
            })
            .catch(function (error) {
                alert(error.response.data.message)

            });


        return false;
    }

    const getTotalSum = () => {
        return cart.reduce(
            (sum, { price, quantity }) => sum + price * quantity,
            0
        );
    };


    const setQuantity = (product, amount) => {
        const newCart = [...cart];
        newCart.find(
            (item) => item.title === product.title
        ).quantity = amount;
        setCart(newCart);
    };

    const removeFromCart = (productToRemove) => {
        setCart(
            cart.filter((product) => product !== productToRemove)
        );
    };

    return (
        <>
            <h1>Cart</h1>
            <Container maxWidth="xl" >
                <div style={{ margin: "15px", display: 'flex', justifyContent: 'space-between', textAlign: 'center' }}>
                    <div className={classes.header}><h2>Image</h2></div>
                    <div className={classes.header}><h2>Sweet Name</h2></div>
                    <div className={classes.header}><h2>Sweet Price</h2></div>
                    <div className={classes.header}><h2>Sweet Quantity in kg</h2></div>
                    <div className={classes.header}><h2>action</h2></div>
                </div>
                <div>
                    {cart.map((product, idx) => (
                        <Card key={idx} value={product.id}  >    {/* style={{ display: "inline-block", margin: "15px" }} */}
                            <div style={{ margin: "15px", display: 'flex', justifyContent: 'space-between' }}>

                                <div className={classes.header} >
                                    <CardMedia
                                        className={`products ${classes.root}`}
                                        // className={classes.media}
                                        image={product.cartimage}
                                        alt={product.cartimage}
                                        title="Contemplative Reptile"
                                    />
                                </div>
                                <div className={classes.header}>
                                    <Typography style={{ lineHeight: "100px", padding: "10px" }}  variant="h5" id="title" component="h2">
                                        {product.title}
                                    </Typography>
                                </div>
                                <div className={classes.header}>
                                    <Typography style={{ lineHeight: "100px", padding: "10px" }} id="price" variant="body2" component="h2">
                                        {product.price}
                                    </Typography>
                                </div>
                                <div className={classes.header}>
                                    <Typography style={{ lineHeight: "100px", padding: "10px" }} id="price" variant="body2" component="h2" onChange={(e) =>
                                        setQuantity(
                                            product,
                                            parseInt(e.target.value)
                                        )
                                    }>
                                        {product.quantity + "kg"}
                                    </Typography>

                                </div>
                                <div style={{ width: "20%", textAlign: '' }}>
                                    <CardActions className={classes.header}>
                                        <Button style={{ lineHeight: "100px", padding: "10px" }} className={classes.header} size="small" onClick={() => removeFromCart(product)} color="primary">
                                            Remove
                                    </Button>
                                    </CardActions>
                                </div>
                            </div>
                        </Card>
                    ))}
                    <div style={{ width: "100%", display: "flex", justifyContent: 'space-around', color: "red", fontSize: 25, padding: 10 }}>


                        <Button style={{ color: 'black' }} onClick={handleOpen}  ><AddShoppingCartIcon />  Order Now</Button>
                        <Modal
                            aria-labelledby="transition-modal-title"
                            aria-describedby="transition-modal-description"
                            className={classes.modal}
                            open={open}
                            onClose={handleClose}
                            closeAfterTransition
                            BackdropComponent={Backdrop}
                            BackdropProps={{
                                timeout: 500,
                            }}
                        >
                            <Fade in={open}>
                                <div className={classes.paper}>
                                    <h2 className={classes.button}>Order Info & address</h2>
                                    <form noValidate autoComplete="off" onSubmit={SendOrder}>
                                        <input className={classes.input} id="name" type="text" placeholder="Type name" required /> <br />
                                        <input className={classes.input} id="email" type="text" placeholder="Type Email" required /> <br />
                                        <input className={classes.input} id="phone" type="text" placeholder="Type Phone Number" required /> <br />
                                        <input className={classes.input} id="address" type="text" placeholder="Type Complete and correct address" required /><br />
                                        <button type="submit" className={classes.button}> Send Order </button>
                                    </form>
                                </div>
                            </Fade>
                        </Modal>
                        <div id="Totalcost" >Total Cost: ${getTotalSum()}</div>
                    </div>
                </div>
            </Container>

        </>
    );
}