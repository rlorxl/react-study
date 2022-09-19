import React, { useState, useRef } from 'react';
import Card from '../UI/Card';
import Button from '../UI/Button';
import ErrorModal from '../UI/ErrorModal';
import classes from './AddUser.module.css';

const AddUser = props => {
  const nameInputRef = useRef();
  const ageInputRef = useRef();

  const [error, setError] = useState();

  const addUserHandler = e => {
    e.preventDefault();
    const enteredUserName = nameInputRef.current.value;
    const enteredUserAge = ageInputRef.current.value;

    if (enteredUserName.trim().length === 0 || enteredUserAge.trim() === 0) {
      setError({
        title: 'Invalid input',
        message: 'Please enter a valid name and age (non-empty values).',
      });
      return;
    }
    if (+enteredUserAge < 1) {
      setError({
        title: 'Invalid age',
        message: 'Please enter a valid age (> 0).',
      });
      return;
    }

    props.onAddUser(enteredUserName, enteredUserAge);

    // * 자주 사용되지 않는 방법임! *
    nameInputRef.current.value = '';
    ageInputRef.current.value = '';
  };

  const errorHandler = () => {
    setError(null);
  };

  return (
    <div>
      {error && (
        <ErrorModal
          title={error.title}
          message={error.message}
          onConfirm={errorHandler}
        />
      )}
      <Card className={classes.input}>
        <form onSubmit={addUserHandler}>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            autoComplete="off"
            ref={nameInputRef}
          />
          <label htmlFor="age">Age(Years)</label>
          <input type="number" id="age" autoComplete="off" ref={ageInputRef} />
          <Button type="submit">Add user</Button>
        </form>
      </Card>
    </div>
  );
};

export default AddUser;
