import ProposalList from './components/ProposalList';
import LanguageSwitch from './components/LanguageSwitch';
import './i18n/config';

function App() {
  return (
    <div>
      <LanguageSwitch />
      <ProposalList />
    </div>
  );
}

export default App; 