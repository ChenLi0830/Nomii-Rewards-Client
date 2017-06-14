import gql from 'graphql-tag';

const createPINMutation = gql`
mutation restaurantCreatePin($restaurantId:ID, $PIN:String, $employeeName:String){
  createPIN(restaurantId: $restaurantId, PIN: $PIN, employeeName: $employeeName){
    id,
    PINs{
      code,
      employeeName,
      usageCount,
      id
    }
  }
}
`;

const editPINMutation = gql`
mutation restaurantEditPin($restaurantId: ID, $oldPIN:String, $newPIN: String, $employeeName: String){
  editPIN(restaurantId: $restaurantId, oldPIN: $oldPIN, newPIN: $newPIN, employeeName: $employeeName){
    id,
    PINs{
      code,
      employeeName,
      usageCount,
      id,
    },
  }
}
`;

const removePINMutation = gql`
mutation restaurantPinRemove($restaurantId: ID, $PIN:String){
  removePIN(restaurantId:$restaurantId, PIN: $PIN){
    id,
    PINs{
      code,
      employeeName,
      usageCount,
      id
    }
  }
}
`;

export {createPINMutation, removePINMutation, editPINMutation};