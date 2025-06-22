
import "bootstrap/dist/css/bootstrap.min.css";
// import { MdLocationOn } from "react-icons/md";


import * as Routers from "../../utils/Routes";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
const HotelManagement = ({setActiveTab}) => {
  const navigate = useNavigate();
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
  const getStatusColor = (status) => {
    switch (status) {
      case "Đã thanh toán":
      case "Hoạt động":
        return "success"
      case "Đang xử lý":
      case "Đang xem xét":
      case "Đang chờ":
        return "warning"
      case "Tạm khóa":
      case "Chưa xử lý":
        return "danger"
      default:
        return "secondary"
    }
  }

  // Xử lý thay đổi trạng thái tài khoản

  return (
    <div className="hotel-hosts-content">
      <div className="page-header">
        <h1>Quản lý Hotel Host</h1>
        <div className="page-actions">
          
          <button className="btn btn-primary">
            <i className="bi bi-download"></i> Xuất dữ liệu
          </button>
        </div>
      </div>

      <div className="content-container">
        <div className="filters-bar">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Tìm kiếm hotel host..." />
          </div>
          <div className="filters">
            <select className="form-select">
              <option>Tất cả trạng thái</option>
              <option>Hoạt động</option>
              <option>Tạm khóa</option>
            </select>
            <select className="form-select">
              <option>Sắp xếp theo</option>
              <option>Tên A-Z</option>
              <option>Ngày tham gia (Mới nhất)</option>
              <option>Số lượng khách sạn (Cao nhất)</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" className="form-check-input" />
                </th>
                <th>ID</th>
                <th>Tên</th>
                <th>Email</th>
                <th>Số điện thoại</th>
                <th>Số khách sạn</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {hotelHosts.map((host) => (
                <tr key={host.id}>
                  <td>
                    <input type="checkbox" className="form-check-input" />
                  </td>
                  <td>{host.id}</td>
                  <td>{host.name}</td>
                  <td>{host.email}</td>
                  <td>{host.phone}</td>
                  <td>{host.hotels}</td>
                  <td>{host.joinDate}</td>
                  <td>
                    <span className={`badge bg-${getStatusColor(host.status)}`}>
                      {host.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-primary"
                        title="Xem chi tiết"
                        onClick={() => {
                          setActiveTab('hotel_information')
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      {/* <button
                        className="btn btn-sm btn-warning"
                        title="Chỉnh sửa"
                      >
                        <i className="bi bi-pencil"></i>
                      </button> */}
                      <button
                        className="btn btn-sm btn-danger"
                        title="Khóa tài khoản"
                      >
                        <i className="bi bi-lock"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination-info">Hiển thị 1-5 của 24 kết quả</div>
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

export default HotelManagement;
