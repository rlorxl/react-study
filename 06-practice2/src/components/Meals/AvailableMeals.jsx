import React from 'react';
import Card from '../UI/Card';
import MealItem from './MealItem/MealItem';
import styles from './AvailableMeals.module.css';
import { useEffect } from 'react';
import { useState } from 'react';

const AvailableMeals = () => {
  const [meals, setMeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [httpError, setHttpError] = useState();

  useEffect(() => {
    // useEffect를 사용한 함수는 promise를 반환하면 안되기 때문에 useEffect내부에서 바로 async, await을 사용할 수 없고 함수로 따로 지정해야 한다.
    const fetchMeals = async () => {
      // try {
      const response = await fetch(
        'https://react-http-853e8-default-rtdb.firebaseio.com/meals.json'
      );

      if (!response.ok) {
        throw new Error('Something went wrong!'); // 생성된 오류 객체의 message프로퍼티에 문자를 저장.
      }

      const responseData = await response.json();

      const loadedMeals = [];

      for (const key in responseData) {
        loadedMeals.push({
          id: key,
          name: responseData[key].name,
          description: responseData[key].description,
          price: responseData[key].price,
        });
      }

      setMeals(loadedMeals);
      setIsLoading(false);
      // } catch (error) {
      //   setIsLoading(false);
      //   setHttpError(error.message);
      // }
    };

    // fetchMeals();
    fetchMeals().catch(error => {
      setIsLoading(false);
      setHttpError(error.message);
    });
  }, []);

  if (isLoading) {
    return (
      <section className={styles.MealsLoading}>
        <p>Loading...</p>
      </section>
    );
  }

  if (httpError) {
    return (
      <section className={styles.MealsError}>
        <p>{httpError}</p>
      </section>
    );
  }

  return (
    <section className={styles.meals}>
      <Card>
        <ul>
          {meals.map(meal => (
            <MealItem
              key={meal.id}
              id={meal.id}
              name={meal.name}
              desc={meal.description}
              price={meal.price}
            />
          ))}
        </ul>
      </Card>
    </section>
  );
};

export default AvailableMeals;
