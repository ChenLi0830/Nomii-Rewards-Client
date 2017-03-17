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
    }
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
      # restaurant{
      #   name,
      #   imageURL
      # }
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


export {UpsertUserMutation, getUserQuery};
