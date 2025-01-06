import FormControl from "@mui/material/FormControl";
import FormHelperText from "@mui/material/FormHelperText";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { FocusEventHandler } from "react";

import styles from "./BaseSelect.module.css";
import { Icon } from "../icons/Icon";

type Option = {
  label: string;
  value: string | number;
  icon?: string;
};

interface BaseSelectProps {
  data: Option[];
  label: string;
  id?: string;
  labelId?: string;
  value?: string | number;
  onChange?: (val: SelectChangeEvent<string | number>) => void;
  onBlur?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  onFocus?: FocusEventHandler<HTMLInputElement | HTMLTextAreaElement>;
  error?: boolean;
  errorMsg?: string;
}

export const BaseSelect = ({
  label,
  data,
  id,
  labelId,
  value,
  error,
  errorMsg,
  onChange,
  onBlur,
  onFocus,
}: BaseSelectProps) => {
  return (
    <FormControl fullWidth error={error}>
      <InputLabel id={labelId}>{label}</InputLabel>
      <Select
        id={id}
        labelId={labelId}
        label="Currency"
        fullWidth
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        onFocus={onFocus}
      >
        {data.map((item) => (
          <MenuItem key={item.value} value={item.value}>
            <div className={styles.item}>
              {item.icon && <Icon icon={item.icon} className={styles.icon} />}
              {item.label}
            </div>
          </MenuItem>
        ))}
      </Select>
      {error && errorMsg && (
        <FormHelperText error={error}>{errorMsg}</FormHelperText>
      )}
    </FormControl>
  );
};
