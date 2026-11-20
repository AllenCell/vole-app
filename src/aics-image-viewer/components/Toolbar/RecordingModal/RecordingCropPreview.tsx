import React, { type ReactElement, useEffect, useState } from "react";
import ReactCrop, { type Crop } from "react-image-crop";
import "react-image-crop/dist/ReactCrop.css";

import styles from "./styles.module.css";

type RecordingCropPreviewProps = {
  cropDimensionsPx: [number, number];
  width: number | string;
  height: number | string;
  image: string | undefined;
  isRecording: boolean;
  percentCrop: Crop;
  setPercentCrop: (crop: Crop) => void;
  aspectRatio: number | null;
};

export default function RecordingCropPreview(props: RecordingCropPreviewProps): ReactElement {
  const { aspectRatio, setPercentCrop, isRecording } = props;

  // While dragging, ignore crops being passed by props
  const [isDragging, setIsDragging] = useState(false);
  const [currentCrop, setCurrentCrop] = useState(props.percentCrop);
  const crop = isDragging ? currentCrop : props.percentCrop;

  useEffect(() => {
    if (!isDragging) {
      setCurrentCrop(props.percentCrop);
    }
  }, [isDragging, props.percentCrop]);

  //// MARK: Callbacks

  const handleOnChange = (_pixelCrop: Crop, percentCrop: Crop): void => {
    setCurrentCrop(percentCrop);
    setPercentCrop(percentCrop);
  };

  return (
    <div style={{ maxWidth: props.width, maxHeight: props.height }}>
      <ReactCrop
        crop={crop}
        onChange={handleOnChange}
        onDragStart={() => setIsDragging(true)}
        onDragEnd={() => setIsDragging(false)}
        // onComplete={handleOnChange}
        aspect={aspectRatio ?? undefined}
        style={{ objectFit: "contain" }}
        keepSelection={true}
        disabled={isRecording}
      >
        <img className={styles.cropImage} src={props.image} alt="Crop preview" />
      </ReactCrop>
    </div>
  );
}
