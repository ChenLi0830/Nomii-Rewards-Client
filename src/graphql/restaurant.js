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
query getRestaurantStats($restaurantId: ID, $daysToCoverList: [Float], $endTo: Int){
    restaurant(id: $restaurantId){
    id,
    name,
    PINs{
      code,
      employeeName,
      usageCount
    }
    statistics(daysToCoverList: $daysToCoverList, endTo: $endTo){
      newUserCount,
      returnUserCount,
      newVisitCount,
      returnVisitCount,
      couponsCount,
      averageRating,
      PINsCount{
        employeeName,
        count
      },
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

const getRestaurantVisitStatsQuery = gql`
query getRestaurantVisitStatistics($restaurantId: ID, $daysToCover: Float, $endTo: Int){
  RestaurantVisitStatistics(restaurantId:$restaurantId, daysToCover: $daysToCover, endTo: $endTo){
    restaurantId,
    actualVisit,
    withoutNomiiVisit,
  }
}
`;

const getRatingFeedbacksQuery = gql`
query getRatingFeedbacks($restaurantId: ID, $daysToCover: Float){
  ratingFeedBacks(restaurantId: $restaurantId, daysToCover: $daysToCover){
    restaurantName,
    userId,
    userName,
    userVisitedRestaurantAt,
    rating,
    tags{
      content,
    },
    comment,
    userContactName,
    userContact,
    userPictureURL,
    createdAt,
    isResolved,
  }
}
`;

export {
  createRestaurantMutation,
  getAllRestaurantCardsQuery,
  getRestaurantQuery,
  getRestaurantStatsQuery,
  restaurantCreateFeedbackTag,
  getRestaurantVisitStatsQuery,
  getRatingFeedbacksQuery,
};