import { Player } from '@/types/player';
import { fetchGetPlayer, fetchUpdatePlayer, fetchAddExp } from '@/service/player';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export const getPlayer = createAsyncThunk('player/getPlayer', async () => {
  const result = await fetchGetPlayer();
  return result;
});

export const updatePlayer = createAsyncThunk('player/updatePlayer', async (player: Player) => {
  await fetchUpdatePlayer(player);
  return await fetchGetPlayer();
});

export const addExp = createAsyncThunk('player/addExp', async (expAmount: number) => {
  const result = await fetchAddExp(expAmount);
  return result;
});

export const playerSlice = createSlice({
  name: 'Player',
  initialState: {
    player: null as Player | null,
    loading: false,
  },
  reducers: {},
  extraReducers(builder) {
    builder
      .addCase(getPlayer.pending, (state) => {
        state.loading = true;
      })
      .addCase(getPlayer.fulfilled, (state, { payload }) => {
        state.player = payload;
        state.loading = false;
      })
      .addCase(getPlayer.rejected, (state) => {
        state.loading = false;
      })
      .addCase(updatePlayer.fulfilled, (state, { payload }) => {
        state.player = payload;
      })
      .addCase(addExp.fulfilled, (state, { payload }) => {
        state.player = payload;
      });
  },
});

export default playerSlice.reducer;
