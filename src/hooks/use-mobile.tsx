import * as React from "react";

const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;

type Breakpoint = "mobile" | "tablet" | "desktop";
type DeviceSize = "xs" | "sm" | "md" | "lg" | "xl";

export interface UseBreakpointReturn {
  /** true si es mobile (< 768px) */
  isMobile: boolean;
  /** true si es tablet (768px - 1024px) */
  isTablet: boolean;
  /** true si es desktop (> 1024px) */
  isDesktop: boolean;
  
  /** Breakpoint activo: 'mobile' | 'tablet' | 'desktop' */
  breakpoint: Breakpoint;
  
  /** Tamaño de dispositivo Tailwind: 'xs' | 'sm' | 'md' | 'lg' | 'xl' */
  size: DeviceSize;
  
  /** Ancho actual de ventana */
  width: number;
  
  /** Alto actual de ventana */
  height: number;
  
  /** Orientación: 'landscape' | 'portrait' */
  orientation: "landscape" | "portrait";
  
  /** Dispositivo táctil */
  isTouch: boolean;
  
  /** Estado inicial cargado */
  isReady: boolean;
}

export function useBreakpoint(): UseBreakpointReturn {
  const [state, setState] = React.useState<UseBreakpointReturn>({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    breakpoint: "mobile",
    size: "xs",
    width: 0,
    height: 0,
    orientation: "portrait",
    isTouch: false,
    isReady: false,
  });

  React.useEffect(() => {
    // Estado inicial
    const updateState = () => {
      const w = window.innerWidth;
      const h = window.innerHeight;
      const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
      
      const breakpoint: Breakpoint = w < MOBILE_BREAKPOINT 
        ? "mobile" 
        : w < TABLET_BREAKPOINT 
        ? "tablet" 
        : "desktop";
      
      const size: DeviceSize = w < 640 ? "xs" : w < 768 ? "sm" : 
                              w < 1024 ? "md" : w < 1280 ? "lg" : "xl";
      
      const orientation = w > h ? "landscape" : "portrait";

      setState({
        isMobile: w < MOBILE_BREAKPOINT,
        isTablet: w >= MOBILE_BREAKPOINT && w < TABLET_BREAKPOINT,
        isDesktop: w >= TABLET_BREAKPOINT,
        breakpoint,
        size,
        width: w,
        height: h,
        orientation,
        isTouch: isTouchDevice,
        isReady: true,
      });
    };

    // MatchMedia para cada breakpoint (más preciso que window resize)
    const mediaQueries = [
      window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`), // mobile
      window.matchMedia(`(min-width: ${MOBILE_BREAKPOINT}px) and (max-width: ${TABLET_BREAKPOINT - 1}px)`), // tablet
      window.matchMedia(`(min-width: ${TABLET_BREAKPOINT}px)`), // desktop
    ];

    // Listeners iniciales
    updateState();
    
    // Resize throttled
    let timeoutId: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(updateState, 100);
    };

    window.addEventListener("resize", handleResize);
    
    // MatchMedia listeners (más eficiente)
    mediaQueries.forEach((mq) => mq.addEventListener("change", updateState));

    // Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      mediaQueries.forEach((mq) => mq.removeEventListener("change", updateState));
      clearTimeout(timeoutId);
    };
  }, []);

  return state;
}

// Hooks derivados para casos comunes
export function useIsMobile() {
  return useBreakpoint().isMobile;
}

export function useIsTablet() {
  return useBreakpoint().isTablet;
}

export function useIsDesktop() {
  return useBreakpoint().isDesktop;
}

export function useWindowSize() {
  return {
    width: useBreakpoint().width,
    height: useBreakpoint().height,
  };
}

export function useOrientation() {
  return useBreakpoint().orientation;
}

// Hook SSR-safe (evita hydration mismatch)
export function useBreakpointSSR(initialWidth = 0): UseBreakpointReturn {
  const browserBreakpoint = useBreakpoint();
  
  if (typeof window === "undefined") {
    return {
      isMobile: initialWidth < MOBILE_BREAKPOINT,
      isTablet: initialWidth >= MOBILE_BREAKPOINT && initialWidth < TABLET_BREAKPOINT,
      isDesktop: initialWidth >= TABLET_BREAKPOINT,
      breakpoint: initialWidth < MOBILE_BREAKPOINT ? "mobile" : 
                 initialWidth < TABLET_BREAKPOINT ? "tablet" : "desktop",
      size: initialWidth < 640 ? "xs" : initialWidth < 768 ? "sm" : 
             initialWidth < 1024 ? "md" : initialWidth < 1280 ? "lg" : "xl",
      width: initialWidth,
      height: 0,
      orientation: "portrait",
      isTouch: false,
      isReady: true,
    };
  }
  
  return browserBreakpoint;
}
