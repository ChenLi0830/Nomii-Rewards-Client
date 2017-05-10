// Action types
const TOGGLE_WARN_MODAL = "TOGGLE_WARN_MODAL";
const TOGGLE_KEYBOARD_VISIBILITY = "TOGGLE_KEYBOARD_VISIBILITY";
const RESET_STATE = "RESET_STATE";
// Action creator
export const toggleModal = () => ({
  type: TOGGLE_WARN_MODAL,
});

export const toggleKeyboardVisibility = (keyboardVisibility) => ({
  type: TOGGLE_KEYBOARD_VISIBILITY,
  payload: keyboardVisibility,
});

export const resetState = () => ({
  type: RESET_STATE,
});

// Reducer
const initialState = {
  showModal: false,
  keyboardIsShown: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_WARN_MODAL":
      return {...state, showModal: !state.showModal};
    case "TOGGLE_KEYBOARD_VISIBILITY":
      return {...state, keyboardIsShown: action.payload};
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

export default reducer;




