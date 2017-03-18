import gql from 'graphql-tag';

const createCouponMutation = gql`
mutation createCoupon($code: String, $isForAllRestaurants:Boolean, $restaurantId:ID, $daysToExpire:Int, $numberOfCoupons:Int){
  createCoupon(code:$code, isForAllRestaurants: $isForAllRestaurants, restaurantId: $restaurantId, daysToExpire: $daysToExpire, numberOfCoupons:$numberOfCoupons){
    code,
    isForAllRestaurants,
    restaurantId,
    expireAt,
    couponsLeft,
  }
}
`;

const redeemCouponMutation = gql`
mutation redeemPromo($userId:ID, $code:String){
  redeemPromo(userId:$userId, code: $code){
    id,
    fbName,
    cards{
      id,
      stampCount,
      lastStampAt,
    }
  }
}
`;

export {createCouponMutation, redeemCouponMutation};