import { useDispatch, useSelector } from 'react-redux';

import { addItem } from '@features/cart';
import { selectCompareIds } from '@features/compare';
import { selectWishlistItems } from '@features/wishlist';

import { specsLine } from '../components/ProductCard/specsLine';

// TODO (zein): replace with toCartItem from '@features/cart' once exported
function toCartItemFallback(product) {
  return {
    productId: product.id,
    name: product.name,
    brand: product.brand,
    price: product.price,
    oldPrice: product.oldPrice ?? null,
    image: product.images?.[0] ?? null,
    specsLine: product.specs ? specsLine(product.specs) : '',
    options: {},
    stock: product.stock,
    quantity: 1,
  };
}

/**
 * Connects ProductCard actions and active states to Cart, Wishlist, and Compare.
 * Usage: const cardProps = useProductCardActions(); -> <ProductCard product={p} {...cardProps(p)} />
 */
export function useProductCardActions() {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlistItems);
  const compareIds = useSelector(selectCompareIds);

  return (product) => ({
    inWishlist: wishlist.some((item) => item.productId === product.id),
    inCompare: compareIds.includes(product.id),
    onAddToCart: () => {
      dispatch(addItem(toCartItemFallback(product)));
      // TODO (asmaa): trigger Toast notification once Toast is exported from '@shared/components/ui'
    },
    onToggleWishlist: () => {
      // TODO (abdelrahman): replace with toggleWishlist({ productId: product.id, savedPrice: product.price }) from '@features/wishlist'
      dispatch({
        type: 'wishlist/toggleWishlist',
        payload: { productId: product.id, savedPrice: product.price },
      });
    },
    onToggleCompare: () => {
      // TODO (zein): replace with toggleCompare(product.id) from '@features/compare' once exported
      dispatch({
        type: 'compare/toggleCompare',
        payload: product.id,
      });
    },
  });
}
