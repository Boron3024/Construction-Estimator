import { createBrowserRouter } from 'react-router';
import { Layout } from './components/Layout';
import { Dashboard } from './pages/Dashboard';
import { EstimatorPage } from './pages/EstimatorPage';
import { BoQPage } from './pages/BoQPage';
import { AnalyticsPage } from './pages/AnalyticsPage';
import { ProjectsPage } from './pages/ProjectsPage';

export const router = createBrowserRouter([
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Dashboard },
      { path: 'estimator', Component: EstimatorPage },
      { path: 'boq', Component: BoQPage },
      { path: 'analytics', Component: AnalyticsPage },
      { path: 'projects', Component: ProjectsPage },
    ],
  },
]);
