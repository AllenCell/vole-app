import type { View3d } from "@aics/vole-core";
import React, { type ReactElement, useEffect, useRef, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { syncCropToDimensions } from "./utils";

type RecordingCropPreviewProps = {
  view3d: View3d;
  cropDimensionsPx: [number, number];
  width: number;
  height: number;
  image: string | undefined;
};

const getDefaultCropFromDimensions = (cropDimensions: [number, number], viewportDimensions: [number, number]): Crop => {
  const aspectRatio = cropDimensions[0] / cropDimensions[1];
  const viewportAspectRatio = viewportDimensions[0] / viewportDimensions[1];
  const isAspectRatioWider = viewportAspectRatio > aspectRatio;
  const width = isAspectRatioWider ? (aspectRatio / viewportAspectRatio) * 100 : 100;
  const height = isAspectRatioWider ? 100 : (viewportAspectRatio / aspectRatio) * 100;
  return {
    unit: "%",
    x: (100 - width) / 2,
    y: (100 - height) / 2,
    width: width,
    height: height,
  };
};

export default function RecordingCropPreview(props: RecordingCropPreviewProps): ReactElement {
  const { view3d, cropDimensionsPx: cropDimensionsPx } = props;
  const [viewportDimensions, setViewportDimensions] = useState<[number, number]>([
    view3d.getCanvasDOMElement().width,
    view3d.getCanvasDOMElement().height,
  ]);

  const [percentCrop, setPercentCrop] = useState<Crop>(
    getDefaultCropFromDimensions(cropDimensionsPx, viewportDimensions)
  );
  const prevCropDimensionsRef = useRef(props.cropDimensionsPx);
  const prevViewportDimensionsRef = useRef(viewportDimensions);

  // Update the crop when the viewport dimensions change
  // Update crop + resize when  crop dimensions change
  useEffect(() => {
    const newPercentCrop = syncCropToDimensions(
      percentCrop,
      viewportDimensions,
      prevViewportDimensionsRef.current,
      cropDimensionsPx,
      prevCropDimensionsRef.current
    );
    prevCropDimensionsRef.current = cropDimensionsPx;
    prevViewportDimensionsRef.current = viewportDimensions;
    if (newPercentCrop === percentCrop) {
      return;
    }
    setPercentCrop(newPercentCrop);
  }, [cropDimensionsPx, viewportDimensions, percentCrop]);

  // Keep viewport dimensions in sync with viewport when the user is using the
  // current viewport size.
  useEffect(() => {
    const canvasHtmlElement = view3d.getCanvasDOMElement();
    if (!canvasHtmlElement) {
      return;
    }
    const observer = new ResizeObserver(() => {
      const width = canvasHtmlElement.width;
      const height = canvasHtmlElement.height;
      setViewportDimensions([width, height]);
    });
    observer.observe(canvasHtmlElement);
    return () => observer.disconnect();
  }, [view3d]);

  //// MARK: Callbacks

  const handleOnChange = (_pixelCrop: Crop, percentCrop: Crop): void => {
    setPercentCrop(percentCrop);
  };

  return (
    <div style={{ maxWidth: props.width, maxHeight: props.height }}>
      <ReactCrop
        crop={percentCrop}
        onChange={handleOnChange}
        aspect={props.cropDimensionsPx[0] / props.cropDimensionsPx[1]}
        key={cropDimensionsPx[0] / cropDimensionsPx[1]}
        style={{ objectFit: "contain" }}
        keepSelection={true}
      >
        <img
          src={props.image}
          alt="Crop preview"
          style={{ objectFit: "contain", maxWidth: props.width, maxHeight: props.height }}
        />
      </ReactCrop>
    </div>
  );
}
