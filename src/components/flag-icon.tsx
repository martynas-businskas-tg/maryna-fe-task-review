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
  return <span className={`fi fi-${currencyFlags[currency]} fis mr-2`} />;
};

export default FlagIcon;
