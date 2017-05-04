// Action types
const TOGGLE_FEEDBACK_MODAL = "TOGGLE_FEEDBACK_MODAL";
const SET_FEEDBACK_RATING = "SET_FEEDBACK_RATING";
const FEEDBACK_NEXT_STEP = "FEEDBACK_NEXT_STEP";
const FEEDBACK_PREV_STEP = "FEEDBACK_PREV_STEP";
const TOGGLE_FEEDBACK_TAG = "TOGGLE_FEEDBACK_TAG";
const CHANGE_FEEDBACK_COMMENT = "CHANGE_FEEDBACK_COMMENT";
const CHANGE_CONTACT = "CHANGE_CONTACT";
const CHANGE_CONTACT_NAME = "CHANGE_CONTACT_NAME";
const RESET_STATE = "RESET_STATE";

// Action creator
export const toggleFeedbackModal = () => {
  console.log("FeedbackModal is toggled");
  return {
    type: TOGGLE_FEEDBACK_MODAL,
  }
};

export const setFeedbackRating = (rating) => ({
  type: SET_FEEDBACK_RATING,
  payload: rating
});

export const nextFeedbackStep = () => ({
  type: FEEDBACK_NEXT_STEP,
});

export const prevFeedbackStep = () => ({
  type: FEEDBACK_PREV_STEP,
});

export const toggleFeedbackTag = (tag) => ({
  type: TOGGLE_FEEDBACK_TAG,
  payload: tag,
});

export const changeFeedbackComment = (comment) => ({
  type: CHANGE_FEEDBACK_COMMENT,
  payload: comment,
});

export const changeContact = (contact) => ({
  type: CHANGE_CONTACT,
  payload: contact,
});

export const changeContactName = (contactName) => ({
  type: CHANGE_CONTACT_NAME,
  payload: contactName,
});

export const resetState = () => ({
  type: RESET_STATE,
});

// Reducer
const initialState = {
  showFeedbackModal: false,
  rating: 0,
  step: 0,
  selectedTags: {},
  comment: "",
  contact: "",
  contactName: "",
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_FEEDBACK_MODAL":
      return {...state, showFeedbackModal: !state.showFeedbackModal};
    case "SET_FEEDBACK_RATING":
      return {...state, rating: action.payload};
    case "FEEDBACK_NEXT_STEP":
      return {...state, step: state.step + 1};
    case "FEEDBACK_PREV_STEP":
      return {...state, step: state.step - 1};
    case "TOGGLE_FEEDBACK_TAG":
      return {...state,
        selectedTags: {
          ...state.selectedTags, [action.payload]:!state.selectedTags[action.payload]
        }
      };
    case "CHANGE_FEEDBACK_COMMENT":
      return {...state, comment: action.payload};
    case "CHANGE_CONTACT":
      return {...state, contact: action.payload};
    case "CHANGE_CONTACT_NAME":
      return {...state, contactName: action.payload};
    case "RESET_STATE":
      return initialState;
    default:
      return state;
  }
};

export default reducer;




