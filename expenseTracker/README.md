# [24~47] 리액트 기초 및 실습 컴포넌트

## JSX

jsx : 자바스크립트를 확장한 문법

1. 태그는 닫혀있어야 한다. `<div></div>` `<input />` `<Hello />`
2. 두개 이상의 태그는 하나의 태그로 감싸져있어야 한다.
   `function App() { return ( <> <Hello /> <div></div> </> ) }`
   fragment </> : 비어있는 태그 (불필요하게 div를 쓰지 않고 빈태그로 감싸기 위해 사용한다.)
   >
3. jsx 내부에서 변수나 함수를 사용할 때는 중괄호`{}`를 사용하고,
   중괄호 안에서는 **유효한 모든 자바스크립트 표현식을 넣을 수 있다.**
   ```js
   function App() {
     const name = 'react';
     return <div>{name}</div>;
   }
   ```

### jsx 자세히 보기

```js
return (
  <div>
    <h2>Let's get started!</h2>
    <Expenses items={expenses} />
  </div>
);

// 위의 jsx구문은 아래와 같다.
return React.createElement(
  'div',
  {},
  React.createElement('h2', {}, "Let's get started!"),
  React.createElement(Expenses, { items: expenses })
);
```

두개 이상의 태그가 하나의 태그로 감싸져있어야 하는 이유
→ return뒤에는 하나의 문만 와야하기 때문에 래퍼가 필요한 것.

- jsx도 표현식이다.
  jsx를 if문 및 for문 안에 사용하고, 변수에 할당하고 함수로부터 반환할 수 있다.

```js
function getGreeting(user) {
  if (user) {
    return <h1>Hello, {formatName(user)}!</h1>;
  }
  return <h1>Hello, Stranger</h1>;
}
```

---

## 스타일 설정

- 태그에 인라인으로 작성하지 않는다.
- 객체의 형태로 만들어서 넣어줘야 하고 클래스 설정은 카멜케이스를 사용한다.
- css class를 태그에 지정할때는 css파일을 import한 후 className을 쓴다.

  >

  ```js
  import ‘./App.css’;
  function App() {
   const style = {
    backgroundColor: ‘black’,
    color: ‘aqua’,
    fontSize: 24,
   };

   return (
   <>
    <div style={style}>{name}</div>
    <div className=”gray-box”></div>
   </>
   )
  }
  ```

---

## Component 분리하기

- 컴포넌트란 UI를 재사용 가능한 개별적인 여러 조각으로 나눈 조각이다.
- 컴포넌트를 재사용하려면 함수형태로 만들어 줘야한다. 그리고 컴포넌트는 항상 대문자로 시작해야 한다.

**1. 시작하기**

- src폴더 안에 Hello.js 라는 파일을 만들고 상단에 import React from ‘react’; 를 입력한다.
- 함수형태의 컴포넌트를 작성 후 최하단에는 export default Hello; 를 작성한다. (내보내기)
- App.js 파일로 돌아가서 최상단에 import Hello from ‘./Hello’; 작성. (import 파일이름 from ‘상대경로')
- 방금만든 Hello.js파일을 불러온다. 그리고 부모 컴포넌트 (ex. function App() ) 안에 `<Hello />` 를 리턴한다.
  `<Hello />`는 재사용이 가능한 ui의 조각이다.

  ````js
  import Hello from './Hello';

      function App() {
        return (
          <>
            <div className="App">
             <Hello />
            </div>
          </>
        );
      }

      export default App;
      ```

  ````

**2. 컴포넌트를 정의하는 방법**

- JavaScript함수로 작성
  ```js
  function Hello(props) {
    return <h1>Hello, {props.name}</h1>;
  }
  ```
- ES6 class를 사용하여 작성
  ```js
  class Hello extends React.Component {
    render() {
      return <h1>Hello, {this.props.name}</h1>;
    }
  }
  ```

---

## props를 통해 데이터 전달하기

**Q. 만약 각 페이지마다 컴포넌트 안의 내용을 조금씩 다르게 보여주고 싶다면?**
props(properties)를 활용하면 사용자 정의 컴포넌트에 추가적인 값을 전달할 수 있다.
props를 받아서 쓸 함수의 파라미터에 props를 쓰고 props.name과 같은 방식으로 값을 받아올 수 있다.
props로 상위 컴포넌트에서 하위 컴포넌트로, 그리고 다시 props를 사용해서 더 안쪽에 있는 하위 컴포넌트로 데이터를 전달한다.

```js
function App(props) {
  return (
    <div>
      <Hello name={props.name} color={props.color} />
    </div>
  );
}
```

### 객체형식과 비구조화 할당

props를 스프레드 문법을 통해 객체 상태의 인자로 넣어주고 비구조화 할당으로 전달받으면 props.name의 형식을 사용하지 않고 프로퍼티 이름만 적어주면 좀 더 깔끔하고 명시적으로 작성할 수 있다.

```js
function App() {
  const info = {
    name: 'react',
    color: 'red',
  };

  return (
    <div className="App">
          
      <Welcome {...info} />
        
    </div>
  );
}
```

```js
function Hello({ name, color }) {
  return <h1 style={{ color }}>Hello, {name}</h1>;
}
```

---

## 사용자지정 래퍼 컴포넌트 만들기

### children prop

컴포넌트의 여는 태그와 닫는 태그 사이의 컨텐츠.
`<Welcome>Hello World!</Welcome>`
Hello World!라는 문자열은 Welcome컴포넌트의 props.children이다.

공통적인 속성(HTML구조나 스타일)을 가지고 있는 컨테이너를 재사용이 가능한 래퍼 컴포넌트로 만들어서 div태그를 대체할 수 있다.
중복되는 코드를 추출해서 코드중복을 줄이고 컴포넌트를 깔끔하게 유지할 수 있도록 컴포넌트를 합성한다.

```js
// Card.js
import './Card.css';

function Card(props) {
  const classes = 'card ' + props.className;
  return <div className={classes}>{props.children}</div>;
}

export default Card;
```

- 공통적인 css속성을 가지고 있는 Card 컴포넌트
  props.children은 Card 커스텀 컴포넌트 태그 사이의 요소들을 가리킨다.
  공통 클래스와 함께 각각의 클래스도 설정하기 위해 classes를 className으로 설정하여 디폴트가 되는 클래스인 'card'와 함께 추가될 수 있도록한다.

```js
// ExpenseItem.js
import React from 'react';
import ExpenseDate from './ExpenseDate';
import Card from './Card';
import './ExpenseItem.css';

function ExpenseItem(props) {
  return (
    <Card className="expense-item">
      {' '}
      // Card는 사용자 지정 커스텀 컴포넌트이다.
      <ExpenseDate date={props.date} />
      <div className="expense-item__description">
        <h2>{props.title}</h2>
        <div className="expense-item__price">${props.amount}</div>
      </div>
    </Card>
  );
}

export default ExpenseItem;
```
