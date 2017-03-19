import gql from 'graphql-tag';

const UpsertUserMutation = gql`
mutation upsertUser($id:ID, $fbName: String){
  upsertUser(id: $id, fbName: $fbName){
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
      restaurant{
        id
        name,
        imageURL,
        longitude,
        latitude,
        description,
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

export {UpsertUserMutation, getUserQuery, userStampCardMutation};
