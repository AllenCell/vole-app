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
      dataUrl = await canv.convertToBlob().then((blob) => URL.createObjectURL(blob));
    }

    const frameSuffix: string = frame.toString().padStart(minDigits, "0");
    const downloadFilename = `${this.options.prefix}${frameSuffix}.png`;
    this.download(downloadFilename, dataUrl);
  }
}
