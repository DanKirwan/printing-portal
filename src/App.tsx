import { FC, Fragment } from 'react';
import { AppRoutes } from './AppRoutes';
import { ModelProvider } from './contexts/ModelContext';
import MainViewerPC from './pageComponents/MainViewer.pc'
import { BrowserRouter } from "react-router-dom";


function App() {

  return (
    <ModelProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </ModelProvider>
  )
}

export default App;
