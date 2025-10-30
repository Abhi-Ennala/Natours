/* eslint-disable */

import axios from 'axios';
import { showAlert } from './alerts'

export const updateSettings = async (data, type) => {
  console.log('inside axios');
  try{
    const url = type === 'password' ? 'http://localhost:8080/api/v1/users/updatePassword' : 'http://localhost:8080/api/v1/users/updateMe';

    const res = await axios({
      method: 'PATCH',
      url,
      data
    });
    console.log(res.data); 
    if(res.data.status === 'success') {
      showAlert('success', `${type.toUpperCase()} updated successfully!`);
    }
  } catch(err) {
    console.log('inside axios catch')
    showAlert('error', err.response.data.message);
  }
};
