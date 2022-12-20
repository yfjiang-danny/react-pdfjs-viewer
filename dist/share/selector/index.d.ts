import React from "react";
import "./index.less";
interface SelectProps {
    defaultValue?: string;
    disableEmpty?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string;
    control?: boolean;
}
declare const Select: React.FunctionComponent<SelectProps>;
export default Select;
