import { configureStore } from "@reduxjs/toolkit";
import inventoryReducer from '../redux/inventory/inventorySlice'

export const store = configureStore({
    reducer: {
      inventory: inventoryReducer,  
    },
  });
  
  export default store;

  export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;