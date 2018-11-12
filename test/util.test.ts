import mapTypes from '../src';

const podguznikFromList: ProductListItem = {
  title: 'Podguznik',
  productId: 54213,
  url: '/podguznik-54213',
  image: 'tygjhjkqw89786dtsugyh',
  compressedImage: 'bjghftryutyiguhkjhgjh',
  isFavorite: true,
  rating: 4.5,
  ordersQuantity: 83,
  fullPrice: 1500,
  sellPrice: 1300
};

describe('MyLib', () => {
  it('maps to an empty object with empty map', () => {
    let result = mapTypes<ProductListItem, Product>(podguznikFromList, {});
    expect(result).toEqual({});
  });

  it('maps boolean fields', () => {
    let result = mapTypes<ProductListItem, Product>(podguznikFromList, {
      skuId: false,
      title: true
    });
    expect(result).toEqual({
      title: 'Podguznik'
    });
  });

  it('maps string fields', () => {
    let result = mapTypes<ProductListItem, Product>(podguznikFromList, {
      id: 'productId'
    });
    expect(result).toEqual({
      id: 54213
    });
  });

  it('maps fields with custom mappers', () => {
    let result = mapTypes<ProductListItem, Product>(podguznikFromList, {
      images: v => [v.image],
      ratingInfo: v => ({
        feedbackQuantity: '0',
        rating: String(v.rating)
      })
    });
    expect(result).toEqual({
      images: ['tygjhjkqw89786dtsugyh'],
      ratingInfo: {
        feedbackQuantity: '0',
        rating: '4.5'
      }
    });
  });
});

interface Product {
  id: number;
  title: string;
  url: string;
  skuId: number;
  ratingInfo: {
    feedbackQuantity: string;
    rating: string;
  };
  images: Array<string>;
  fullPrice: number;
  purchasePrice: number;
  isFavorite: boolean;
}

interface ProductListItem {
  productId: number;
  title: string;
  url: string;
  fullPrice: number;
  sellPrice: number;
  rating: number;
  image: string;
  compressedImage: string;
  isFavorite: boolean;
  ordersQuantity: number;
}
