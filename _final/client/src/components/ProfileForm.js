import gql from 'graphql-tag';
import React, { useState } from 'react';
import { Mutation } from 'react-apollo';
import styled from 'styled-components';
import Button from './Button';
import RawInput from './Input';
import { userQuery } from '../queries';

const updateUserMutation = gql`
  mutation updateUser($id: ID!, $bio: String, $displayName: String, $photo: String) {
    updateUser(id: $id, bio: $bio, displayName: $displayName, photo: $photo) {
      id
    }
  }
`;

const Form = styled.form`
  margin: 16px 0;
`;

const Input = styled(RawInput)`
  margin: 8px 0;
`;

const Actions = styled.div`
  display: flex;
  margin: 8px 0;
`;

const SaveButton = styled(Button).attrs({ primary: true })`
  margin-left: 16px;
`;

const ProfileForm = ({ user, setEditing }) => {
  // const [isEditing, setEditing] = useState(false);
  const [displayName, setDisplayName] = useState(user.displayName);
  const [bio, setBio] = useState(user.bio);
  const [photo, setPhoto] = useState(user.photo);

  const reset = () => {
    setDisplayName(user.displayName);
    setBio(user.bio);
    setPhoto(user.photo);
    setEditing(false);
  };

  const onNameChange = event => setDisplayName(event.target.value);
  const onBioChange = event => setBio(event.target.value);
  const onPhotoChange = event => setPhoto(event.target.value);

  return (
    <Mutation
      mutation={updateUserMutation}
      variables={{
        id: user.id, displayName, bio, photo,
      }}
      onCompleted={reset}
      refetchQueries={[{ query: userQuery, variables: { username: user.username } }]}
      awaitRefetchQueries
    >
      {(mutate) => {
        const onFormSubmit = (event) => {
          event.preventDefault();
          mutate();
        };

        return (
          <Form onSubmit={onFormSubmit}>
            <Input placeholder="Name" value={displayName} onChange={onNameChange} big />
            <Input placeholder="Bio" value={bio} onChange={onBioChange} />
            <Input placeholder="Avatar URL" value={photo} onChange={onPhotoChange} />
            <Actions>
              <Button type="reset" onClick={reset}>
                Cancel
              </Button>
              <SaveButton primary disabled={displayName === '' || !photo.startsWith('http')}>
                Save
              </SaveButton>
            </Actions>
          </Form>
        );
      }}
    </Mutation>
  );
};

export default ProfileForm;
