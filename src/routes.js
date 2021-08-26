
import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import Map from "views/Map.js";
import Notifications from "views/Notifications.js";
import Rtl from "views/Rtl.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import UserProfile from "views/UserProfile.js";

var routes = [
  {
    path: "/dashboard",
    name: "Home",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/energy-trading",
    name: "Energy Trading",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: UserProfile,
    layout: "/admin",
  },
  {
    path: "/ppas",
    name: "PPAs",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/admin",
  }
];
export default routes;
