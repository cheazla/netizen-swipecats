import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getCats } from "../api/cataas";

export interface Cat {
  id: number;
  url: string;
}

interface CatsState {
  cats: Cat[];
  liked: Cat[];
  index: number;
  status: "idle" | "loading" | "succeeded";
}

const initialState: CatsState = {
  cats: [],
  liked: [],
  index: 0,
  status: "idle",
};

export const fetchCats = createAsyncThunk("cats/fetch", async () => {
  return await getCats(10);
});

const catsSlice = createSlice({
  name: "cats",
  initialState,
  reducers: {
    swipeRight: (state) => {
      const current = state.cats[state.index];
      if (current) state.liked.push(current);
      state.index++;
    },
    swipeLeft: (state) => {
      state.index++;
    },
    reset: (state) => {
      state.index = 0;
      state.liked = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCats.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchCats.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.cats = action.payload;
      });
  },
});

export const { swipeRight, swipeLeft, reset } = catsSlice.actions;
export default catsSlice.reducer;
