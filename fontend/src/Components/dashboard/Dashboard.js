
import React, { useState } from 'react';
import Products from '../card/Products';
import Cart from '../card/Cart';
import { colors } from '@material-ui/core';

const PAGE_PRODUCTS = 'products';
const PAGE_CART = 'cart';

function Dashboard() {
  const [cart, setCart] = useState([]);
  const [page, setPage] = useState(PAGE_PRODUCTS);

  const navigateTo = (nextPage) => {
    setPage(nextPage);
  };

  const getCartTotal = () => {
    return cart.reduce(
      (sum, { quantity }) => sum + quantity,
      0
    );
  };

  return (
    <div className="app">
      <header>
        <button
          style={{ margin: '20px', backgroundColor: 'pink',fontSize:'40px', border: 'none', padding: '10px', borderRadius: '4px', color: 'black' }}
          onClick={() => navigateTo(PAGE_CART)}>
          Go to Cart ({getCartTotal()})
        </button>

        <button
          style={{
            margin: '20px',backgroundColor:'pink', border: 'none',
            padding: '10px', borderRadius: '4px', color: 'black',
            fontSize:'40px',
          }}
          onClick={() => navigateTo(PAGE_PRODUCTS)}>
          View Products
        </button>
      </header>
      {page === PAGE_PRODUCTS && (
        <Products cart={cart} setCart={setCart} />
      )}
      {page === PAGE_CART && (
        <Cart cart={cart} setCart={setCart} />
      )}
    </div>
  );
}

export default Dashboard;
