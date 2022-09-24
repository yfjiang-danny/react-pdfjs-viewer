import React, { FC } from "react";
import "../styles/loading-layer.less";

interface LoadingLayerProps {}

const LoadingLayer: FC<LoadingLayerProps> = (props) => {
  return <div className="loading-layer" />;
};

export default LoadingLayer;
