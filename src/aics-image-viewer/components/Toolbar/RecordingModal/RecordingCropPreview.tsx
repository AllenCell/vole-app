import React, { type ReactElement } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

type RecordingCropPreviewProps = {
  cropDimensionsPx: [number, number];
  width: number;
  height: number;
  image: string | undefined;
  isRecording: boolean;
  percentCrop: Crop;
  setPercentCrop: (crop: Crop) => void;
};

export default function RecordingCropPreview(props: RecordingCropPreviewProps): ReactElement {
  const { cropDimensionsPx: cropDimensionsPx, percentCrop, setPercentCrop } = props;

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
        disabled={props.isRecording}
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
