import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { pagesConfig } from './pages.config'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { ProtectedRoute } from '@/components/ProtectedRoute';
import LoginPage from '@/pages/Login';

const { Pages, Layout, mainPage } = pagesConfig;
const mainPageKey = mainPage ?? Object.keys(Pages)[0];
const MainPage = mainPageKey ? Pages[mainPageKey] : <></>;

const LayoutWrapper = ({ children, currentPageName }) => Layout ?
  <Layout currentPageName={currentPageName}>{children}</Layout>
  : <>{children}</>;

const AuthenticatedApp = () => (
  <Routes>
    <Route path="/login" element={<LoginPage />} />
    {Object.entries(Pages).map(([path, Page]) => (
      <Route
        key={path}
        path={path === mainPageKey ? "/" : `/${path}`}
        element={
          <ProtectedRoute>
            <LayoutWrapper currentPageName={path}>
              <Page />
            </LayoutWrapper>
          </ProtectedRoute>
        }
      />
    ))}
    <Route path="*" element={<PageNotFound />} />
  </Routes>
);


function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;

