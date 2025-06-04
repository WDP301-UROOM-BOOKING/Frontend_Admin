import React from "react";
import "../../css/admin/SidebarAdmin.css";
import image1 from "../../images/LOGO_WEBSITE-removebg-preview.png";
import * as Routers from "../../utils/Routes";
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const navigate = useNavigate();
  return (
    <div className="sidebar_2">
      {/* Logo */}
      <div className="mb-4 d-flex justify-content-center mt-3">
        <img src={image1} width="140" height="30" alt="Logo" />
      </div>

      {/* Menu */}
      <ul className="nav flex-column " style={{ marginTop: "25px" }}>
        <li className="nav-item_2">
          <a
            className="nav-link_2 active"
            onClick={() => {
              navigate(Routers.DashboardAdmin);
            }}
          >
            <i className="bi bi-grid me-2"></i> Dashboard
          </a>
        </li>

        <li className="nav-item_2">
          <a
            className="nav-link_2"
            onClick={() => {
              navigate(Routers.HotelManagement);
            }}
          >
            <i className="bi bi-map me-2"></i> Hotel management
          </a>
        </li>

        <li className="nav-item_2">
          <a
            className="nav-link_2"
            onClick={() => {
              navigate(Routers.ListCustomerAdmin);
            }}
          >
            <i className="bi bi-person me-2"></i> List customer
          </a>
        </li>

        <li className="nav-item_2">
          <a
            className="nav-link_2"
            onClick={() => {
              navigate(Routers.TransactionHotelhost);
            }}
          >
            <i className="bi bi-palette me-2"></i> Transaction
          </a>
        </li>

        <li className="nav-item_2">
          <a
            className="nav-link_2"
            onClick={() => {
              navigate(Routers.ApprovalAccountHotelhost);
            }}
          >
            <i className="bi bi-person me-2"></i> Approval hotel
          </a>
        </li>
        <li className="nav-item_2">
          <a
            className="nav-link_2"
            onClick={() => {
              navigate(Routers.ReportedFeedbackAdmin);
            }}
          >
            <i className="bi bi-book me-2"></i> Report Feedback
          </a>
        </li>
      </ul>
    </div>
  );
}
