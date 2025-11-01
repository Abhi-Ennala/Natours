/* eslint-disable */
/* global Stripe */

import axios from 'axios';
import { showAlert } from './alerts';


const stripe = Stripe('pk_test_51SOW75H6OSOKdF5jBtIciHgj5eBpSNiMiRbbxvuMo1CkU8MbDGj8N3y59wowkQkhqdSX8MDZM9dsQ69xn3pgCAer00P1k4jWZM');

export const bookTour = async tourId => {
  try{
    // 1) Get checkout session from API
    const session = await axios(`/api/v1/bookings/checkout-session/${tourId}`);
    
    console.log(session);
    
    // 2) Create checkout and charge credit card
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id
    })
  }catch(err){
    console.log(err);
    showAlert('error', err);
  }
}
 