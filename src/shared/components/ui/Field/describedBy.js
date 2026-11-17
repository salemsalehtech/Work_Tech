/** Id of the message that describes a control (aria-describedby): the error wins over the hint. */
export function describedBy(id, { hint, error }) {
  if (!id) return undefined;
  if (error) return `${id}-error`;
  if (hint) return `${id}-hint`;
  return undefined;
}
