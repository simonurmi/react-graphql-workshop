import gql from 'graphql-tag';
import React, { Suspense, lazy } from 'react';
import { Query } from 'react-apollo';
import { Router } from '@reach/router';
import Navbar from './Navbar';
import Loading from './Loading';

const Home = lazy(() => import('../pages/Home'));
const Profile = lazy(() => import('../pages/Profile'));

const currentUserQuery = gql`
  query getCurrentUser {
    me {
      id
      username
      displayName
      photo
    }
  }
`;

const App = () => (
  <Query query={currentUserQuery}>
    {({ data, loading, error }) => {
      if (error) return `Error: ${error.message}`;

      const { me } = data;

      return (
        <>
          <Navbar me={me} />
          <Suspense fallback={<Loading />}>
            <Router primary={false}>
              <Home loading={loading} me={me || {}} path="/" />
              <Profile loading={loading} me={me || {}} path="/:username" />
            </Router>
          </Suspense>
        </>
      );
    }}
  </Query>
);

export default App;
