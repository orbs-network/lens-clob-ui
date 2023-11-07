import { useNumericFormat } from "react-number-format";
import {StringParam, useQueryParams} from 'use-query-params'

export const useFormatNumber = ({
  value,
  decimalScale = 3,
  prefix,
  suffix,
}: {
  value?: string | number;
  decimalScale?: number;
  prefix?: string;
  suffix?: string;
}) => {
  const result = useNumericFormat({
    allowLeadingZeros: true,
    thousandSeparator: ",",
    displayType: "text",
    value: value || "",
    decimalScale,
    prefix,
    suffix,
  });

  return result.value?.toString();
};



export const useUrlParams = () => {
  const [query, setQuery] = useQueryParams({
    'network': StringParam,
  });

  return {
    network: query["network"] as string | undefined,
    setNetwork: (value: string | undefined) => {
      setQuery({ network: value }, "pushIn");
    },
  };
};