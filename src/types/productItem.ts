interface ColorOpt {
  code: string;
  color: string;
  colorset: { hex: string };
  photos: string[];
}

export interface ProductItem {
  id: string;
  generalname: string;
  name: string;
  price: number;
  priceDiscount: 1000;
  showonaddons: boolean;
  showonmain: boolean;
  complect: [];
  coloropts: ColorOpt[];
  chars: [];
}
