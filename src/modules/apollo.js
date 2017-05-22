import config from '../../exp.json';
import ApolloClient, {createNetworkInterface} from 'apollo-client';
import { getStoredState, createPersistor } from 'redux-persist'
import {AsyncStorage} from 'react-native';

let uri;
switch (config.slug){
  case "nomii-rewards-exponentjs-dev":
    uri = "http://192.168.0.14:4000/graphql"; //The LAN IP address where GraphQL is hosted
    break;
  case "nomii-rewards-exponentjs-staging":
    uri = "https://aq9i785i63.execute-api.us-west-2.amazonaws.com/staging/graphql";
    break;
  case "nomii-rewards-exponentjs":
    uri = "https://bnbs6szfk8.execute-api.us-west-2.amazonaws.com/dev/graphql";
    break;
}

const networkInterface = createNetworkInterface({
  uri: uri,
  opts: {
    //The "same-origin" value makes query behave similarly to
    // XMLHttpRequest with regards to cookies. Otherwise, cookies won't get sent, resulting in these
    // requests not preserving the authentication session.
    credentials: "same-origin",
  }
});


// getStoredState({ storage: AsyncStorage }, (err, rehydratedState) => {
//   const client = new ApolloClient({
//     networkInterface: networkInterface,
//     dataIdFromObject: o => o.id,
//     initialState: { apollo: { data: rehydratedState.apollo.data }},
//   });
// });

// const getClient = async () => {
//   const rehydratedState = await getStoredState({ storage: AsyncStorage });
//
//   return new ApolloClient({
//     networkInterface: networkInterface,
//     dataIdFromObject: o => o.id,
//     initialState: { apollo: { data: rehydratedState.apollo.data }},
//   })
// };

const getClient = (callback) => getStoredState({ storage: AsyncStorage }, (error, rehydratedState) => {
  const client = new ApolloClient({
    networkInterface: networkInterface,
    dataIdFromObject: o => o.id,
    initialState: { apollo: { data: rehydratedState.apollo.data }},
  });
  
  callback(client);
});


