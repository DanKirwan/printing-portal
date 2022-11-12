import { ModelProvider } from './contexts/ModelContext';
import MainViewerPC from './pageComponents/MainViewer.pc'

function App() {

  return (
    <ModelProvider>
      <MainViewerPC />

    </ModelProvider>
  )
}

export default App;
