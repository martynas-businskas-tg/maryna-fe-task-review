## Currency Converter

This project is a React-based currency converter application. It allows users to input an amount in one currency and convert it to another currency using live exchange rates. The application includes validation for maximum input amounts for specific currencies and handles errors gracefully.

### Features
- Currency selection for "from" and "to" fields.
- Amount input with real-time validation.
- Live exchange rate fetching and conversion.
- Error handling for input limits.
- Responsive design using Tailwind CSS.

### Installation

#### Prerequisites
- Node.js (version 12 or later)
- npm (version 6 or later)

#### Steps
1. Clone the repository:
    ```bash
    git clone https://github.com/mchertkoieva00/fe-task.git
    ```

2. Install dependencies:
    ```bash
    pnpm install
    ```

3. Start the development server:
    ```bash
    pnpm dev
    ```

4. Open your browser and navigate to `http://localhost:3000`.


### Key Components
- `App.tsx`: The main component that includes the CurrencyConverter component.
- `currency-converter.tsx`: The main logic for currency conversion, input validation, and error handling.
- `amount-input.tsx`: A reusable input component for handling amounts.
- `dropdowns.tsx`: A reusable dropdown component for selecting currencies.
- `flag-icon.tsx`: A reusable component for generating flag icons based on country code

### Tailwind CSS
This project uses Tailwind CSS for styling. The configuration is set up in the `tailwind.config.js` file.

### Input Validation
The application validates the amount input based on predefined limits for specific currencies:
- 20000 PLN
- 5000 EUR
- 1000 GBP
- 50000 UAH

### Responsive Design
The application layout adjusts for mobile and desktop views using Tailwind CSS responsive utilities. Inputs take full width on mobile screens and are displayed side-by-side on larger screens.

### API Integration
Exchange rates are fetched from an external API. Ensure that your network connection allows access to the API endpoint used in the `fetchExchangeRate` function.

---
