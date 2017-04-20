import geolib from 'geolib';
import _ from 'lodash';
import {AsyncStorage} from 'react-native';

const addDistanceToCards = (cards, userLocation) => {
  return cards.map(card => {
    let distance = geolib.getDistance(
        {longitude: card.restaurant.longitude, latitude: card.restaurant.latitude},
        {longitude: userLocation.longitude, latitude: userLocation.latitude},
    );
    if (card.restaurant.name === "Accessible Everywhere") distance = 5;
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

export {
  sortCardsByDistance,
  sortCardsByUrgency,
  getTimeInSec,
  cardIsExpired,
  getCardUrgency,
  addDistanceToCards,
  getIfPermissionAsked,
  setIfPermissionAsked,
};