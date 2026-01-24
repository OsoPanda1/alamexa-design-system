type ReportHandler = (metric: {
  name: string;
  value: number;
  id: string;
  delta: number;
}) => void;

export function reportWebVitals(onReport: ReportHandler) {
  if (typeof window === "undefined") return;

  // Performance Observer for Core Web Vitals
  if ("PerformanceObserver" in window) {
    // LCP - Largest Contentful Paint
    try {
      const lcpObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        const lastEntry = entries[entries.length - 1];
        if (lastEntry) {
          onReport({
            name: "LCP",
            value: lastEntry.startTime,
            id: `lcp-${Date.now()}`,
            delta: lastEntry.startTime,
          });
        }
      });
      lcpObserver.observe({ type: "largest-contentful-paint", buffered: true });
    } catch (e) {
      console.debug("LCP observer not supported");
    }

    // FID - First Input Delay
    try {
      const fidObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if ("processingStart" in entry) {
            const fidEntry = entry as PerformanceEventTiming;
            onReport({
              name: "FID",
              value: fidEntry.processingStart - fidEntry.startTime,
              id: `fid-${Date.now()}`,
              delta: fidEntry.processingStart - fidEntry.startTime,
            });
          }
        });
      });
      fidObserver.observe({ type: "first-input", buffered: true });
    } catch (e) {
      console.debug("FID observer not supported");
    }

    // CLS - Cumulative Layout Shift
    try {
      let clsValue = 0;
      const clsObserver = new PerformanceObserver((entryList) => {
        const entries = entryList.getEntries();
        entries.forEach((entry) => {
          if ("hadRecentInput" in entry) {
            const clsEntry = entry as PerformanceEntry & { hadRecentInput: boolean; value: number };
            if (!clsEntry.hadRecentInput) {
              clsValue += clsEntry.value;
            }
          }
        });
        onReport({
          name: "CLS",
          value: clsValue,
          id: `cls-${Date.now()}`,
          delta: clsValue,
        });
      });
      clsObserver.observe({ type: "layout-shift", buffered: true });
    } catch (e) {
      console.debug("CLS observer not supported");
    }
  }

  // TTFB - Time to First Byte
  if ("performance" in window && "getEntriesByType" in performance) {
    const navEntries = performance.getEntriesByType("navigation") as PerformanceNavigationTiming[];
    if (navEntries.length > 0) {
      const nav = navEntries[0];
      onReport({
        name: "TTFB",
        value: nav.responseStart - nav.requestStart,
        id: `ttfb-${Date.now()}`,
        delta: nav.responseStart - nav.requestStart,
      });
    }
  }
}
