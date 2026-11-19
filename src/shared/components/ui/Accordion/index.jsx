import { useId, useState } from 'react';

function Accordion({
  items = [],
  allowMultiple = false,
  defaultOpenIds = [],
  accordionClassName = '',
}) {
  const [open, setOpen] = useState(allowMultiple ? defaultOpenIds : defaultOpenIds.slice(0, 1));
  const baseId = useId();
  const handleAccordion = (id) => {
    setOpen((prev) => {
      if (prev.includes(id)) {
        return prev.filter((opened) => opened !== id);
      }
      return allowMultiple ? [...prev, id] : [id];
    });
  };
  if (!items.length) return null;

  return (
    <div className={`accordion ${accordionClassName}`}>
      {items.map(({ id, title, content }) => {
        const isOpen = open.includes(id);
        const headerId = `${baseId}-header-${id}`;
        const panelId = `${baseId}-panel-${id}`;

        return (
          <div key={id} className={`accordion_item ${isOpen ? 'is-open' : ''}`}>
            <button
              id={headerId}
              type="button"
              className="accordion_button"
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => handleAccordion(id)}
            >
              <span className="accordion_title">{title}</span>
              <span className="accordion_mark" aria-hidden="true">
                {isOpen ? '-' : '+'}
              </span>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={headerId}
              className="accordion_panel"
              hidden={!isOpen}
            >
              {content}
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default Accordion;
