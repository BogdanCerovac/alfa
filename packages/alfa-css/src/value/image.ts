import { Hash } from "@siteimprove/alfa-hash";
import { Parser } from "@siteimprove/alfa-parser";

import { Value } from "../value";

import { URL } from "./url";
import { Gradient } from "./gradient";

const { map, either } = Parser;

/**
 * @see https://drafts.csswg.org/css-values/#images
 */
export class Image<I extends URL | Gradient = URL | Gradient> extends Value<
  "image"
> {
  public static of<I extends URL | Gradient>(image: I): Image<I> {
    return new Image(image);
  }

  private readonly _image: I;

  private constructor(image: I) {
    super();
    this._image = image;
  }

  public get type(): "image" {
    return "image";
  }

  public get image(): I {
    return this._image;
  }

  public equals(value: unknown): value is this {
    return value instanceof Image && value._image.equals(this._image);
  }

  public hash(hash: Hash): void {
    this._image.hash(hash);
  }

  public toJSON(): Image.JSON {
    return {
      type: "image",
      image: this._image.toJSON(),
    };
  }

  public toString(): string {
    return `${this._image}`;
  }
}

export namespace Image {
  export interface JSON extends Value.JSON {
    type: "image";
    image: URL.JSON | Gradient.JSON;
  }

  export function isImage<I extends URL | Gradient>(
    value: unknown
  ): value is Image<I> {
    return value instanceof Image;
  }

  /**
   * @see https://drafts.csswg.org/css-images/#typedef-image
   */
  export const parse = map(either(URL.parse, Gradient.parse), (image) =>
    Image.of(image)
  );
}
