import { AppProviders } from './AppProviders';
import { BundleBuilderPage } from '../components/layout/BundleBuilderPage';
import { ToastContainer } from '../components/common/Toast/ToastContainer';

export function App() {
  return (
    <AppProviders>
      <BundleBuilderPage />
      <ToastContainer />
    </AppProviders>
  );
}
