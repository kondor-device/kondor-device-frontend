import imageUrlBuilder from "@sanity/image-url";
import type { SanityImageSource } from "@sanity/image-url/lib/types/types";
import { client } from "./sanityClient";

const builder = imageUrlBuilder(client);

export const urlForImage = (source: SanityImageSource) => builder.image(source);
