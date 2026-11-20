import CanvasRecorder from "./CanvasRecorder";

/**
 * Downloads each frame as a PNG image.
 */
export default class ImageSequenceRecorder extends CanvasRecorder {
  protected async recordFrame(frame: number): Promise<void> {
    const minDigits = this.options.minDigits || this.options.max.toString().length || 1;

    await this.setFrameAndRender(frame);
    const canv = this.getCanvas();

    let dataUrl: string;
    if (canv instanceof HTMLCanvasElement) {
      dataUrl = canv.toDataURL("image/png");
    } else {
      // OffscreenCanvas
      try {
        dataUrl = await canv.convertToBlob().then((blob) => URL.createObjectURL(blob));
      } catch (error) {
        console.error(error);
        throw new Error(
          "Image capture failed; the resolution may be too high to render. See console for more details."
        );
      }
    }

    const frameSuffix: string = frame.toString().padStart(minDigits, "0");
    const downloadFilename = `${this.options.prefix}${frameSuffix}.png`;
    this.download(downloadFilename, dataUrl);
  }
}
