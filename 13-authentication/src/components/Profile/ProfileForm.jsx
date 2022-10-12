import { useRef, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import AuthContext from '../../store/auth-context';
import classes from './ProfileForm.module.css';

// 비밀번호 변경 폼
const ProfileForm = () => {
  const history = useHistory();
  const newPasswordInputRef = useRef();
  const authCtx = useContext(AuthContext);

  const submitHandler = (e) => {
    e.preventDefault();

    const enteredNewPassword = newPasswordInputRef.current.value;

    // optional: add validation

    fetch(
      'https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDtr9PdL9GSyR6LjtOhuX-3W0-R6vhb4h0',
      {
        method: 'POST',
        body: JSON.stringify({
          idToken: authCtx.token,
          password: enteredNewPassword,
          returnsecureToken: false,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }
    ).then((res) => {
      // 항상 성공이라고 가정
      console.log('비밀번호 변경 성공');
      history.replace('/');
    });
  };
  return (
    <form className={classes.form} onSubmit={submitHandler}>
      <div className={classes.control}>
        <label htmlFor='new-password'>New Password</label>
        <input
          type='password'
          id='new-password'
          minLength='7'
          ref={newPasswordInputRef}
        />
      </div>
      <div className={classes.action}>
        <button>Change Password</button>
      </div>
    </form>
  );
};

export default ProfileForm;
