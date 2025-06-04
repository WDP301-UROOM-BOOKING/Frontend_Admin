import { useState } from "react";
import DetailReportedAdmin from "./DetailReportedAdmin";

function ReportedFeedbackAdmin() {
  const [showModal, setShowModal] = useState(false);
  // Dữ liệu báo cáo feedback gần đây
  const recentReports = [
    {
      id: "1",
      customerName: "Nguyễn Văn X",
      hotelName: "Luxury Palace Hotel",
      reportType: "Vi phạm chính sách",
      submittedDate: "15/06/2025",
      status: "Chưa xử lý",
      severity: "Cao",
    },
    {
      id: "2",
      customerName: "Trần Thị Y",
      hotelName: "Seaside Resort & Spa",
      reportType: "Chất lượng dịch vụ",
      submittedDate: "16/06/2025",
      status: "Đang xử lý",
      severity: "Trung bình",
    },
    {
      id: "2",
      customerName: "Lê Văn Z",
      hotelName: "City Center Hotel",
      reportType: "Sai thông tin",
      submittedDate: "16/06/2025",
      status: "Chưa xử lý",
      severity: "Thấp",
    },
    {
      id: "2",
      customerName: "Phạm Thị K",
      hotelName: "Mountain View Lodge",
      reportType: "Vi phạm chính sách",
      submittedDate: "17/06/2025",
      status: "Đang xử lý",
      severity: "Cao",
    },
  ];

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

  return (
    <div className="reports-content">
      <div className="page-header">
        <h1>Báo cáo vi phạm</h1>
        <div className="page-actions">
          <button className="btn btn-outline-primary">
            <i className="bi bi-filter"></i> Lọc
          </button>
          <button className="btn btn-primary">
            <i className="bi bi-download"></i> Xuất báo cáo
          </button>
        </div>
      </div>

      <div className="content-container">
        <div className="filters-bar">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Tìm kiếm báo cáo..." />
          </div>
          <div className="filters">
            <select className="form-select">
              <option>Tất cả trạng thái</option>
              <option>Chưa xử lý</option>
              <option>Đang xử lý</option>
              <option>Đã xử lý</option>
            </select>
            <select className="form-select">
              <option>Tất cả mức độ</option>
              <option>Cao</option>
              <option>Trung bình</option>
              <option>Thấp</option>
            </select>
            <select className="form-select">
              <option>Tất cả loại</option>
              <option>Vi phạm chính sách</option>
              <option>Chất lượng dịch vụ</option>
              <option>Sai thông tin</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách hàng</th>
                <th>Khách sạn</th>
                <th>Loại báo cáo</th>
                <th>Ngày gửi</th>
                <th>Mức độ</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {recentReports.map((report) => (
                <tr key={report.id}>
                  <td>{report.id}</td>
                  <td>{report.customerName}</td>
                  <td>{report.hotelName}</td>
                  <td>{report.reportType}</td>
                  <td>{report.submittedDate}</td>
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
                      className={`badge bg-${getStatusColor(report.status)}`}
                    >
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-primary"
                        title="Xem chi tiết"
                        onClick={() =>{
                          setShowModal(true);
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button className="btn btn-sm btn-warning" title="Xử lý">
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        title="Đánh dấu đã xử lý"
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination-info">Hiển thị 1-4 của 12 kết quả</div>
          <ul className="pagination">
            <li className="page-item disabled">
              <a className="page-link" href="#">
                Trước
              </a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                Sau
              </a>
            </li>
          </ul>
        </div>
      </div>
      <DetailReportedAdmin
        show={showModal}
        onHide={() => setShowModal(false)}
        handleClose={() => setShowModal(false)}
      />
    </div>
  );
}

export default ReportedFeedbackAdmin;
