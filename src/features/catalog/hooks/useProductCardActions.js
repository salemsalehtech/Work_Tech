import { useDispatch, useSelector } from 'react-redux';

import { addItem, toCartItem } from '@features/cart';
import { selectCompareIds, toggleCompare } from '@features/compare';
import { selectWishlistItems } from '@features/wishlist';

import { specsLine } from '../components/ProductCard/specsLine';

/**
 * Connects a product to the cart, the wishlist and compare.
 *   const actionsOf = useProductCardActions();
 *   <ProductCard product={product} {...actionsOf(product)} />
 * Product details also passes the chosen options: actionsOf(product, { selection }).
 */
export function useProductCardActions() {
  const dispatch = useDispatch();
  const wishlist = useSelector(selectWishlistItems);
  const compareIds = useSelector(selectCompareIds);

  return (product, { selection } = {}) => ({
    inWishlist: wishlist.some((item) => item.productId === product.id),
    inCompare: compareIds.includes(product.id),
    onAddToCart: () =>
      dispatch(addItem(toCartItem(product, { selection, specsLine: specsLine(product.specs) }))),
    // TODO(abdelrahman): dispatch toggleWishlist from @features/wishlist once it is exported.
    onToggleWishlist: () =>
      dispatch({
        type: 'wishlist/toggleWishlist',
        payload: { productId: product.id, price: product.price },
      }),
    onToggleCompare: () => dispatch(toggleCompare(product.id)),
  });
}
