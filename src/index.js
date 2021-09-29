
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import AdminLayout from "layouts/Admin/Admin.js";
import RTLLayout from "layouts/RTL/RTL.js";

import "assets/scss/black-dashboard-react.scss";
import "assets/demo/demo.css";
import "assets/css/nucleo-icons.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ThemeContextWrapper from "./components/ThemeWrapper/ThemeWrapper";
import BackgroundColorWrapper from "./components/BackgroundColorWrapper/BackgroundColorWrapper";
import ReceiptPDF from "./views/ReceiptPDF";
import ViewPPA from "./views/ViewPPA";

ReactDOM.render(
  <ThemeContextWrapper>
    <BackgroundColorWrapper>
      <BrowserRouter>
        <Switch>
          <Route path="/panel" render={(props) => <AdminLayout {...props} />} />
          <Route path="/receipt/:id" render={(props) => <ReceiptPDF {...props} />} />
          <Route path="/viewPPA/:id" render={(props) => <ViewPPA {...props} />} />
            <Redirect from="/" to="/panel/dashboard" />
        </Switch>
      </BrowserRouter>
      <ToastContainer />
    </BackgroundColorWrapper>
  </ThemeContextWrapper>,
  document.getElementById("root")
);
