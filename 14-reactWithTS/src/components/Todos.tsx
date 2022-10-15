import React, { useContext } from 'react';
import { TodosContext } from '../store/todos-context';
import TodoItem from './TodoItem';
import classes from './Todos.module.css';

// const Todos: React.FC<{ items: Todo[]; onDeleteTodo: (id: string) => void }> = (
//   props
// ) => {
// 필요한 props의 형태를 <>안에 지정한다.
// React.FC(Function Component) : 타입을 React.FC로 설정해서 이 컴포넌트가 함수형으로 동작한다는걸 명확히 한다.
// void는 반환값이 없는 함수 타입을 말한다.

const Todos: React.FC = () => {
  const todosCtx = useContext(TodosContext);

  return (
    <ul className={classes.todos}>
      {todosCtx.items.map((item) => (
        <TodoItem
          key={item.id}
          text={item.text}
          onDelete={todosCtx.deleteTodo.bind(null, item.id)}
        />
      ))}
    </ul>
  );
};

export default Todos;
