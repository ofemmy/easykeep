import Footer from "./Footer";
import { useContext } from "react";
import { MyAppContext } from "../store";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import MobileSidebar from "./MobileSidebar";
import LowerNavbar from "./LowerNavbar";
import LoadingComponent from "./LoadingComponent";

type LayoutProps = {};
const Layout: React.FC<LayoutProps> = ({ children }) => {
  const { isLoading } = useContext(MyAppContext);
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-gray-100 pb-12 sm:pb-0">
      <MobileSidebar />
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="flex flex-col w-64">
          <Sidebar />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto focus:outline-none" tabIndex={0}>
        {/* <Navbar/> */}
        {isLoading && <LoadingComponent />}
        {children}
      </div>
    </div>
  );
};
export default Layout;
