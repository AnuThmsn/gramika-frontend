import React, { useEffect } from 'react';
import CartItem from '../components/CartItem.jsx';
import '../styles/Cart.css';
import { BsClock } from 'react-icons/bs';
import { useTranslation } from 'react-i18next';
import '../i18n'; // Make sure i18n is imported once

const Cart = ({
  isOpen,
  onClose,
  onProceedToPayment,
  cartItems = [],
  onUpdateQuantity = () => {}
}) => {
  const { t } = useTranslation();

  const itemsTotal = cartItems.reduce((sum, item) => sum + (item.price || 0) * (item.quantity || 0), 0);
  const deliveryCharge = 25;
  const handlingCharge = 2;
  const grandTotal = itemsTotal + deliveryCharge + handlingCharge;
  const shipmentItemCount = cartItems.reduce((sum, item) => sum + (item.quantity || 0), 0);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
  }, [isOpen]);

  const handleProceedClick = () => {
    onProceedToPayment(grandTotal);
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <>
      {/* Overlay */}
      <div
        className={`cart-overlay ${isOpen ? 'open' : ''}`}
        onClick={handleBackdropClick}
        aria-hidden={!isOpen}
      ></div>

      {/* Sidebar */}
      <div className={`cart-sidebar ${isOpen ? 'open' : ''}`} role="dialog" aria-hidden={!isOpen}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
          <h3 style={{ margin: 0, color: '#204229' }}>{t('your_cart')}</h3>
          <button
            aria-label="Close cart"
            style={{ background: 'transparent', border: 'none', color: '#204229', fontSize: 18, cursor: 'pointer', fontWeight: 700 }}
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Delivery info */}
        <div className="delivery-info">
          <p><BsClock className="icon" /> {t('delivery_in')}</p>
          <p>{t('shipment_of', { count: shipmentItemCount })}</p>
        </div>

        {/* Cart items */}
        <div className="cart-items">
          {cartItems.length === 0 ? (
            <p>{t('cart_empty')}</p>
          ) : (
            cartItems.map(item => (
              <CartItem key={item.id} item={item} onUpdateQuantity={onUpdateQuantity} />
            ))
          )}
        </div>

        {/* Bill details */}
        <div className="bill-details">
          <p>{t('items_total')} <span>₹{itemsTotal}</span></p>
          <p>{t('delivery_charge')} <span>₹{deliveryCharge}</span></p>
          <p>{t('handling_charge')} <span>₹{handlingCharge}</span></p>
          <p className="grand-total">{t('grand_total')} <span>₹{grandTotal}</span></p>
        </div>

        {/* Cancellation */}
        <div className="cancellation-policy">
          <p><strong>{t('cancellation_policy')}</strong></p>
          <p>{t('cancellation_text')}</p>
        </div>

        {/* Footer */}
        <div className="cart-footer">
          <span className="total-amount">₹{grandTotal} {t('total')}</span>
          <button className="proceed-button" onClick={handleProceedClick}>
            {t('proceed_checkout')}
          </button>
        </div>
      </div>
    </>
  );
};

export default Cart;
