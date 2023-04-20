import React from "react";
import "./index.less";

export interface ModalProps {
  visible: boolean;
  wrapperClassName?: string;
  className?: string;
  mask?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  visible,
  wrapperClassName,
  className,
  mask = true,
  children,
}) => {
  return (
    <div
      className={`share-modal-container ${wrapperClassName ?? ""}`}
      style={{ display: visible ? "flex" : "none" }}
    >
      {mask && <div className="share-modal-mask" />}
      <div className={`share-modal ${className ?? ""}`}>{children}</div>
    </div>
  );
};

export default Modal;
