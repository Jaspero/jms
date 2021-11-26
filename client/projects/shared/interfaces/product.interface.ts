import {Meta} from './meta.interface';

export interface ProductVariation {
  title: string;
  options: string[];
}

export interface ProductAttribute {
  price: number;
  salePrice: number;
  sku: string;
}

export interface Product {
  id: string;
  title: string;
  excerpt: string;
  sku?: string;
  price: number;
  salePrice: number;
  weight: number;
  stock: number;
  sale: boolean;
  gallery: string[];
  category: string;
  variations: ProductVariation[];
  attributes: ProductAttribute[];
  content: string;
  createdOn: number;
  meta: Meta;
}
