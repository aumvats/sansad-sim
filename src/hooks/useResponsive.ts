import { useState, useEffect } from "react";

const BREAKPOINTS = {
  mobile: 380,
  mobileL: 480,
  tablet: 768,
  desktop: 1024,
  wide: 1440,
} as const;

export interface ResponsiveState {
  width: number;
  isSmallPhone: boolean;
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
  isWide: boolean;
  /** Dot radius in px based on viewport */
  dotRadius: number;
}

export function useResponsive(): ResponsiveState {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1024
  );

  useEffect(() => {
    function handleResize() {
      setWidth(window.innerWidth);
    }
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isSmallPhone = width < BREAKPOINTS.mobileL;
  const isMobile = width < BREAKPOINTS.tablet;

  return {
    width,
    isSmallPhone,
    isMobile,
    isTablet: width >= BREAKPOINTS.tablet && width < BREAKPOINTS.desktop,
    isDesktop: width >= BREAKPOINTS.desktop && width < BREAKPOINTS.wide,
    isWide: width >= BREAKPOINTS.wide,
    dotRadius: isSmallPhone ? 2.5 : isMobile ? 3 : 4,
  };
}
