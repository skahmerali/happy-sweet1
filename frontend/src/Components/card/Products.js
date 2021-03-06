import React, { useState, useEffect } from 'react'
import { makeStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import axios from 'axios'
import { UseGlobalState, UseGlobalStateUpdate } from '../../context/context'
import Container from '@material-ui/core/Container';


const useStyles = makeStyles({
    root: {
        maxWidth: 300,
        width: 300,
    },
    media: {
        height: 160,
    },
    fontSize: {
        fontSize: 18,
    }
});


export default function Products({ setCart, cart }) {
    const golobalState = UseGlobalState()
    const globalStateUpdate = UseGlobalStateUpdate()
    const classes = useStyles();
    const [products, setProducts] = useState([])

    useEffect(() => {
        axios({
            method: 'get',
            url: 'http://localhost:5000/getProducts',
            withCredentials: true
        }).then((response) => {
            console.log(response.data.data)
            setProducts(response.data.data)
        }).catch((err) => {
            console.log(err)
        })
    }, [])
    ///////////////////////////////
    const addToCart = (product) => {
        let newCart = [...cart];
        let itemInCart = newCart.find(
            (item) => product.title === item.title
        );
        if (itemInCart) {
            itemInCart.quantity++;
        } else {
            itemInCart = {
                ...product,
                quantity: 1,
            };
            newCart.push(itemInCart);
        }
        setCart(newCart);
    };

    return (
        <React.Fragment>
            <Container maxWidth="xl" style={{display: 'flex', flexWrap: 'wrap', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-around'}} >
                {products.map((product, index) => {
                    return <Card key={index} value={product.id} className={`products ${classes.root}`} style={{ display: "inline-block", margin: "15px" }} >
                        <CardActionArea>
                            <CardContent>
                                <Typography   variant="body2"  style={{color: 'red'}} id="title" component="p">
                                    {product.availability}
                                </Typography>
                            </CardContent>
                            <CardMedia
                                className={classes.media}
                                image={product.cartimage}
                                title="Contemplative Reptile"
                            />
                            <CardContent>
                                <Typography variant="h5" color="primary" id="title" component="h2">
                                    {product.title}
                                </Typography>
                                <Typography id="description" variant="body2" color="primary" component="p">
                                    {product.description}

                                </Typography>
                                <Typography id="price" variant="body2" color="primary" component="p">
                                    Rs:{product.price}/=
                                </Typography>
                            </CardContent>
                        </CardActionArea>
                        <CardActions>

                            <Button size="small" onClick={() => addToCart(product)} color="primary">
                                Add To Card
                            </Button>
                        </CardActions>
                    </Card>
                })}
            </Container>
        </React.Fragment>
    )
}
