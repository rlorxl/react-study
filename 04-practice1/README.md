# [108~116] Portals & Refs

## Portals

`import ReactDOM from 'react-dom';`

Portal은 부모 컴포넌트의 DOM계층 구조 바깥에 있는 DOM노드로 자식을 렌더링하는 방법이다.
보통 컴포넌트 렌더링 메서드에서 엘리먼트를 반환할 때 그 엘리먼트의 부모노드에서 가장 가까운 자식으로 DOM에 마운트된다. (#root)  
그런데 DOM의 다른 위치, 이를테면 #root가 아닌 #overlay-root같은 div를 만들어 그 위치에 오버레이되는 요소(모달이나 툴팁 등)를 삽입하고 싶을 때가 있다.

`ReactDOM.createPortal(child,container)`
첫번째 인자는 렌더링할 리액트 노드, 두번째 인자로는 포인터(요소가 렌더링될 실제 DOM엘리먼트)를 설정한다.

```html
<html>
  <body>
    <div id="app-root"></div>
    // 기존 마운트 위치.
    <div id="modal-root"></div>
    // 여기에 마운트 시킨다.
  </body>
</html>
```

```js
// 컴포넌트의 return문 안에서 사용.
{
  ReactDOM.createPortal(
    <Backdrop onConfirm={props.onConfirm} />,
    document.getElementById('backdrop-root')
  );
}
```

---

## Ref

`const nameInputRef = useRef();`

특정 DOM요소에 접근하고 싶을 때 state보다 비교적 간단한 방법으로 useRef가 있다. (포커스, 선택, 애니메이션을 관리하기 위해서는 이런 DOM 노드에 접근하는 것이 불가피하다.)
useRef를 쓰면 단순히 값을 가져오기 위한 행동으로 state를 쓰는 것보다 코드가 간결해지고 데이터를 편하게 가져올 수 있다.

**current prop**

ref를 추가하고 출력해보면 객체가 나오는데 이 객체는 'current'프로퍼티를 항상 가지고 있는 객체이다. current프로퍼티는 ref가 연결된 실제 값(실제 DOM요소)을 가지고 있다.
input에 ref를 연결했다면 input은 항상 value를 가지고 있기 때문에 `nameInputRef.current.value`로 input에 입력한 값을 가지고 올 수 있다.

```js
<input
  type="text"
  id="username"
  autoComplete="off"
  /* value와 onChange는 더이상 필요하지 않음! */
  // value={enteredUsername}
  // onChange={usernameChangeHandler}
  ref={nameInputRef} // 연결하려는 요소에 ref를 추가한다.
/>
```

<br/>

> ref로 DOM요소에 접근해서 조작하는 것이 가능하지만 조작하지 않는것이 좋다. DOM은 리액트에 의해서만 조작되어야 한다. ref는 단순히 데이터, 값을 가져오는 용도로만 사용하는것이 좋다.

---

## Ref 전달하기 - forwardRef

### 부모 컴포넌트에게 DOM ref를 공개하기

자식 컴포넌트의 ref를 자신의(부모) ref로서 외부에 노출시키게 한다. 부모 컴포넌트는 자식 컴포넌트에서 `React.forwardRef`를 통해 전달된 ref를 얻고, 그것을 렌더링되는 DOM으로 전달할 수 있다.

> 보기 드문 경우지만, 부모 컴포넌트에서 자식 컴포넌트의 DOM 노드에 접근하려 하는 경우도 있습니다. 자식 컴포넌트의 DOM 노드에 접근하는 것은 컴포넌트의 캡슐화를 파괴하기 떄문에 권장되지 않습니다. 그렇지만 가끔가다 자식 컴포넌트의 DOM 노드를 포커스하는 일이나, 크기 또는 위치를 계산하는 일 등을 할 때에는 효과적인 방법이 될 수 있습니다. https://ko.reactjs.org/docs/refs-and-the-dom.html

**예시) 자식 컴포넌트 이미지의 값을 가져오기**

1. 예를 들어 CatParent.js 라는 부모 컴포넌트가 있을 때, 먼저 const catRef = useRef(); 와 같이 useRef()함수를 변수 설정하고 <Cat ref={catRef} /> ← 자식 컴포넌트에서 ref를 받아온다.
2. 자식 컴포넌트 함수를 시작할 때 forwardRef 를 적고 props와 함께 ref도 적는다.
3. 이미지의 값을 보내줄 것이므로 img태그안에 ref={ref} 를 작성한다.

```js
const Cat = forwardRef((props, ref) => {
  console.log('자식 컴포넌트 Cat');
  console.log(ref);

  return (
    <div>
      <img
        src="https://static01.nyt.com/images/2016/03/30/universal/ko/well_cat-korean/well_cat-superJumbo-v2.jpg?quality=90&auto=webp"
        alt="cat"
        style={{ width: '150px' }}
        ref={ref}
      ></img>
    </div>
  );
});

export default Cat;
```

`<button onClick={() => alert(catRef.current.height)}>고양이의 크기를 알고싶어</button>`
→ 버튼을 눌렀을 때 alert으로 자식 컴포넌트에서 받아온 이미지의 height값이 나타난다.
