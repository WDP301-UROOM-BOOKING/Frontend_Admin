import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as Routers from "./utils/Routes";

//admin
import ListFeedbackAdminPage from "pages/admin/feedback/ListFeedbackAdminPage";
import ReportedFeedbackAdmin from "pages/admin/reported_feedback/ReportedFeedbackAdmin";
import DetailReportedAdmin from "pages/admin/reported_feedback/DetailReportedAdmin";
import ListCustomerAdmin from "pages/admin/customer/ListCustomerAdmin";
import DetailCustomerAdmin from "pages/admin/customer/DetailCustomerAdmin";
import ListPaymentHotel from "pages/admin/payment/ListPaymentHotel";
import DashboardAdmin from "pages/admin/DashboardAdmin";
import HotelManagement from "pages/admin/hotelHost/HotelManagement";
import DetailHotelHostAdmin from "pages/admin/hotelHost/DetailHotelHostAdmin";
import TransactionHotelhost from "pages/admin/hotelHost/TransactionHotelhost";
import ApprovalAccountHotelhost from "pages/admin/hotelHost/ApprovalAccountHotelhost";

function App() {
  return (
    <Router>
      <Routes>
        {/*Admin */}
        <Route path={Routers.ListFeedbackAdminPage} element={<ListFeedbackAdminPage/>} />
        <Route path={Routers.ReportedFeedbackAdmin} element={<ReportedFeedbackAdmin/>} />
        <Route path={Routers.DetailReportedAdmin} element={<DetailReportedAdmin/>} />
        <Route path={Routers.ListCustomerAdmin} element={<ListCustomerAdmin/>} />
        <Route path={Routers.DetailCustomerAdmin} element={<DetailCustomerAdmin/>} />
        <Route path={Routers.ListPaymentHotel} element={<ListPaymentHotel/>} />
        <Route path={Routers.DashboardAdmin} element={<DashboardAdmin />} />
        <Route path={Routers.HotelManagement} element={<HotelManagement />}/>
      <Route path={Routers.DetailHotelHostAdmin} element={<DetailHotelHostAdmin />} />
      <Route path={Routers.TransactionHotelhost} element={<TransactionHotelhost />} />
      <Route path={Routers.ApprovalAccountHotelhost} element={<ApprovalAccountHotelhost />} />

      </Routes>
    </Router>
  );
}

export default App;
