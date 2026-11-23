export const enum RangeMode {
  ALL,
  CUSTOM,
}

export const enum RecordingMode {
  SCREENSHOT,
  IMAGE_SEQUENCE,
  VIDEO_MP4,
}

export const enum VideoQuality {
  HIGH = "very-high",
  MEDIUM = "medium",
  LOW = "low",
}

export const VideoQualityToEstimatedBitrate: Record<VideoQuality, number> = {
  [VideoQuality.HIGH]: 1e8,
  [VideoQuality.MEDIUM]: 2e7,
  [VideoQuality.LOW]: 1e7,
};
