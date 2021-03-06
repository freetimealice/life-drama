import React from 'react'
import {connect} from 'react-redux'

import {getCart, removeItem, updateCart, lowerQuantity} from '../store/cart'

const findItemInCart = (cart, product) => {
  let index
  let productId
  if (product.userId) {
    productId = product.productId
  } else {
    productId = product.id
  }

  const itemInCart = cart.filter((elem, idx) => {
    const cartProductId = elem.userId ? elem.productId : elem.id
    if (cartProductId === productId) {
      index = idx
      return true
    }
  })
  const id = itemInCart[0].productId
    ? itemInCart[0].productId
    : itemInCart[0].id

  return {
    itemId: id,
    index: index,
    quantity: itemInCart[0].quantity
  }
}

class Cart extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      cartExists: false,
      cartNeedsUpdate: false
    }
  }

  async componentDidMount() {
    await this.props.getCart(this.props.userId)
  }

  async componentDidUpdate() {
    if (this.state.cartExists === false) {
      this.setState({
        cartExists: true
      })
      await this.props.getCart(this.props.userId)
    } else if (this.state.cartNeedsUpdate === true) {
      this.setState({cartNeedsUpdate: false})
      await this.props.getCart(this.props.userId)
    }
  }

  deleteProduct = (event, product, userId, cart) => {
    event.preventDefault()
    const productToUpdate = findItemInCart(cart, product)
    this.setState({cartNeedsUpdate: true})
    this.props.removeItem(productToUpdate.index, userId, productToUpdate.itemId)
  }

  increaseQuantity = (event, product, userId, cart) => {
    event.preventDefault()
    const productToUpdate = findItemInCart(cart, product)
    this.props.updateItem(productToUpdate.index, userId, productToUpdate.itemId)
  }

  decreaseQuantity = (event, product, userId, cart) => {
    event.preventDefault()
    const productToUpdate = findItemInCart(cart, product)
    if (productToUpdate.quantity === 1) {
      this.props.removeItem(
        productToUpdate.index,
        userId,
        productToUpdate.itemId
      )
    } else {
      this.props.lowerQuantity(
        productToUpdate.index,
        userId,
        productToUpdate.itemId
      )
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
            <div className="container table table-hover table-condensed">
              <table id="cart" className="table table-hover table-condensed">
                <thead>
                  <tr>
                    <th style={{width: '50%'}}>Product</th>
                    <th style={{width: '10%'}}>Price</th>
                    <th style={{width: '8%'}}>Quantity</th>
                    <th style={{width: '32%'}} />
                  </tr>
                </thead>
                {cart.map(product => {
                  return (
                    <tbody className="product-thumb" key={product.id}>
                      <tr>
                        <td data-th="Product">
                          <div className="row">
                            <div className="col-sm-2 hidden-xs">
                              <img
                                src={product.imageUrl}
                                alt="..."
                                className="img-responsive"
                              />
                            </div>
                            <div className="col-sm-10">
                              <h3>
                                The "{product.userId
                                  ? product.productName
                                  : product.name}"
                              </h3>
                            </div>
                          </div>
                        </td>
                        <td data-th="Price">
                          <h3>
                            ${product.userId
                              ? product.purchasePrice
                              : product.price}
                          </h3>
                        </td>
                        <td data-th="Quantity">
                          <div className="form-group row">
                            <div className="col-md-8">
                              <div className="input-group">
                                <input
                                  readOnly
                                  className="form-control text-center"
                                  type="number"
                                  value={product.quantity}
                                />
                              </div>
                            </div>

                            <div className="col-md-2">
                              <div className="btn-group">
                                <button
                                  label="decrease-button"
                                  type="button"
                                  className="btn btn-default"
                                  onClick={() => {
                                    this.decreaseQuantity(
                                      event,
                                      product,
                                      userId,
                                      cart
                                    )
                                  }}
                                >
                                  {' '}
                                  -{' '}
                                </button>
                                <button
                                  label="increase-button"
                                  type="button"
                                  className="btn btn-default"
                                  onClick={() => {
                                    this.increaseQuantity(
                                      event,
                                      product,
                                      userId,
                                      cart
                                    )
                                  }}
                                >
                                  {' '}
                                  +{' '}
                                </button>
                              </div>
                            </div>

                            {/* <div className="col-md-2">
                            
                          </div> */}
                          </div>
                        </td>
                        <td colSpan={2} className="hidden-xs" />
                        <td className="actions" data-th="">
                          <button
                            className="btn btn-default btn-lg"
                            name="delete-button"
                            type="submit"
                            onClick={() => {
                              this.deleteProduct(
                                event,
                                product,
                                this.props.userId,
                                this.props.cart
                              )
                            }}
                          >
                            {' '}
                            <img
                              className="delete-button"
                              src="/button-delete.png"
                            />
                          </button>
                          <i className="fa-angle-right" />
                        </td>
                      </tr>
                    </tbody>
                  )
                })}
                <tfoot>
                  <tr>
                    <td>
                      <button
                        className="btn btn-warning"
                        onClick={() => {
                          this.props.history.push('/')
                        }}
                      >
                        <i className="fa-angle-left" /> Continue Shopping
                      </button>
                    </td>
                    <td>
                      <h3>Total: ${this.totalPrice(cart)}</h3>
                    </td>
                    <td colSpan={1.5} className="hidden-xs" />
                    <td>
                      <button
                        className="btn btn-warning btn-block"
                        type="submit"
                        name="checkout"
                        onClick={this.routeChange}
                      >
                        Checkout
                      </button>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>
        ) : (
          <div> Wait just a moment please... </div>
        )}
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
