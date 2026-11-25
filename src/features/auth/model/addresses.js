// An account with addresses always has exactly one default address.
export const setDefaultAddress = (addresses, id) =>
  addresses.map((address) => ({ ...address, isDefault: address.id === id }));

export function addAddress(addresses, address) {
  const next = [...addresses, address];
  return address.isDefault || addresses.length === 0 ? setDefaultAddress(next, address.id) : next;
}

export function removeAddress(addresses, id) {
  const next = addresses.filter((address) => address.id !== id);
  if (next.length === 0 || next.some((address) => address.isDefault)) return next;
  return setDefaultAddress(next, next[0].id);
}
