import {Actions} from 'react-native-router-flux';
import { Toast } from 'antd-mobile';
import dismissKeyboard from 'dismissKeyboard';


// Action types
const TOGGLE_DISTANCE_WARN_MODAL = "TOGGLE_DISTANCE_WARN_MODAL";

// Action creator
export const toggleModal = () => ({
  type: TOGGLE_DISTANCE_WARN_MODAL,
});

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




