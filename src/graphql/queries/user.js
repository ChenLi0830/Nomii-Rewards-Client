import gql from 'graphql-tag';

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

export {getUserQuery};