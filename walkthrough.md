# UI Redesign - BookMyShow Style with Day/Night Mode

## Overview
The movie ticket application has been redesigned to resemble "BookMyShow," featuring a professional, clean aesthetic and a fully functional Day/Night mode. The dark, Netflix-inspired theme has been replaced with a versatile light/dark theme using a new color palette.

## Changes Made

### Configuration & Global Styles
- **`tailwind.config.js`**: Added a new `bms` color palette (Primary Red: `#F84464`, Dark Text: `#333545`, etc.) and enabled `darkMode: 'class'`.
- **`index.css`**: Defined CSS variables (`--bg-primary`, `--text-primary`, etc.) for dynamic theme switching. Updated global styles for inputs, buttons, and layout containers.

### Components
- **`Navbar.jsx`**:
    - Implemented Day/Night mode toggle with Sun/Moon icons.
    - Updated logo to a professional BookMyShow style.
    - Added a secondary navigation bar for categories (Movies, Stream, Events, etc.).
    - Refined search bar and profile dropdown styling.

### Pages
- **`Home.jsx`**:
    - Replaced the static hero image with a dynamic carousel banner.
    - Updated movie cards to a clean, white/dark card style with distinct typography.
    - Added "Recommended Movies" and "Premiere" sections.
- **`Movies.jsx`**:
    - Implemented a sidebar filter layout for Genres and Languages.
    - Updated the movie grid to match the new card style.
    - Added a clean search bar within the filter section.
- **`MovieDetails.jsx`**:
    - Redesigned as a product page with a large background banner and a distinct booking strip.
    - Organized details into clear sections: About, Cast, and Crew.
    - Added a sticky booking bar for date and time selection.
- **`SeatSelection.jsx`**:
    - Created a clean, professional seat map layout.
    - Added a screen indicator and clear legend.
    - Implemented a sticky bottom bar for the booking summary and "Pay" button.
- **`BookingConfirmation.jsx`**:
    - Designed a "Ticket" style card layout.
    - Added a QR code placeholder for a realistic ticket feel.
    - Included clear booking details and action buttons.
- **`Login.jsx` & `Signup.jsx`**:
    - Removed the Netflix background.
    - Implemented a centered, clean card layout for the forms.
    - Fully supported Day/Night mode.

## Verification Plan

### Automated Tests
- Run the application using `npm run dev`.
- Navigate to `http://localhost:5173`.

### Manual Verification Steps
1.  **Theme Toggle**:
    - Click the Sun/Moon icon in the Navbar.
    - Verify that the background, text, and card colors switch smoothly between light and dark modes across ALL pages.
2.  **Home Page**:
    - Check the carousel animation.
    - Verify movie cards display correct data and hover effects.
3.  **Movies Page**:
    - Test the filters (Genre, Language).
    - Verify the search functionality.
4.  **Movie Details**:
    - Check the banner rendering.
    - Verify the "Book Tickets" button scrolls to the booking strip or opens the modal (if applicable).
5.  **Seat Selection**:
    - Select seats and verify the total price calculation.
    - Check the "Proceed to Payment" button state.
6.  **Booking Flow**:
    - Complete a booking and verify the redirection to the Confirmation page.
    - Check the Ticket card layout and QR code on the Confirmation page.
7.  **Auth Pages**:
    - Visit Login and Signup pages.
    - Verify the clean layout and theme adaptability.

## Next Steps
-   Implement actual payment gateway integration (currently mocked).
-   Add more interactive animations for a "delightful" user experience.
-   Optimize images and assets for faster loading.
