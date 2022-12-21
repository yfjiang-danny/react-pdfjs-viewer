import React from "react";

function SvgArrowDropDown(
  props: React.SVGProps<SVGSVGElement>,
  svgRef?: React.Ref<SVGSVGElement>
) {
  return (
    <svg viewBox="0 0 24 24" {...props} ref={svgRef}>
      <path d="M7 10l5 5 5-5z"></path>
    </svg>
  );
}

const ForwardRef = React.forwardRef(SvgArrowDropDown);
export default ForwardRef;
