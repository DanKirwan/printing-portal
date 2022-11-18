import { FC, Fragment } from 'react';
import { AppRoutes } from './AppRoutes';
import { ModelProvider } from './contexts/ModelContext';
import MainViewerPC from './pageComponents/MainViewer.pc'
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider } from "@mui/material/styles";

import { theme } from './theme';
import { CssBaseline } from '@mui/material';
import { AuthProvider } from './contexts/AuthContext';




function App() {
  return (
    <ThemeProvider theme={theme}>
      <AuthProvider>

        <ModelProvider>
          <BrowserRouter>
            <CssBaseline />
            <AppRoutes />
          </BrowserRouter>
        </ModelProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}

export default App;
