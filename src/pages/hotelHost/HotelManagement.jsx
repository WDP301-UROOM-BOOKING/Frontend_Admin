
import "bootstrap/dist/css/bootstrap.min.css";
// import { MdLocationOn } from "react-icons/md";


import * as Routers from "../../utils/Routes";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import ApiConstants from "../../adapter/ApiConstants";
import { Modal, Form, Button } from "react-bootstrap";
import ButtonGroup from "react-bootstrap/ButtonGroup";
import ToggleButton from "react-bootstrap/ToggleButton";

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

const HotelManagement = ({ setActiveTab }) => {
  const navigate = useNavigate();
  const [hosts, setHosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [limit] = useState(8); // Số lượng mỗi trang
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  // Modal lock/unlock state
  const [selectedHost, setSelectedHost] = useState(null);
  const [showLockReasonModal, setShowLockReasonModal] = useState(false);
  const [lockReason, setLockReason] = useState(LOCK_REASONS[0]);
  const [lockDuration, setLockDuration] = useState(LOCK_DURATIONS[0].value);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  // ... countdown, unlockCountdown sẽ thêm sau
  const [selectedIds, setSelectedIds] = useState([]);
  const allChecked = hosts.length > 0 && selectedIds.length === hosts.length;
  const anyChecked = selectedIds.length > 0;
  // Modal xác nhận unlock nhiều host
  const [showBulkUnlockModal, setShowBulkUnlockModal] = useState(false);
  // State cho search, filter, sort
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState(""); // "" = tất cả, "ACTIVE", "LOCK"
  const [sortOption, setSortOption] = useState("");

  // Chọn/bỏ chọn tất cả
  const handleCheckAll = () => {
    if (allChecked) setSelectedIds([]);
    else setSelectedIds(hosts.map(h => h._id));
  };
  // Chọn/bỏ chọn từng dòng
  const handleCheck = (id) => {
    setSelectedIds(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Tìm trạng thái của các host được chọn
  const selectedHosts = hosts.filter(h => selectedIds.includes(h._id));
  const allLocked = selectedHosts.length > 0 && selectedHosts.every(h => h.isLocked);
  const allUnlocked = selectedHosts.length > 0 && selectedHosts.every(h => !h.isLocked);
  const mixed = selectedHosts.length > 0 && !allLocked && !allUnlocked;

  // Unlock nhiều host: chỉ unlock host đang lock
  const handleBulkUnlock = async () => {
    const token = localStorage.getItem("token");
    const idsToUnlock = selectedHosts.filter(h => h.isLocked).map(h => h._id);
    await Promise.all(idsToUnlock.map(id => {
      const url = `${BASE_URL}/api${ApiConstants.UNLOCK_CUSTOMER.replace(":id", id)}`;
      return fetch(url, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
    }));
    setHosts(prev => prev.map(h => idsToUnlock.includes(h._id) ? { ...h, isLocked: false, status: 'ACTIVE' } : h));
    setShowBulkUnlockModal(false);
    setSelectedIds([]);
  };

  useEffect(() => {
    const fetchHosts = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");
        let url = `${BASE_URL}/api/auth/owners?page=${page}&limit=${limit}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;
        if (statusFilter) url += `&status=${statusFilter}`;
        if (sortOption) url += `&sort=${sortOption}`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.success) {
          setHosts(data.data);
          setTotalPages(data.totalPages || 1);
          setTotal(data.total || 0);
        } else {
          setHosts([]);
          setTotalPages(1);
          setTotal(0);
        }
      } catch (err) {
        setHosts([]);
        setTotalPages(1);
        setTotal(0);
      }
      setLoading(false);
    };
    fetchHosts();
  }, [page, limit, search, statusFilter, sortOption]);
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
  // Hàm lock host
  const handleConfirmLock = async () => {
    if (!selectedHost) return;
    const token = localStorage.getItem("token");
    const url = `${BASE_URL}/api${ApiConstants.LOCK_CUSTOMER.replace(":id", selectedHost._id)}`;
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
    if (data && data.data) {
      setHosts(prev => prev.map(h => h._id === selectedHost._id ? { ...h, ...data.data } : h));
    } else {
      setHosts(prev => prev.map(h => h._id === selectedHost._id ? { ...h, status: 'LOCK', isLocked: true } : h));
    }
    setShowLockReasonModal(false);
    setSelectedHost(null);
  };

  // Hàm unlock host
  const handleUnlockHost = async () => {
    if (!selectedHost) return;
    const token = localStorage.getItem("token");
    const url = `${BASE_URL}/api${ApiConstants.UNLOCK_CUSTOMER.replace(":id", selectedHost._id)}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data && data.data) {
      setHosts(prev => prev.map(h => h._id === selectedHost._id ? { ...h, ...data.data } : h));
    } else {
      setHosts(prev => prev.map(h => h._id === selectedHost._id ? { ...h, status: 'ACTIVE', isLocked: false } : h));
    }
    setShowAcceptModal(false);
    setSelectedHost(null);
  };

  // Tính thời gian còn lại (nếu có)
  let unlockCountdown = null;
  if (selectedHost && selectedHost.lockDuration && selectedHost.lockDuration !== 'permanent' && selectedHost.lockExpiresAt) {
    const now = new Date();
    const expires = new Date(selectedHost.lockExpiresAt);
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
            <input
              type="text"
              placeholder="Tìm kiếm hotel host..."
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
            <select
              className="form-select"
              value={sortOption}
              onChange={e => {
                setSortOption(e.target.value);
                setPage(1);
              }}
            >
              <option value="">Sắp xếp theo</option>
              <option value="name">Tên A-Z</option>
              <option value="createdAt">Ngày tham gia (Mới nhất)</option>
              <option value="hotelCount">Số lượng khách sạn (Cao nhất)</option>
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
                <th>Số khách sạn</th>
                <th>Ngày tham gia</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {hosts.map((host) => (
                <tr key={host._id}>
                  <td>
                    <input type="checkbox" className="form-check-input" checked={selectedIds.includes(host._id)} onChange={() => handleCheck(host._id)} />
                  </td>
                  <td>{`H-${host._id}`}</td>
                  <td>{host.name}</td>
                  <td>{host.email}</td>
                  <td>{host.phoneNumber}</td>
                  <td>{host.ownedHotels?.length || 0}</td>
                  <td>{host.createdAt ? new Date(host.createdAt).toLocaleDateString() : ''}</td>
                  <td>
                    <span className={`badge ${host.status === 'ACTIVE' ? 'bg-success' : 'bg-secondary'}`}>
                      {host.status === 'ACTIVE' ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-primary"
                        title="Xem chi tiết"
                        onClick={() => {
                          localStorage.setItem('selectedHotelHostAdmin', JSON.stringify(host));
                          setActiveTab('hotel_information');
                        }}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      {host.status === 'ACTIVE' ? (
                        <button
                          className="btn btn-sm btn-danger"
                          title="Khóa tài khoản"
                          onClick={() => {
                            setSelectedHost(host);
                            setLockReason(LOCK_REASONS[0]);
                            setLockDuration(LOCK_DURATIONS[0].value);
                            setShowLockReasonModal(true);
                          }}
                        >
                          <i className="bi bi-lock"></i>
                        </button>
                      ) : (
                        <button
                          className="btn btn-sm btn-success"
                          title="Mở tài khoản"
                          onClick={() => {
                            setSelectedHost(host);
                            setShowAcceptModal(true);
                          }}
                        >
                          <i className="bi bi-unlock"></i>
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
                      <span>Đã chọn {selectedIds.length} hotel host</span>
                      <div className="d-flex gap-2 ms-auto">
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
            Hiển thị trang {page} / {totalPages} của {total} hotel host
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

      {/* Modal xác nhận unlock */}
      <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận mở khóa tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedHost && selectedHost.lockDuration && selectedHost.lockDuration !== 'permanent' && unlockCountdown
            ? (
                <>
                  <div>Tài khoản này sẽ tự động được mở khóa sau: <b>{unlockCountdown}</b></div>
                  <div>Bạn có chắc chắn rằng muốn mở khóa ngay bây giờ không?</div>
                </>
              )
            : "Bạn có chắc chắn muốn mở khóa tài khoản này không?"}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowAcceptModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleUnlockHost}>
            Xác nhận mở khóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal xác nhận unlock nhiều host */}
      <Modal show={showBulkUnlockModal} onHide={() => setShowBulkUnlockModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận mở khóa tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn mở khóa {selectedIds.length} hotel host đã chọn?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBulkUnlockModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleBulkUnlock}>
            Xác nhận mở khóa
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default HotelManagement;
