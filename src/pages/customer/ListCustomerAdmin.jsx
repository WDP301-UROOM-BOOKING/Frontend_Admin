import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import CustomerDetail from "./DetailCustomerAdmin";
import ConfirmationModal from "@components/ConfirmationModal";
import ApiConstants from "../../adapter/ApiConstants";
import { Modal, Form, Button } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.vfs;

const BASE_URL = process.env.REACT_APP_ENVIRONMENT === 'production' 
  ? process.env.REACT_APP_BACKEND_CUSTOMER_URL_PRODUCT 
  : process.env.REACT_APP_BACKEND_CUSTOMER_URL_DEVELOPMENT;

const LOCK_REASONS = [
  "Spam/quảng cáo (Spam/Advertisement)",
  "Lừa đảo/thông tin giả (Fraud/Fake Information)",
  "Vi phạm điều khoản sử dụng (Violation of Terms)",
  "Hành vi không phù hợp (Inappropriate Behavior)",
  "Yêu cầu của pháp luật (Legal Requirement)"
];
const LOCK_DURATIONS = [
  { label: "7 ngày", value: "7" },
  { label: "14 ngày", value: "14" },
  { label: "30 ngày", value: "30" },
  { label: "Vĩnh viễn", value: "permanent" }
];

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

  // State cho modal lý do/mức độ lock từng user
  const [showLockReasonModal, setShowLockReasonModal] = useState(false);
  const [lockReason, setLockReason] = useState(LOCK_REASONS[0]);
  const [lockDuration, setLockDuration] = useState(LOCK_DURATIONS[0].value);

  const handleAccept = () => {
    console.log("Item accepted!")
  }
  const handleDelete = () => {
    console.log("Item deleted!")
  }

  // Xuất PDF với pdfmake (hỗ trợ Unicode)
  const handleExportPDF = () => {
    const tableBody = [
      ["ID", "Name", "Email", "Phone", "Status", "Join Date"],
      ...customers.map(c => [
        `KH-${c._id}`,
        c.name,
        c.email,
        c.phoneNumber,
        c.status === 'ACTIVE' ? 'Active' : 'Locked',
        c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ''
      ])
    ];
    const docDefinition = {
      content: [
        { text: "Customer List", style: "header" },
        {
          table: {
            headerRows: 1,
            body: tableBody
          }
        }
      ],
      styles: {
        header: { fontSize: 18, bold: true, margin: [0, 0, 0, 10] }
      }
    };
    pdfMake.createPdf(docDefinition).download("customer-list.pdf");
  };

  // Fetch customers from backend
  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const token = localStorage.getItem("token");
        let url = `${BASE_URL}/api/auth/all-customers?page=${page}&limit=${limit}`;
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
    setLockReason(LOCK_REASONS[0]);
    setLockDuration(LOCK_DURATIONS[0].value);
    setShowLockReasonModal(true);
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
    const url = `${BASE_URL}/api${ApiConstants.LOCK_CUSTOMER.replace(":id", selectedCustomer._id)}`;
    await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      // body sẽ được thêm sau khi có modal lý do/mức độ
    });
    setCustomers(prev => prev.map(c => c._id === selectedCustomer._id ? { ...c, isLocked: true, status: 'LOCK' } : c));
    setShowDeleteModal(false);
    setSelectedCustomer(null);
  };
  // Hàm xác nhận unlock
  const handleUnlockCustomer = async () => {
    if (!selectedCustomer) return;
    const token = localStorage.getItem("token");
    const url = `${BASE_URL}/api${ApiConstants.UNLOCK_CUSTOMER.replace(":id", selectedCustomer._id)}`;
    await fetch(url, {
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
    await Promise.all(idsToLock.map(id => {
      const url = `${BASE_URL}/api${ApiConstants.LOCK_CUSTOMER.replace(":id", id)}`;
      return fetch(url, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        // body sẽ được thêm sau khi có modal lý do/mức độ
      });
    }));
    setCustomers(prev => prev.map(c => idsToLock.includes(c._id) ? { ...c, isLocked: true, status: 'LOCK' } : c));
    setShowBulkLockModal(false);
    setSelectedIds([]);
  };
  // Unlock nhiều user: chỉ unlock user đang lock
  const handleBulkUnlock = async () => {
    const token = localStorage.getItem("token");
    const idsToUnlock = selectedUsers.filter(u => u.isLocked).map(u => u._id);
    await Promise.all(idsToUnlock.map(id => {
      const url = `${BASE_URL}/api${ApiConstants.UNLOCK_CUSTOMER.replace(":id", id)}`;
      return fetch(url, {
      method: "PUT",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
    }));
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

  // Xác nhận lock với lý do và mức độ
  const handleConfirmLock = async () => {
    if (!selectedCustomer) return;
    const token = localStorage.getItem("token");
    const url = `${BASE_URL}/api${ApiConstants.LOCK_CUSTOMER.replace(":id", selectedCustomer._id)}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        reasonLocked: lockReason,
        lockDuration: lockDuration
      })
    });
    const data = await res.json();
    // Nếu backend trả về user mới (data.data), cập nhật lại customers
    if (data && data.data) {
      setCustomers(prev => prev.map(c => c._id === selectedCustomer._id ? { ...c, ...data.data } : c));
    } else {
      setCustomers(prev => prev.map(c => c._id === selectedCustomer._id ? { ...c, isLocked: true, status: 'LOCK' } : c));
    }
    setShowLockReasonModal(false);
    setSelectedCustomer(null);
  };

  // Tính thời gian còn lại cho unlock (nếu có)
  let unlockCountdown = null;
  if (selectedCustomer && selectedCustomer.lockDuration && selectedCustomer.lockDuration !== 'permanent' && selectedCustomer.lockExpiresAt) {
    const now = new Date();
    const expires = new Date(selectedCustomer.lockExpiresAt);
    const diffMs = expires - now;
    if (diffMs > 0) {
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      const diffHours = Math.floor((diffMs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
      unlockCountdown = `${diffDays > 0 ? diffDays + ' ngày, ' : ''}${diffHours} giờ, ${diffMinutes} phút`;
    } else {
      unlockCountdown = 'Sắp được mở khóa tự động';
    }
  }

  return (
    <div className="customers-content">
      <div className="page-header">
        <h1>Quản lý Khách hàng</h1>
        <div className="page-actions">
          {/* <button className="btn btn-outline-primary">
            <i className="bi bi-filter"></i> Lọc
          </button> */}
          <button className="btn btn-primary" onClick={handleExportPDF}>
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

      {/* Modal chọn lý do và mức độ lock */}
      <Modal show={showLockReasonModal} onHide={() => setShowLockReasonModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Chọn lý do và mức độ khóa tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Lý do khóa</Form.Label>
              <Form.Select value={lockReason} onChange={e => setLockReason(e.target.value)}>
                {LOCK_REASONS.map(reason => (
                  <option key={reason} value={reason}>{reason}</option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group>
              <Form.Label>Mức độ khóa</Form.Label>
              <div className="d-flex justify-content-center mt-2">
                <ButtonGroup>
                  {LOCK_DURATIONS.map(opt => (
                    <ToggleButton
                      key={opt.value}
                      id={`lock-duration-${opt.value}`}
                      type="radio"
                      variant={lockDuration === opt.value ? "danger" : "outline-secondary"}
                      name="lockDuration"
                      value={opt.value}
                      checked={lockDuration === opt.value}
                      onChange={e => setLockDuration(e.currentTarget.value)}
                      className="mx-1"
                    >
                      {opt.label}
                    </ToggleButton>
                  ))}
                </ButtonGroup>
              </div>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowLockReasonModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleConfirmLock}>
            Xác nhận khóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Accept Confirmation Modal */}
      <ConfirmationModal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        onConfirm={handleUnlockCustomer}
        title="Confirm Unlock Customer"
        message={
          selectedCustomer && selectedCustomer.lockDuration && selectedCustomer.lockDuration !== 'permanent' && unlockCountdown
            ? (
                <>
                  <div>Tài khoản này sẽ tự động được mở khóa sau: <b>{unlockCountdown}</b></div>
                  <div>Bạn có chắc chắn rằng muốn mở khóa ngay bây giờ không?</div>
                </>
              )
            : "Are you sure you want to unlock this customer?"
        }
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
