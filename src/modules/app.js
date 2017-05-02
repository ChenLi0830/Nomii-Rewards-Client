// Action types
const TOGGLE_WARN_MODAL = "TOGGLE_WARN_MODAL";
const RESET_STATE = "RESET_STATE";
// Action creator
export const toggleModal = () => ({
  type: TOGGLE_WARN_MODAL,
});

export const resetState = () => ({
  type: RESET_STATE,
});

// Reducer
const initialState = {
  showModal: false,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_WARN_MODAL":
      return {...state, showModal: !state.showModal};
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

export default reducer;




