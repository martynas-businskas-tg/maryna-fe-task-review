import React from "react";

interface AmountInputProps {
  label: string;
  amount: number | null;
  currency: string;
  placeholder: string;
  onChange: (amount: number | null) => void;
  maxAmount?: string | null;
}

const AmountInput: React.FC<AmountInputProps> = ({
  label,
  amount,
  currency,
  onChange,
  placeholder,
  maxAmount,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onChange(value === "" ? null : parseFloat(value));
  };

  return (
    <div className="relative w-full mb-4">
      <label className="block text-gray-700 text-sm font-light mb-2">
        {label}
      </label>
      <div>
        <input
          type="number"
          value={amount ?? ""}
          onChange={handleChange}
          className={`appearance-none border-b-2 border-gray-300 w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-blue-500 ${
            maxAmount ? "border-red-500" : ""
          }`}
          placeholder={placeholder}
          required
        />
        <span className="absolute right-3 top-10 text-gray-700">
          {currency}
        </span>
        {maxAmount && (
          <p className="mt-2 text-sm text-red-600 dark:text-red-500">
            <span className="font-medium">{maxAmount}</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default AmountInput;
