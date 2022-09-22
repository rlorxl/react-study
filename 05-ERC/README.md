# [117 ~ 138] 리듀서(Reducer)를 사용하여 부작용 처리 & 컨텍스트 API 사용하기

## useEffect

컴포넌트가 마운트/언마운트 될 때 호출되는 함수. 코드가 한번만 실행될 수 있도록 보호한다.
useEffect의 두번째 인자로는 의존성 배열(deps)을 등록하는데 의존성 배열안의 값이 바뀔 때 마다 등록한 함수가 호출된다.
deps가 빈 array를 가질 때는 코드가 한번만 호출된다.

```js
// 1. 컴포넌트가 렌더링 될 때마다(이후에) 실행
useEffect(() => {
  console.log('rendering');
});

// 2. 첫 마운트때 실행
useEffect(() => {
  console.log('mounting');
}, []);

// 3. 첫 마운트, 의존성 배열의 값이 변화될 때만 렌더링 됨. (컴포넌트 재평가시)
useEffect(() => {
  console.log('count update');
}, [count]);
```

### cleanup function

return뒤의 함수. useEffect가 다음번에 실행되기 전에 & 컴포넌트 제거 전에 실행된다. (첫 마운트시에는 실행X)  
폼 유효성 검사나 http리퀘스트를 보낼 때 활용할 수 있다. (불필요한 함수 호출을 막을 수 있다.)
아래 예시에서는 유효성 검사시 input입력이 있을 때마다 useEffect가 실행되는데 디바운스로 동작하게 하기 위해서 setTimeout을 추가하고, cleanup함수로는 clearTimeout을 해주었다.
cleanup함수가 useEffect가 실행되기 전에 항상 호출되는데, 0.5초 안에 입력이 연속으로 있을 때는 cleanup함수만 실행되고 setTimeout은 실행되지 않는다.

```js
useEffect(() => {
  const identifier = setTimeout(() => {
    console.log('Checking form validity');
    setFormIsValid(
      // debouncing
      enteredEmail.includes('@') && enteredPassword.trim().length > 6
    );
  }, 500);

  return () => {
    console.log('CLEANUP');
    clearTimeout(identifier);
  };
}, [enteredEmail, enteredPassword]); // 함수자체를 의존성으로 추가한다. -> enteredEmail, enteredPassword가 변경된 경우에 실행. (* setFormEmail은 추가할 필요가 없는데, React는 해당 함수가 절대 변경되지 않도록 보장하므로 종속성으로 추가할 필요가 없다.)
```

### 객체의 특정속성을 종속성으로 추가

객체 디스트럭처링으로 특정 속성 꺼내기

```js
const { isValid: emailIsValid } = emailState;
const { isValid: passwordIsValid } = passwordState;
```

객체 디스트럭처링을 사용하여 emailState.isValid, passwordState.isValid 프로퍼티를 디스트럭처링으로 꺼내서 새로운 변수명으로 지정했다.

```js
useEffect(() => {
  const identifier = setTimeout(() => {
    console.log('Checking form validity!');
    setFormIsValid(emailIsValid && passwordIsValid);
  }, 500);

  return () => {
    console.log('CLEANUP');
    clearTimeout(identifier);
  };
}, [emailIsValid, passwordIsValid]);
```

그리고 지정한 새로운 속성을 종속성으로 추가하여(isValid) emailState, passwordState가 변할 때가 아닌, 유효성검사에서 true,false변경이 있을 때만 작동하도록한 것.

---

## useReducer

useState의 대체함수. useState처럼 state를 생성하고 관리한다.  
context API, redux와 함께 사용하는 경우가 많다.

- 다음 state가 이전 state에 의존적인 경우
- 여러개의 하위값을 포함하는 복잡한 state를 다룰 때

> 다른 state를 기반으로하는 state를 업데이트한다면 하나의 state로 병합하는것이 좋다. 이것은 useState에 객체를 설정해서 관리하는것이 가능하다. 하지만 state가 복잡하고 여러가지 관련된 state가 결합된 경우에는 useReducer를 고려해볼 수 있다.

`import React, { useReduce } from 'react'`
`const [state, dispatchFn] = useReducer(reducerFn, initialState, initFn)`

- reducerFn : 리듀서 함수. 복잡한 state업데이트 로직을 포함하고 있다. 새 액션이 디스패치 될 때마다 리듀서 함수가 호출되고 최신의 state를 반환하도록 해준다.
- initialState, initFn(생략가능) : 초기state, 초기함수 설정이 가능하다. 리듀서 함수는 컴포넌트 내부에서 만든 어떤 데이터도 필요하지 않기 때문에 컴포넌트 함수의 밖에서 만들 수 있다.

```js
const reducer = (state, action) => {
  switch (action.type) {
    case 'increment':
      return { value: action.val, isValid: action.val.includes('@') };
    case 'decrement':
      return { value: state.value, isValid: state.value.includes('@') };
  }
};

const [emailState, dispatchEmail] = useReducer(emailReducer, {
  value: '',
  isValid: null,
});
```

```js
const emailChangeHandler = event => {
  dispatchEmail({ type: 'USER_INPUT', val: event.target.value });
};
```

---

## Context로 리팩토링하기 (중앙 state관리)

전체state를 관리하는 context파일을 만들어 App.jsx컴포넌트를 state관리와 분리한다.
context를 사용하면 어떤 컴포넌트에서도 전역적으로 관리되고 있는 상태값에 접근할 수 있다.
예를 들어 로그인한 유저의 정보나 전체 테마 스타일 등등… 전역으로 관리해야 하는 값, 전역적으로 데이터를 전달해야 할 때 라던지...
<br/>
$$App.js → A → B → C → D$$

_가장 상위의 App.js컴포넌트가 있고 그 하위로 → A → B → C → D 컴포넌트가 있을 때 App.js에서 D 컴포넌트로 state를 전달하려면 (D컴포넌트에서 App상태를 기반으로 무언가 해야할 때) props를 단계별로 하위 컴포넌트로 전달 전달해서 D컴포넌트까지 도달해야 한다. (prop drilling)_
하지만 Context API를 사용한다면 상태를 관리하고 있는 컴포넌트에서 Context를 생성하면 하위 컴포넌트에서 단계별로 props를 전달하지 않아도 한번에 접근 권한이 생긴다.

App컴포넌트는 이제 화면에 무언가를 그리는데에만 집중할 수 있다.
index.jsx(main.jsx)의 App컴포넌트는 contextProvider로 감싼다.

```js
ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthContextProvider>
    <App />
  </AuthContextProvider>
);
```

useContext는 컴포넌트별로 여러개를 만들 수 있는데,

App → A → B → C → D  
　　&nbsp;&nbsp;→ E → F → G → H

같은 형식으로 컴포넌트 트리가 짜여있을 때 ‘A’ 컴포넌트에서 만든 context에는 E~H 컴포넌트는 접근할 수 없다.

잦은 state변경이 있는경우 컨텍스트 사용은 그다지 적합하지 않다. (1초에 여러번, 매초마다 있는경우)
