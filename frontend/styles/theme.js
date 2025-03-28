// frontend/config/theme.js
import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  colors: {
    brand: {
      50: "#e6fffa",
      100: "#b2f5ea",
      200: "#81e6d9",
      300: "#4fd1c5",
      400: "#38b2ac",
      500: "#14B8A6", // Main Creova teal color
      600: "#0F766E",
      700: "#285e61",
      800: "#234e52",
      900: "#1d4044",
    },
  },
  fonts: {
    heading: "'Inter', sans-serif",
    body: "'Inter', sans-serif",
  },
  styles: {
    global: {
      body: {
        bgGradient: "linear(to-br, #14B8A6, #ffffff)",
        color: "gray.900",
      },
      h1: {
        fontWeight: "bold",
        color: "gray.800",
      },
      button: {
        _hover: {
          transform: "translateY(-3px)",
          boxShadow: "lg",
        },
      },
    },
  },
});

export default theme;