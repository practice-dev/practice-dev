import {
  gql,
  ApolloClient,
  InMemoryCache,
  HttpLink,
  ApolloLink,
} from '@apollo/client';
import fetch from 'cross-fetch';
import { setContext } from '@apollo/client/link/context';
import {
  GetAwsUploadContentAuthQuery,
  UpdateChallengeInput,
  UpdateModuleInput,
  UpdateModuleMutation,
} from './generated';

const token = process.env.PD_ADMIN_TOKEN;
const url = process.env.PD_API_URL || 'http://localhost:3001/graphql';
if (!token) {
  throw new Error('PD_ADMIN_TOKEN is not set');
}

const httpLink = ApolloLink.from([
  new ApolloLink((operation, forward) => {
    if (operation.variables) {
      const omitTypename = (key: any, value: any) =>
        key === '__typename' ? undefined : value;
      operation.variables = JSON.parse(
        JSON.stringify(operation.variables),
        omitTypename
      );
    }
    return forward(operation).map(data => {
      return data;
    });
  }),
  setContext((_, { headers }) => {
    return {
      headers: {
        ...headers,
        authorization: token,
      },
    };
  }),
  new HttpLink({ uri: url, fetch }),
]);

const client = new ApolloClient({
  link: httpLink,
  headers: {
    authorization: token,
  },
  cache: new InMemoryCache(),
});

export async function getAwsUploadContentAuth() {
  const ret = await client.query<GetAwsUploadContentAuthQuery>({
    query: gql`
      query GetAwsUploadContentAuth {
        getAwsUploadContentAuth {
          bucketName
          credentials {
            accessKeyId
            secretAccessKey
            sessionToken
          }
        }
      }
    `,
  });
  return ret.data.getAwsUploadContentAuth;
}

export async function updateModule(values: UpdateModuleInput) {
  await client.mutate<UpdateModuleMutation>({
    mutation: gql`
      mutation updateModule($values: UpdateModuleInput!) {
        updateModule(values: $values)
      }
    `,
    variables: { values },
  });
}

export async function updateChallenge(values: UpdateChallengeInput) {
  await client.mutate<UpdateModuleMutation>({
    mutation: gql`
      mutation updateChallenge($values: UpdateChallengeInput!) {
        updateChallenge(values: $values)
      }
    `,
    variables: { values },
  });
}
