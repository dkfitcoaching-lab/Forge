import { useState, useEffect } from "react";

export function useStaggeredReveal(count, delay = 50) {
  const [visible, setVisible] = useState([]);

  useEffect(() => {
    if (!count) { setVisible([]); return; }
    const timers = [];
    for (let i = 0; i < count; i++) {
      timers.push(
        setTimeout(() => {
          setVisible((prev) => [...prev, i]);
        }, i * delay)
      );
    }
    return () => timers.forEach(clearTimeout);
  }, [count, delay]);

  return visible;
}
