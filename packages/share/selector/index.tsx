import React, { ReactNode, useEffect, useState } from "react";
import { ArrowDropDown } from "../../assets/svg";
import "./index.less";

interface SelectProps {
  children: ReactNode;
  defaultValue?: string;
  disableEmpty?: boolean;
  onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
  value?: string;
  control?: boolean;
}

// TODO: Refactor
const Select: React.FunctionComponent<SelectProps> = (props) => {
  const [value, setValue] = useState<string | undefined>(props.defaultValue);

  function onChange(event: React.ChangeEvent<HTMLSelectElement>): void {
    props.onChange?.(event);
    if (props.control) {
      return;
    }
    setValue(event.currentTarget.value);
  }

  useEffect(() => {
    if (props.control) {
      setValue(props.value);
    }
  }, [props.value]);

  return (
    <div className="select-container">
      <div className="input-container">
        <select className="native-select" value={value} onChange={onChange}>
          {props.children}
        </select>
        <ArrowDropDown className="select-icon" />
      </div>
    </div>
  );
};

export default Select;
