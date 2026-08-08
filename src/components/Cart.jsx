import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';
import './Cart.css';

export default function Cart() {
  const { items, isOpen, setIsOpen, updateQuantity, removeItem, clearCart, subtotal } = useCart();

  return (
    <>
      {/* Overlay */}
      {isOpen && <div className="cart-overlay" onClick={() => setIsOpen(false)} />}

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'cart-drawer--open' : ''}`} id="cart-drawer">
        {/* Header */}
        <div className="cart-drawer__header">
          <div className="cart-drawer__title">
            <ShoppingBag size={18} />
            <span>Your Cart</span>
          </div>
          <button className="cart-drawer__close" onClick={() => setIsOpen(false)} aria-label="Close cart">
            <X size={18} />
          </button>
        </div>

        {/* Items */}
        <div className="cart-drawer__body">
          {items.length === 0 ? (
            <div className="cart-drawer__empty">
              <ShoppingBag size={48} strokeWidth={1} />
              <p>Your cart is empty</p>
              <span>Browse our products and add items to get started.</span>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.key} className="cart-item">
                <div className="cart-item__info">
                  <h4 className="cart-item__name">{item.name}</h4>
                  <span className="cart-item__size badge">{item.size}</span>
                  <span className="cart-item__price">₹{item.price}</span>
                </div>
                <div className="cart-item__controls">
                  <button
                    className="cart-item__qty-btn"
                    onClick={() => updateQuantity(item.key, -1)}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="cart-item__qty">{item.quantity}</span>
                  <button
                    className="cart-item__qty-btn"
                    onClick={() => updateQuantity(item.key, 1)}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                  <button
                    className="cart-item__remove"
                    onClick={() => removeItem(item.key)}
                    aria-label="Remove item"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
                <div className="cart-item__total">
                  ₹{(item.price * item.quantity).toLocaleString('en-IN')}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer__footer">
            <div className="cart-drawer__subtotal">
              <span>Subtotal</span>
              <span className="cart-drawer__subtotal-value">₹{subtotal.toLocaleString('en-IN')}</span>
            </div>
            <p className="cart-drawer__shipping">Shipping calculated at checkout</p>
            <button className="btn btn-primary btn-lg cart-drawer__checkout">
              Proceed to Checkout <ArrowRight size={16} />
            </button>
            <button className="btn btn-ghost cart-drawer__clear" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        )}
      </div>
    </>
  );
}
