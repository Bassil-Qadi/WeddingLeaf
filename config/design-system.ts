export const designSystem = {
    colors: {
      primary: "#C6A86A",
      background: "#F9F7F3",
      foreground: "#262626",
  
      sage: "#8FA88F",
      rose: "#D7A7A0",
  
      white: "#FFFFFF",
      black: "#171717",
  
      success: "#4CAF50",
      warning: "#F59E0B",
      error: "#EF4444",
    },
  
    radius: {
      sm: "8px",
      md: "12px",
      lg: "18px",
      xl: "24px",
      full: "9999px",
    },
  
    spacing: {
      section: "7rem",
      container: "1280px",
    },
  
    animation: {
      fast: 0.15,
      normal: 0.3,
      luxury: 0.6,
      cinematic: 1.2,
    },
  
    shadow: {
      sm: "0 2px 8px rgba(0,0,0,.06)",
      md: "0 8px 24px rgba(0,0,0,.08)",
      lg: "0 16px 48px rgba(0,0,0,.12)",
    },
  } as const;