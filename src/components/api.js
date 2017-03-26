import geolib from 'geolib';
import _ from 'lodash';

const calculateCardsWithDistances = (cards, userLocation) => {
  // const {longitude, latitude, accuracy} = userLocation.coords;
  // console.log("userLocation", userLocation.coords);
  // console.log("userCards", userCards);
  let cardsWithDistances = cards.map(card => {
    let distance = geolib.getDistance(
        {longitude: card.restaurant.longitude, latitude: card.restaurant.latitude},
        {longitude: userLocation.longitude, latitude: userLocation.latitude},
    );
    return {...card, distance}
  });
  
  // cardsWithDistances[0].distance = 3213;
  // cardsWithDistances[1].distance = 123;
  // console.log("cardsWithDistances", cardsWithDistances);
  
  return _.sortBy(cardsWithDistances, card => card.distance);
};


const getTimeInSec = () => {
  return Math.trunc(new Date().getTime()/1000);
};

const cardIsExpired = (card) => {
  if (!card.lastStampAt) return false; // Card's stamp comes from redeeming coupon
  return card.lastStampAt + card.restaurant.stampValidDays * 24 * 3600 < getTimeInSec()
};
export {calculateCardsWithDistances, getTimeInSec, cardIsExpired};