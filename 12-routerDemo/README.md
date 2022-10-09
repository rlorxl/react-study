# [276 ~ 302] 리액트 라우터가 있는 SPA 다중페이지 구현하기

사용자가 이동하고자 하는 정확한 url주소를 입력해 해당 페이지로 바로 들어갈 수 있는 것은 웹사이트의 장점이기도 하다.
하지만 싱글 페이지 어플리케이션은 기본적으로 url변경이 일어나지 않기 때문에 항상 첫번째 페이지만을 로드한다.  
리액트 라우터는 경로를 처리할 수 있도록 도와서 경로에 맞는 컴포넌트를 렌더링 하도록 한다.

## react-router

`npm install react-router-dom@5` (ver.5)

`import { Route } from 'react-router-dom`

```js
<Route path="/welcome"> // 특정 경로를 정의
  <Welcome />  // 렌더링 되어야 할 컴포넌트
</Route>
<Route path="/products">
  <Products />
</Route>
```

App을 렌더링하는 index.js파일에서 `BrowserRouter` import하기.

`import { BrowserRouter } from 'react-router-dom`

```js
<BrowserRouter>
  <App />
</BrowserRouter>
```

### 링크 작업하기

일반적인 a태그로 경로에 도달하게 하는 것은 실제로 새로운 서버요청을 보내게 되는 것으로 페이지를 탐색할 때마다 새로고침되며 지금까지의 상태를 모두 잃게 된다. 이것은 단일 페이지를 사용하는 것의 이점을 잃게 되는 것이기 때문에 사용하지 않는다.

**1. 링크 컴포넌트 사용하기**

링크 컴포넌트는 말 그대로 링크를 생성하는 역할을 한다.

`import { Link } from 'react-router-dom'`

```js
<Link to="/welcome">Welcome</Link>
```

**2. NavLink**

`NavLink`는 현재 보여지고 있는 링크 페이지의 버튼에 활성상태를 표시하는 클래스를 부여할 수 있는 역할을 한다.
Link를 NavLink로 바꾸고 `activeClassName`만 추가해주면 된다. css파일에는 .active 상태의 스타일을 추가하면 된다.

---

## useParams

기본경로 뒤에 /:세부 경로 를 붙일 수 있다.

```js
<Route path="/product/:productId">
  <ProductDetail />
</Route>
```

`import { useParams } from 'react-router-dom'`

`const params = useParams()`

세부 경로는 useParams를 이용해서 가져올 수 있다.

이렇게 했을 때의 문제점은 다른 경로로 넘어가지 않고 기존 컴포넌트 내부에서 세부 경로 지정했던 컴포넌트가 불러와진다는 것이다.

해결방법은 React-router-dom에서 제공하는 **Switch컴포넌트**를 사용할 수 있다.  
스위치 컴포넌트는 라우트 컴포넌트 주위에 래핑하고 위부터 아래로 읽었을 때 경로와 가장 먼저 매칭되는 라우트가 활성화된다.

```jss
<Switch>
  <Route path="/welcome">
    <Welcome />
  </Route>
  <Route path="/products" exact>
    <Products />
  </Route>
  <Route path="/products/:productId">
    <ProductDetail />
  </Route>
</Switch>
```

스위치가 경로의 시작 부분과 일치하는 컴포넌트를 찾고 바로 중단되기 때문에 **exact** prop까지 같이 붙여줘야 한다.  
exact는 라우터와 정확히 일치하는 경우에만 작동한다.

### 중첩 라우트

페이지 내부에도 라우트가 필요한 경우가 있다. 예를 들어 조건부로 렌더링 해야하는 컨텐츠의 경우 기존 컴포넌트 내부에 라우트를 중첩시켜 더 구체적으로 일치되는 경로가 있다면 url을 근거로 서로 다른 컨텐츠를 상황에 따라 렌더할 수 있다. 이 기능은 더 복잡한 사용자 인터페이스를 구축하는 데 사용된다.

```js
<section>
  <h1>Welcome</h1>
  <Route path="/welcome/new-user">
    // welcome컴포넌트 내부에서 라우트를 다시 정의할 수 있다. welcome페이지가
    활성화되어있는 경우에만 이 라우트가 평가된다.
    <p>Welcome, new user!</p>
  </Route>
</section>
```

### 리디렉션

`import { Redirect } from 'react-router-dom';`

```js
<Route path="/" exact>
  // 경로가 '/'인 경우에 '/welcome'으로 경로를 다시 보낸다.
  <Redirect to="/welcome" />
</Route>
```

### prompt 컴포넌트

사용자가 양식을 입력할 때 실수로 뒤로 스와이프하거나 뒤로가기 버튼을 눌렀을 경우 상태가 없어져버리는 일이 생길 수 있다.
일부 웹 페이지를 보면 이런 현상이 방지되는 것을 볼 수 있을 것이다. 정말로 페이지를 나갈 것인지 한번 묻는 동작을 구현할 때 리액트 라우터의 `prompt`컴포넌트를 사용할 수 있다.

이 컴포넌트는 사용자가 다른 곳으로 이동할 때 자동으로 그것을 감시하고 특정 조건이 충족되면 떠나기 전에 경고를 표시한다.

```js
<Prompt
  when={isEntering}
  message={(location) =>
    "Are you sure you wnat to leave? All your entered data will be lost!"
  }
/>
```

- when : 사용자가 url을 변경하는 경우 프롬프트가 표시되어야 하는지 여부를 찾기 위해 true나 false를 전달.
- message : 사용자가 나가려고 할 때 보여주고 싶은 텍스트(위치 객체를 얻는 함수)
