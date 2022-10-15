import React, { useContext, useRef } from 'react';
import { TodosContext } from '../store/todos-context';
import classes from './NewTodo.module.css';

const NewTodo: React.FC = () => {
  const todosCtx = useContext(TodosContext);

  const todoInputRef = useRef<HTMLInputElement>(null);
  // 모든 DOM요소들은 미리 정의된 타입을 가진다. input요소의 타입은 HTMLInputElement.
  // 타입스크립트는 useRef의 기본값을 지정해주어야 한다.

  const submitHandler = (event: React.FormEvent) => {
    event.preventDefault();

    const enteredText = todoInputRef.current!.value;
    /* 타입스크립트는 옵셔널 체이닝 연산자를 사용하지 않으면 에러라고 인식한다. 기본적으로 value는 어디서 불러오는지에 따라 undefined가 될 수도 있기 때문인데 
    이 시점에는 value가 절대 null이 아니라고 알려주고 싶을 때는 '!.'(느낌표 연산자)을 써주면 명시적으로 undefined가 들어오지 않을 것이라고 알려주게 된다.*/

    if (enteredText.trim().length === 0) {
      // throw an error
      return;
    }

    todosCtx.addTodo(enteredText);
  };

  return (
    <form onSubmit={submitHandler} className={classes.form}>
      <label htmlFor='text'>Todo text</label>
      <input type='text' id='text' ref={todoInputRef} />
      <button>Add Todo</button>
    </form>
  );
};

export default NewTodo;
