
import Dashboard from "views/Dashboard.js";
import Icons from "views/Icons.js";
import Map from "views/Map.js";
import Notifications from "views/Notifications.js";
import Rtl from "views/Rtl.js";
import TableList from "views/TableList.js";
import Typography from "views/Typography.js";
import EnergyTrading from "views/EnergyTrading.js";
import Devices from "./views/Devices";
import Transactions from "./views/Transactions";

var routes = [
  {
    path: "/dashboard",
    name: "Home",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/panel",
  },
  {
    path: "/devices",
    name: "Device Manager",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Devices,
    layout: "/panel",
  },
  {
    path: "/energy-trading",
    name: "Energy Trading",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: EnergyTrading,
    layout: "/panel",
  },
  {
    path: "/transactions",
    name: "Transactions",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Transactions,
    layout: "/panel",
  },
  {
    path: "/ppas",
    name: "PPAs",
    rtlName: "",
    icon: "tim-icons icon-chart-pie-36",
    component: Dashboard,
    layout: "/panel",
  }
];
export default routes;
