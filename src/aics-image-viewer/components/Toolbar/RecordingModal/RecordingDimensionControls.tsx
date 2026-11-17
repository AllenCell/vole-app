import type { View3d } from "@aics/vole-core";
import { LockOutlined, UnlockOutlined } from "@ant-design/icons";
import { Button, Card, InputNumber, Space, Tooltip } from "antd";
import React, { type ReactElement, useCallback, useEffect, useRef, useState } from "react";

import { FlexColumn, FlexRow, FlexRowAlignCenter, VisuallyHidden } from "../../shared/utils";
import { useViewportDimensions } from "./utils";

import { SettingsContainer, SettingsItem } from "../../shared/SettingsContainer";

import styles from "./styles.module.css";

type RecordingDimensionControlsProps = {
  view3d: View3d;
  isRecording: boolean;
  aspectRatio: number | null;
  setAspectRatio: (aspectRatio: number | null) => void;
  settingsIndentPx: number;

  dimensions: [number, number];
  setDimensions: (dimensions: [number, number]) => void;
  exportDimensions: [number, number];

  onClickSetToViewport?: () => void;
};

const enum RecordingDimensionControlsHtmlIds {
  FRAME_DIMENSION_WIDTH_INPUT_ID = "export-modal-dimensions-width-input",
  FRAME_DIMENSION_HEIGHT_INPUT_ID = "export-modal-dimensions-height",
  FRAME_CUSTOM_RANGE_FRAME_INCREMENT_INPUT = "export-modal-frame-custom-range-frame-increment-input",
  FINAL_DIMENSIONS_TEXT = "export-modal-final-dimensions-text",
}

export default function RecordingDimensionControls(props: RecordingDimensionControlsProps): ReactElement {
  const {
    view3d,
    isRecording,
    dimensions,
    setDimensions: setParentDimensions,
    exportDimensions,
    aspectRatio,
    setAspectRatio,
    onClickSetToViewport,
  } = props;

  const cardRef = useRef<HTMLDivElement | null>(null);

  const [useCurrentViewportSize, setUseCurrentViewportSize] = useState(true);

  const [widthInput, setWidthInput] = useState(dimensions[0]);
  const [heightInput, setHeightInput] = useState(dimensions[1]);

  //// MARK: Listeners

  // Sync prop dimensions to input dimensions on change
  useEffect(() => {
    setWidthInput(dimensions[0]);
    setHeightInput(dimensions[1]);
  }, [dimensions]);

  //// MARK: Callbacks

  // Sync width and height inputs with the current dimensions
  const setDimensions = useCallback(
    (dimensions: [number, number]) => {
      setWidthInput(dimensions[0]);
      setHeightInput(dimensions[1]);
      setParentDimensions(dimensions);
    },
    [setParentDimensions]
  );

  const onViewportDimensionsUpdate = useCallback(
    (dimensions: [number, number]): void => {
      if (useCurrentViewportSize && !isRecording) {
        setDimensions(dimensions);
        setAspectRatio(dimensions[0] / dimensions[1]);
      }
    },
    [useCurrentViewportSize, isRecording, setDimensions, setAspectRatio]
  );
  const viewportDimensions = useViewportDimensions(view3d, onViewportDimensionsUpdate);

  //// MARK: Handlers

  const handleSetToViewportDimensions = useCallback(() => {
    setDimensions(viewportDimensions);
    setAspectRatio(viewportDimensions[0] / viewportDimensions[1]);
    setUseCurrentViewportSize(true);
    onClickSetToViewport?.();
  }, [viewportDimensions, aspectRatio, setAspectRatio, setDimensions, onClickSetToViewport]);

  const handleSetWidth = (): void => {
    let width = widthInput;
    if (width !== dimensions[0]) {
      width = Math.round(Math.max(1, width));
      if (aspectRatio !== null) {
        const height = Math.max(Math.round(width / aspectRatio), 1);
        setDimensions([width, height]);
      } else {
        setDimensions([width, dimensions[1]]);
      }
      setUseCurrentViewportSize(false);
    }
  };

  const handleSetHeight = (): void => {
    let height = heightInput;
    if (height !== dimensions[1]) {
      height = Math.round(Math.max(1, height));
      if (aspectRatio !== null) {
        const width = Math.max(Math.round(height * aspectRatio), 1);
        setDimensions([width, height]);
      } else {
        setDimensions([dimensions[0], height]);
      }
      setUseCurrentViewportSize(false);
    }
  };

  const onToggleAspectRatio = (): void => {
    if (aspectRatio !== null) {
      setAspectRatio(null);
    } else {
      setAspectRatio(dimensions[0] / dimensions[1]);
    }
    setUseCurrentViewportSize(false);
  };

  //// MARK: Rendering

  return (
    <Card size="small" title={"Dimensions"} ref={cardRef}>
      <SettingsContainer gapPx={6} indentPx={props.settingsIndentPx}>
        <SettingsItem
          label="Frame dimensions"
          labelStyle={{ marginTop: "2px", height: "min-content" }}
          htmlFor={RecordingDimensionControlsHtmlIds.FRAME_DIMENSION_WIDTH_INPUT_ID}
        >
          <FlexColumn style={{ alignItems: "flex-start", paddingBottom: "8px" }} $gap={6}>
            <FlexRow $gap={6}>
              <Button
                onClick={handleSetToViewportDimensions}
                type={useCurrentViewportSize ? "primary" : "default"}
                disabled={isRecording}
              >
                Set to viewport
              </Button>
              {/*
               * TODO: Implement a mode where, in axis view mode, the viewport
               * can be set to JUST the image and image dimensions.
               */}
              {/* <Button
                disabled={imageDimensions === null}
                type={isImageDimensions ? "primary" : "default"}
                onClick={() => {
                  imageDimensions && onSetDimensions([imageDimensions[0], imageDimensions[1]]);
                  setUseCurrentViewportSize(false);
                }}
              >
                Set to image
              </Button> */}
            </FlexRow>
            <FlexColumn>
              <FlexRowAlignCenter className={styles.flexRowWrap} style={{ gap: "4px" }}>
                <Space.Compact>
                  <Space.Addon>
                    <p className={styles.hintText}>W</p>
                  </Space.Addon>
                  <InputNumber
                    className={styles.dimensionInput}
                    id={RecordingDimensionControlsHtmlIds.FRAME_DIMENSION_WIDTH_INPUT_ID}
                    disabled={isRecording}
                    aria-label="Width"
                    value={widthInput}
                    onChange={(value) => value !== null && setWidthInput(value)}
                    onPressEnter={handleSetWidth}
                    onBlur={handleSetWidth}
                    controls={false}
                    style={{ width: "70px" }}
                  />
                </Space.Compact>
                <span style={{ padding: "0 4px" }}>×</span>
                <Space.Compact>
                  <Space.Addon>
                    <p className={styles.hintText}>H</p>
                  </Space.Addon>
                  <InputNumber
                    className={styles.dimensionInput}
                    id={RecordingDimensionControlsHtmlIds.FRAME_DIMENSION_HEIGHT_INPUT_ID}
                    disabled={isRecording}
                    aria-label="Height"
                    value={heightInput}
                    onChange={(value) => value !== null && setHeightInput(value)}
                    onPressEnter={handleSetHeight}
                    onBlur={handleSetHeight}
                    controls={false}
                    style={{ width: "70px" }}
                  />
                </Space.Compact>
                <Tooltip
                  title={aspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}
                  trigger={["hover", "focus"]}
                  getPopupContainer={() => cardRef.current || document.body}
                >
                  <Button
                    type={aspectRatio ? "primary" : "link"}
                    disabled={isRecording}
                    style={{ fontSize: "20px", padding: "6px" }}
                    onClick={onToggleAspectRatio}
                  >
                    {aspectRatio ? <LockOutlined /> : <UnlockOutlined />}
                    <VisuallyHidden>{aspectRatio ? "Unlock aspect ratio" : "Lock aspect ratio"}</VisuallyHidden>
                  </Button>
                </Tooltip>
              </FlexRowAlignCenter>
            </FlexColumn>
          </FlexColumn>
        </SettingsItem>
        <SettingsItem label="Exported file dimensions" isDisplayOnly={true}>
          <p
            className={styles.hintText}
            id={RecordingDimensionControlsHtmlIds.FINAL_DIMENSIONS_TEXT}
          >{`${exportDimensions[0]} × ${exportDimensions[1]}`}</p>
        </SettingsItem>
      </SettingsContainer>
    </Card>
  );
}
