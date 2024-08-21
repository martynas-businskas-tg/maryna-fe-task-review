import React, { useState, useCallback, useMemo } from "react";
import CurrencyDropdown from "./dropdowns";
import { FaArrowRightArrowLeft, FaRegCircle } from "react-icons/fa6";
import AmountInput from "./amount-input";
import { Currency } from "../types";
import BigNumber from "bignumber.js";
import debounce from "lodash.debounce";

BigNumber.config({ DECIMAL_PLACES: 6 });

const CurrencyConverter: React.FC = () => {
  const [fromAmount, setFromAmount] = useState<BigNumber | null>(
    new BigNumber(1),
  );
  const [toAmount, setToAmount] = useState<BigNumber | null>(null);
  const [exchangeRate, setExchangeRate] = useState<BigNumber | null>(null);
  const [initialConversion, setIsInitialConversion] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [fromCurrency, setFromCurrency] = useState<Currency>("EUR");
  const [toCurrency, setToCurrency] = useState<Currency>("GBP");
  const [lastEditedField, setLastEditedField] = useState<"from" | "to">("from");

  const currencyLimits: { [key in Currency]?: BigNumber } = {
    PLN: new BigNumber(20000),
    EUR: new BigNumber(5000),
    GBP: new BigNumber(1000),
    UAH: new BigNumber(50000),
  };

  const checkLimit = useCallback(
    (amount: BigNumber, currency: Currency): boolean => {
      const limit = currencyLimits[currency];
      if (limit && amount.isGreaterThan(limit)) {
        setError(`Amount exceeds limit for ${currency}: ${limit.toString()}`);
        return false;
      }
      setError(null);
      return true;
    },
    [],
  );

  const convertCurrency = useCallback(
    async (
      from: Currency,
      to: Currency,
      amount: BigNumber | null,
      direction: "from" | "to",
    ) => {
      if (amount === null || amount.isZero()) {
        setFromAmount(null);
        setToAmount(null);
        setExchangeRate(null);
        return;
      }

      try {
        const res = await fetch(
          `https://my.transfergo.com/api/fx-rates?amount=${amount.toString()}&from=${from}&to=${to}`,
        );
        const data = await res.json();
        const rate = new BigNumber(data.rate);
        setExchangeRate(rate);

        if (direction === "from") {
          const convertedAmount = new BigNumber(data.toAmount);
          if (checkLimit(amount, from)) {
            setFromAmount(amount);
            setToAmount(convertedAmount.decimalPlaces(2));
          }
        } else {
          const convertedAmount = amount.dividedBy(rate);
          if (checkLimit(convertedAmount, from)) {
            setFromAmount(convertedAmount.decimalPlaces(2));
            setToAmount(amount);
          }
        }
      } catch (error) {
        console.error("Error Fetching", error);
        setError("Failed to fetch exchange rate. Please try again.");
      }
    },
    [checkLimit],
  );

  const debouncedConvert = useMemo(
    () =>
      debounce(
        (
          from: Currency,
          to: Currency,
          amount: BigNumber | null,
          direction: "from" | "to",
        ) => {
          convertCurrency(from, to, amount, direction);
        },
        300,
      ),
    [convertCurrency],
  );

  const handleFromAmountChange = (value: number | null) => {
    const newAmount = value !== null ? new BigNumber(value) : null;
    setLastEditedField("from");
    if (newAmount !== null) {
      if (checkLimit(newAmount, fromCurrency)) {
        setFromAmount(newAmount);
        debouncedConvert(fromCurrency, toCurrency, newAmount, "from");
      }
    } else {
      setFromAmount(null);
      setToAmount(null);
      setExchangeRate(null);
    }
  };

  const handleToAmountChange = (value: number | null) => {
    const newAmount = value !== null ? new BigNumber(value) : null;
    setLastEditedField("to");
    setToAmount(newAmount);
    if (newAmount !== null) {
      debouncedConvert(fromCurrency, toCurrency, newAmount, "to");
    } else {
      setFromAmount(null);
      setToAmount(null);
      setExchangeRate(null);
    }
  };
  const handleFromCurrencySelect = (currency: Currency) => {
    setFromCurrency(currency);
    if (fromAmount !== null) {
      if (checkLimit(fromAmount, currency)) {
        debouncedConvert(currency, toCurrency, fromAmount, "from");
      }
    }
  };

  const handleToCurrencySelect = (currency: Currency) => {
    setToCurrency(currency);
    if (fromAmount !== null) {
      debouncedConvert(fromCurrency, currency, fromAmount, "from");
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setFromAmount(toAmount);
    setToAmount(fromAmount);
    if (toAmount !== null) {
      debouncedConvert(toCurrency, fromCurrency, toAmount, "from");
    }
  };

  const handleConvertButtonClick = async () => {
    if (fromAmount === null || fromAmount.isZero()) {
      setError("Amount cannot be empty or zero");
      return;
    }

    if (!checkLimit(fromAmount, fromCurrency)) {
      return;
    }

    try {
      const res = await fetch(
        `https://my.transfergo.com/api/fx-rates?amount=${fromAmount.toString()}&from=${fromCurrency}&to=${toCurrency}`,
      );
      const data = await res.json();
      const rate = new BigNumber(data.rate);
      const convertedAmount = new BigNumber(data.toAmount);

      setExchangeRate(rate);
      setToAmount(convertedAmount.decimalPlaces(2));
      setIsInitialConversion(true);
      setError(null);
    } catch (error) {
      console.error("Error Fetching", error);
      setError("Failed to fetch exchange rate. Please try again.");
    }
  };
  const [openDropdown, setOpenDropdown] = useState<"from" | "to" | null>(null);

  const handleDropdownToggle = (
    dropdownType: "from" | "to",
    isOpen: boolean,
  ) => {
    if (isOpen) {
      setOpenDropdown(dropdownType);
    } else if (openDropdown === dropdownType) {
      setOpenDropdown(null);
    }
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-12 bg-white rounded-lg shadow-xl">
      <div className="flex gap-5 items-center">
        <CurrencyDropdown
          label="FROM:"
          onSelect={handleFromCurrencySelect}
          selectedCurrency={fromCurrency}
          onDropdownToggle={(isOpen) => handleDropdownToggle("from", isOpen)}
        />
        <div>
          <button onClick={swapCurrencies}>
            <FaArrowRightArrowLeft className="text-blue-400 text-lg" />
          </button>
        </div>
        <CurrencyDropdown
          label="TO:"
          onSelect={handleToCurrencySelect}
          selectedCurrency={toCurrency}
          onDropdownToggle={(isOpen) => handleDropdownToggle("to", isOpen)}
        />
      </div>
      <div
        className={`flex ${initialConversion ? "flex-col sm:flex-row items-start" : "flex-col sm:flex-row items-center"} gap-5 mt-5`}
      >
        <div
          className={`flex-1 ${!initialConversion ? "w-full" : "sm:flex-1 w-full"}`}
        >
          <AmountInput
            currency={fromCurrency}
            label="AMOUNT:"
            amount={fromAmount?.toNumber() ?? null}
            onChange={handleFromAmountChange}
            placeholder="from"
            maxAmount={error}
          />
        </div>
        {initialConversion && (
          <div
            className={`flex-1 ${!initialConversion ? "w-full" : "sm:flex-1 w-full"}`}
          >
            <AmountInput
              currency={toCurrency}
              label="CONVERTED TO:"
              amount={toAmount?.toNumber() ?? null}
              onChange={handleToAmountChange}
              placeholder="To"
            />
          </div>
        )}
      </div>
      {!initialConversion && (
        <div className="mt-6 w-full">
          <button
            disabled={!!error}
            onClick={handleConvertButtonClick}
            className={`px-5 py-2 w-full bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                            ${error ? "opacity-50 cursor-not-allowed" : ""}
                        `}
          >
            Convert
          </button>
        </div>
      )}
      {exchangeRate !== null && (
        <div className="mt-4 text-left">
          <div className="flex gap-2 items-center">
            <FaRegCircle className="text-orange-300 text-xs font-bold" />
            <h2 className="font-bold text-gray-600">
              1 {fromCurrency} = {exchangeRate.toFixed(5)} {toCurrency}
            </h2>
          </div>
          <div className="py-4">
            <small className="font-light text-gray-400">
              All figures are live mid-market rates, which are for informational
              purposes only. To see the rates for money transfer, please select
              sending money option.
            </small>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencyConverter;
