import { configureStore } from '@reduxjs/toolkit';

import counterReducer from './counter';
import authReducer from './auth';

const store = configureStore({
  // reducer: counterSlice.reducer, // 단일 리듀서
  reducer: { counter: counterReducer, auth: authReducer }, // slice가 여려개일 때는 reducer의 값으로 객체를 전달한다.
});

export default store;
