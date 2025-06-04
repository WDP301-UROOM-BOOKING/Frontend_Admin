import "bootstrap/dist/css/bootstrap.min.css";
import { useState } from "react";
import CustomerDetail from "./DetailCustomerAdmin";
import ConfirmationModal from "components/ConfirmationModal";
function ListCustomerAdmin() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const handleAccept = () => {
    console.log("Item accepted!")
  }
  const handleDelete = () => {
    console.log("Item deleted!")
  }
  // Dữ liệu danh sách khách hàng
  const customers = [
    {
      id: "1",
      name: "Nguyễn Văn X",
      email: "nguyenvanx@example.com",
      phone: "0901234567",
      bookings: 8,
      joinDate: "15/01/2023",
      status: "Hoạt động",
    },
    {
      id: "2",
      name: "Trần Thị Y",
      email: "tranthiy@example.com",
      phone: "0912345678",
      bookings: 5,
      joinDate: "20/03/2023",
      status: "Hoạt động",
    },
    {
      id: "3",
      name: "Lê Văn Z",
      email: "levanz@example.com",
      phone: "0923456789",
      bookings: 3,
      joinDate: "05/05/2023",
      status: "Tạm khóa",
    },
    {
      id: "4",
      name: "Phạm Thị K",
      email: "phamthik@example.com",
      phone: "0934567890",
      bookings: 12,
      joinDate: "12/07/2023",
      status: "Hoạt động",
    },
    {
      id: "5",
      name: "Hoàng Văn M",
      email: "hoangvanm@example.com",
      phone: "0945678901",
      bookings: 7,
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
  return (
    <div className="customers-content">
      <div className="page-header">
        <h1>Quản lý Khách hàng</h1>
        <div className="page-actions">
          {/* <button className="btn btn-outline-primary">
            <i className="bi bi-filter"></i> Lọc
          </button> */}
          <button className="btn btn-primary">
            <i className="bi bi-download"></i> Xuất dữ liệu
          </button>
        </div>
      </div>

      <div className="content-container">
        <div className="filters-bar">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Tìm kiếm khách hàng..." />
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
              <option>Số lượng đặt phòng (Cao nhất)</option>
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
                <th>Số đặt phòng</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((customer) => (
                <tr key={customer.id}>
                  <td>
                    <input type="checkbox" className="form-check-input" />
                  </td>
                  <td>{customer.id}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phone}</td>
                  <td>{customer.bookings}</td>
                  <td>{customer.joinDate}</td>
                  <td>
                    <span
                      className={`badge bg-${getStatusColor(customer.status)}`}
                    >
                      {customer.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-primary"
                        title="Xem chi tiết"
                        onClick={() =>{
                          setShowModal(true)
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      {customer.status === "Hoạt động" ? (
                        <button
                          className="btn btn-sm btn-danger"
                          title="Khóa tài khoản"
                          onClick={() =>{
                            setShowDeleteModal(true)
                          }}
                        >
                          <i className="bi bi-lock"></i>
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          title="Mở tài khoản"
                          onClick={() =>{
                            setShowAcceptModal(true)
                          }}
                        >
                          <i className="bi bi-lock"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination-info">Hiển thị 1-5 của 42 kết quả</div>
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
      <CustomerDetail
        show={showModal}
        onHide={() => setShowModal(false)}
        handleClose={() => setShowModal(false)}
      />
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirm Lock Customer"
        message="Are you sure you want to lock this customer ?"
        confirmButtonText="Confirm"
        type="danger"
      />

      {/* Accept Confirmation Modal */}
      <ConfirmationModal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        onConfirm={handleAccept}
        title="Confirm Unlock Customer"
        message="Are you sure you want to unlock this customer ?"
        confirmButtonText="Confirm"
        type="accept"
      />
    </div>
  );
}

export default ListCustomerAdmin;
