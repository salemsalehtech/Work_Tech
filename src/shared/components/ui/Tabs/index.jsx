import { useState, useRef } from 'react';
function Tabs({ tabs, id, navClassName, tabClassName, activeTab }) {
  const [isActive, setIsActive] = useState(0);
  const tabRef = useRef([]);
  const keyDown = (e, index) => {
    let nextItem = null;
    if (e.key === 'ArrowRight') nextItem = (index + 1) % tabs.length;
    else if (e.key === 'ArrowLeft') nextItem = (index - 1 + tabs.length) % tabs.length;
    else if (e.key === 'Home') nextItem = 0;
    else if (e.key === 'End') nextItem = tabs.length - 1;
    if (nextItem === null) return;
    e.preventDefault();
    setIsActive(nextItem);
    tabRef.current[nextItem]?.focus();
    console.log('key pressed:', e.key, 'index:', index);
  };
  return (
    <div>
      <div className={navClassName} role="tablist">
        {tabs.map((tab, index) => {
          return (
            <button
              key={tab.label}
              className={`${tabClassName} ${isActive === index ? activeTab : ''}`}
              ref={(element) => (tabRef.current[index] = element)}
              id={`${id}-tab-${index}`}
              role="tab"
              type="button"
              aria-selected={isActive === index}
              aria-controls={`${id}-panel-${index}`}
              tabIndex={isActive === index ? 0 : -1}
              onClick={() => setIsActive(index)}
              onKeyDown={(e) => keyDown(e, index)}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div
        id={`${id}-panel-${isActive}`}
        aria-labelledby={`${id}-tab-${isActive}`}
        role="tabpanel"
        tabIndex={0}
      >
        {tabs[isActive].content}
      </div>
    </div>
  );
}

export default Tabs;
