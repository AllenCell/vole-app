import type { View3d } from "@aics/vole-core";
import React, { type ReactElement, useEffect, useRef, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type RecordingCropPreviewProps = {
  view3d: View3d;
  cropDimensionsPx: [number, number];
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

  const viewportAspectRatioRef = useRef(viewportDimensions[0] / viewportDimensions[1]);
  viewportAspectRatioRef.current = viewportDimensions[0] / viewportDimensions[1];

  // Update crop on crop dimensions change
  useEffect(() => {
    const prevCropDimsPx = prevCropDimensionsRef.current;
    const widthChanged = prevCropDimsPx[0] !== cropDimensionsPx[0];
    const heightChanged = prevCropDimsPx[1] !== cropDimensionsPx[1];
    if (!widthChanged && !heightChanged) {
      return;
    }

    // TODO: Account for image (viewport) dimensions here
    const pxCrop = percentToPixelCrop(percentCrop, viewportDimensions);
    const centerPxX = pxCrop.x + pxCrop.width / 2;
    const centerPxY = pxCrop.y + pxCrop.height / 2;
    const oldCropAspectRatioPx = pxCrop.width / pxCrop.height;
    const newCropAspectRatioPx = cropDimensionsPx[0] / cropDimensionsPx[1];

    let newWidthPx = pxCrop.width;
    let newHeightPx = pxCrop.height;
    if (oldCropAspectRatioPx > newCropAspectRatioPx) {
      // Old crop was wider than the new crop; use width as bound, and adjust height
      newHeightPx = newWidthPx / newCropAspectRatioPx;
    } else {
      newWidthPx = newHeightPx * newCropAspectRatioPx;
    }

    // Normalize width and height to be within the viewport bounds
    if (newWidthPx > viewportDimensions[0]) {
      newWidthPx = viewportDimensions[0];
      newHeightPx = newWidthPx / newCropAspectRatioPx;
    }
    if (newHeightPx > viewportDimensions[1]) {
      newHeightPx = viewportDimensions[1];
      newWidthPx = newHeightPx * newCropAspectRatioPx;
    }
    // TODO: Recenter if the new crop goes out of the viewport bounds
    const newPxCrop: Crop = {
      unit: "px",
      x: centerPxX - newWidthPx / 2,
      y: centerPxY - newHeightPx / 2,
      width: newWidthPx,
      height: newHeightPx,
    };
    const newPctCrop = pixelToPercentCrop(newPxCrop, viewportDimensions);
    console.log("New percent crop", newPctCrop, newPxCrop);
    console.log("centerPx", centerPxX, centerPxY);
    console.log("dimensions", viewportDimensions, "pxCrop", pxCrop);
    setPercentCrop(newPctCrop);
    prevCropDimensionsRef.current = cropDimensionsPx;
  }, [cropDimensionsPx, percentCrop, viewportDimensions]);

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
    // If user clicks outside of crop area, do not update the crop
    if (crop.height === 0 || crop.width === 0) {
      return;
    }
    setPercentCrop(crop);
    // setPercentCrop(percentCrop);
  };

  return (
    <div style={{ maxWidth: "500px", maxHeight: "500px" }}>
      <ReactCrop
        crop={percentCrop}
        onChange={handleOnChange}
        aspect={props.cropDimensionsPx[0] / props.cropDimensionsPx[1]}
        key={cropDimensionsPx[0] / cropDimensionsPx[1]}
        style={{ objectFit: "contain" }}
      >
        <img src={image} alt="Crop preview" style={{ objectFit: "contain", maxWidth: "100%", maxHeight: "100%" }} />
      </ReactCrop>
    </div>
  );
}
