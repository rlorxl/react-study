import { createSlice } from '@reduxjs/toolkit';
const initialCounterState = { counter: 0, showCounter: true };

const counterSlice = createSlice({
  name: 'counter',
  initialState: initialCounterState,
  reducers: {
    // if문을 작성할 필요 없음: 어떤 액션인지에 따라 메서드가 자동 호출됨.
    increament(state) {
      state.counter += 1;
    },
    decremeent(state) {
      state.counter -= 1;
    },
    increase(state, action) {
      state.counter = state.counter + action.payload; // 기본으로 생성되는 액션 객체에 있는 이름이 payload
    },
    toggleCounter(state) {
      state.showCounter = !state.showCounter;
    },
  },
});

export const counterActions = counterSlice.actions;

export default counterSlice.reducer;
