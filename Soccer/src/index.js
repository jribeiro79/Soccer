import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, Button, Typography } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './theme';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Registrar Service Worker
serviceWorkerRegistration.register();

// Detectar se o dispositivo é um iPhone ou iPad e se está a usar o Safari
const isIOS = () => {
  return (
    /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream
  );
};

const isInStandaloneMode = () => {
  return (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone);
};

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Verificar se o dispositivo é móvel
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        setIsMobile(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, []);

  const handleInstallClick = () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      deferredPrompt.userChoice.then((choiceResult) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setDeferredPrompt(null);
      });
    }
  };

  if (isIOS() && !isInStandaloneMode()) {
    return (
      <Typography variant="body1" sx={{ position: 'absolute', top: 10, right: 10 }}>
        Para instalar esta aplicação, toque no botão de partilha e selecione "Adicionar à Tela de Início".
      </Typography>
    );
  }

  if (!deferredPrompt || !isMobile) {
    return null;
  }

  return (
    <Button
      variant="contained"
      color="secondary"
      size="small"
      onClick={handleInstallClick}
      sx={{ position: 'absolute', top: 10, right: 10 }}
    >
      Install App
    </Button>
  );
};

// Render da aplicação
ReactDOM.render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <BrowserRouter basename="/soccer">
      <InstallButton />
      <App />
    </BrowserRouter>
  </ThemeProvider>,
  document.getElementById('root')
);

export default InstallButton;