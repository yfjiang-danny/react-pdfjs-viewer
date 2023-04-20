import { FC } from "react";
import { ModalProps } from "../share/modal";
import "./index.less";
interface PropertyModalProps extends ModalProps {
    onClose?(): void;
}
declare const PropertyModal: FC<PropertyModalProps>;
export default PropertyModal;
