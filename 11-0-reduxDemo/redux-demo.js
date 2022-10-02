const redux = require('redux');

const counterReducer = (state = { counter: 0 }, action) => {
  if (action.type === 'increment') {
    return {
      counter: state.counter + 1,
    };
  }

  if (action.type === 'decrement') {
    return {
      counter: state.counter - 1,
    };
  }

  return state;
};

const store = redux.createStore(counterReducer);

const counterSubscriber = () => {
  const latestState = store.getState(); // 업데이트된 후의 최신상태 스냅샷 제공.
  console.log(latestState);
};

// 리덕스가 구독함수를 인식하도록하고 상태 변경이 있을 때마다 구독함수를 실행하도록 한다.
store.subscribe(counterSubscriber);

// 액션 발송(상태 변경)
store.dispatch({ type: 'increment' });
store.dispatch({ type: 'decrement' });
