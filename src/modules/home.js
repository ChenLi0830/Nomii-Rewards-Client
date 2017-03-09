import {Actions} from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import dismissKeyboard from 'dismissKeyboard';


// Action types
const TOGGLE_DISTANCE_WARN_MODAL = "TOGGLE_DISTANCE_WARN_MODAL";

// Action creator
export const toggleModal = () => ({
  type: TOGGLE_DISTANCE_WARN_MODAL,
});

export const pressCard = (card) => {
  return (dispatch, getState) => {
    // if (card.distance <= 1000)
    // {
      Actions.inputPin({card});
    // } else {
    //   dispatch(toggleModal());
    // }
  }
};

// Reducer
const initialState = {
  showModal: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_DISTANCE_WARN_MODAL":
      return {...state, showModal: !state.showModal};
    default:
      return state;
  }
};

export default reducer;




