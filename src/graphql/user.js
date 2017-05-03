import gql from 'graphql-tag';

const UpsertUserMutation = gql`
mutation upsertUser($id:ID, $fbName: String, $token: String){
  upsertUser(id: $id, fbName: $fbName, token: $token){
    id,
    fbName,
    registeredAt,
    lastLoginAt,
    isNomiiAdmin,
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
    ownedRestaurants
  }
}
`;

const getUserQuery = gql`
query getUser($id:ID){
  user(id:$id){
    id,
    fbName,
    isNomiiAdmin,
    cards{
			id
      stampCount,
      lastStampAt,
      discounts,
      PINSuccessScreens,
      codeSuccessScreen,
      restaurant{
        id
        name, 
        imageURL,
        longitude,
        latitude,
        description,
        stampValidDays,
      }
    },
    redeemedCoupons{
      redeemedAt,
      couponCode
    }
    visitedRestaurants,
    ownedRestaurants,
    awaitFeedbacks{
      restaurantId,
      visitedAt,
      stampCountOfCard,
      employeeName,
      restaurant{
        name,
        imageURL
      }
      feedbackTags{
        id,
        content,
      }
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

const userAddAwaitFeedbackMutation = gql`
mutation addAwaitFeedback($userId:ID, $restaurantId:ID,$stampCountOfCard:Int, $employeeName:String){
  addAwaitFeedbackToUser(userId: $userId, restaurantId: $restaurantId, stampCountOfCard: $stampCountOfCard, employeeName: $employeeName){
    id,
    fbName,
    awaitFeedbacks{
      restaurantId,
      visitedAt,
      stampCountOfCard,
      employeeName,
      restaurant{
        name,
        imageURL,
        address
      },
      feedbackTags{
        id,
        content
      }
    }
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
    userContactName
  }
}
`;

export {UpsertUserMutation, getUserQuery, userStampCardMutation, userAddPushTokenMutation, userAddAwaitFeedbackMutation, userSubmitFeedbackMutation};
