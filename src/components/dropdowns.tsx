import React, { useState } from "react";
import FlagIcon from "./flag-icon";
import { Currency } from "../types";

interface DropdownProps {
  label: string;
  onSelect: (currency: Currency) => void;
  selectedCurrency: Currency;
}

const CurrencyDropdown: React.FC<DropdownProps> = ({
  label,
  onSelect,
  selectedCurrency,
}) => {
  const currencies: Currency[] = ["PLN", "EUR", "GBP", "UAH"];
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (currency: Currency) => {
    onSelect(currency);
    setIsOpen(false);
  };

  return (
    <div className="relative inline-block w-64 mb-4">
      <label className="block text-gray-700 text-sm font-light mb-2">
        {label}
      </label>
      <div
        className="border-b-2 border-gray-300 cursor-pointer flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="flex items-center">
          <FlagIcon currency={selectedCurrency} />
          <span>{selectedCurrency}</span>
        </span>
        <svg
          className={`fill-current h-4 w-4 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
        >
          <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
        </svg>
      </div>
      {isOpen && (
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg">
          {currencies.map((currency) => (
            <li
              key={currency}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3"
              onClick={() => handleChange(currency)}
            >
              <FlagIcon currency={currency} />
              <span>{currency}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CurrencyDropdown;
