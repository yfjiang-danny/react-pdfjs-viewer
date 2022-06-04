import React, { ReactNode } from "react";
import "./index.scss";
interface SelectProps {
    children: ReactNode;
    defaultValue?: string;
    disableEmpty?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLSelectElement>) => void;
    value?: string;
    control?: boolean;
}
declare const Select: React.FunctionComponent<SelectProps>;
export default Select;
