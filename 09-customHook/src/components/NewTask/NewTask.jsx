import { useState } from 'react';

import Section from '../UI/Section';
import TaskForm from './TaskForm';
import useHttp from '../../hooks/use-http';

const NewTask = props => {
  const { isLoading, error, sendRequest: sendTaskRequest } = useHttp();

  const createTask = (taskText, taskData) => {
    const generatedId = taskData.name;
    const createdTask = { id: generatedId, text: taskText };

    props.onAddTask(createdTask);
  };

  const enterTaskHandler = async taskText => {
    sendTaskRequest(
      {
        url: 'https://react-http-853e8-default-rtdb.firebaseio.com/tasks.json',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: { text: taskText },
      },
      createTask.bind(null, taskText)
      /* bind(): 함수를 사전에 구성할 수 있게 해줌.
      첫번 째 인자: this예약어(여기에선 필요없으므로 null로 둔다.)
      두 번째 인자: 호출 예정인 함수가 받는 첫번째 인자. 
      
      bind를 했기 때문에 커스텀 훅의 applyData로 넘겨준 인자는 createTask의 두번째 인자로 들어간다.
      */
    );
  };

  return (
    <Section>
      <TaskForm onEnterTask={enterTaskHandler} loading={isLoading} />
      {error && <p>{error}</p>}
    </Section>
  );
};

export default NewTask;
