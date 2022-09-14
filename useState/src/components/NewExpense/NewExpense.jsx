import React, { useState } from 'react';
import ExpenseForm from './ExpenseForm';
import './NewExpense.css';

const NewExpense = props => {
  const [isEditing, setIsEditing] = useState(false);

  const saveExpenseDataHandler = enteredExpenseData => {
    // 파라미터로 받은 값은 자식 컴포넌트인 ExpenseForm에서 끌어올려진 값임.
    const expenseData = {
      ...enteredExpenseData,
      id: Math.random().toString(),
    };
    props.onAddExpense(expenseData);
    setIsEditing(false);
  };

  const startEditingHandler = () => {
    setIsEditing(true);
  };

  const stopEditingHandler = () => {
    setIsEditing(false);
  };

  return (
    <div className="new-expense">
      {!isEditing ? (
        <button onClick={startEditingHandler}>Add New Expense</button>
      ) : (
        <ExpenseForm
          onSaveExpenseData={saveExpenseDataHandler}
          onCancel={stopEditingHandler}
        />
      )}
      {/* onSaveExpenseData라는 이름의 props로 함수를 전달한다. 이때 전달하는 함수는 실행하지 않는다. 이 함수를 가리키기만 할 뿐이다. */}
    </div>
  );
};

export default NewExpense;
