import { Layout } from "../components/layout";
import '../styles/globals.css'

import {
  createRootRoute,
  Outlet,
  useRouter,
} from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

export const Route = createRootRoute({
  component: RootLayout,
});

export default function RootLayout() {
  const router = useRouter();
  console.log(router.basepath);
  return (
    <Layout activeTab={router.basepath}>
      {/* <> */}
      <Outlet />
      <TanStackRouterDevtools />
      {/* </> */}
    </Layout>
  );
};
