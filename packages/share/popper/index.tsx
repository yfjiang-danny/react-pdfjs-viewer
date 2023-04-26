import React, { FC } from "react";


export type Placement = "top-start" | "top-end" | "bottom-start" | "bottom-end" | "right-start" | "right-end" | "left-start" | "left-end";

interface PopoverProps {
  anchorEl?:
  | HTMLElement
  | (() => HTMLElement)
  | null
  | undefined;
}

function resolveAnchorEl(
  anchorEl:
    | HTMLElement
    | (() => HTMLElement)
    | null
    | undefined,
): HTMLElement | null | undefined {
  return typeof anchorEl === 'function' ? anchorEl() : anchorEl;
}

const Popover: FC<PopoverProps> = ({ anchorEl, children }) => {

  /**
   * placement initialized from prop but can change during lifetime if modifiers.flip.
   * modifiers.flip is essentially a flip for controlled/uncontrolled behavior
   */
  const [placement, setPlacement] = React.useState<Placement | undefined>();
  const [resolvedAnchorElement, setResolvedAnchorElement] = React.useState<
    HTMLElement | null | undefined
  >(resolveAnchorEl(anchorEl));

  function updatePosition() {
    //
  }

  React.useEffect(() => {
    if (anchorEl) {
      setResolvedAnchorElement(resolveAnchorEl(anchorEl));
    }
  }, [anchorEl]);

  return <>Popover Component</>;
};

export default Popover;
