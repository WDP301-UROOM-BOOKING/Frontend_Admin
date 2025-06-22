import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import { Col, Form, Row } from "react-bootstrap";

const ListPaymentHotel = () => {
  // Dữ liệu giao dịch thanh toán gần đây
  const recentPayments = [
    {
      id: "1",
      hotelName: "Luxury Palace Hotel",
      amount: "4,500,000 VND",
      month:1,
      year: 2025,
      status: "Đã thanh toán",
      type: "Hoa hồng",
    },
    {
      id: "2",
      hotelName: "Seaside Resort & Spa",
      amount: "12,800,000 VND",
      month:3,
      year: 2025,
      status:"Đã thanh toán",
      type: "Hoa hồng",
    },
    {
      id: "3",
      hotelName: "City Center Hotel",
      amount: "1,200,000 VND",
      month:4,
      year: 2025,
      status: "Đang xử lý",
      type: "Phí dịch vụ",
    },
    {
      id: "4",
      hotelName: "Mountain View Lodge",
      amount: "7,500,000 VND",
      month:5,
      year: 2025,
      status: "Đã thanh toán",
      type: "Hoa hồng",
    },
  ];

  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
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
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  return (
    <div className="payments-content">
      <div className="page-header">
        <h1>Quản lý Thanh toán</h1>
        {/* <div className="page-actions">
          <button className="btn btn-outline-primary">
            <i className="bi bi-filter"></i> Lọc
          </button>
          <button className="btn btn-primary">
            <i className="bi bi-download"></i> Xuất báo cáo
          </button>
        </div> */}
      </div>

      <div className="content-container">
        <div className="filters-bar">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Tìm kiếm giao dịch..." />
          </div>
          <div className="filters">
            <select className="form-select">
              <option>Tất cả trạng thái</option>
              <option>Đã thanh toán</option>
              <option>Đang xử lý</option>
            </select>
            <select className="form-select">
              <option>Tất cả loại</option>
              <option>Hoa hồng</option>
              <option>Phí dịch vụ</option>
            </select>
            <Form.Group className="mb-3">
              <Form.Label>Month</Form.Label>
              <Form.Select
                value={selectedMonth}
                onChange={(e) =>
                  setSelectedMonth(Number.parseInt(e.target.value))
                }
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Year</Form.Label>
              <Form.Select
                value={selectedYear}
                onChange={(e) =>
                  setSelectedYear(Number.parseInt(e.target.value))
                }
              >
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>ID</th>
                <th>Khách sạn</th>
                <th>Số tiền</th>
                <th>Loại</th>
                <th>Tháng/Năm</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {recentPayments.map((payment) => (
                <tr key={payment.id}>
                  <td>{payment.id}</td>
                  <td>{payment.hotelName}</td>
                  <td>{payment.amount}</td>
                  <td>{payment.type}</td>
                  <td>{payment.month}/{payment.year}</td>
                  <td>
                    <span
                      className={`badge bg-${getStatusColor(payment.status)}`}
                    >
                      {payment.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-primary"
                        title="Xem chi tiết"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        title="Xác nhận"
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-warning"
                        title="In hóa đơn"
                      >
                        <i className="bi bi-printer"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination-info">Hiển thị 1-4 của 120 kết quả</div>
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
    </div>
  );
};

export default ListPaymentHotel;
