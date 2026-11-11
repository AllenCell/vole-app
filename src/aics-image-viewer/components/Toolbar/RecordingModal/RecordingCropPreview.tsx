import { View3d } from "@aics/vole-core";
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

export default function RecordingCropPreview(props: RecordingCropPreviewProps): ReactElement {
  const { view3d, cropDimensionsPx: dimensions } = props;
  const [image, setImage] = useState<string>(
    "https://marketplace.canva.com/xHPJk/MAHA8XxHPJk/1/tl/canva-MAHA8XxHPJk.jpg"
  );
  const [viewportDimensions, setViewportDimensions] = useState<[number, number]>([
    view3d.getCanvasDOMElement().width,
    view3d.getCanvasDOMElement().height,
  ]);

  const prevDimensionsRef = useRef(props.cropDimensionsPx);
  const [percentCrop, setPercentCrop] = useState<Crop>(getDefaultCropFromDimensions(dimensions, viewportDimensions));

  // Update crop on dimensions change
  useEffect(() => {
    const prevDimensions = prevDimensionsRef.current;
    const widthChanged = prevDimensions[0] !== dimensions[0];
    const heightChanged = prevDimensions[1] !== dimensions[1];
    // TODO: Account for image (viewport) dimensions here

    if (!widthChanged && !heightChanged) {
      return;
    }

    const centerX = percentCrop.x + percentCrop.width / 2;
    const centerY = percentCrop.y + percentCrop.height / 2;
    const newAspectRatio = dimensions[0] / dimensions[1];
    let newWidthPct = percentCrop.width;
    let newHeightPct = percentCrop.height;
    if (widthChanged) {
      // Keep height; adjust width based on aspect ratio
      newWidthPct = percentCrop.height * newAspectRatio;
    }
    if (heightChanged) {
      // Keep width; adjust height based on aspect ratio
      newHeightPct = percentCrop.width / newAspectRatio;
    }

    // Normalize width/height to be within 0-100%
    if (newWidthPct > 100) {
      newWidthPct = 100;
      newHeightPct = newWidthPct / newAspectRatio;
    }
    if (newHeightPct > 100) {
      newHeightPct = 100;
      newWidthPct = newHeightPct * newAspectRatio;
    }

    setPercentCrop({
      unit: "%",
      x: centerX - newWidthPct / 2,
      y: centerY - newHeightPct / 2,
      width: newWidthPct,
      height: newHeightPct,
    });

    prevDimensionsRef.current = dimensions;
  }, [dimensions, percentCrop]);

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
    setPercentCrop(percentCrop);
  };

  return (
    <div>
      <ReactCrop
        crop={percentCrop}
        onChange={handleOnChange}
        aspect={props.cropDimensionsPx[0] / props.cropDimensionsPx[1]}
        key={dimensions[0] / dimensions[1]}
      >
        <img src={image} alt="Crop preview" style={{ maxWidth: "100%", maxHeight: "100%" }} />
      </ReactCrop>
    </div>
  );
}
