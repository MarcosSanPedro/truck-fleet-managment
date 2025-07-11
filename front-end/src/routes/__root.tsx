import { Layout } from "../components/layout";
import '../styles/globals.css'

import {
  createRootRoute,
  Outlet,
  useLocation,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import LogisticsErrorPage from "../components/LogisticsErrorPage";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: ()=> <LogisticsErrorPage error={{status: 404, message: "Not Found"}} />
});

export default function RootLayout() {
  const location = useLocation();
  const isAboutPage = location.pathname === '/about';

  if (isAboutPage) {
    return (
      <>
        <Outlet />
        <TanStackRouterDevtools />
      </>
    );
  }

  return (
    <Layout>
      <Outlet />
      <TanStackRouterDevtools />
    </Layout>
  );
};
