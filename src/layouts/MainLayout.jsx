import { useState } from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import Breadcrumbs from "../components/Breadcrumbs";
import { useTheme } from "../hooks/useTheme";
import { useAuth } from "../context/AuthProvider";

const MainLayout = ({ children }) => {
  const { dark, setDark } = useTheme();
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="flex flex-col h-screen">
      <Header
        dark={dark}
        setDark={setDark}
        user={user}
        toggleSidebar={toggleSidebar}
      />
      <div className="flex flex-grow overflow-hidden">
        <Sidebar
          role={user?.auth?.role}
          isOpen={sidebarOpen}
        />
        <main className="flex-grow p-4 bg-gray-100 dark:bg-gray-900 overflow-y-auto">
          <Breadcrumbs />
          <div className="h-full">{children}</div>
        </main>
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default MainLayout;
