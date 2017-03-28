import config from '../../exp.json';
import ApolloClient, {createNetworkInterface} from 'apollo-client';

let uri;
switch (config.slug){
  case "nomii-rewards-exponentjs-dev":
    uri = "http://localhost:4000/graphql";
    break;
  case "nomii-rewards-exponentjs-staging":
    uri = "https://p9s1hjsm03.execute-api.us-west-2.amazonaws.com/staging/graphql";
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

const client = new ApolloClient({
  networkInterface: networkInterface,
  dataIdFromObject: o => o.id,
});

export {client};