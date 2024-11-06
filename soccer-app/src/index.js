import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, Button } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import App from './App';
import theme from './theme';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';

// Registrar Service Worker
serviceWorkerRegistration.register();

const InstallButton = () => {
  const [deferredPrompt, setDeferredPrompt] = React.useState(null);
  const [isMobile, setIsMobile] = React.useState(false);

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);

      // Verificar se o dispositivo é móvel
      if (/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) 
          && !window.matchMedia('(display-mode: standalone)').matches) {
        setIsMobile(true);
      }
    };

    const handleAppInstalled = () => {
      console.log('PWA was installed');
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
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