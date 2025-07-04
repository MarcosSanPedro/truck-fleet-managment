import { Layout } from "../components/layout";
import '../styles/globals.css'

import {
  createRootRoute,
  Outlet,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import LogisticsErrorPage from "../components/LogisticsErrorPage";

export const Route = createRootRoute({
  component: RootLayout,
  notFoundComponent: ()=> <LogisticsErrorPage error={{status: 404, message: "Not Found"}} />
});


export default function RootLayout() {

  return (
    <Layout>
      {/* <> */}
      <Outlet />
      <TanStackRouterDevtools />
      {/* </> */}
    </Layout>
  );
};
