import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedSeats: [],
  showId: null,
  totalPrice: 0,
};

const bookingSlice = createSlice({
  name: 'booking',
  initialState,
  reducers: {
    initBooking: (state, action) => {
      const { showId } = action.payload;
      // If visiting a different show, reset selection
      if (state.showId !== showId) {
        state.showId = showId;
        state.selectedSeats = [];
        state.totalPrice = 0;
      }
    },
    toggleSeat: (state, action) => {
      const { seatId, price } = action.payload;
      const index = state.selectedSeats.indexOf(seatId);

      if (index >= 0) {
        // Deselect
        state.selectedSeats.splice(index, 1);
        state.totalPrice -= price;
      } else {
        // Select (limit to 10)
        if (state.selectedSeats.length < 10) {
          state.selectedSeats.push(seatId);
          state.totalPrice += price;
        }
      }
    },
    clearSelection: (state) => {
      state.selectedSeats = [];
      state.totalPrice = 0;
    },
    // Optional: useful if we need to force set seats (e.g. from local storage restored differently)
    setSelectedSeats: (state, action) => {
      const { seats, pricePerSeat } = action.payload;
      state.selectedSeats = seats;
      state.totalPrice = seats.length * pricePerSeat;
    }
  },
});

export const { initBooking, toggleSeat, clearSelection, setSelectedSeats } = bookingSlice.actions;

// Selectors
export const selectSelectedSeats = (state) => state.booking.selectedSeats;
export const selectTotalPrice = (state) => state.booking.totalPrice;
export const selectBookingShowId = (state) => state.booking.showId;

export default bookingSlice.reducer;
