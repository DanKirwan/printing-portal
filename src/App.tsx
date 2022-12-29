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




function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>

        <ModelProvider>
          <BrowserRouter>
            <Suspense fallback={<Loading />}>

              <CssBaseline />
              <Layout>
                <AppRoutes />
              </Layout>
            </Suspense>
          </BrowserRouter>
        </ModelProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;
