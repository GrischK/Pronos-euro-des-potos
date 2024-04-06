import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
const defaultOptions = {} as const;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type CreateMatchInput = {
  scoreA?: InputMaybe<Scalars['String']>;
  scoreB?: InputMaybe<Scalars['String']>;
  teamA: Scalars['Int'];
  teamB: Scalars['Int'];
};

export type CreatePredictionInput = {
  awayTeamScorePrediction: Scalars['Int'];
  homeTeamScorePrediction: Scalars['Int'];
  matchId: Scalars['Int'];
  user?: InputMaybe<Scalars['Int']>;
};

export type CreateTeamInput = {
  flag: Scalars['String'];
  group: Scalars['String'];
  name: Scalars['String'];
};

export type LoginInput = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type Match = {
  __typename?: 'Match';
  date?: Maybe<Scalars['String']>;
  id: Scalars['Int'];
  scoreA?: Maybe<Scalars['String']>;
  scoreB?: Maybe<Scalars['String']>;
  teamA: Team;
  teamB: Team;
};

export type MatchData = {
  __typename?: 'MatchData';
  awayTeam?: Maybe<MatchTeam>;
  group?: Maybe<Scalars['String']>;
  homeTeam?: Maybe<MatchTeam>;
  id: Scalars['Float'];
  score?: Maybe<MatchScore>;
  status?: Maybe<Scalars['String']>;
  utcDate?: Maybe<Scalars['String']>;
};

export type MatchFullTime = {
  __typename?: 'MatchFullTime';
  away?: Maybe<Scalars['Float']>;
  home?: Maybe<Scalars['Float']>;
};

export type MatchScore = {
  __typename?: 'MatchScore';
  duration?: Maybe<Scalars['String']>;
  fullTime?: Maybe<MatchFullTime>;
  winner?: Maybe<Scalars['String']>;
};

export type MatchTeam = {
  __typename?: 'MatchTeam';
  crest?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['Float']>;
  name?: Maybe<Scalars['String']>;
  shortName?: Maybe<Scalars['String']>;
  tla?: Maybe<Scalars['String']>;
};

export type Mutation = {
  __typename?: 'Mutation';
  createMatch: Match;
  createPrediction: Prediction;
  createTeam: Team;
  createUSer: User;
  deleteUser: Scalars['String'];
  login: Scalars['String'];
  logout: Scalars['String'];
  updateUser: User;
};


export type MutationCreateMatchArgs = {
  data: CreateMatchInput;
};


export type MutationCreatePredictionArgs = {
  data: CreatePredictionInput;
};


export type MutationCreateTeamArgs = {
  data: CreateTeamInput;
};


export type MutationCreateUSerArgs = {
  data: UserInput;
};


export type MutationDeleteUserArgs = {
  id: Scalars['Int'];
};


export type MutationLoginArgs = {
  data: LoginInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  id: Scalars['Int'];
};

export type Prediction = {
  __typename?: 'Prediction';
  awayTeamScorePrediction: Scalars['Int'];
  homeTeamScorePrediction: Scalars['Int'];
  id: Scalars['Int'];
  matchId: Scalars['Int'];
  user?: Maybe<User>;
};

export type PronoInput = {
  scoreA: Scalars['String'];
  scoreB: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  fetchMatchByIdFromAPI?: Maybe<MatchData>;
  fetchMatchesFromAPI: Array<MatchData>;
  getAllMatchs: Array<Match>;
  getAllPredictions: Array<Prediction>;
  getAllTeams: Array<Team>;
  getAllUsers: Array<User>;
  getUserPredictions: Array<Prediction>;
  profile: User;
};


export type QueryFetchMatchByIdFromApiArgs = {
  matchId: Scalars['Float'];
};


export type QueryGetUserPredictionsArgs = {
  userId: Scalars['Int'];
};

export type Team = {
  __typename?: 'Team';
  flag: Scalars['String'];
  group: Scalars['String'];
  id: Scalars['Int'];
  name: Scalars['String'];
};

export type UpdateUserInput = {
  email?: InputMaybe<Scalars['String']>;
  password?: InputMaybe<Scalars['String']>;
  picture?: InputMaybe<Scalars['String']>;
  userName?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  email: Scalars['String'];
  id: Scalars['Int'];
  picture?: Maybe<Scalars['String']>;
  prediction?: Maybe<Array<Prediction>>;
  role?: Maybe<Scalars['String']>;
  userName: Scalars['String'];
};

export type UserInput = {
  email: Scalars['String'];
  password: Scalars['String'];
  picture?: InputMaybe<Scalars['String']>;
  userName: Scalars['String'];
};

export type CreatePredictionMutationVariables = Exact<{
  data: CreatePredictionInput;
}>;


export type CreatePredictionMutation = { __typename?: 'Mutation', createPrediction: { __typename?: 'Prediction', id: number, matchId: number, homeTeamScorePrediction: number, awayTeamScorePrediction: number, user?: { __typename?: 'User', id: number, userName: string } | null } };

export type CreateUserMutationVariables = Exact<{
  data: UserInput;
}>;


export type CreateUserMutation = { __typename?: 'Mutation', createUSer: { __typename?: 'User', id: number } };

export type FetchMatchesFromApiQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchMatchesFromApiQuery = { __typename?: 'Query', fetchMatchesFromAPI: Array<{ __typename?: 'MatchData', id: number, group?: string | null, status?: string | null, utcDate?: string | null, homeTeam?: { __typename?: 'MatchTeam', name?: string | null, crest?: string | null } | null, awayTeam?: { __typename?: 'MatchTeam', name?: string | null, crest?: string | null } | null, score?: { __typename?: 'MatchScore', winner?: string | null, duration?: string | null, fullTime?: { __typename?: 'MatchFullTime', home?: number | null, away?: number | null } | null } | null }> };

export type GetProfileQueryVariables = Exact<{ [key: string]: never; }>;


export type GetProfileQuery = { __typename?: 'Query', profile: { __typename?: 'User', id: number } };

export type GetUserPredictionsQueryVariables = Exact<{
  userId: Scalars['Int'];
}>;


export type GetUserPredictionsQuery = { __typename?: 'Query', getUserPredictions: Array<{ __typename?: 'Prediction', matchId: number, homeTeamScorePrediction: number, awayTeamScorePrediction: number, user?: { __typename?: 'User', id: number } | null }> };

export type GetAllUsersQueryVariables = Exact<{ [key: string]: never; }>;


export type GetAllUsersQuery = { __typename?: 'Query', getAllUsers: Array<{ __typename?: 'User', id: number, userName: string, email: string, picture?: string | null }> };

export type LoginMutationVariables = Exact<{
  data: LoginInput;
}>;


export type LoginMutation = { __typename?: 'Mutation', login: string };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { __typename?: 'Mutation', logout: string };


export const CreatePredictionDocument = gql`
    mutation CreatePrediction($data: CreatePredictionInput!) {
  createPrediction(data: $data) {
    id
    matchId
    homeTeamScorePrediction
    awayTeamScorePrediction
    user {
      id
      userName
    }
  }
}
    `;
export type CreatePredictionMutationFn = Apollo.MutationFunction<CreatePredictionMutation, CreatePredictionMutationVariables>;

/**
 * __useCreatePredictionMutation__
 *
 * To run a mutation, you first call `useCreatePredictionMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreatePredictionMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createPredictionMutation, { data, loading, error }] = useCreatePredictionMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreatePredictionMutation(baseOptions?: Apollo.MutationHookOptions<CreatePredictionMutation, CreatePredictionMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreatePredictionMutation, CreatePredictionMutationVariables>(CreatePredictionDocument, options);
      }
export type CreatePredictionMutationHookResult = ReturnType<typeof useCreatePredictionMutation>;
export type CreatePredictionMutationResult = Apollo.MutationResult<CreatePredictionMutation>;
export type CreatePredictionMutationOptions = Apollo.BaseMutationOptions<CreatePredictionMutation, CreatePredictionMutationVariables>;
export const CreateUserDocument = gql`
    mutation CreateUser($data: UserInput!) {
  createUSer(data: $data) {
    id
  }
}
    `;
export type CreateUserMutationFn = Apollo.MutationFunction<CreateUserMutation, CreateUserMutationVariables>;

/**
 * __useCreateUserMutation__
 *
 * To run a mutation, you first call `useCreateUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createUserMutation, { data, loading, error }] = useCreateUserMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useCreateUserMutation(baseOptions?: Apollo.MutationHookOptions<CreateUserMutation, CreateUserMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<CreateUserMutation, CreateUserMutationVariables>(CreateUserDocument, options);
      }
export type CreateUserMutationHookResult = ReturnType<typeof useCreateUserMutation>;
export type CreateUserMutationResult = Apollo.MutationResult<CreateUserMutation>;
export type CreateUserMutationOptions = Apollo.BaseMutationOptions<CreateUserMutation, CreateUserMutationVariables>;
export const FetchMatchesFromApiDocument = gql`
    query FetchMatchesFromAPI {
  fetchMatchesFromAPI {
    id
    group
    homeTeam {
      name
      crest
    }
    awayTeam {
      name
      crest
    }
    status
    utcDate
    score {
      winner
      duration
      fullTime {
        home
        away
      }
    }
  }
}
    `;

/**
 * __useFetchMatchesFromApiQuery__
 *
 * To run a query within a React component, call `useFetchMatchesFromApiQuery` and pass it any options that fit your needs.
 * When your component renders, `useFetchMatchesFromApiQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFetchMatchesFromApiQuery({
 *   variables: {
 *   },
 * });
 */
export function useFetchMatchesFromApiQuery(baseOptions?: Apollo.QueryHookOptions<FetchMatchesFromApiQuery, FetchMatchesFromApiQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<FetchMatchesFromApiQuery, FetchMatchesFromApiQueryVariables>(FetchMatchesFromApiDocument, options);
      }
export function useFetchMatchesFromApiLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FetchMatchesFromApiQuery, FetchMatchesFromApiQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<FetchMatchesFromApiQuery, FetchMatchesFromApiQueryVariables>(FetchMatchesFromApiDocument, options);
        }
export type FetchMatchesFromApiQueryHookResult = ReturnType<typeof useFetchMatchesFromApiQuery>;
export type FetchMatchesFromApiLazyQueryHookResult = ReturnType<typeof useFetchMatchesFromApiLazyQuery>;
export type FetchMatchesFromApiQueryResult = Apollo.QueryResult<FetchMatchesFromApiQuery, FetchMatchesFromApiQueryVariables>;
export const GetProfileDocument = gql`
    query getProfile {
  profile {
    id
  }
}
    `;

/**
 * __useGetProfileQuery__
 *
 * To run a query within a React component, call `useGetProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetProfileQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetProfileQuery(baseOptions?: Apollo.QueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
      }
export function useGetProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetProfileQuery, GetProfileQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetProfileQuery, GetProfileQueryVariables>(GetProfileDocument, options);
        }
export type GetProfileQueryHookResult = ReturnType<typeof useGetProfileQuery>;
export type GetProfileLazyQueryHookResult = ReturnType<typeof useGetProfileLazyQuery>;
export type GetProfileQueryResult = Apollo.QueryResult<GetProfileQuery, GetProfileQueryVariables>;
export const GetUserPredictionsDocument = gql`
    query GetUserPredictions($userId: Int!) {
  getUserPredictions(userId: $userId) {
    matchId
    homeTeamScorePrediction
    awayTeamScorePrediction
    user {
      id
    }
  }
}
    `;

/**
 * __useGetUserPredictionsQuery__
 *
 * To run a query within a React component, call `useGetUserPredictionsQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetUserPredictionsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetUserPredictionsQuery({
 *   variables: {
 *      userId: // value for 'userId'
 *   },
 * });
 */
export function useGetUserPredictionsQuery(baseOptions: Apollo.QueryHookOptions<GetUserPredictionsQuery, GetUserPredictionsQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetUserPredictionsQuery, GetUserPredictionsQueryVariables>(GetUserPredictionsDocument, options);
      }
export function useGetUserPredictionsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetUserPredictionsQuery, GetUserPredictionsQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetUserPredictionsQuery, GetUserPredictionsQueryVariables>(GetUserPredictionsDocument, options);
        }
export type GetUserPredictionsQueryHookResult = ReturnType<typeof useGetUserPredictionsQuery>;
export type GetUserPredictionsLazyQueryHookResult = ReturnType<typeof useGetUserPredictionsLazyQuery>;
export type GetUserPredictionsQueryResult = Apollo.QueryResult<GetUserPredictionsQuery, GetUserPredictionsQueryVariables>;
export const GetAllUsersDocument = gql`
    query getAllUsers {
  getAllUsers {
    id
    userName
    email
    picture
  }
}
    `;

/**
 * __useGetAllUsersQuery__
 *
 * To run a query within a React component, call `useGetAllUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useGetAllUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useGetAllUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useGetAllUsersQuery(baseOptions?: Apollo.QueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
      }
export function useGetAllUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<GetAllUsersQuery, GetAllUsersQueryVariables>) {
          const options = {...defaultOptions, ...baseOptions}
          return Apollo.useLazyQuery<GetAllUsersQuery, GetAllUsersQueryVariables>(GetAllUsersDocument, options);
        }
export type GetAllUsersQueryHookResult = ReturnType<typeof useGetAllUsersQuery>;
export type GetAllUsersLazyQueryHookResult = ReturnType<typeof useGetAllUsersLazyQuery>;
export type GetAllUsersQueryResult = Apollo.QueryResult<GetAllUsersQuery, GetAllUsersQueryVariables>;
export const LoginDocument = gql`
    mutation Login($data: LoginInput!) {
  login(data: $data)
}
    `;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      data: // value for 'data'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, options);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        const options = {...defaultOptions, ...baseOptions}
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, options);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;