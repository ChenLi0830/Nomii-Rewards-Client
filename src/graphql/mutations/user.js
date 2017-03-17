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

export {UpsertUserMutation};
