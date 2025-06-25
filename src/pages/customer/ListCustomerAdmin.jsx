import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import CustomerDetail from "./DetailCustomerAdmin";
import ConfirmationModal from "@components/ConfirmationModal";

function ListCustomerAdmin() {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const [customers, setCustomers] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5); // Số lượng mỗi trang, có thể cho chỉnh nếu muốn
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" = tất cả, "ACTIVE", "LOCK"
  const [selectedIds, setSelectedIds] = useState([]);
  const allChecked = customers.length > 0 && selectedIds.length === customers.length;
  const anyChecked = selectedIds.length > 0;
  const [sortOption, setSortOption] = useState("");

  const handleAccept = () => {
    console.log("Item accepted!")
  }
  const handleDelete = () => {
    console.log("Item deleted!")
  }

  // Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        let url = `http://localhost:5000/api/auth/all-customers?page=${page}&limit=${limit}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (statusFilter) url += `&status=${statusFilter}`;
        if (sortOption) url += `&sort=${sortOption}`;
        const res = await fetch(url, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await res.json();
        if (data.success) {
          setCustomers(data.data);
          setTotalPages(data.totalPages || 1);
          setTotal(data.total || 0);
        } else {
          setCustomers([]);
          setTotalPages(1);
          setTotal(0);
        }
      } catch (err) {
        setCustomers([]);
        setTotalPages(1);
        setTotal(0);
      }
    };
    fetchCustomers();
  }, [page, limit, search, statusFilter, sortOption]);

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

  // Khi click Lock
  const handleShowLockModal = (customer) => {
    setSelectedCustomer(customer);
    setShowDeleteModal(true);
  };
  // Khi click Unlock
  const handleShowUnlockModal = (customer) => {
    setSelectedCustomer(customer);
    setShowAcceptModal(true);
  };
  // Hàm xác nhận lock
  const handleLockCustomer = async () => {
    if (!selectedCustomer) return;
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/auth/lock-customer/${selectedCustomer._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setCustomers(prev => prev.map(c => c._id === selectedCustomer._id ? { ...c, isLocked: true, status: 'LOCK' } : c));
    setShowDeleteModal(false);
    setSelectedCustomer(null);
  };
  // Hàm xác nhận unlock
  const handleUnlockCustomer = async () => {
    if (!selectedCustomer) return;
    const token = localStorage.getItem("token");
    await fetch(`http://localhost:5000/api/auth/unlock-customer/${selectedCustomer._id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setCustomers(prev => prev.map(c => c._id === selectedCustomer._id ? { ...c, isLocked: false, status: 'ACTIVE' } : c));
    setShowAcceptModal(false);
    setSelectedCustomer(null);
  };

  // Chọn/bỏ chọn tất cả
  const handleCheckAll = () => {
    if (allChecked) setSelectedIds([]);
    else setSelectedIds(customers.map(c => c._id));
  };
  // Chọn/bỏ chọn từng dòng
  const handleCheck = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Modal xác nhận lock/unlock nhiều user
  const [showBulkLockModal, setShowBulkLockModal] = useState(false);
  const [showBulkUnlockModal, setShowBulkUnlockModal] = useState(false);

  // Tìm trạng thái của các user được chọn
  const selectedUsers = customers.filter(c => selectedIds.includes(c._id));
  const allLocked = selectedUsers.length > 0 && selectedUsers.every(c => c.isLocked);
  const allUnlocked = selectedUsers.length > 0 && selectedUsers.every(c => !c.isLocked);
  const mixed = selectedUsers.length > 0 && !allLocked && !allUnlocked;

  // Lock nhiều user: chỉ lock user đang unlock
  const handleBulkLock = async () => {
    const token = localStorage.getItem("token");
    const idsToLock = selectedUsers.filter(u => !u.isLocked).map(u => u._id);
    await Promise.all(idsToLock.map(id => fetch(`http://localhost:5000/api/auth/lock-customer/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })));
    setCustomers(prev => prev.map(c => idsToLock.includes(c._id) ? { ...c, isLocked: true, status: 'LOCK' } : c));
    setShowBulkLockModal(false);
    setSelectedIds([]);
  };
  // Unlock nhiều user: chỉ unlock user đang lock
  const handleBulkUnlock = async () => {
    const token = localStorage.getItem("token");
    const idsToUnlock = selectedUsers.filter(u => u.isLocked).map(u => u._id);
    await Promise.all(idsToUnlock.map(id => fetch(`http://localhost:5000/api/auth/unlock-customer/${id}`, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
    })));
    setCustomers(prev => prev.map(c => idsToUnlock.includes(c._id) ? { ...c, isLocked: false, status: 'ACTIVE' } : c));
    setShowBulkUnlockModal(false);
    setSelectedIds([]);
  };

  // Hàm cập nhật trạng thái lock cho 1 customer từ modal detail
  const handleLockChange = (customerId, isLocked) => {
    setCustomers(prev => prev.map(c =>
      c._id === customerId
        ? { ...c, isLocked, status: isLocked ? 'LOCK' : 'ACTIVE' }
        : c
    ));
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
            <input
              type="text"
              placeholder="Tìm kiếm khách hàng..."
              value={search}
              onChange={e => {
                setSearch(e.target.value);
                setPage(1);
              }}
            />
          </div>
          <div className="filters">
            <select
              className="form-select"
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="ACTIVE">Hoạt động</option>
              <option value="LOCK">Tạm khóa</option>
            </select>
            <select className="form-select"
              value={sortOption}
              onChange={e => {
                setSortOption(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Sắp xếp theo</option>
              <option value="name">Tên A-Z</option>
              <option value="createdAt">Ngày tham gia (Mới nhất)</option>
              <option value="bookingCount">Số lượng đặt phòng (Cao nhất)</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" className="form-check-input" checked={allChecked} onChange={handleCheckAll} />
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
                <tr key={customer._id}>
                  <td>
                    <input type="checkbox" className="form-check-input" checked={selectedIds.includes(customer._id)} onChange={() => handleCheck(customer._id)} />
                  </td>
                  <td>{`KH-${customer._id}`}</td>
                  <td>{customer.name}</td>
                  <td>{customer.email}</td>
                  <td>{customer.phoneNumber}</td>
                  <td>{typeof customer.bookingCount === 'number' ? customer.bookingCount : 0}</td>
                  <td>{customer.createdAt ? new Date(customer.createdAt).toLocaleDateString() : ''}</td>
                  <td>
                    <span className={`badge ${customer.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                      {customer.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-primary"
                        title="Xem chi tiết"
                        onClick={() => {
                          setSelectedCustomer(customer);
                          setShowModal(true);
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      {customer.isLocked ? (
                        <button
                          className="btn btn-sm btn-success"
                          title="Mở tài khoản"
                          type="button"
                          onClick={() => handleShowUnlockModal(customer)}
                        >
                          <i className="bi bi-unlock"></i>
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-danger"
                          title="Khóa tài khoản"
                          type="button"
                          onClick={() => handleShowLockModal(customer)}
                        >
                          <i className="bi bi-lock"></i>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {/* Hàng drop-down khi chọn nhiều */}
              {anyChecked && (
                <tr>
                  <td colSpan="9">
                    <div className="d-flex justify-content-between align-items-center">
                      <span>Đã chọn {selectedIds.length} khách hàng</span>
                      <div className="d-flex gap-2 ms-auto">
                        {(allUnlocked || mixed) && (
                          <button className="btn btn-danger" type="button" onClick={() => setShowBulkLockModal(true)}>
                            <i className="bi bi-lock"></i> Khóa tài khoản
                          </button>
                        )}
                        {(allLocked || mixed) && (
                          <button className="btn btn-success" type="button" onClick={() => setShowBulkUnlockModal(true)}>
                            <i className="bi bi-unlock"></i> Mở tài khoản
                          </button>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination-info">
            Hiển thị trang {page} / {totalPages} của {total} khách hàng
          </div>
          <ul className="pagination">
            <li className={`page-item${page === 1 ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)} disabled={page === 1}>
                Trước
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, i) => (
              <li key={i + 1} className={`page-item${page === i + 1 ? " active" : ""}`}>
                <button className="page-link" onClick={() => setPage(i + 1)}>
                  {i + 1}
                </button>
              </li>
            ))}
            <li className={`page-item${page === totalPages ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page + 1)} disabled={page === totalPages}>
                Sau
              </button>
            </li>
          </ul>
        </div>
      </div>
      <CustomerDetail
        show={showModal}
        onHide={() => setShowModal(false)}
        handleClose={() => setShowModal(false)}
        customer={selectedCustomer}
        onLockChange={handleLockChange}
      />
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleLockCustomer}
        title="Confirm Lock Customer"
        message="Are you sure you want to lock this customer ?"
        confirmButtonText="Confirm"
        type="danger"
      />

      {/* Accept Confirmation Modal */}
      <ConfirmationModal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        onConfirm={handleUnlockCustomer}
        title="Confirm Unlock Customer"
        message="Are you sure you want to unlock this customer ?"
        confirmButtonText="Confirm"
        type="accept"
      />

      {/* Modal xác nhận lock/unlock nhiều user */}
      <ConfirmationModal
        show={showBulkLockModal}
        onHide={() => setShowBulkLockModal(false)}
        onConfirm={handleBulkLock}
        title="Xác nhận khóa tài khoản"
        message={`Bạn có chắc chắn muốn khóa ${selectedIds.length} khách hàng đã chọn?`}
        confirmButtonText="Xác nhận"
        type="danger"
      />
      <ConfirmationModal
        show={showBulkUnlockModal}
        onHide={() => setShowBulkUnlockModal(false)}
        onConfirm={handleBulkUnlock}
        title="Xác nhận mở khóa tài khoản"
        message={`Bạn có chắc chắn muốn mở khóa ${selectedIds.length} khách hàng đã chọn?`}
        confirmButtonText="Xác nhận"
        type="accept"
      />
    </div>
  );
}

export default ListCustomerAdmin;
