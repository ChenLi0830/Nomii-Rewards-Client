import gql from 'graphql-tag';

const createRestaurantMutation = gql`
mutation createRestaurant($name: String, $imageURL:String, $longitude: Float, $latitude: Float,$description: String){
  createRestaurant(name: $name, imageURL: $imageURL, longitude:$longitude, latitude: $latitude, description: $description){
    id,
    name,
    imageURL,
    PINs{
      code,
      employeeName
    }
  }
}
`;

const getRestaurantQuery = gql`
query getRestaurant($restaurantId: ID){
  restaurant(id: $restaurantId){
    id,
    name,
    imageURL,
    longitude,
    latitude,
    description,
    stampValidDays,
  }
}
`;

const getAllRestaurantCardsQuery = gql`
query getAllRestaurantCards($userId: ID){
  allRestaurantCards(userId: $userId){
    id,
		stampCount,
		lastStampAt,
    discounts,
    PINSuccessScreens,
    codeSuccessScreen,		
    restaurant{
      id,
      name,
      imageURL,
      description,
      stampValidDays,
      longitude,
      latitude,
    }
	}
}
`;

const getRestaurantStatsQuery = gql`
query getRestaurantStats($restaurantId: ID, $daysToCover: Float, $endTo: Int){
    restaurant(id: $restaurantId){
    id,
    name,
    PINs{
      code,
      employeeName,
      usageCount
    }
    statistics(daysToCover: $daysToCover, endTo: $endTo){
      id,
      newUserCount,
      returnUserCount,
      newVisitCount,
      returnVisitCount,
      PINsCount{
        employeeName,
        count
      },
      couponsCount
    }
  }
}
`;

const restaurantCreateFeedbackTag = gql`
mutation createFeedbackTag($content: String){
  createFeedBackTag(content: $content){
    id,
    content,
    createdAt
  }
}
`;

export {createRestaurantMutation, getAllRestaurantCardsQuery, getRestaurantQuery, getRestaurantStatsQuery, restaurantCreateFeedbackTag};