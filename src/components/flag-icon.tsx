import React from "react";
import "flag-icons/css/flag-icons.min.css";
import { Currency } from "../types";

const currencyFlags: { [key in Currency]: string } = {
  PLN: "pl",
  EUR: "eu",
  GBP: "gb",
  UAH: "ua",
};

interface FlagIconProps {
  currency: Currency;
}

const FlagIcon: React.FC<FlagIconProps> = ({ currency }) => {
  return (
    <span
      style={{
        display: "inline-block",
        width: "1.5em",
        height: "1.2em",
        marginRight: "8px",
        verticalAlign: "middle",
        borderRadius: "2px",
        boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <span
        className={`fi fi-${currencyFlags[currency]}`}
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%) scale(1.5)",
          fontSize: "1em",
          lineHeight: "1em",
        }}
      />
    </span>
  );
};

export default FlagIcon;
