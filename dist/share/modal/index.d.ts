import React from "react";
import "./index.less";
export interface ModalProps {
    visible: boolean;
    wrapperClassName?: string;
    className?: string;
    mask?: boolean;
}
declare const Modal: React.FC<ModalProps>;
export default Modal;
