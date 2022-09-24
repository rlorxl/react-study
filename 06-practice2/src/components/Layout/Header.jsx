import React from 'react';
import mealsImg from '../../assets/meals.jpeg'; // 로컬이미지 가져오기
import styles from './Header.module.css';
import HeaderCartButton from './HeaderCartButton';

const Header = props => {
  return (
    <>
      <header className={styles.header}>
        <h1>ReactMeals</h1>
        <HeaderCartButton onClick={props.onShowCart} />
      </header>
      <div className={styles['main-image']}>
        <img src={mealsImg} alt="A table full of delicious food" />
      </div>
    </>
  );
};

export default Header;
