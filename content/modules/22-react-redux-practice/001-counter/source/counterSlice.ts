import { createSlice } from 'reduxjs/toolkit';

interface CounterState {
  value: number;
}

const initialState: CounterState = {
  value: 0,
};

export const counterSlice = createSlice({
  name: 'counter',
  initialState,
  reducers: {},
});

export const {} = counterSlice.actions;

export const counterReducer = counterSlice.reducer;
