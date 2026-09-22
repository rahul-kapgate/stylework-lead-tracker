import { createTheme } from "@mui/material/styles";

export const muiTheme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#0B8A59",
      dark: "#087149",
      light: "#3BB47F",
    },

    background: {
      default: "#F3F8F5",
      paper: "#FBFDFC",
    },

    text: {
      primary: "#17211C",
      secondary: "#6B7C73",
    },

    divider: "#DCE8E1",
  },

  typography: {
    fontFamily:
      'Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 10,
  },

  components: {
    MuiCheckbox: {
      styleOverrides: {
        root: {
          color: "#B8C9BF",

          "&.Mui-checked": {
            color: "#0B8A59",
          },
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 8,
          fontSize: 12,
        },
      },
    },
  },
});
