import gql from 'graphql-tag';

const UpsertUserMutation = gql`
mutation upsertUser($id:ID, $fbName: String, $token: String){
  upsertUser(id: $id, fbName: $fbName, token: $token){
    id,
    fbName,
    registeredAt,
    lastLoginAt,
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

export {UpsertUserMutation, getUserQuery, userStampCardMutation, userAddPushTokenMutation};
