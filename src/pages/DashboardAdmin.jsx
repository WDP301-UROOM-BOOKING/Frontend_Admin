import "../css/admin/Dashboard.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { useState, useEffect, useRef } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import * as Routers from "@utils/Routes";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { FaBell } from "react-icons/fa";

import AccountManagement from "./hotelHost/HotelManagement";
import ListCustomerAdmin from "./customer/ListCustomerAdmin";
import ReportedFeedbackAdmin from "./reported_feedback/ReportedFeedbackAdmin";
import ListPaymentHotel from "./payment/ListPaymentHotel";
import ApprovePage from "./approve/ApprovePage";
import DashboardPage from "./dashboard/DashboardPage";
import HotelManagement from "./hotelHost/HotelManagement";
import ListFeedbackAdminPage from "./feedback/ListFeedbackAdminPage";
import DetailHotelHostAdmin from "./hotelHost/DetailHotelHostAdmin";
import { useAppSelector } from "@redux/store";
import { disconnectSocket } from "@redux/socket/socketSlice";
import { useDispatch } from "react-redux";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthActions from "@redux/auth/actions";
import { clearToken } from "@utils/handleToken";
import Chat from "./messenger/Chat";
import ListPaymentCustomer from "./payment/ListPaymentCustomer";
import ListPromotionPage from "./promotion/ListPromotionPage";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

function AdminDashboard() {
  const Auth = useAppSelector((state) => state.Auth.Auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isClient, setIsClient] = useState(false);
  
  // Initialize activeTab from URL params or default to "dashboard"
  const [activeTab, setActiveTab] = useState(() => {
    return searchParams.get("tab") || "dashboard";
  });
  
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [notifications, setNotifications] = useState([
    {
      id: 1,
      title: "Yêu cầu phê duyệt mới",
      message: "Luxury Palace Hotel đã gửi yêu cầu phê duyệt",
      time: "5 phút trước",
      isRead: false,
      type: "approval",
    },
    {
      id: 2,
      title: "Báo cáo vi phạm",
      message: "Có báo cáo mới về vi phạm từ khách hàng",
      time: "30 phút trước",
      isRead: false,
      type: "report",
    },
    {
      id: 3,
      title: "Thanh toán mới",
      message: "Giao dịch thanh toán #12345 đã hoàn tất",
      time: "2 giờ trước",
      isRead: true,
      type: "payment",
    },
  ]);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const notificationRef = useRef(null);
  const userMenuRef = useRef(null);

  // Update URL when activeTab changes
  useEffect(() => {
    setSearchParams({ tab: activeTab });
  }, [activeTab, setSearchParams]);

  // Function to handle tab change
  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setIsNotificationOpen(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setIsUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Đếm số thông báo chưa đọc
  const unreadCount = notifications.filter((notif) => !notif.isRead).length;

  // Lấy icon cho loại thông báo
  const getNotificationIcon = (type) => {
    switch (type) {
      case "approval":
        return (
          <i className="bi bi-check-circle-fill notification-icon approval"></i>
        );
      case "report":
        return <i className="bi bi-flag-fill notification-icon report"></i>;
      case "payment":
        return <i className="bi bi-cash-coin notification-icon payment"></i>;
      default:
        return <i className="bi bi-bell-fill notification-icon"></i>;
    }
  };

  // Đảm bảo component đã mount trên client
  useEffect(() => {
    setIsClient(true);
  }, []);

  // Nếu chưa mount trên client, return loading
  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className="admin-dashboard">
        {/* Sidebar */}
        <div className={`sidebar ${sidebarCollapsed ? "collapsed" : ""}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <i className="bi bi-building"></i>
              <span className="logo-text">Admin</span>
            </div>
          </div>

          <div className="sidebar-content">
            <div className="sidebar-menu">
              <h6 className="menu-category">QUẢN LÝ CHÍNH</h6>
              <ul className="menu-items">
                <li
                  className={`menu-item ${
                    activeTab === "dashboard" ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleTabChange("dashboard")}>
                    <i className="bi bi-speedometer2"></i>
                    <span>Dashboard</span>
                  </a>
                </li>
                <li
                  className={`menu-item ${
                    activeTab === "hotel-hosts" ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleTabChange("hotel-hosts")}>
                    <i className="bi bi-building"></i>
                    <span>Quản lý Hotel Host</span>
                  </a>
                </li>
                <li
                  className={`menu-item ${
                    activeTab === "customers" ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleTabChange("customers")}>
                    <i className="bi bi-people"></i>
                    <span>Quản lý Khách hàng</span>
                  </a>
                </li>
                <li
                  className={`menu-item ${
                    activeTab === "promotions" ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleTabChange("promotions")}>
                    <i className="bi bi-check-circle"></i>
                    <span>Quản lý Khuyến mãi</span>
                  </a>
                </li>
                <li
                  className={`menu-item ${
                    activeTab === "approvals" ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleTabChange("approvals")}>
                    <i className="bi bi-check-circle"></i>
                    <span>Phê duyệt Khách sạn</span>
                    <span className="badge bg-danger">58</span>
                  </a>
                </li>
              </ul>

              <h6 className="menu-category">BÁO CÁO & THANH TOÁN</h6>
              <ul className="menu-items">
                <li
                  className={`menu-item ${
                    activeTab === "payments" ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleTabChange("payments")}>
                    <i className="bi bi-wallet"></i>
                    <span>Thanh toán khách sạn</span>
                  </a>
                </li>
                <li
                  className={`menu-item ${
                    activeTab === "payments_customer" ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleTabChange("payments_customer")}>
                    <i className="bi bi-credit-card"></i>
                    <span>Thanh toán khách hàng</span>
                  </a>
                </li>
                <li
                  className={`menu-item ${
                    activeTab === "reports" ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleTabChange("reports")}>
                    <i className="bi bi-flag"></i>
                    <span>Báo cáo vi phạm</span>
                    <span className="badge bg-warning">12</span>
                  </a>
                </li>
              </ul>

              <h6 className="menu-category">Liên Hệ</h6>
              <ul className="menu-items">
                <li
                  className={`menu-item ${
                    activeTab === "messenger" ? "active" : ""
                  }`}
                >
                  <a href="#" onClick={() => handleTabChange("messenger")}>
                    <i className="bi bi-chat-dots-fill"></i>
                    <span>Liên hệ khách hàng</span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          {/* Header */}
          <header className="header">
            <div className="header-left">
              <div className="search-box">
                <i className="bi bi-search"></i>
                <input
                  type="text"
                  placeholder="Tìm kiếm..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="header-right">
              {/* Notification */}
              <div className="notification-container" ref={notificationRef}>
                <button
                  className="notification-button"
                  onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                >
                  <FaBell style={{ color: "black" }} />
                  {unreadCount > 0 && (
                    <span className="notification-badge">{unreadCount}</span>
                  )}
                </button>

                {isNotificationOpen && (
                  <div className="notification-dropdown">
                    <div className="notification-header">
                      <h6>Thông báo</h6>
                      <button className="mark-all-read">Đánh dấu đã đọc</button>
                    </div>
                    <div className="notification-body">
                      {notifications.map((notification) => (
                        <div
                          key={notification.id}
                          className={`notification-item ${
                            !notification.isRead ? "unread" : ""
                          }`}
                        >
                          <div className="notification-icon-wrapper">
                            {getNotificationIcon(notification.type)}
                          </div>
                          <div className="notification-content">
                            <div className="notification-title">
                              {notification.title}
                            </div>
                            <div className="notification-message">
                              {notification.message}
                            </div>
                            <div className="notification-time">
                              {notification.time}
                            </div>
                          </div>
                          {!notification.isRead && (
                            <div className="unread-indicator"></div>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="notification-footer">
                      <button>Xem tất cả thông báo</button>
                    </div>
                  </div>
                )}
              </div>

              {/* User Menu */}
              <div className="user-menu-container" ref={userMenuRef}>
                <button
                  className="user-menu-button"
                  onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                >
                  <img
                    src={
                      Auth?.image?.url ||
                      "https://i.pinimg.com/736x/e7/06/6d/e7066d76a429f504ccf2086d09cf8da1.jpg"
                    }
                    alt="Admin"
                    className="user-avatar"
                  />
                  <div className="user-info">
                    <span className="user-name">{Auth?.name || "Admin"}</span>
                  </div>
                  <i
                    className={`bi bi-chevron-${
                      isUserMenuOpen ? "up" : "down"
                    }`}
                  ></i>
                </button>

                {isUserMenuOpen && (
                  <div className="user-dropdown">
                    <ul>
                      <li className="divider"></li>
                      <li>
                        <a
                          onClick={() => {
                            dispatch(disconnectSocket());
                            navigate(Routers.LoginPage, {
                              state: {
                                message: "Logout account successfully !!!",
                              },
                            });
                            dispatch({
                              type: AuthActions.LOGOUT,
                            });
                            clearToken();
                          }}
                          className="logout"
                          style={{ cursor: "pointer" }}
                        >
                          <i className="bi bi-box-arrow-right"></i>
                          <span>Đăng xuất</span>
                        </a>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="page-content">
            {/* Dashboard */}
            {activeTab === "dashboard" && (
              <DashboardPage setActiveTab={handleTabChange} />
            )}

            {/* Hotel Hosts Management */}
            {activeTab === "hotel-hosts" && (
              <HotelManagement setActiveTab={handleTabChange} />
            )}

            {/* Customers Management */}
            {activeTab === "customers" && <ListCustomerAdmin />}

            {/* Hotel Approvals */}
            {activeTab === "approvals" && <ApprovePage />}

            {/* Payments */}
            {activeTab === "payments" && <ListPaymentHotel />}

            {/* Payments */}
            {activeTab === "payments_customer" && <ListPaymentCustomer />}

            {/* Payments */}
            {activeTab === "promotions" && <ListPromotionPage />}

            {/* Reports */}
            {activeTab === "reports" && <ReportedFeedbackAdmin />}

            {/* messenger */}
            {activeTab === "messenger" && <Chat/>}

            {activeTab === "hotel_information" && (
              <DetailHotelHostAdmin setActiveTab={handleTabChange} />
            )}
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminDashboard;
