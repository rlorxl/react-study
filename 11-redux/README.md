# [236~259] Redux

`npm install redux`

`npm install redux react-redux`
: 리액트 앱에서 리덕스 스토어, 리듀서에 접속하여 컴포넌트를 구독할 수 있도록 돕는 패키지.

리듀서 함수는 리덕스 라이브러리에 의해 호출된다.

리듀서 함수는 2개의 파라미터를 받는데, '기존의 상태'와 '액션'이다.

> Inputs: Old State + Dispatched Action

리듀서 함수는 항상 새로운 상태 객체를 리턴한다. 그래서 리듀서 함수는 언제나 순수함수가 되어야 한다. (http요청을 하거나, 로컬 스토리지에 저장하거나하는 부수적인 효과가 없어야 한다.)

> Output: New State Object

### redux 기본설정

1. node용 리덕스 스토어

```js
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
```

2. 리액트용 리덕스 스토어

```js
import { createStore } from 'redux';

const counterReducer = (state = 0, action) => {
  if (action.type === 'increment') {
    return { counter: state.counter + 1 };
  }

  if (action.type === 'decrement') {
    return { counter: state.counter - 1 };
  }

  return state;
};

const store = createStore(counterReducer);

export default store;
```

### 제공자 - Provider

`import { Provider } from 'react-redux';`

`import store from './store/index';`

`<Provider store={store}><App /></Provider>`
Provider를 import한 뒤 제공하고자 하는 컴포넌트 (여기서는 최상위)를 감싼다. store의 밸류로 들어간 store는 import해 온 store.

---

## useSelector

스토어가 관리하는 데이터에 접근할 수 있게하는 hook.

`const counter = useSelector(state => state.counter)`
counter 상수는 리덕스가 관리하는 상태를 받고, 상태의 일부를 리턴한다. 여기서는 state.counter.
useSelector를 사용할 때 리액트 리덕스가 자동으로 서브스크립션을 설정한다. 그러면 상태 변경이 있을 때 마다, 스토어에서 데이터가 바뀔 때 마다 컴포넌트가 업데이트 되고 자동으로 설정한 상수는 가장 최신의 데이터(값)을 받을 것이다.
