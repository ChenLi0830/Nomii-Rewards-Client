import {Amplitude} from 'expo';
// Action types
const TOGGLE_FEEDBACK_MODAL = "TOGGLE_FEEDBACK_MODAL";
const SET_FEEDBACK_RATING = "SET_FEEDBACK_RATING";
const FEEDBACK_NEXT_STEP = "FEEDBACK_NEXT_STEP";
const FEEDBACK_PREV_STEP = "FEEDBACK_PREV_STEP";
const TOGGLE_FEEDBACK_TAG = "TOGGLE_FEEDBACK_TAG";
const CHANGE_FEEDBACK_COMMENT = "CHANGE_FEEDBACK_COMMENT";
const CHANGE_CONTACT = "CHANGE_CONTACT";
const CHANGE_CONTACT_NAME = "CHANGE_CONTACT_NAME";
const SKIP_FEEDBACK = "SKIP_FEEDBACK";
const CHANGE_IS_FIRST_TIME = "CHANGE_IS_FIRST_TIME";
const CHANGE_VISIT_TIMES = "CHANGE_VISIT_TIMES";
const CHANGE_TIME_PERIOD = "CHANGE_TIME_PERIOD";
const RESET_STATE = "RESET_STATE";

// Action creator
export const toggleFeedbackModal = (isVisible) => {
  console.log(`FeedbackModal is toggled to be ${isVisible}`);
  if (isVisible) {
    Amplitude.logEvent("Feedback is shown");
  }
  return {
    type: TOGGLE_FEEDBACK_MODAL,
    payload: isVisible,
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

export const skipFeedback = () => ({
  type: SKIP_FEEDBACK,
});

export const changeIsFirstTime = (isFirstTime) => ({
  type: CHANGE_IS_FIRST_TIME,
  payload: isFirstTime,
});

export const changeTimePeriod = (timePeroid) => ({
  type: CHANGE_TIME_PERIOD,
  payload: timePeroid,
});

export const changeVisitTimes = (visitTimes) => ({
  type: CHANGE_VISIT_TIMES,
  payload: visitTimes,
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
  modalSkipped: false,
  isFirstTime: false,
  visitTimes: undefined,
  timePeriod: undefined,
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case "TOGGLE_FEEDBACK_MODAL":
      if (action.payload === false){
        return {...state, showFeedbackModal: false};
      }
      else {
        return {...initialState, showFeedbackModal: true, contact: state.contact, contactName: state.contactName};
      }
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
    case "SKIP_FEEDBACK":
      return {...state, modalSkipped: true};
    case "RESET_STATE":
      return {...initialState};
    case "CHANGE_IS_FIRST_TIME":
      return {...state, isFirstTime: action.payload};
    case "CHANGE_TIME_PERIOD":
      return {...state, timePeriod: action.payload, visitTimes: 1};
    case "CHANGE_VISIT_TIMES":
      return {...state, visitTimes: action.payload};
    default:
      return state;
  }
};

export default reducer;




