import {Actions} from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import dismissKeyboard from 'dismissKeyboard';
import {getAllRestaurantCardsQuery} from '../graphql/restaurant';
import {cardIsExpired} from '../components/api';

// Action types
const USER_CHANGE_PIN = "USER_CHANGE_PIN";
const USER_SUBMIT_PIN_START = "USER_SUBMIT_PIN_START";
const USER_SUBMIT_PIN_FAILED = "USER_SUBMIT_PIN_FAILED";
const USER_SUBMIT_PIN_SUCCESS = "USER_SUBMIT_PIN_SUCCESS";
const USER_ENTER_PIN_SCREEN = "USER_ENTER_PIN_SCREEN";
const USER_TOGGLE_MODAL_VISIBILITY = "USER_TOGGLE_MODAL_VISIBILITY";

// Action creator
export const changePin = (pin) => ({
  type: USER_CHANGE_PIN,
  payload: pin,
});

const submitPinFailed = (message) => ({
  type: USER_SUBMIT_PIN_FAILED,
  payload: message,
});

const submitPinSuccess = () => ({
  type: USER_SUBMIT_PIN_SUCCESS,
});

export const userEnterScreen = () => ({
  type: USER_ENTER_PIN_SCREEN,
});

export const toggleModal = () => ({
  type: USER_TOGGLE_MODAL_VISIBILITY,
});

export const userSubmitPin = (card, stampCardMutation, variables) => {
  // console.log("card", card);
  return (dispatch, getState) => {
    Toast.loading('Loading...', 0);
    // console.log("variables", variables);
    stampCardMutation({
      variables: {...variables},
      refetchQueries: [{query: getAllRestaurantCardsQuery, variables: {userId: variables.userId}}]
    })
        .then(result =>{
          Toast.hide();
        
          dispatch(submitPinSuccess());
          dismissKeyboard();
          setTimeout(()=>{
            // console.warn("cardIsExpired(card)", cardIsExpired(card));
            if (cardIsExpired(card)) {
              Actions.reward({progress: 0});
            }
            else {
              Actions.reward({progress: card.stampCount % 3});
            }
          }, 100);
        })
        .catch(err => {
          Toast.hide();
          // console.log(err.graphQLErrors[0].message)
          dispatch(submitPinFailed(err.graphQLErrors[0].message));
        });
  }
};

// Reducer
const initialState = {
  pin: "",
  // loading: false,
  message: "",
  showModal: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "USER_CHANGE_PIN":
      return {...state, pin: action.payload, message: ""};
    case "USER_SUBMIT_PIN_FAILED":
      return {...state, pin: "", message: action.payload};
    case "USER_SUBMIT_PIN_SUCCESS":
    case "USER_ENTER_PIN_SCREEN":
      return initialState;
    case "USER_TOGGLE_MODAL_VISIBILITY":
      return {...state, showModal: !state.showModal};
    default:
      return state;
  }
};

export default reducer;




