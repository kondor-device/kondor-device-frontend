import { BundleComponent } from "@/types/bundle";

export interface BundlePhoto {
  url: string;
  alt?: string;
}

/**
 * Photos of a set in the order they are shown: the set's own photos first (added in the admin),
 * then the first photo of every component, then the rest of the components' photos.
 */
export const getBundlePhotos = (
  ownPhotos: BundlePhoto[] | null | undefined,
  components: BundleComponent[],
): BundlePhoto[] => {
  const componentPhotos = components.map(
    (component) => component.colorOpt?.photos ?? [],
  );

  return [
    ...(ownPhotos ?? []),
    ...componentPhotos.map((list) => list[0]),
    ...componentPhotos.flatMap((list) => list.slice(1)),
  ].filter((photo): photo is BundlePhoto => Boolean(photo?.url));
};
