import gql from 'graphql-tag';

const createPINMutation = gql`
mutation restaurantCreatePin($restaurantId:ID, $PIN:String, $employeeName:String){
  createPIN(restaurantId: $restaurantId, PIN: $PIN, employeeName: $employeeName){
    code,
    employeeName,
    usageCount,
  }
}
`;

const removePINMutation = gql`
mutation restaurantPinRemove($restaurantId: ID, $PIN:String){
  removePIN(restaurantId:$restaurantId, PIN: $PIN){
    code,
    employeeName,
    usageCount
  }
}
`;

export {createPINMutation, removePINMutation};