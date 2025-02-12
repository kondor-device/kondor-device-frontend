interface Photo {
  alt: string;
  url: string;
}

export interface ColorOpt {
  code: string;
  color: string;
  colorset: { hex: string };
  photos: Photo[];
}

export interface Characteristic {
  name: string;
  char: string;
}

export interface ComplectItem {
  name: string;
  icon: { url: string; alt: string };
}

export interface ProductItem {
  id: string;
  generalname: string;
  name: string;
  price: number;
  priceDiscount: number;
  showonaddons: boolean;
  showonmain: boolean;
  complect: ComplectItem[];
  coloropts: ColorOpt[];
  chars: Characteristic[];
  cat: { name: string; id: string };
  preorder: boolean;
  preordertext: string;
}
