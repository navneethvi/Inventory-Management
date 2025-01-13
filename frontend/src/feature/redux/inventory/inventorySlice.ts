import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Define an interface for the inventory data
interface InventoryItem {
  condition: string;
  title: string;
  brand: string;
  price: string;
  product_type: string;
  custom_label_0: string;
  timestamp: string;
}

interface InventoryState {
  inventory: InventoryItem[];
  loading: boolean;
  error: string | null;
}

const initialState: InventoryState = {
  inventory: [],
  loading: false,
  error: null,
};

type Filters = {
  brand: string[], duration: string[]
};

export const fetchInventory = createAsyncThunk(
  'inventory/fetchInventory',
  async (filters: Filters) => {
    try {
      const response = await axios.get('https://inventory-backend-two-virid.vercel.app/api/inventory' , {
        params: filters,
      });
      console.log("Res==?", response.data);
      
      return response.data;
    } catch (error) {
      console.error('Error fetching inventory:', error);
      throw new Error('Failed to fetch inventory');
    }
  }
);
const inventorySlice = createSlice({
  name: 'inventory',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchInventory.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInventory.fulfilled, (state, action) => {
        state.loading = false;
        state.inventory = action.payload;
      })
      .addCase(fetchInventory.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch data';
      });
  },
});

export default inventorySlice.reducer;
