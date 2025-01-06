import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import LoadingButton from "@mui/lab/LoadingButton";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import axios from "axios";
import { useFormik } from "formik";
import { useCallback, useEffect, useState } from "react";
import { NumericFormat } from "react-number-format";
import * as yup from "yup";

import viteLogo from "/vite.svg";

import styles from "./App.module.css";
import reactLogo from "./assets/react.svg";
import { BaseSelect } from "./components/BaseSelect/BaseSelect";
import { CurrencyType } from "./types/currency.type";

const validationSchema = yup.object({
  rate: yup.string().required("Currency is required"),
  amount: yup
    .number()
    .min(1, "Amount should be of minimum 1 characters length")
    .required("Amount is required"),
});

type FormType = {
  rate: number;
  amount: number;
};

function App() {
  const [currencies, setCurrencies] = useState<CurrencyType[]>([]);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSending, setIsSending] = useState(true);

  const handleSubmit = useCallback(
    (values: FormType) => {
      setLoading(true);
      setTimeout(() => {
        setExchangeRate(
          isSending ? values.rate * values.amount : values.amount / values.rate,
        );
        setLoading(false);
      }, 2000);
    },
    [isSending],
  );

  const formik = useFormik<FormType>({
    initialValues: {
      rate: 1,
      amount: 1,
    },
    validationSchema,
    onSubmit: handleSubmit,
  });

  const handleChangeExchangeState = () => {
    setIsSending((pre) => !pre);
    setExchangeRate(null);
  };

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        "https://interview.switcheo.com/prices.json",
      );

      /* 
        the data is not unique, so we need to filter it base on the latest date and currency type
      */
      const uniqCurrencies: CurrencyType[] = Array.from(
        data
          .reduce((map: Map<string, CurrencyType>, item: CurrencyType) => {
            const existing = map.get(item.currency);

            if (!existing || new Date(item.date) > new Date(existing.date)) {
              map.set(item.currency, item);
            }

            return map;
          }, new Map())
          .values(),
      );

      setCurrencies(uniqCurrencies);
    })();
  }, []);

  return (
    <>
      <div>
        <a href="https://vite.dev" target="_blank">
          <img src={viteLogo} className={styles.logo} alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img
            src={reactLogo}
            className={`${styles.logo} ${styles.react}`}
            alt="React logo"
          />
        </a>
      </div>
      <h1>Swap Assests</h1>
      <div className={styles.card}>
        <form className={styles.formWrapper} onSubmit={formik.handleSubmit}>
          <BaseSelect
            data={currencies.map((currency) => ({
              label: currency.currency,
              value: currency.price,
              icon: currency.currency,
            }))}
            label="Currency"
            id="rate"
            labelId="curreny-label"
            value={formik.values.rate}
            onChange={(e) => {
              formik.setFieldValue("rate", e.target.value);
              setExchangeRate(null);
            }}
            onBlur={formik.handleBlur}
            error={!!formik.errors.rate}
            errorMsg={formik.errors.rate as string}
          />
          <div className={styles.swapWrapper}>
            <NumericFormat
              customInput={TextField}
              thousandSeparator
              valueIsNumericString
              fullWidth
              id="amount"
              name="amount"
              label={`Amount to ${isSending ? "send" : "receive"}`}
              value={formik.values.amount}
              onValueChange={(values) => {
                formik.setFieldValue("amount", values.floatValue);
              }}
              onBlur={formik.handleBlur}
              error={!!formik.errors.amount}
              helperText={formik.errors.amount as string}
            />
            <Button
              variant="text"
              color="primary"
              onClick={handleChangeExchangeState}
            >
              <CurrencyExchangeIcon />
            </Button>
          </div>
          <div className={`w-full ${styles.amountToReceive}`}>
            <label>Amount to {isSending ? "receive" : "send"}</label>
            {exchangeRate && (
              <NumericFormat
                thousandSeparator
                id="amountToReceive"
                name="amountToReceive"
                renderText={(value) => <b>{value}</b>}
                displayType="text"
                value={exchangeRate}
              />
            )}
          </div>
          <LoadingButton
            type="submit"
            variant="contained"
            color="primary"
            loading={loading}
          >
            Swap
          </LoadingButton>
        </form>
      </div>
    </>
  );
}

export default App;
