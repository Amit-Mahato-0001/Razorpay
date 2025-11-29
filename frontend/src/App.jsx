import React, { useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'
import PaymentButton from './paymentButton'

function App() {

  const [product, setProduct] = useState(null)
  const [qty, setQty] = useState(1)

  useEffect(() => {
    axios.get('http://localhost:3000/api/products/get-item')
      .then(response => {
        setProduct(response.data.product)
        console.log(response.data.product)
      })
      .catch(err => console.error(err))
  },[])

  const formatPrice = (amount) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount)

  const total = product ? product.price.amount * qty : 0

  const handleBuy = () => {
    // replace with real checkout flow when ready
    alert(`Checkout — ${formatPrice(total)}`)
  }

  return (
    <div className="app">
      <div className="container">
        {!product ? (
          <div className="skeleton-card">
            <div className="skeleton-image" />
            <div className="skeleton-text" />
          </div>
        ) : (
          <div className="product-card">
            <div className="media">
              <img className="product-image" src={product.image} alt={product.title} />
            </div>
            <div className="info">
              <h1 className="title">{product.title}</h1>
              <p className="description">{product.description}</p>

              <div className="price-row">
                <div className="price">{formatPrice(product.price.amount)}</div>
                <div className="qty">
                  <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                  <span className="qty-value">{qty}</span>
                  <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
                </div>
              </div>

              <div className="actions">
                <PaymentButton/>
                <button className="btn ghost">Add to Cart</button>
              </div>

              <div className="total">Total: <strong>{formatPrice(total)}</strong></div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
