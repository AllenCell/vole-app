import type { View3d } from "@aics/vole-core";
import React, { type ReactElement, useEffect, useRef, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { clamp } from "../../../shared/utils/math";

type RecordingCropPreviewProps = {
  view3d: View3d;
  cropDimensionsPx: [number, number];
  width: number;
  height: number;
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

function percentToPixelCrop(percentCrop: Crop, viewportDimensions: [number, number]): Crop {
  const [viewportWidth, viewportHeight] = viewportDimensions;
  return {
    unit: "px",
    x: (percentCrop.x / 100) * viewportWidth,
    y: (percentCrop.y / 100) * viewportHeight,
    width: (percentCrop.width / 100) * viewportWidth,
    height: (percentCrop.height / 100) * viewportHeight,
  };
}

function pixelToPercentCrop(pixelCrop: Crop, viewportDimensions: [number, number]): Crop {
  const [viewportWidth, viewportHeight] = viewportDimensions;
  return {
    unit: "%",
    x: (pixelCrop.x / viewportWidth) * 100,
    y: (pixelCrop.y / viewportHeight) * 100,
    width: (pixelCrop.width / viewportWidth) * 100,
    height: (pixelCrop.height / viewportHeight) * 100,
  };
}

function recenterPercentCrop(percentCrop: Crop): void {
  percentCrop.x = clamp(percentCrop.x, 0, 100 - percentCrop.width);
  percentCrop.y = clamp(percentCrop.y, 0, 100 - percentCrop.height);
}

function updateCrop(
  percentCrop: Crop,
  prevViewportDimensions: [number, number],
  newViewportDimensions: [number, number],
  prevCropDimsPx: [number, number],
  newCropDimsPx: [number, number]
): Crop {
  const cropDimsChanged = prevCropDimsPx[0] !== newCropDimsPx[0] || prevCropDimsPx[1] !== newCropDimsPx[1];
  const viewportDimsChanged =
    prevViewportDimensions[0] !== newViewportDimensions[0] || prevViewportDimensions[1] !== newViewportDimensions[1];
  if (!cropDimsChanged && !viewportDimsChanged) {
    return percentCrop;
  }

  // const centerPctX = percentCrop.x + percentCrop.width / 2;
  // const centerPctY = percentCrop.y + percentCrop.height / 2;

  const pxCrop = percentToPixelCrop(percentCrop, prevViewportDimensions);
  const centerPxX = pxCrop.x + pxCrop.width / 2;
  const centerPxY = pxCrop.y + pxCrop.height / 2;
  const prevCropAspectRatioPx = pxCrop.width / pxCrop.height;
  const newCropAspectRatioPx = newCropDimsPx[0] / newCropDimsPx[1];

  let newWidthPx = pxCrop.width;
  let newHeightPx = pxCrop.height;

  if (prevCropAspectRatioPx > newCropAspectRatioPx) {
    // Old crop was wider than the new crop; use width as bound, and adjust height
    newHeightPx = newWidthPx / newCropAspectRatioPx;
  } else {
    newWidthPx = newHeightPx * newCropAspectRatioPx;
  }

  // Normalize width and height to be within the new viewport bounds
  if (newWidthPx > newViewportDimensions[0]) {
    newWidthPx = newViewportDimensions[0];
    newHeightPx = newWidthPx / newCropAspectRatioPx;
  }
  if (newHeightPx > newViewportDimensions[1]) {
    newHeightPx = newViewportDimensions[1];
    newWidthPx = newHeightPx * newCropAspectRatioPx;
  }

  const newPxCrop: Crop = {
    unit: "px",
    x: centerPxX - newWidthPx / 2,
    y: centerPxY - newHeightPx / 2,
    width: newWidthPx,
    height: newHeightPx,
  };
  const newPctCrop = pixelToPercentCrop(newPxCrop, newViewportDimensions);
  // Recenter if the new crop goes out of the viewport bounds
  recenterPercentCrop(newPctCrop);
  return newPctCrop;
}

export default function RecordingCropPreview(props: RecordingCropPreviewProps): ReactElement {
  const { view3d, cropDimensionsPx: cropDimensionsPx } = props;
  const [image, setImage] = useState<string>(
    "https://marketplace.canva.com/xHPJk/MAHA8XxHPJk/1/tl/canva-MAHA8XxHPJk.jpg"
  );
  const [viewportDimensions, setViewportDimensions] = useState<[number, number]>([
    view3d.getCanvasDOMElement().width,
    view3d.getCanvasDOMElement().height,
  ]);

  const prevCropDimensionsRef = useRef(props.cropDimensionsPx);
  const [percentCrop, setPercentCrop] = useState<Crop>(
    getDefaultCropFromDimensions(cropDimensionsPx, viewportDimensions)
  );

  const viewportDimensionsRef = useRef(viewportDimensions);
  // viewportDimensionsRef.current = viewportDimensions;

  // Update the crop when the viewport dimensions change
  // Update crop + resize when  crop dimensions change
  useEffect(() => {
    const newPercentCrop = updateCrop(
      percentCrop,
      viewportDimensionsRef.current,
      viewportDimensions,
      prevCropDimensionsRef.current,
      cropDimensionsPx
    );
    prevCropDimensionsRef.current = cropDimensionsPx;
    viewportDimensionsRef.current = viewportDimensions;
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
      view3d.capture((dataUrl: string) => setImage(dataUrl));
    });
    observer.observe(canvasHtmlElement);
    return () => observer.disconnect();
  }, [view3d]);

  //// MARK: Callbacks

  const handleOnChange = (crop: Crop, percentCrop: Crop): void => {
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
          src={image}
          alt="Crop preview"
          style={{ objectFit: "contain", maxWidth: props.width, maxHeight: props.height }}
        />
      </ReactCrop>
    </div>
  );
}
