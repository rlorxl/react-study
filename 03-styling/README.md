# [82~??] 컴포넌트 스타일링

## 스타일 동적으로 추가하기 (inline style)

### 1. jsx구문에 추가

```js
const [isValid, setIsValid] = useState(true);

<label style={{ color: !isValid ? 'red' : 'black' }}>Course Goal</label>
<input
  style={{
    borderColor: !isValid ? 'red' : '#ccc',
    background: !isValid ? 'red' : 'transparent',
  }}
  type="text"
  onChange={goalInputChangeHandler}
/>
```

### 2. class 조건부로 추가

```js
<div className={`form-control ${!isValid ? 'invalid' : ''}`}>
  <label>Course Goal</label>
  <input type="text" onChange={goalInputChangeHandler} />
</div>
```

인라인 스타일은 항상 최우선을 차지하기 때문에 지양된다.

---

## Styled Components

스타일을 클래스를 지정해서 부여하는 경우 동일한 클래스가 의도치않은 곳에 지정된다던지 다른 컴포넌트에 영향을 미칠 가능성이 있다.
이런 상황을 피할 수 있는 접근 방법의 첫번째는 styled component를 사용하는 것이다.
styled component는 일정 스타일이 첨부된 컴포넌트를 구축할 수 있게 도와주는 패키지이다.  
패키지가 적용된 컴포넌트에만 스타일이 지정되며 다른 컴포넌트에는 영향을 미치지 않는다.

`import styled from 'styled-components'`

styled component 쓰는 법은 컴포넌트 이름을 설정하고 ` style.button``  `과 같은 형태로 쓴다. 여기서 button은 styled객체의 메소드이며 새로운 button컴포넌트를 반환한다.  
styled 패키지는 모든 html요소에 대한 메소드를 가지고 있기 때문에 html요소라면 ` styled.div``  `, ` styled.h1``  `처럼 쓸 수 있다. 그리고 백틱안에 바로 스타일을 작성한다.

```js
const Button = styled.button`
  font: inherit;
  padding: 0.5rem 1.5rem;
  border: 1px solid #8b005d;
  color: white;
  background: #8b005d;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.26);
  cursor: pointer;

  &:focus {
    outline: none;
  }
`;
```

### styled component & 동적 props

컴포넌트에서 props로 상태값을 전달해서 값에 따라 스타일을 동적으로 설정해줄 수 있다.
`<FormControl invalid={!isValid}>`과 같은 형태로 props를 전달하고 styled컴포넌트 안에서 `props.invalid`로 조건부 스타일 지정이 가능하다.

```js
const FormControl = styled.div`
  & input {
    display: block;
    width: 100%;
    border: 1px solid ${props => (props.invalid ? 'red' : '#ccc')};
    background: ${props => (props.invalid ? '#ffd7d7' : 'transparent')};
    font: inherit;
    line-height: 1.5rem;
    padding: 0 0.25rem;
  }
`;
```

---

## CSS Modules

CSS 모듈은 원래의 css클래스, css파일을 가지고 이름을 바꾸는 작업을 거쳐 임포트하는 css파일을 고유하게 만든다. 그래서 각각의 컴포넌트에 고유한 버전의 스타일과 클래스를 생성할 수 있다. html요소에는 **'컴포넌트 이름\_클래스 이름\_\_고유한 해시값'** 이 들어간다.

1. css파일명을 Button.module.css와 같은 형태로 만든다.
2. `import styles from './Button.module.css';`
3. `className={styles.button}`의 형태로 클래스이름을 지정한다.
