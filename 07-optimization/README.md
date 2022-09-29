# [159~170] A Look Behind The Scenes Of React & Optimization Techniques

## useMemo

이전에 연산된 값을 재사용하는 방법. (메모이제이션 - 캐시에서 꺼내서 사용한다)
성능을 최적화해야하는 상황에서 사용한다.
특정 값이 바뀌었을 때에만 연산 하도록 처리한다.
원하는 값이 바뀌지 않았다면 리렌더링할 때 이전에 만들었던 값을 재사용한다.

`const count = useMemo(() => countActiveUsers(users), [])`

- 첫번째 인자 - 메모이제이션해줄 데이터
- 두번째 인자(의존성 배열) → 뎁스 값이 업데이트될 때만 값을 새로 연산한다. 빈 배열일 경우는 처음 마운트 될때 값을 계산.

> 객체 타입 안에 있는 값이 바뀌었을 때 → 객체 타입은 변수안에 값 자체가 담기지 않고 메모리상의 주소값으로 저장되기 때문에 함수형 컴포넌트에서 리렌더링할 때 주소값(메모리 공간?)도 바뀌는것으로 인식되어 예상하지 않은 호출이 일어날 수 있다. 이 때 useMemo를 사용하면 불필요한 호출을 막을 수 있다.

```js
const location = useMemo(() => {
  return { country: isKorea ? '한국' : '외국' };
}, [isKorea]);

useEffect(() => {
  console.log('isKorea의 값이 바뀌었습니다.');
}, [isKorea]);
```

location은 useMemo를 사용하고 있기 때문에 객체의 isKorea가 실제로 변화가 있을 때만 동작하게 한다.
원래는 useMemo로 감싸지 않으면 useEffect의 의존성 배열에 isKorea를 넣어도 다른게 바뀌었을 때도 useEffect안의 로직이 동작한다.
useMemo에서 전달된 함수는 랜더링 중에 실행되므로, 랜더링 중에서 실행하지 않는 함수는 useEffect를 사용할 것

### 컴포넌트에 useMemo적용

`export default React.memo(Component)`

props값이 바뀐 경우에만 컴포넌트를 재실행 및 재평가한다. (함수형 컴포넌트에서만 최적화 가능.)
변경이 없는 컴포넌트에 대해 매번 재평가하는 것은 가치가 없기 때문에 useMemo를 사용해서 재평가를 막을 수 있다.

<br/>

**useMemo를 남용하지 마세요!**

> memo메소드는 App에 변경이 발생할 때마다 memo를 사용한 컴포넌트에서 기존 props값과 새로운 값을 비교한다. 그러면 비교하는 작업에대한 성능 비용이 든다. 컴포넌트를 재평가하는 데에 필요한 성능 비용과 props를 비교하는 성능 비용을 서로 맞바꾸는 것이다.

<br/>

useMemo를 사용해도 props로 함수를 넘겨준다면 제대로 동작하지 않는 것처럼 보인다. 왜 그럴까? 자바스크립트의 동작 방식 때문인데 useMemo가 하는일은 props의 값을 확인하고 이전의 값과 비교를 한다고 했다. 이 작업은 일반 비교 연산자를 통해 하기 때문에 자바스크립트는 객체나 함수에 대해서는 변경되지 않은 값도 같지 않다고 인식한다. 함수도 하나의 객체에 불과하기 때문에 내용이 같다고 해도 비교했을때는 달라졌다고 인식하여 다시 재실행되는 것이다.

---

## useCallback

`const someFunction = useCallback(() => {},[deps]))`

useCallback도 memoization하는것은 useMemo와 동일한데 콜백함수 자체를 메모이제이션한다.
컴포넌트 내부의 함수를 useCallback으로 감싸면 컴포넌트가 첫마운트 될 때 함수와 값을 저장해 두었다가 다시 렌더링 할 때 저장되어있던 함수, 값(저장될 시점)을 꺼내서 재사용한다.

함수는 객체다.
컴포넌트 렌더링 → 컴포넌트 함수 호출 → 모든 내부 변수 초기화
의존성배열의 값이 변경이 있을 때만 새로 만든 함수 객체로 초기화한다.

```js
const someFunction = () => {
  console.log(`someFunc: number: ${number}`);
  return;
};
useEffect(() => {
  console.log('someFunction이 변경되었습니다.');
}, [someFunction]);
```

이 상태에서는 useEffect안의 console.log가 계속 호출이 된다.

→ useCallback사용으로 최적화

```js
const someFunction = useCallback(() => {
  console.log(`someFunc: number: ${number}`);
  return;
}, [number]); // 의존성 배열을 비워두면 처음에만 실행이 되고 메모이제이션한다.

useEffect(() => {
  console.log('someFunction이 변경되었습니다.');
}, [someFunction]);
```

### http요청에서 useCallback사용

```js
useEffect(() => {
  fetchMoviesHandler();
}, [fetchMoviesHandler]);
```

의존성 배열이 빈 배열이면 첫 렌더링시에도 데이터를 불러오기 때문에 의존성 배열에 의존성으로서 포인터를 추가해야한다. 여기서는 fetchMoviesHandler함수를 추가하면 되는데,(http요청하는 함수) 문제는 함수는 컴포넌트가 재 렌더링 될 때마다 새로운 함수로 인식이 되기 때문에 이를 의존성으로 추가한다면 무한 루프가 발생한다. 해결하기 위해 useCallback으로 fetchMoviesHandler함수를 감싼다.

```js
const fetchMoviesHandler = useCallback(async () => {
  setIsLoading(true);
  setError(null);
  try {
    const response = await fetch('https://swapi.dev/api/film');

    if (!response.ok) {
      throw new Error('Something went wrong!');
    }

    const data = await response.json();
    const transformedMovies = data.results.map(movieData => {
      return {
        id: movieData.episode_id,
        title: movieData.title,
        openingText: movieData.opening_crawl,
        releaseDatee: movieData.release_date,
      };
    });

    setMovies(transformedMovies);
  } catch (error) {
    setError(error.message); // 'Something went wrong!'
  }
  setIsLoading(false);
}, []);
```
