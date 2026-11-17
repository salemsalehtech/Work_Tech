import ErrorState from '../ErrorState';

const hasNoItems = (data) =>
  data == null || (Array.isArray(data) ? data.length === 0 : data.items?.length === 0);

/**
 * Renders exactly one of the four states of a data view (loading, error, empty, data) from an RTK Query result.
 *
 *   const result = useGetOrdersQuery(userId);
 *   <DataState result={result} loading={<OrdersSkeleton />} empty={<EmptyState … />}>
 *     {(orders) => <OrderList orders={orders} />}
 *   </DataState>
 *
 * `isEmpty` overrides the default check (empty array, or { items: [] }).
 */
function DataState({
  result,
  loading = null,
  empty = null,
  error,
  isEmpty = hasNoItems,
  children,
}) {
  const { data, isLoading, isError, refetch } = result;

  if (isLoading) return loading;
  if (isError) return error ?? <ErrorState onRetry={refetch} />;
  if (isEmpty(data)) return empty;
  return children(data);
}

export default DataState;
