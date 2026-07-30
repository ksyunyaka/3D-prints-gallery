import { Outlet } from "react-router-dom";

const AdminLayout = () => (
  <main className="min-h-screen bg-background px-6 py-10">
    <Outlet />
  </main>
);

export default AdminLayout;
