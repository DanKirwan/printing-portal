import { FC, Fragment, Suspense } from 'react';
import { AppRoutes } from './AppRoutes';
import { ModelProvider } from './contexts/ModelContext';
import MainViewerPC from './pageComponents/MainViewer.pc'
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material";

import { theme } from './theme';
import { CssBaseline } from '@mui/material';
import Loading from "@src/components/Loading";
import { AuthProvider } from './contexts/AuthContext';
import { Header } from './components/Header';
import { Layout } from './components/Layout';
import { CookieConsentProvider } from '@use-cookie-consent/react';
import { CookieConsentPopup } from './components/privacy/CookieConsentPopup';
import { CentralLoading } from './components/generic/CentralLoading';




function App() {
  return (
    <ThemeProvider theme={theme}>
      <CookieConsentProvider>
        <AuthProvider>

          <ModelProvider>
            <BrowserRouter>

              <CssBaseline />
              <CookieConsentPopup />
              <Layout>
                <Suspense fallback={<CentralLoading />}>
                  <AppRoutes />
                </Suspense>
              </Layout>
            </BrowserRouter>
          </ModelProvider>
        </AuthProvider>
      </CookieConsentProvider>
    </ThemeProvider>
  )
}

export default App;
