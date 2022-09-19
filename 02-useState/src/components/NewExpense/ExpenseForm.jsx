import React, { useState } from 'react';
import './ExpenseForm.css';

const ExpenseForm = props => {
  const [enteredTitle, setEnteredTitle] = useState('');
  const [enteredAmount, setEnteredAmount] = useState('');
  const [enteredDate, setEnteredDate] = useState('');

  const titleChangeHandler = event => {
    setEnteredTitle(event.target.value);
    // setUserInput({ ...userInput, title: event.target.value });
  };

  const amountChangeHandler = event => {
    setEnteredAmount(event.target.value);
    // setUserInput({ ...userInput, amount: event.target.value });
  };

  const dateChangeHandler = event => {
    setEnteredDate(event.target.value);
    // setUserInput({ ...userInput, date: event.target.value });
  };

  const submitHandler = e => {
    e.preventDefault();

    const expenseData = {
      title: enteredTitle,
      amount: +enteredAmount,
      date: new Date(enteredDate),
    };

    props.onSaveExpenseData(expenseData); // 부모 컴포넌트와 소통하는 법: 부모 컴포넌트에서 정의된 함수를 호출하며 인자를 전달한다.

    // reset input
    setEnteredAmount('');
    setEnteredAmount('');
    setEnteredDate('');
  };

  return (
    <form onSubmit={submitHandler}>
      <div className="new-expense__controls">
        <div className="new-expense__control">
          <label>Title</label>
          {/* 양방향 바인딩 : 입력에서 변경사항 수신 -> 상태 업데이트 -> 입력에 상태를 다시 보내줌. */}
          <input
            type="text"
            value={enteredTitle}
            onChange={titleChangeHandler}
          />
        </div>
        <div className="new-expense__control">
          <label>Amount</label>
          <input
            type="number"
            min="0.01"
            step="0.01"
            value={enteredAmount}
            onChange={amountChangeHandler}
          />
        </div>
        <div className="new-expense__control">
          <label>Date</label>
          <input
            type="date"
            min="2022-01-01"
            max="2022-12-31"
            value={enteredDate}
            onChange={dateChangeHandler}
          />
        </div>
      </div>
      <div className="new-expense__actions">
        <button type="button" onClick={props.onCancel}>
          Cancel
        </button>
        <button type="submit">Add Expense</button>
      </div>
    </form>
  );
};

export default ExpenseForm;
