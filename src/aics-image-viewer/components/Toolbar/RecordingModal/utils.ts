import type { View3d } from "@aics/vole-core";
import { useCallback, useEffect, useRef, useState } from "react";
import type { Crop } from "react-image-crop";

import { clamp } from "../../../shared/utils/math";

export function getFrameCount(min: number, max: number, frameIncrement: number): number {
  return Math.max(Math.ceil(((max ?? 1) - min + 1) / frameIncrement), 1);
}

/**
 * Returns a human-readable duration label in the format "MM min, SS sec".
 */
export const getDurationLabel = (totalSeconds: number): string => {
  const durationMin = Math.floor(totalSeconds / 60);
  const durationSec = totalSeconds - durationMin * 60;

  let timestamp = "";
  if (durationMin > 0) {
    timestamp += durationMin.toString() + " min, ";
  }
  // Format seconds to hundredths if less than 10 seconds
  if (durationMin === 0 && durationSec < 10) {
    // Round digits to 2 decimal places
    const roundedSeconds = Math.round(durationSec * 100) / 100;
    timestamp += roundedSeconds.toFixed(2) + " sec";
  } else {
    timestamp += Math.floor(durationSec).toString() + " sec";
  }
  return timestamp;
};

/** Returns a (heavily-approximated) file size in megabytes (MB) for a video. */
export const getApproximateVideoFilesizeMb = (
  totalSeconds: number,
  videoBitsPerSecond: number,
  exportDimensions: [number, number],
  numFrames: number
): string => {
  // From experimentation, filesize scales linearly (ish) with the
  // bitrate and duration unless a maximum filesize is hit at high
  // bitrates, which seems to depend on the video dimensions.

  // Video quality is bitrate in bits/second.
  // This is usually within 0.5-2x the actual filesize.
  const maxVideoBitsDuration = totalSeconds * videoBitsPerSecond;

  // Experimentally-determined compression ratio (bits per pixel), which determines
  // maximum size a video can be at very high bitrates. This may vary WILDLY based
  // on image complexity (videos with little change will compress better).
  // This is here because otherwise the filesize estimate is way too high for high bitrates
  // (475 MB predicted vs. 70 MB actual)
  // TODO: Is there a way to concretely determine this?
  const compressionRatioBitsPerPixel = 3.5; // Actual value 2.7-3.0, overshooting to be safe
  const maxVideoBitsResolution = exportDimensions[0] * exportDimensions[1] * numFrames * compressionRatioBitsPerPixel;

  const sizeInMb = Math.min(maxVideoBitsResolution, maxVideoBitsDuration) / 8_000_000; // bits to MB

  if (sizeInMb > 1) {
    return Math.round(sizeInMb) + " MB";
  } else {
    // Round to one decimal place, with a minimum of 0.1 MB. (We don't need to be too precise
    // because these are estimates.)
    return Math.max(1, Math.round(sizeInMb * 10)) / 10 + " MB";
  }
};

export function getExportDimensions(dimensionsInput: [number, number], enforceEvenDims: boolean): [number, number] {
  let targetViewportDims;
  if (enforceEvenDims) {
    targetViewportDims = dimensionsInput.map((value) => Math.round(value / 2) * 2) as [number, number];
  } else {
    targetViewportDims = dimensionsInput.map((value) => Math.round(value)) as [number, number];
  }

  return targetViewportDims;
}

/**
 * Determines the required pixel dimensions of the viewport canvas so that the
 * cropped region has the target export resolution. Also returns the offset, in
 * pixels, of the cropped region within the canvas.
 */
export function getCanvasDimensions(
  exportDimensions: [number, number],
  percentCrop: Crop
): {
  canvasDimensionsPx: [number, number];
  canvasOffsetPx: [number, number];
} {
  const canvasWidthPx = Math.ceil(exportDimensions[0] / (percentCrop.width / 100));
  const canvasHeightPx = Math.ceil(exportDimensions[1] / (percentCrop.height / 100));
  const offsetX = Math.round((percentCrop.x / 100) * canvasWidthPx);
  const offsetY = Math.round((percentCrop.y / 100) * canvasHeightPx);

  return {
    canvasDimensionsPx: [canvasWidthPx, canvasHeightPx],
    canvasOffsetPx: [offsetX, offsetY],
  };
}

/**
 * Updates a crop when the viewport or crop dimensions (aspect ratio) changes.
 * @returns A percentile crop, adjusted to fit within the new viewport and crop
 * dimensions. If the viewport and crop dimensions have not changed, returns the
 * original percentile crop.
 */
function syncCropToDimensions(
  percentCrop: Crop,
  newViewportDimensionsPx: [number, number],
  prevViewportDimensionsPx: [number, number],
  newCropDimsPx: [number, number],
  prevCropDimsPx: [number, number]
): Crop {
  const cropDimsChanged = prevCropDimsPx[0] !== newCropDimsPx[0] || prevCropDimsPx[1] !== newCropDimsPx[1];
  const viewportDimsChanged =
    prevViewportDimensionsPx[0] !== newViewportDimensionsPx[0] ||
    prevViewportDimensionsPx[1] !== newViewportDimensionsPx[1];

  if (!cropDimsChanged && !viewportDimsChanged) {
    return percentCrop;
  }

  const centerPctX = percentCrop.x + percentCrop.width / 2;
  const centerPctY = percentCrop.y + percentCrop.height / 2;
  let newHeightPct = percentCrop.height;
  let newWidthPct = percentCrop.width;
  const prevCropAspectRatioPx = prevCropDimsPx[0] / prevCropDimsPx[1];
  const newCropAspectRatioPx = newCropDimsPx[0] / newCropDimsPx[1];
  const newViewportAspectRatio = newViewportDimensionsPx[0] / newViewportDimensionsPx[1];

  if (prevCropAspectRatioPx > newCropAspectRatioPx) {
    // Old crop was wider than the new crop; use width as bound, and adjust height
    newHeightPct = (newWidthPct / newCropAspectRatioPx) * newViewportAspectRatio;
  } else {
    // Old crop was taller than the new crop; use height as bound, and adjust width
    newWidthPct = (newHeightPct * newCropAspectRatioPx) / newViewportAspectRatio;
  }

  // Normalize width and height to be within the new viewport bounds
  if (newWidthPct > 100) {
    newWidthPct = 100;
    newHeightPct = (newWidthPct / newCropAspectRatioPx) * newViewportAspectRatio;
  }
  if (newHeightPct > 100) {
    newHeightPct = 100;
    newWidthPct = (newHeightPct * newCropAspectRatioPx) / newViewportAspectRatio;
  }

  const newPercentCrop: Crop = {
    unit: "%",
    x: centerPctX - newWidthPct / 2,
    y: centerPctY - newHeightPct / 2,
    width: newWidthPct,
    height: newHeightPct,
  };
  // Recenter if the new crop goes out of the viewport bounds
  newPercentCrop.x = clamp(newPercentCrop.x, 0, 100 - newPercentCrop.width);
  newPercentCrop.y = clamp(newPercentCrop.y, 0, 100 - newPercentCrop.height);

  return newPercentCrop;
}

export const getDefaultFullCrop = (): Crop => {
  return {
    unit: "%",
    x: 0,
    y: 0,
    width: 100,
    height: 100,
  };
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

//// MARK: Hooks

/**
 * Hook for managing a percentage {@linkcode Crop} region within a resizable
 * viewport. Synchronizes changes to the crop region with the target image size,
 * and updates crop bound and aspect ratio relative to the viewport.
 *
 * @param viewportDimensionsPx The dimensions of the viewport in pixels.
 * @param targetDimensionsPx The target dimensions of the output image in
 * pixels.
 * @param setTargetDimensionsPx Callback to update the target dimensions of the
 * output image in pixels. Called if the crop region's size changes when
 * `aspectRatio` is `null`.
 * @param aspectRatio The desired aspect ratio of the target output image, or
 * null if freeform. When freeform, changes to the crop region's size will also
 * be used to update the target dimensions, via calls to `setTargetDimensionsPx`.
 * @returns a tuple containing:
 *   - The current crop region as a percent {@linkcode Crop} object.
 *   - A setter function to update the crop region, which accepts a percent
 *     {@linkcode Crop} object.
 */
export function useCrop(
  viewportDimensionsPx: [number, number],
  targetDimensionsPx: [number, number],
  setTargetDimensionsPx: (dimensions: [number, number]) => void,
  aspectRatio: number | null
): [Crop, (percentCrop: Crop) => void] {
  const [percentCrop, _setPercentCrop] = useState<Crop>(
    getDefaultCropFromDimensions(targetDimensionsPx, viewportDimensionsPx)
  );
  const prevCropDimensionsRef = useRef(targetDimensionsPx);
  const prevViewportDimensionsRef = useRef(viewportDimensionsPx);

  // Wrap the percent crop setter to 1) allow changes to the crop aspect ratio
  // to update the crop dimensions, and 2) prevent the crop from becoming too
  // small.
  const setPercentCrop = useCallback(
    (newPercentCrop: Crop) => {
      newPercentCrop = { ...newPercentCrop };

      // Require that crops be at least 10% of the width of the overall image
      newPercentCrop.width = Math.max(10, newPercentCrop.width);
      const viewportAspectRatio = viewportDimensionsPx[0] / viewportDimensionsPx[1];
      const minHeight = aspectRatio !== null ? (newPercentCrop.width / aspectRatio) * viewportAspectRatio : 10;
      newPercentCrop.height = Math.max(minHeight, newPercentCrop.height);

      if (aspectRatio !== null) {
        _setPercentCrop(newPercentCrop);
        return;
      }
      // When aspect ratio is disabled, scale the crop dimensions to match.
      const newCropDimensionsPx: [number, number] = [
        Math.round((targetDimensionsPx[0] / percentCrop.width) * newPercentCrop.width),
        Math.round((targetDimensionsPx[1] / percentCrop.height) * newPercentCrop.height),
      ];
      setTargetDimensionsPx(newCropDimensionsPx);
      _setPercentCrop(newPercentCrop);
      prevCropDimensionsRef.current = newCropDimensionsPx;
    },
    [targetDimensionsPx, aspectRatio, percentCrop, viewportDimensionsPx, setTargetDimensionsPx]
  );

  // Update the crop when the viewport dimensions or crop dimensions change.
  useEffect(() => {
    const newPercentCrop = syncCropToDimensions(
      percentCrop,
      viewportDimensionsPx,
      prevViewportDimensionsRef.current,
      targetDimensionsPx,
      prevCropDimensionsRef.current
    );
    prevCropDimensionsRef.current = targetDimensionsPx;
    prevViewportDimensionsRef.current = viewportDimensionsPx;
    if (newPercentCrop === percentCrop) {
      return;
    }
    _setPercentCrop(newPercentCrop);
  }, [targetDimensionsPx, viewportDimensionsPx, percentCrop]);

  return [percentCrop, setPercentCrop];
}

/**
 * Hook for tracking the current viewport dimensions.
 * @param view3d The 3D view instance.
 * @param onUpdateDimensions Optional callback invoked when the viewport
 * dimensions change.
 * @returns The current viewport dimensions as a tuple [width, height].
 */
export function useViewportDimensions(
  view3d: View3d,
  onUpdateDimensions?: (dimensions: [number, number]) => void
): [number, number] {
  const [viewportDimensions, setViewportDimensions] = useState<[number, number]>([
    view3d.getCanvasDOMElement().width,
    view3d.getCanvasDOMElement().height,
  ]);
  const onUpdateCallbackRef = useRef(onUpdateDimensions);
  onUpdateCallbackRef.current = onUpdateDimensions;

  // Keep viewport dimensions in sync with viewport
  useEffect(() => {
    const canvasHtmlElement = view3d.getCanvasDOMElement();
    if (!canvasHtmlElement) {
      return;
    }
    const observer = new ResizeObserver(() => {
      const width = canvasHtmlElement.width;
      const height = canvasHtmlElement.height;
      setViewportDimensions([width, height]);
      if (onUpdateCallbackRef.current) {
        onUpdateCallbackRef.current([width, height]);
      }
    });
    observer.observe(canvasHtmlElement);
    return () => observer.disconnect();
  }, [view3d]);

  return viewportDimensions;
}
