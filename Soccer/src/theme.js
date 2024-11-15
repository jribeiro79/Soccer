import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    primary: {
      main: '#4CAF50', // Verde para cor primária
    },
    secondary: {
      main: '#FFFFFF', // Branco para cor secundária
    },
    eventGroups: {
      firstGroup: '#e3f2fd', // Azul-claro
      secondGroup: '#ffcccb', // Cor avermelhada
      thirdGroup: '#c8e6c9', // Verde um pouco mais escuro
    },
  },
  typography: {
    fontFamily: 'Roboto, Arial, sans-serif',
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '8px',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: '12px', // Cantos arredondados nos cards
          backgroundColor: '#F9F9F9', // Cor de fundo suave, quase branca
        },
      },
    },
    MuiTableCell: {
      styleOverrides: {
        head: {
          backgroundColor: '#E8F5E9', // Fundo verde claro para cabeçalhos de tabelas
          color: '#000000', // Texto preto nos cabeçalhos
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        h4: {
          color: '#4CAF50', // Verde para títulos principais
        },
        h6: {
          color: '#4CAF50', // Verde para subtítulos
        },
      },
    },
  },
});

export default theme;