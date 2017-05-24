import gql from 'graphql-tag';

const UpsertUserMutation = gql`
mutation upsertUser($id:ID, $fbName: String, $token: String){
  upsertUser(id: $id, fbName: $fbName, token: $token){
    id,
    fbName,
    registeredAt,
    lastLoginAt,
    isNomiiAdmin,
    ownedRestaurants,
    cards {
      id,
      stampCount,
      lastStampAt,
      restaurant{
        id,
        name,
        imageURL,
        longitude,
        latitude
        description,
        stampValidDays,
      }
    },
    awaitFeedbacks{
      restaurantId,
      visitedAt,
      stampCountOfCard,
      employeeName,
      skipCount,
      restaurant{
        name,
        imageURL
      }
      feedbackTags{
        id,
        content,
      },
      isNewUser,
    }
  }
}
`;

const getUserQuery = gql`
query getUser($id:ID){
  user(id:$id){
    id,
    fbName,
    registeredAt,
    lastLoginAt,
    isNomiiAdmin,
    ownedRestaurants,
    cards {
      id,
      stampCount,
      lastStampAt,
      restaurant{
        id,
        name,
        imageURL,
        longitude,
        latitude
        description,
        stampValidDays,
      }
    },
    awaitFeedbacks{
      restaurantId,
      visitedAt,
      stampCountOfCard,
      employeeName,
      skipCount,
      restaurant{
        name,
        imageURL
      }
      feedbackTags{
        id,
        content,
      },
      isNewUser,
    }
  }
}
`;

const userStampCardMutation = gql`
mutation userStampCard($userId: ID, $cardId: ID, $PIN: String){
  stampCard(userId: $userId, cardId: $cardId, PIN: $PIN){
    id,
    fbName,
    cards{
      id,
      stampCount,
      lastStampAt
    },
    visitedRestaurants,
    awaitFeedbacks{
      restaurantId,
      visitedAt,
      stampCountOfCard,
      employeeName,
      skipCount,
      restaurant{
        name,
        imageURL
      }
      feedbackTags{
        id,
        content,
      },
      isNewUser,
    }
  }
}
`;

const userAddPushTokenMutation = gql`
mutation userUpsertPushToken($userId: ID, $pushToken: String){
  addPushToken(userId: $userId, pushToken: $pushToken){
    id,
    fbName,
  }
}
`;

const userSubmitFeedbackMutation = gql`
mutation userSubmitFeedback(
  $restaurantId: ID,
	$userId: ID,
	$userVisitedRestaurantAt: Int,
	$stampCountOfCard: Int,
	$employeeName:String ,
	$rating: Float,
	$tags: [FeedbackTagInput],
	$comment: String,
	$userContact: String,
	$userContactName: String,
  $isFirstTime: Boolean,
  $visitTimes: Int,
  $timePeriod: String,
){
  submitUserFeedback(
  restaurantId: $restaurantId
	userId: $userId,
	userVisitedRestaurantAt: $userVisitedRestaurantAt,
	stampCountOfCard: $stampCountOfCard,
	employeeName: $employeeName,
	rating: $rating,
	tags: $tags,
	comment: $comment,
	userContact: $userContact,
	userContactName: $userContactName,
  isFirstTime: $isFirstTime,
  visitTimes: $visitTimes,
  timePeriod: $timePeriod,
  ){
    restaurantId,
    userId,
    restaurantName,
    userName,
    userVisitedRestaurantAt,
    stampCountOfCard,
    tags{
      id,
      content
    },
    comment,
    rating,
    userContact,
    userContactName,
    isFirstTime,
    visitTimes,
    timePeriod,
  }
}
`;

const userSkipFeedbackMutation = gql`
mutation userSkipFeedback($userId:ID){
  skipAwaitFeedback(userId: $userId){
    id,
    awaitFeedbacks{
      restaurantId,
      visitedAt,
      stampCountOfCard,
      skipCount,
    }
  }
}
`;

export {
  UpsertUserMutation,
  getUserQuery,
  userStampCardMutation,
  userAddPushTokenMutation,
  userSubmitFeedbackMutation,
  userSkipFeedbackMutation,
};
