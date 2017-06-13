import geolib from 'geolib';
import _ from 'lodash';
import {AsyncStorage} from 'react-native';

const addDistanceToCards = (cards, userLocation) => {
  return cards.map(card => {
    let distance = geolib.getDistance(
        {longitude: card.restaurant.longitude, latitude: card.restaurant.latitude},
        {longitude: userLocation.longitude, latitude: userLocation.latitude},
    );
    if (card.restaurant.name === "Starbucks") distance = 5;
    return {...card, distance}
  });
};

const sortCardsByDistance = (cardsWithDistance) => {
  return _.sortBy(cardsWithDistance, card => card.distance);
};

const sortCardsByUrgency = (cardsWithExpiration) => {
  return _.sortBy(cardsWithExpiration, card => card.expireInDays);
};

const getTimeInSec = () => {
  return Math.trunc(new Date().getTime()/1000);
};

const cardIsExpired = (card) => {
  if (!card.lastStampAt) return false; // Card's stamp comes from redeeming coupon
  return card.lastStampAt + card.restaurant.stampValidDays * 24 * 3600 < getTimeInSec()
};

const getExpireInDays = (lastStampAt, stampValidDays) => {
  if (cardIsExpired({lastStampAt, restaurant: {stampValidDays}})) return undefined;
  
  return lastStampAt === null ? undefined :
      Math.ceil((lastStampAt + stampValidDays * 24 * 3600 - getTimeInSec()) / (3600 * 24));
};

// The smaller the number the more urgent it is
const getCardUrgency = (stampValidDays, expireInDays) => {
  if (isNaN(expireInDays)) return 2; //Card is not stamped
  let urgencyArray = [
    [2, 4, 7],
    [3, 7, 14],
    [5, 15, 30],
  ];
  
  // Get correct row
  let row;
  for (row=0; row<urgencyArray.length; row++){
    // row is found
    if (urgencyArray[row][2]>=stampValidDays) break;
  }
  if (row === urgencyArray.length) row--;
  
  // Get urgency
  let urgency;
  for (urgency = 0; urgency<urgencyArray[row].length; urgency++){
    // urgencyLevel is found
    if (urgencyArray[row][urgency] >= expireInDays) break;
  }
  if (urgency === urgencyArray[0].length) urgency--;
  return urgency;
};

const getIfPermissionAsked = async (permission)=>{
  let permissionList = ["location", "notification"];
  if (!_.includes(permissionList, permission)){
    throw new Error("no such permission");
  }
  try {
    return !!await AsyncStorage.getItem(`@NomiiStore:${permission}PermissionAsked`);
  } catch (error){
    console.error("getIfPermissionAsked error", error);
  }
};

const setIfPermissionAsked = async (permission) => {
  let permissionList = ["location", "notification"];
  if (!_.includes(permissionList, permission)){
    throw new Error("no such permission");
  }
  try {
    return !!(await AsyncStorage.setItem(`@NomiiStore:${permission}PermissionAsked`, JSON.stringify(true)))
  } catch (error){
    console.error("getIfPermissionAsked error", error);
  }
};

/**
 * A helper function to get promise run time
 * @param{Promise} promise - the promise you want to get the run time of
 * @param{string} name - name of the promise to be shown in console.log
 * */
const getPromiseTime = async (promise, name) => {
  const start = Date.now();
  try {
    return await promise;
  } finally {
    const end = Date.now();
    console.log(`${name} took ${end-start}ms`);
  }
};

/**
 * Calculate the display time of how long it is since prevTimeStamp
 * */
const calcHowLongAgo = (prevTimeStamp) => {
  const timeStamp = getTimeInSec();
  const timeDifInSec = timeStamp - prevTimeStamp;
  if (timeDifInSec < 60) return `just now`;
  const timeDifInMin = Math.floor(timeDifInSec/60);
  if (timeDifInMin < 60) return `${timeDifInMin} ${timeDifInMin>1 ? "mins" : "min"} ago`;
  const timeDifInHour = Math.floor(timeDifInMin/60);
  if (timeDifInHour < 24) return `${timeDifInHour} ${timeDifInHour>1 ? "hours" : "hour"} ago`;
  const timeDifInDay = Math.floor(timeDifInHour/24);
  return `${timeDifInDay} ${timeDifInDay>1 ? "days" : "day"} ago`;
};

/**
 * categorize feedBacks by time period, used in Dashboard
 * @param{Object[]} ratingFeedBacks
 * */
const categorizeFeedbacksByPeriod = (ratingFeedBacks) => {
  const timeStampNow = getTimeInSec();
  const allfeedBacks = [...ratingFeedBacks].reverse();
  
  let feedBackByTimePeriod = [[], [], [], []];
  
  for (const feedback of allfeedBacks) {
    if ((timeStampNow - feedback.createdAt) <= 1 * 24 * 3600) feedBackByTimePeriod[0].push(
        feedback);
    if ((timeStampNow - feedback.createdAt) <= 7 * 24 * 3600) feedBackByTimePeriod[1].push(
        feedback);
    if ((timeStampNow - feedback.createdAt) <= 30 * 24 * 3600) feedBackByTimePeriod[2].push(
        feedback);
    feedBackByTimePeriod[3].push(feedback);
  }
  
  return feedBackByTimePeriod;
};

export {
  sortCardsByDistance,
  sortCardsByUrgency,
  getTimeInSec,
  cardIsExpired,
  getCardUrgency,
  addDistanceToCards,
  getIfPermissionAsked,
  setIfPermissionAsked,
  getExpireInDays,
  getPromiseTime,
  calcHowLongAgo,
  categorizeFeedbacksByPeriod,
};