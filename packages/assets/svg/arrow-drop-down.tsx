import React, { forwardRef, SVGProps } from "react";

const SvgArrowDropDown = forwardRef<SVGSVGElement, SVGProps<SVGSVGElement>>(
  (props, ref) => {
    return (
      <svg viewBox="0 0 24 24" {...props} ref={ref}>
        <path d="M7 10l5 5 5-5z"></path>
      </svg>
    );
  }
);

export default SvgArrowDropDown;
