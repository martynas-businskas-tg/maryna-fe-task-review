import React, { useState, useEffect } from "react";
import CurrencyDropdown from "./dropdowns";
import { FaArrowRightArrowLeft, FaRegCircle } from "react-icons/fa6";
import AmountInput from "./amount-input";
import { Currency } from "../types";
import BigNumber from "bignumber.js";

BigNumber.config({ DECIMAL_PLACES: 6 });

const CurrencyConverter: React.FC = () => {
  const [amount, setAmount] = useState<BigNumber | null>(new BigNumber(1));
  const [convertedAmount, setConvertedAmount] = useState<BigNumber | null>(
    null,
  );
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

  const handleFromCurrencySelect = (currency: Currency) => {
    setFromCurrency(currency);
    setLastEditedField("from");
  };

  const handleToCurrencySelect = (currency: Currency) => {
    setToCurrency(currency);
    setLastEditedField("to");
  };

  const fetchExchangeRate = async (from: Currency, to: Currency) => {
    if (amount === null) setAmount(new BigNumber(0));
    try {
      const res = await fetch(
        `https://my.transfergo.com/api/fx-rates?from=${from}&to=${to}`,
      );
      const data = await res.json();
      const rate = new BigNumber(data.rate);
      setExchangeRate(rate);
      return rate;
    } catch (error) {
      console.error("Error Fetching", error);
      setExchangeRate(null);
      return null;
    }
  };

  const swapCurrencies = () => {
    setFromCurrency(toCurrency);
    setToCurrency(fromCurrency);
    setAmount(convertedAmount);
    setConvertedAmount(amount);
    setLastEditedField(lastEditedField === "from" ? "to" : "from");
  };

  const handleConvertButtonClick = async () => {
    const rate = await fetchExchangeRate(fromCurrency, toCurrency);
    const limit = currencyLimits[fromCurrency];
    if (amount === null || rate === null || amount.isZero()) {
      setError("Amount cannot be empty or zero");
      return;
    }
    if (limit && amount.isGreaterThan(limit)) {
      setError(`Amount exceeds limit for ${fromCurrency}: ${limit.toString()}`);
      return;
    }
    const newAmount = amount.multipliedBy(rate);
    setConvertedAmount(newAmount);
    setIsInitialConversion(true);
  };

  const handleToAmountChange = (value: BigNumber | null) => {
    setConvertedAmount(value);
    setLastEditedField("to");
  };

  useEffect(() => {
    const limit = currencyLimits[fromCurrency];
    if (amount === null) return;

    if (limit && amount.isGreaterThan(limit)) {
      setError(`Amount exceeds limit for ${fromCurrency}: ${limit.toString()}`);
    } else {
      setError(null);
    }
  }, [amount, convertedAmount, fromCurrency]);

  useEffect(() => {
    const limit = currencyLimits[fromCurrency];
    if (!exchangeRate) return;

    if (limit && amount !== null && amount.isGreaterThan(limit)) {
      setError(`Amount exceeds limit for ${fromCurrency}: ${limit.toString()}`);
      return;
    }

    if (lastEditedField === "from" && amount !== null) {
      const newConvertedAmount = amount
        .multipliedBy(exchangeRate)
        .decimalPlaces(2);
      if (
        convertedAmount === null ||
        !newConvertedAmount.isEqualTo(convertedAmount)
      ) {
        setConvertedAmount(newConvertedAmount);
      }
    } else if (lastEditedField === "to" && convertedAmount !== null) {
      const newAmount = convertedAmount
        .dividedBy(exchangeRate)
        .decimalPlaces(2);
      if (limit && newAmount.isGreaterThan(limit)) {
        setError(
          `Amount exceeds limit for ${fromCurrency}: ${limit.toString()}`,
        );
        console.log(error);
        return;
      } else if (amount === null || !newAmount.isEqualTo(amount)) {
        setAmount(newAmount);
      }
    }
  }, [amount, convertedAmount, lastEditedField, exchangeRate]);

  useEffect(() => {
    if (fromCurrency && toCurrency && amount) {
      fetchExchangeRate(fromCurrency, toCurrency).then((rate) => {
        if (rate !== null) {
          const newConvertedAmount = amount.multipliedBy(rate).decimalPlaces(2);
          setConvertedAmount(newConvertedAmount);
        }
      });
    }
  }, [fromCurrency, toCurrency]);

  const handleFromAmountChange = (value: BigNumber | null) => {
    if (value !== null) {
      const limit = currencyLimits[fromCurrency];
      if (limit && value.isGreaterThan(limit)) {
        setError(
          `Amount exceeds limit for ${fromCurrency}: ${limit.toString()}`,
        );
      } else {
        setError(null);
      }
    }
    setAmount(value);
    setLastEditedField("from");
  };

  return (
    <div className="max-w-xl mx-auto my-10 p-12 bg-white rounded-lg shadow-xl">
      <div className="flex gap-5 items-center">
        <CurrencyDropdown
          label="FROM:"
          onSelect={handleFromCurrencySelect}
          selectedCurrency={fromCurrency}
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
        />
      </div>
      <div
        className={`flex ${initialConversion ? "flex-col sm:flex-row items-start" : "flex-col sm:flex-row items-center"} gap-5 mt-5`}
      >
        <div className={`flex-1 ${!initialConversion ? "w-full" : "sm:flex-1 w-full"}`}>
          <AmountInput
            currency={fromCurrency}
            label="AMOUNT:"
            amount={amount?.toNumber() ?? null}
            onChange={(value) =>
              handleFromAmountChange(
                value !== null ? new BigNumber(value) : null,
              )
            }
            placeholder="from"
            maxAmount={error} // Pass error message as maxAmount prop
          />
        </div>
        {initialConversion && (
          <div className={`flex-1 ${!initialConversion ? "w-full" : "sm:flex-1 w-full"}`}>
            <AmountInput
              currency={toCurrency}
              label="CONVERTED TO:"
              amount={convertedAmount?.toNumber() ?? null}
              onChange={(value) =>
                handleToAmountChange(
                  value !== null ? new BigNumber(value) : null,
                )
              }
              placeholder="To"
            />
          </div>
        )}
      </div>
      {!initialConversion && (
        <div className="mt-6 w-full">
          <button
            onClick={handleConvertButtonClick}
            className="px-5 py-2 w-full bg-green-600 text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
                   "
          >
            Convert
          </button>
          {error && <p className="text-red-400/100 pt-3">{error}</p>}
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
