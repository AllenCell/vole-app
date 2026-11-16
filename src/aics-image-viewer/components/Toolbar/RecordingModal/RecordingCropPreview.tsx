import type { View3d } from "@aics/vole-core";
import React, { type ReactElement } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import { useCrop, useViewportDimensions } from "./utils";

type RecordingCropPreviewProps = {
  view3d: View3d;
  cropDimensionsPx: [number, number];
  width: number;
  height: number;
  image: string | undefined;
};

export default function RecordingCropPreview(props: RecordingCropPreviewProps): ReactElement {
  const { view3d, cropDimensionsPx: cropDimensionsPx } = props;

  const viewportDimensions = useViewportDimensions(view3d);
  const [percentCrop, setPercentCrop] = useCrop(viewportDimensions, cropDimensionsPx);

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
