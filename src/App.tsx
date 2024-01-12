import { ThemeProvider } from "@mui/material";
import { Suspense } from 'react';
import { BrowserRouter } from "react-router-dom";
import { AppRoutes } from './AppRoutes';
import { ModelProvider } from './contexts/ModelContext';

import { CssBaseline } from '@mui/material';
import { CookieConsentProvider } from '@use-cookie-consent/react';
import { Layout } from './components/Layout';
import { CentralLoading } from './components/generic/CentralLoading';
import { CookieConsentPopup } from './components/privacy/CookieConsentPopup';
import { AuthProvider } from './contexts/AuthContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { theme } from './theme';




function App() {
  return (
    <ThemeProvider theme={theme}>
      <Suspense fallback={<CentralLoading />}>
        <CookieConsentProvider>
          <AuthProvider>
            <SettingsProvider>


              <ModelProvider>
                <BrowserRouter>

                  <CssBaseline />
                  <CookieConsentPopup />
                  <Layout>
                    <AppRoutes />
                  </Layout>
                </BrowserRouter>
              </ModelProvider>
            </SettingsProvider>
          </AuthProvider>
        </CookieConsentProvider>
      </Suspense>
    </ThemeProvider>
  )
}

export default App;
