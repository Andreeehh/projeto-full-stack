import { CsvDownloadButton } from '../components/CsvDowloadButton';

function App() {
  const handleClick = () => {};
  return (
    <>
      <CsvDownloadButton onButtonClicked={handleClick}>Importar</CsvDownloadButton>
    </>
  );
}

export default App;
