export type CanvasOverlayOptions = {
  source: {
    setFrame: (frame: number) => Promise<void>;
    getCanvas: () => HTMLCanvasElement;
    /** Dimensions of the area to sample from in the source canvas, in pixels.*/
    dimensionsPx: [number, number];
    /**
     * Offset of the area to sample from in the source canvas, in pixels, from
     * the top left corner.
     */
    offsetPx: [number, number];
  };
};

/**
 * Composites a source canvas to an offscreen canvas so that additional overlays
 * (scale bars, timestamps) can be drawn on top of it.
 */
export default class CanvasOverlayRenderer {
  private offscreenCanvas: OffscreenCanvas;

  constructor(private options: CanvasOverlayOptions) {
    // TODO: When footer is enabled, resize the offscreen canvas to account for
    // it (e.g. add height).
    this.offscreenCanvas = new OffscreenCanvas(options.source.dimensionsPx[0], options.source.dimensionsPx[1]);

    this.setFrame = this.setFrame.bind(this);
    this.getCanvas = this.getCanvas.bind(this);
  }

  public async setFrame(frame: number): Promise<void> {
    await this.options.source.setFrame(frame);

    // Copy source canvas into offscreen canvas with dims at offset
    const [offsetX, offsetY] = this.options.source.offsetPx;
    const [width, height] = this.options.source.dimensionsPx;

    const ctx = this.offscreenCanvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, width, height);
      ctx.drawImage(this.options.source.getCanvas(), offsetX, offsetY, width, height, 0, 0, width, height);
    }

    // TODO: Draw footer for scale bar and timestamp
  }

  public getCanvas(): OffscreenCanvas {
    return this.offscreenCanvas;
  }
}
