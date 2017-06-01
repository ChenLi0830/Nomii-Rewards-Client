import {Actions} from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import dismissKeyboard from 'dismissKeyboard';
import _ from 'lodash';

// Action types
const USER_CHANGE_EMPLOYEE_NAME = "USER_CHANGE_EMPLOYEE_NAME";
const USER_CHANGE_PIN = "USER_CHANGE_PIN";
const USER_GENERATE_NEW_PIN = "USER_GENERATE_NEW_PIN";
const CREATE_EMPLOYEE_SUCCESS = "CREATE_EMPLOYEE_SUCCESS";

// Action creator
export const changeEmployeeName = (name) => ({
  type: USER_CHANGE_EMPLOYEE_NAME,
  payload: name,
});

export const changePin = (pin) => ({
  type: USER_CHANGE_PIN,
  payload: pin,
});

export const createEmployeeSuccess = () => ({
  type: CREATE_EMPLOYEE_SUCCESS,
});

const submitNewPIN = (newPIN)=>({
  type: USER_GENERATE_NEW_PIN,
  payload: newPIN,
});

const generatePIN = ()=>{
  let newPIN = "";
  for (let i=0; i<4; i++) newPIN += Math.trunc(Math.random() * 10);
  return newPIN;
};

export const generateNewPin = (restaurantPINs) =>{
  return (dispatch, getState) =>{
    // If PIN exist, don't do anything
    const PIN = getState().createPIN.pin;
    if (PIN && PIN.length>0) return;
    
    // Generate new PIN otherwise
    console.log("restaurantPINs", restaurantPINs);
    let newPIN;
    // Ensure newPIN will not be a duplicated PIN
    while (true){
      newPIN = generatePIN();
      // console.log("dupPIN",_.find(restaurantPINs, {code: "8663"}));
      if (!_.find(restaurantPINs, {code: newPIN})) break;
    }
    
    dispatch(submitNewPIN(newPIN));
  }
};

// Reducer
const initialState = {
  pin:"",
  employeeName:""
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_CHANGE_EMPLOYEE_NAME":
      // console.log("new name", action.payload);
      return {...state, employeeName: action.payload};
    case "USER_CHANGE_PIN":
      // console.log("new name", action.payload);
      return {...state, pin: action.payload};
    case "USER_GENERATE_NEW_PIN":
      // console.log("creating new pin ", action.payload)
      return {...state, pin: action.payload};
    case "CREATE_EMPLOYEE_SUCCESS":
      return initialState;
    default:
      return state;
  }
};

export default reducer;




