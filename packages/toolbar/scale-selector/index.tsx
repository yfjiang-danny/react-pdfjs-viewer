import Tippy from "@tippyjs/react";
import React, { FC, useMemo, useRef } from "react";
import { Instance } from "tippy.js";
import { usePDFViewer } from "../../provider";
import { ScaleType } from "../../types";

export interface OptionModel {
  value: ScaleType | number;
  label: string;
}

interface ScaleSelectorProps {}

const ScaleSelector: FC<ScaleSelectorProps> = () => {
  const options: OptionModel[] = [
    {
      value: "auto",
      label: "自动缩放",
    },
    {
      value: "fitWidth",
      label: "适合页宽",
    },
    {
      value: "fitHeight",
      label: "适合页面",
    },
    {
      value: 0.5,
      label: "50%",
    },
    {
      value: 0.75,
      label: "75%",
    },
    {
      value: 1,
      label: "100%",
    },
    {
      value: 1.25,
      label: "125%",
    },
    {
      value: 1.5,
      label: "150%",
    },
    {
      value: 2,
      label: "200%",
    },
    {
      value: 3,
      label: "300%",
    },
    {
      value: 4,
      label: "400%",
    },
  ];
  const { scale, setScale } = usePDFViewer();
  const instanceRef = useRef<Instance>();
  const rootRef = useRef<HTMLDivElement | null>(null);

  const displayName = useMemo(() => {
    const findOption = options.find((v) => v.value == scale);
    if (findOption) {
      return findOption.label;
    }
    if (typeof scale == "number") {
      return `${(scale * 100).toFixed(0)}%`;
    }
    return "";
  }, [options, scale]);

  function onChanged(v: OptionModel) {
    setScale((pre) => {
      if (pre == v.value) {
        return pre;
      }
      return v.value;
    });
  }

  return (
    <Tippy
      interactive
      trigger="click"
      onCreate={(instance) => (instanceRef.current = instance)}
      placement={"bottom-start"}
      content={
        <div className="scale-wrapper">
          {options.map((v) => {
            return (
              <div
                key={v.value}
                onClick={() => {
                  onChanged(v);
                  instanceRef.current?.hide();
                }}
                className="scale-option"
              >
                {v.label}
              </div>
            );
          })}
        </div>
      }
      popperOptions={{
        modifiers: [
          {
            enabled: true,
            name: "updatePosition",
            phase: "beforeWrite",
            requires: ["computeStyles"],
            fn: ({ instance, state }) => {
              if (rootRef.current) {
                const headerWidthStr = `${rootRef.current.clientWidth}px`;
                if (state.styles.popper.width != headerWidthStr) {
                  state.styles.popper.width = headerWidthStr;
                  instance.update();
                }
              }
            },
          },
        ],
      }}
      hideOnClick
    >
      <div className="scale-reference" ref={rootRef}>
        {displayName}
      </div>
    </Tippy>
  );
};

export default ScaleSelector;
