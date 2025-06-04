import { useState } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";

const DashboardPage = ({setActiveTab}) => {
  // Dữ liệu thống kê tổng quan
  const overviewStats = {
    totalHotels: 1245,
    activeHotels: 987,
    pendingApprovals: 58,
    totalCustomers: 25430,
    totalRevenue: "12.5M",
    growthRate: 18.5,
  };

  // Dữ liệu biểu đồ doanh thu
  const revenueData = {
    labels: [
      "T1",
      "T2",
      "T3",
      "T4",
      "T5",
      "T6",
      "T7",
      "T8",
      "T9",
      "T10",
      "T11",
      "T12",
    ],
    datasets: [
      {
        label: "Doanh thu thực tế",
        data: [
          12500, 13200, 15400, 18900, 21500, 25800, 28900, 27600, 24300, 19800,
          16500, 22100,
        ],
        borderColor: "#4361ee",
        backgroundColor: "rgba(67, 97, 238, 0.1)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Dự đoán (AI)",
        data: [
          12000, 13000, 15000, 19000, 22000, 26000, 29000, 28000, 24000, 20000,
          17000, 23000,
        ],
        borderColor: "#f72585",
        borderDash: [5, 5],
        tension: 0.4,
        fill: false,
      },
    ],
  };

  // Dữ liệu biểu đồ phân bố khách sạn theo khu vực
  const hotelDistributionData = {
    labels: ["Miền Bắc", "Miền Trung", "Miền Nam", "Tây Nguyên", "Ven biển"],
    datasets: [
      {
        data: [35, 25, 30, 5, 15],
        backgroundColor: [
          "#4361ee",
          "#3a0ca3",
          "#4cc9f0",
          "#f72585",
          "#7209b7",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu biểu đồ phân loại khách sạn
  const hotelCategoryData = {
    labels: ["5 sao", "4 sao", "3 sao", "2 sao", "Khác"],
    datasets: [
      {
        data: [15, 25, 35, 20, 5],
        backgroundColor: [
          "#4cc9f0",
          "#4361ee",
          "#3a0ca3",
          "#7209b7",
          "#f72585",
        ],
        borderWidth: 1,
      },
    ],
  };

  // Dữ liệu yêu cầu phê duyệt gần đây
  const recentApprovals = [
    {
      id: "A-7829",
      hotelName: "Luxury Palace Hotel",
      owner: "Nguyễn Văn A",
      location: "Hà Nội",
      category: "5 sao",
      submittedDate: "15/06/2025",
      status: "Đang chờ",
    },
    {
      id: "A-7830",
      hotelName: "Seaside Resort & Spa",
      owner: "Trần Thị B",
      location: "Đà Nẵng",
      category: "4 sao",
      submittedDate: "16/06/2025",
      status: "Đang xem xét",
    },
    {
      id: "A-7831",
      hotelName: "City Center Hotel",
      owner: "Lê Văn C",
      location: "TP.HCM",
      category: "3 sao",
      submittedDate: "16/06/2025",
      status: "Đang chờ",
    },
    {
      id: "A-7832",
      hotelName: "Mountain View Lodge",
      owner: "Phạm Thị D",
      location: "Đà Lạt",
      category: "4 sao",
      submittedDate: "17/06/2025",
      status: "Đang xem xét",
    },
    {
      id: "A-7833",
      hotelName: "Riverside Boutique Hotel",
      owner: "Hoàng Văn E",
      location: "Huế",
      category: "4 sao",
      submittedDate: "18/06/2025",
      status: "Đang chờ",
    },
  ];

  // Dữ liệu báo cáo feedback gần đây
  const recentReports = [
    {
      id: "R-7829",
      customerName: "Nguyễn Văn X",
      hotelName: "Luxury Palace Hotel",
      reportType: "Vi phạm chính sách",
      submittedDate: "15/06/2025",
      status: "Chưa xử lý",
      severity: "Cao",
    },
    {
      id: "R-7830",
      customerName: "Trần Thị Y",
      hotelName: "Seaside Resort & Spa",
      reportType: "Chất lượng dịch vụ",
      submittedDate: "16/06/2025",
      status: "Đang xử lý",
      severity: "Trung bình",
    },
    {
      id: "R-7831",
      customerName: "Lê Văn Z",
      hotelName: "City Center Hotel",
      reportType: "Sai thông tin",
      submittedDate: "16/06/2025",
      status: "Chưa xử lý",
      severity: "Thấp",
    },
    {
      id: "R-7832",
      customerName: "Phạm Thị K",
      hotelName: "Mountain View Lodge",
      reportType: "Vi phạm chính sách",
      submittedDate: "17/06/2025",
      status: "Đang xử lý",
      severity: "Cao",
    },
  ];

  // Dữ liệu danh sách hotel host
  const hotelHosts = [
    {
      id: "H-7829",
      name: "Nguyễn Văn A",
      email: "nguyenvana@example.com",
      phone: "0901234567",
      hotels: 3,
      joinDate: "15/01/2023",
      status: "Hoạt động",
    },
    {
      id: "H-7830",
      name: "Trần Thị B",
      email: "tranthib@example.com",
      phone: "0912345678",
      hotels: 2,
      joinDate: "20/03/2023",
      status: "Hoạt động",
    },
    {
      id: "H-7831",
      name: "Lê Văn C",
      email: "levanc@example.com",
      phone: "0923456789",
      hotels: 1,
      joinDate: "05/05/2023",
      status: "Tạm khóa",
    },
    {
      id: "H-7832",
      name: "Phạm Thị D",
      email: "phamthid@example.com",
      phone: "0934567890",
      hotels: 4,
      joinDate: "12/07/2023",
      status: "Hoạt động",
    },
    {
      id: "H-7833",
      name: "Hoàng Văn E",
      email: "hoangvane@example.com",
      phone: "0945678901",
      hotels: 2,
      joinDate: "30/09/2023",
      status: "Hoạt động",
    },
  ];

  // Lấy màu cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "Đã thanh toán":
      case "Hoạt động":
        return "success";
      case "Đang xử lý":
      case "Đang xem xét":
      case "Đang chờ":
        return "warning";
      case "Tạm khóa":
      case "Chưa xử lý":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Lấy màu cho mức độ nghiêm trọng
  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Cao":
        return "danger";
      case "Trung bình":
        return "warning";
      case "Thấp":
        return "info";
      default:
        return "secondary";
    }
  };
  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Tổng quan hệ thống</h1>
        <div className="page-actions">
          <div className="date-filter">
            <select className="form-select">
              <option>Hôm nay</option>
              <option>Tuần này</option>
              <option selected>Tháng này</option>
              <option>Năm nay</option>
            </select>
          </div>
          <button className="btn btn-primary">
            <i className="bi bi-download"></i> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>{overviewStats.totalHotels}</h3>
            <p>Tổng số khách sạn</p>
          </div>
          <div className="stat-card-icon hotels">
            <i className="bi bi-building"></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>{overviewStats.activeHotels}</h3>
            <p>Khách sạn hoạt động</p>
          </div>
          <div className="stat-card-icon active">
            <i className="bi bi-check-circle"></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>{overviewStats.pendingApprovals}</h3>
            <p>Chờ phê duyệt</p>
          </div>
          <div className="stat-card-icon pending">
            <i className="bi bi-hourglass-split"></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>{overviewStats.totalCustomers}</h3>
            <p>Tổng số khách hàng</p>
          </div>
          <div className="stat-card-icon customers">
            <i className="bi bi-people"></i>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="chart-container">
        <div className="chart-header">
          <h2>Doanh thu hệ thống</h2>
          <div className="chart-actions">
            <div className="btn-group">
              <button className="btn btn-sm btn-outline-secondary">Ngày</button>
              <button className="btn btn-sm btn-outline-secondary">Tuần</button>
              <button className="btn btn-sm btn-primary">Tháng</button>
              <button className="btn btn-sm btn-outline-secondary">Năm</button>
            </div>
          </div>
        </div>
        <div className="chart-body">
          <Line
            data={revenueData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  position: "top",
                },
              },
              scales: {
                y: {
                  beginAtZero: false,
                  grid: {
                    drawBorder: false,
                  },
                  ticks: {
                    callback: (value) => value / 1000 + "K",
                  },
                },
                x: {
                  grid: {
                    display: false,
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="charts-row">
        <div className="chart-container half">
          <div className="chart-header">
            <h2>Phân bố khách sạn theo khu vực</h2>
          </div>
          <div className="chart-body">
            <Doughnut
              data={hotelDistributionData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
                cutout: "70%",
              }}
            />
          </div>
        </div>
        <div className="chart-container half">
          <div className="chart-header">
            <h2>Phân loại khách sạn</h2>
          </div>
          <div className="chart-body">
            <Pie
              data={hotelCategoryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Recent Activities */}
      <div className="recent-activities">
        <div className="activity-container">
          <div className="activity-header">
            <h2>Yêu cầu phê duyệt gần đây</h2>
            <a
              href="#"
              onClick={() => setActiveTab("approvals")}
              className="view-all"
            >
              Xem tất cả
            </a>
          </div>
          <div className="activity-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Tên khách sạn</th>
                    <th>Chủ sở hữu</th>
                    <th>Địa điểm</th>
                    <th>Ngày gửi</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {recentApprovals.slice(0, 3).map((approval) => (
                    <tr key={approval.id}>
                      <td>{approval.id}</td>
                      <td>{approval.hotelName}</td>
                      <td>{approval.owner}</td>
                      <td>{approval.location}</td>
                      <td>{approval.submittedDate}</td>
                      <td>
                        <span
                          className={`badge bg-${getStatusColor(
                            approval.status
                          )}`}
                        >
                          {approval.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-primary">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-success">
                            <i className="bi bi-check-lg"></i>
                          </button>
                          <button className="btn btn-sm btn-danger">
                            <i className="bi bi-x-lg"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="activity-container">
          <div className="activity-header">
            <h2>Báo cáo vi phạm gần đây</h2>
            <a
              href="#"
              onClick={() => setActiveTab("reports")}
              className="view-all"
            >
              Xem tất cả
            </a>
          </div>
          <div className="activity-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Khách hàng</th>
                    <th>Khách sạn</th>
                    <th>Loại báo cáo</th>
                    <th>Mức độ</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {recentReports.slice(0, 3).map((report) => (
                    <tr key={report.id}>
                      <td>{report.id}</td>
                      <td>{report.customerName}</td>
                      <td>{report.hotelName}</td>
                      <td>{report.reportType}</td>
                      <td>
                        <span
                          className={`badge bg-${getSeverityColor(
                            report.severity
                          )}`}
                        >
                          {report.severity}
                        </span>
                      </td>
                      <td>
                        <span
                          className={`badge bg-${getStatusColor(
                            report.status
                          )}`}
                        >
                          {report.status}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn-sm btn-primary">
                            <i className="bi bi-eye"></i>
                          </button>
                          <button className="btn btn-sm btn-warning">
                            <i className="bi bi-pencil"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
