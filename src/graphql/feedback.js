import gql from 'graphql-tag';

const resolveFeedback = gql`
mutation resolveFeedback($restaurantId: ID, $createdAt: Int){
  feedbackEventResolve(restaurantId: $restaurantId, createdAt: $createdAt){
    restaurantId,
    createdAt,
    restaurantName,
    isResolved,
  }
}
`;

const unresolveFeedback = gql`
mutation unresolveFeedback($restaurantId: ID, $createdAt: Int){
  feedbackEventUnresolve(restaurantId: $restaurantId, createdAt: $createdAt){
    restaurantId,
    createdAt,
    restaurantName,
    isResolved,
  }
}
`;

export {resolveFeedback, unresolveFeedback};