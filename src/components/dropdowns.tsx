import React, { useState, useEffect, useRef } from "react";
import FlagIcon from "./flag-icon";
import { Currency } from "../types";

interface DropdownProps {
  label: string;
  onSelect: (currency: Currency) => void;
  selectedCurrency: Currency;
  onDropdownToggle: (isOpen: boolean) => void;
}

const CurrencyDropdown: React.FC<DropdownProps> = ({
  label,
  onSelect,
  selectedCurrency,
  onDropdownToggle,
}) => {
  const currencies: Currency[] = ["PLN", "EUR", "GBP", "UAH"];
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleChange = (currency: Currency) => {
    onSelect(currency);
    setIsOpen(false);
    onDropdownToggle(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
    onDropdownToggle(!isOpen);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        onDropdownToggle(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onDropdownToggle]);

  return (
    <div className="relative inline-block w-64 mb-4" ref={dropdownRef}>
      <label className="block text-gray-700 text-sm font-light mb-2">
        {label}
      </label>
      <div
        className="border-b-2 border-gray-300 cursor-pointer flex justify-between items-center pb-1"
        onClick={toggleDropdown}
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
        <ul className="absolute z-10 mt-2 w-full bg-white border border-gray-300 rounded shadow-lg overflow-hidden">
          {currencies
            .filter((currency) => currency !== selectedCurrency)
            .map((currency, index, filteredArray) => (
              <li
                key={currency}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-3 ${
                  index !== filteredArray.length - 1
                    ? "border-b border-sky-100"
                    : ""
                }`}
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
