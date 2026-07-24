import { AppProviders } from './providers/AppProviders';
import { AppRouter } from './router/routes';

export default function App() {
  return (
    <AppProviders>
      <AppRouter />
    </AppProviders>
  );
}
