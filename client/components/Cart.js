import React from 'react'
import {connect} from 'react-redux'

import {getCart, removeItem, updateCart, lowerQuantity} from '../store/cart'

const findItemInCart = (cart, productId) => {
  let index
  const itemInCart = cart.filter((elem, idx) => {
    if (elem.productId === productId) {
      index = idx
      return true
    }
  })
  return {item: itemInCart[0], index: index}
}

class Cart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cartExists: false,
      cartNeedsUpdate: false
    }
    this.deleteProduct = this.deleteProduct.bind()
  }
  async componentDidMount() {
    await this.props.getCart(this.props.userId)
  }

  async componentDidUpdate() {
    if (this.state.cartExists === false && this.props.userId) {
      await this.props.getCart(this.props.userId)
      this.setState({
        cartExists: true
      })
    } else if (this.state.cartNeedsUpdate === true) {
      await this.props.getCart(this.props.userId)
      this.setState({cartNeedsUpdate: false})
    }
  }

  deleteProduct = (event, productId, userId, cart) => {
    event.preventDefault()
    const data = findItemInCart(cart, productId)
    this.setState({cartNeedsUpdate: true})
    this.props.removeItem(data.index, userId, data.item.productId)
  }

  increaseQuantity = (event, product, userId, cart) => {
    event.preventDefault()
    const data = findItemInCart(cart, product.productId)
    this.props.updateItem(data.index, userId, data.item.productId)
  }

  decreaseQuantity = (event, product, userId, cart) => {
    event.preventDefault()
    const data = findItemInCart(cart, product.productId)
    if (data.item.quantity === 1) {
      this.props.removeItem(data.index, userId, data.item.productId)
    } else {
      this.props.lowerQuantity(data.index, userId, data.item.productId)
    }
  }

  routeChange = () => {
    let path = '/checkout'
    this.props.history.push(path)
  }

  totalPrice = cart => {
    return cart.reduce((total, item) => {
      if (!item.userId) {
        return total + item.quantity * item.price
      } else {
        return total + item.quantity * item.purchasePrice
      }
    }, 0)
  }

  render() {
    const {cart, userId} = this.props
    return (
      <div>
        {cart.length ? (
          <div>
            <h2>Buy now... and get your wallet some drama!</h2>
            <div className="container">
              {cart.map(product => {
                return (
                  <div className="product-thumb" key={product.id}>
                    <img src={product.imageUrl} />
                    <button
                      name="delete-button"
                      type="submit"
                      onClick={() => {
                        this.deleteProduct(
                          event,
                          product.productId,
                          this.props.userId,
                          this.props.cart
                        )
                      }}
                    >
                      <img className="delete-button" src="/button-delete.png" />
                    </button>
                    <h3>
                      The "{product.userId ? product.productName : product.name}"
                    </h3>
                    <h3>
                      Price: ${product.userId
                        ? product.purchasePrice
                        : product.price}
                    </h3>
                    <form>
                      <button
                        label="decrease-button"
                        type="button"
                        onClick={() => {
                          this.decreaseQuantity(event, product, userId, cart)
                        }}
                      >
                        -
                      </button>
                      <input value={product.quantity} />
                      <button
                        label="increase-button"
                        type="button"
                        onClick={() => {
                          this.increaseQuantity(event, product, userId, cart)
                        }}
                      >
                        +
                      </button>
                    </form>
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          <div> Wait just a moment please... </div>
        )}
        <div className="container" id="total">
          <h3>Total: ${this.totalPrice(cart)}</h3>
          <button type="submit" name="checkout" onClick={this.routeChange}>
            Checkout
          </button>
        </div>
      </div>
    )
  }
}

//Container

const mapStateToProps = state => ({
  cart: state.cart,
  userId: state.user.id,
  product: state.product
})

const mapDispatchToProps = dispatch => ({
  getCart: userId => {
    dispatch(getCart(userId))
  },
  removeItem: (index, userId, productId) => {
    dispatch(removeItem(index, userId, productId))
  },
  updateItem: (index, userId, productId) => {
    dispatch(updateCart(index, userId, productId))
  },
  lowerQuantity: (index, userId, productId) => {
    dispatch(lowerQuantity(index, userId, productId))
  }
})

export default connect(mapStateToProps, mapDispatchToProps)(Cart)
