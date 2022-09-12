#[48 ~ 66] 리액트 State 및 이벤트 다루기

## useState

리액트에서 화면을 업데이트(리렌더링)하고 싶다면 특정 컴포넌트가 변경되었다는것을 알려주는 방법이 필요하다.
useState는 함수 컴포넌트 내에서 어떠한 상태(현재상태)와 리렌더링 되는 상태의 값을 지정해주는 hook이다.

1. useState 라이브러리 import하기
   `import React, { useState } from 'react`

>

2. 컴포넌트 함수 안에서 useState 호출하기

```js
const ExpenseItem = props => {
  const [title, setTitle] = useState(props.title);
  /*
  구조분해할당으로 변수이름 설정.
  - title : 관리되고 있는 값.
  - setTitle : 새로운 title값을 설정하기 위해 호출할 수 있는 함수.
  */

  const clickHandler = () => {
    setTitle('updated!'); // 새로운 값을 설정 - 리액트는 state가 등록된 컴포넌트만 재평가 한다.
    console.log(title);
  };

  return (
    <Card className="expense-item">
      <ExpenseDate date={props.date} />
      <div className="expense-item__description">
        <h2>{title}</h2>
        <div className="expense-item__price">${props.amount}</div>
      </div>
      <button onClick={clickHandler}>Change Title</button>
      /* 클릭 제어 : .addEventListener('click',() => {})가 아닌 `onClick`을 태그안에
      직접적으로 작성한다. */
    </Card>
  );
};
```

- **주의!**
  state는 컴포넌트별 인스턴스를 기반으로 독립적인 state를 갖기 때문에 똑같은 컴포넌트가 여러개 있어도 다른 컴포넌트에서는 state가 변경되지 않는다. 이벤트를 발생시킨 특정 컴포넌트만 재평가 된다.

### 사용자 입력 리스닝

기본적으로 input에 `onChange`이벤트를 달아 input에 변화가 있을 때마다 감지가 가능하다.

### 이전 state에 의존하는 state업데이트

하나의 컴포넌트안에서 여러개의 state를 가지고 있는 것도 가능하다. 하지만 하나의 state를 가지고 있는 것과의 차이가 있다.

- 하나의 state로 관리하려면 초기값을 객체로 주면 된다.

```js
// const [title, setTitle] = useState('');
// const [amount, setAmount] = useState('');
// const [date, setDate] = useState('');

const [userInput, setUserInput] = useState({
  title: '',
  amount: '',
  date: '',
});
```

위와 아래는 완전히 동일하게 동작하는 코드이다.

- 이전state에 의존하는 state를 업데이트 하려면 state를 오버라이드(덮어쓰기)하는 함수 구문을 사용해야 한다.
  <br>
  > 오버라이드 하는 이유 : 불변성을 지켜주어야만 리액트 컴포넌트에서 상태가 업데이트 됨을 감지할 수 있고 이에 필요한 렌더링이 발생한다.
  > 원시타입 (boolean, number, string)은 이미 불변성을 가지고 있다. - 변수에 원시 타입의 값을 할당하면, 메모리에 값 자체가 저장된다.
  > 참조타입(Object, Array)은 불변성을 가지고 있지않다. - 변수에 메모리 값이 담긴 주소가 저장된다. 참조타입은 setState를 할 때 불변성을 가지도록 호출해야 한다. (함수형 컴포넌트에서 상태를 업데이트할 때 값 자체가 대체되기 때문)

<br>

- useState를 세팅할 때는 setState안에 함수를 할당할 수도 있는데 이때 첫번째 인자는 현재 state값을 가리킨다.

```js
const titleChangeHandler = event => {
  setUserInput(prevState => {
    return { ...prevState, title: event.target.value };
  });
};
```

<br>
### 배열 렌더링 - map, key

```js
const App = () => {
  const [names, setName] = useState(['조알라', '이조은']);
  return (
    <div>
      <input type="text" />
          <button>Upload</button>
          
      {names.map((name, idx) => {
        return <p key={idx}>{name}</p>;
      })}
    </div>
  );
};
```

배열을 렌더링할 때 key를 설정해야 효율적으로 렌더링을 할 수 있다.

- Key는 React가 어떤 항목을 변경, 추가 또는 삭제할지 식별하는 것을 돕는다.
- key는 엘리먼트에 안정적인 고유성을 부여하기 위해 배열 내부의 엘리먼트에 지정해야 한다.
- 대부분 데이터의 id를 key로 사용하거나, 배열의 index값을 줄 수 있다.(지양)
- key는 형제사이에서만 고유하면된다. 다른 배열간의 동일한 key사용은 문제없다.
  https://ko.reactjs.org/docs/lists-and-keys.html
