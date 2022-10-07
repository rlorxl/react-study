# [236~259] Redux

`npm install redux`

`npm install redux react-redux`

- 리액트 앱에서 리덕스 스토어, 리듀서에 접속하여 컴포넌트를 구독할 수 있도록 돕는 패키지.

- 리듀서 함수는 리덕스 라이브러리에 의해 호출된다.

- 리듀서 함수는 2개의 파라미터를 받는데, '기존의 상태'와 '액션'이다.

> Inputs: Old State + Dispatched Action

리듀서 함수는 항상 새로운 상태 객체를 리턴한다. 그래서 리듀서 함수는 언제나 순수함수가 되어야 한다. (http요청을 하거나, 로컬 스토리지에 저장하거나하는 부수적인 효과가 없어야 한다.)

> Output: New State Object

### redux 기본설정

**1. node용 리덕스 스토어**

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

**2. 리액트용 리덕스 스토어**

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

<br/>

### 제공자 - Provider

`import { Provider } from 'react-redux';`

`import store from './store/index';`

`<Provider store={store}><App /></Provider>`

보내줄 state를 제공받을 컴포넌트들을 감싸는 울타리의 역할. Provider를 import한 뒤 제공하고자 하는 컴포넌트 (여기서는 최상위)를 감싼다. store의 밸류로 들어간 store는 import해 온 store.

<br/>

### useSelector

스토어가 관리하는 데이터에 접근할 수 있게하는 hook.  
스토어의 상태값을 반환해주는 역할을 한다. useSelector를 사용한 함수에서 리덕스 스토어의 상태값이 바뀐 경우 ( 버튼 클릭 등의 이벤트를 통해 액션이 실행되어 상태값이 변경된 경우) 바뀐 스토어의 상태값을 다시 가져와 컴포넌트를 렌더링 시킨다.

`const counter = useSelector(state => state.counter)`

counter 상수는 리덕스가 관리하는 상태를 받고, 상태의 일부를 리턴한다. 여기서는 state.counter.  
useSelector를 사용할 때 리액트 리덕스가 자동으로 서브스크립션을 설정한다. 그러면 상태 변경이 있을 때 마다, 스토어에서 데이터가 바뀔 때 마다 컴포넌트가 업데이트 되고 자동으로 설정한 상수는 가장 최신의 데이터(값)을 받을 것이다.

#### 주의할 점

> reducer에서 반환하는 객체는 기존의 state와 병합되지 않고 기존 state를 덮어쓴다. 절대 원본 state를 변경해서는 안되며 state를 업데이트 할 때는 항상 다른 state를 설정해야 한다.

---

## Redux Toolkit

`npm install @reduxjs/toolkit`

리덕스를 더 편하고 쉽게 작동할 수 있게 해주는 추가적 패키지.

저장소 준비, 리듀서 생산과 불변 수정 로직 작성, 상태 ‘조각'전부를 한번에 작성하는 등 일반적인 작업들을 단순화해주는 유틸리티를 포함하고 있다.

### configurestore

configurestore는 createStore처럼 store를 만드는데 다른 점은 여러개의 리듀서를 하나의 리듀서로 쉽게 합칠 수 있게 한다.

configurestore는 store내 reducer를 통한 state 변화, action dispatch 등의 흐름을 UI를 통해 관리해주는 기능을 제공한다. middleWare가 장착된 store를 생성하여 state, API 관리 등을 해줄 수 있다.

```js
// 저장소 준비 - configurestore - index.js
import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './root';
import themeReducer from './theme';

// 여러개의 리듀서를 하나로 합치는 작업
const store = configureStore({
  reducer: {
    user: userReducer,
    theme: themeReducer,
  },
});

export default store;
```

### createSlice

createSlice를 사용하면 기본적으로 action에 대한 별도 함수 설정, 해당 함수에 따른 객체 return 및 state mutation logic(reducer 내부)을 따로 작성하지 않아도 된다. 즉 createSlice 내부에서 모든 작업을 한번에 수행할 수 있다.

```js
// 기본예시
import { createSlice } from '@reduxjs/toolkit';

const counterSlice = createSlice({
  name: 'counter',
  initialState: 0,
  reducers: {
    increment: state => state + 1,
  },
});
```

```js
// 예시2
import { createSlice } from '@reduxjs/toolkit';

// 초기 값 (아무 상태도 변경하지 않았을 때 나올 데이터)
const initialStateValue = { name: '', age: 0, email: '' };

const userSlice = createSlice({
  name: 'user',
  initialState: { value: initialStateValue },
  reducers: {
    login: (state, action) => {
      // 기존에 리듀서 함수로 작성했던 부분이 객체 안으로 들어왔다. 이때 if문을 작성할 필요가 없다 (어떤 액션인지에 따라 메서드가 자동 호출됨.)
      state.value = action.payload;
    },
    logout: state => {
      state.value = initialStateValue;
    },
  },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;
```

redux toolkit과 함께 createSlice함수를 사용하면 기존 state를 직접 변경하는 것처럼 작성할 수 있는데 그 이유는 redux toolkit은 내부적으로 immer라는 다른 패키지를 사용하는데 코드를 감지하고 자동으로 원래 있는 상태를 복제한다.
그리고 새로운 상태 객체를 생성하고 모든 상태를 변경할 수 없게 유지하고, 변경한 상태는 변하지 않도록 오버라이드한다.

createSlice()내의 reducers로 만든 객체의 프로퍼티키의 콜백 함수는 두개의 파라미터를 받을 수 있다.

- state : 우리가 초기값으로 만든 initialState객체의 프로퍼티 키값과 완전히 동일한 프로퍼티들을 가지고 있다.
- action : payload와 type을 포함하는 객체.
  - payload : 상태를 변경할 때 사용할 수 있는 전달할 정보가 포함되어 있다. 마치 함수처럼 인수를 포함할 수 있고 해당 인수를 이용해 변수 값을 변경 할 수 있다. state를 변경하려면 payload에 새 값을 포함하는 객체를 전달하여 해당 정보에 접근할 수 있다.
  - type : 잘 사용하지 않음…..?

```js
// Login.js
import { useDispatch } from 'react-redux';
import { userActions } from '../store/user';

const Login = () => {
  const dispatch = useDispatch();

  return (
    <button
      onClick={() =>
        dispatch(
          login({
            name: 'Pedro',
            age: 20,
            email: 'pedro@gmail.com',
          }) // action 내용 전달!
        )
      }
    >
      Login
    </button>;

  )
};

export default Login;
```
