// Action types
const TOGGLE_WARN_MODAL = "TOGGLE_WARN_MODAL";
const TOGGLE_FEEDBACK_MODAL = "TOGGLE_FEEDBACK_MODAL";
const SET_FEEDBACK_RATING = "SET_FEEDBACK_RATING";
const FEEDBACK_NEXT_STEP = "FEEDBACK_NEXT_STEP";
const RESET_STATE = "RESET_STATE";
// Action creator
export const toggleModal = () => ({
  type: TOGGLE_WARN_MODAL,
});

export const toggleFeedbackModal = () => ({
  type: TOGGLE_FEEDBACK_MODAL,
});

export const setFeedbackRating = (rating) => ({
  type: SET_FEEDBACK_RATING,
  payload: rating
});

export const nextFeedbackStep = () => ({
  type: FEEDBACK_NEXT_STEP,
});

export const resetState = () => ({
  type: RESET_STATE,
});

// Reducer
const initialState = {
  showModal: false,
  showFeedbackModal: false,
  feedbackRating: 0,
  feedBackStep: 0,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_WARN_MODAL":
      return {...state, showModal: !state.showModal};
    case "TOGGLE_FEEDBACK_MODAL":
      return {...state, showFeedbackModal: true};
    case "SET_FEEDBACK_RATING":
      return {...state, feedbackRating: action.payload};
    case "FEEDBACK_NEXT_STEP":
      return {...state, feedBackStep: state.feedBackStep + 1};
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

export default reducer;




