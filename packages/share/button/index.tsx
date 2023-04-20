import React, { FC, HTMLAttributes } from "react";
import "./index.less";

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {}

const Button: FC<ButtonProps> = ({ className, ...restProps }) => {
  return (
    <button {...restProps} className={`share-button ${className ?? ""}`} />
  );
};

export default Button;
