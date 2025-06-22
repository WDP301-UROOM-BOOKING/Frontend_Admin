import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import * as Routers from "./utils/Routes";

//admin
import ListFeedbackAdminPage from "@pages/feedback/ListFeedbackAdminPage";
import ReportedFeedbackAdmin from "@pages/reported_feedback/ReportedFeedbackAdmin";
import DetailReportedAdmin from "@pages/reported_feedback/DetailReportedAdmin";
import ListCustomerAdmin from "@pages/customer/ListCustomerAdmin";
import DetailCustomerAdmin from "@pages/customer/DetailCustomerAdmin";
import ListPaymentHotel from "@pages/payment/ListPaymentHotel";
import DashboardAdmin from "@pages/DashboardAdmin";
import HotelManagement from "@pages/hotelHost/HotelManagement";
import DetailHotelHostAdmin from "@pages/hotelHost/DetailHotelHostAdmin";
import TransactionHotelhost from "@pages/hotelHost/TransactionHotelhost";
import ApprovalAccountHotelhost from "@pages/hotelHost/ApprovalAccountHotelhost";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@redux/store";
import { initializeSocket } from "@redux/socket/socketSlice";
import LoginPage from "@pages/login_register/LoginPage";
import RegisterPage from "@pages/login_register/RegisterPage";
import ForgetPasswordPage from "@pages/login_register/ForgetPasswordPage";
import VerifyCodePage from "@pages/login_register/VerifyCodePage";
import ResetPasswordPage from "@pages/login_register/ResetPasswordPage";
import BannedPage from "@pages/BannedPage";
import VerifyCodeRegisterPage from "@pages/login_register/VerifyCodeRegisterPage";

function App() {

   useEffect(() => {
    document.title = "Uroom Admin";
  }, []);

  const dispatch = useAppDispatch();
  const Socket = useAppSelector((state) => state.Socket.socket);
  const Auth = useAppSelector((state) => state.Auth.Auth);

  useEffect(() => {
    if (Auth?._id === -1) return;
    dispatch(initializeSocket());
  }, [Auth?._id]);

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
        <Route path={Routers.BannedPage} element={<BannedPage />} />

        {/*Authentication */}
        <Route path={Routers.LoginPage} element={<LoginPage />} />
        <Route path={Routers.RegisterPage} element={<RegisterPage/>} />
        <Route path={Routers.ForgetPasswordPage} element={<ForgetPasswordPage />} />
        <Route path={Routers.VerifyCodePage} element={<VerifyCodePage />} />
        <Route path={Routers.ResetPasswordPage} element={<ResetPasswordPage />} />
        <Route path={Routers.VerifyCodeRegisterPage} element={<VerifyCodeRegisterPage />} />
      </Routes>
    </Router>
  );
}

export default App;
