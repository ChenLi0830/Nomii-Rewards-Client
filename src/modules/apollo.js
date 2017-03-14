import ApolloClient, {createNetworkInterface} from 'apollo-client';


const networkInterface = createNetworkInterface({
  // uri: "http://localhost:4000/graphql",
  uri: "https://bnbs6szfk8.execute-api.us-west-2.amazonaws.com/dev/graphql",
  opts: {
    //The "same-origin" value makes query behave similarly to
    // XMLHttpRequest with regards to cookies. Otherwise, cookies won't get sent, resulting in these
    // requests not preserving the authentication session.
    credentials: "same-origin",
  }
});

const client = new ApolloClient({
  networkInterface: networkInterface,
  dataIdFromObject: o => o.id,
});

export {client};