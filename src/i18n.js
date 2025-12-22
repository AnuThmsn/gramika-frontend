import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// Simple example with English translations
const resources = {
  en: {
    translation: {
      "your_cart": "Your Cart",
      "delivery_in": "Delivery in 20 minutes",
      "shipment_of": "Shipment of {{count}} items",
      "cart_empty": "Your cart is empty.",
      "items_total": "Items total",
      "delivery_charge": "Delivery charge",
      "handling_charge": "Handling charge",
      "grand_total": "Grand total",
      "cancellation_policy": "Cancellation Policy",
      "cancellation_text": "Orders cannot be cancelled once packed for delivery. In case of unexpected delays, a refund will be provided, if applicable.",
      "total": "TOTAL",
      "proceed_checkout": "Proceed to Checkout →"
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en',
    fallbackLng: 'en',
    interpolation: { escapeValue: false },
  });

export default i18n;
