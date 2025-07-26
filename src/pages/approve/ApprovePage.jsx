import ApiConstants from "@adapter/ApiConstants";
import api from "@libs/api";
import HotelActions from "@redux/hotel/actions";
import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row, Card } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { showToast, ToastProvider } from "../../components/ToastContainer";
import { FaMapMarkerAlt, FaClock, FaPhoneAlt, FaEnvelope, FaStar, FaWifi, FaSwimmer, FaDog, FaUsers } from "react-icons/fa";
// Tiện nghi - ánh xạ tên sang icon
const FACILITY_ICONS = {
  'Free Wi-Fi': <FaWifi className="me-2" />, // ví dụ tên
  'Swimming Pool': <FaSwimmer className="me-2" />,
  'Pet-Friendly': <FaDog className="me-2" />,
  'Conference Room': <FaUsers className="me-2" />,
};
const ApprovePage = ({props}) => {

  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const [approvalToConfirm, setApprovalToConfirm] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [confirmModal, setConfirmModal] = useState(false);
  // Pagination, search, filter, sort states
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [sortOption, setSortOption] = useState("newest");
  const recentApprovals = useSelector(state => state?.Hotel?.hotelsNotApproval)
  useEffect(() => {
    fetchApprovals();
  }, []);

  // Get payment detail
  const getApprovalDetail = async (approvalId) => {
    try {
      const response = await api.get(
        ApiConstants.GET_APPROVAL_BY_ID.replace(':id', approvalId)
      );
      
      if (response.data) {
        setSelectedApproval(response?.data?.hotels[0]);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('Error fetching payment detail:', error);
      showToast.error('Không thể tải chi tiết thanh toán');
    }
  };

  const fetchApprovals = () => {
  dispatch({
    type: HotelActions.FETCH_HOTELS_NOT_APPROVAL,
    payload: {
      onSuccess: (data) => {
        console.log("Fetched approvals successfully:", data);
      },
      onFailed: (msg) => {
        console.warn("Fetch failed:", msg);
      },
      onError: (err) => {
        console.error("Server error:", err);
      },
    },
  });
};


  // Update Approval status
  const updateApprovalStatus = async (approvalId, adminStatus) => {
    try {
      const response = await api.put(
        ApiConstants.UPDATE_APPROVAL_STATUS.replace(':approvalId', approvalId),
        {adminStatus: adminStatus}
      );
      console.log('response >> ', response);
      if (response.status === 200) {
        // Refresh the Approvals list
        setConfirmModal(false);
        setApprovalToConfirm(null);
        showToast.success('Xác nhận phê duyệt thành công');
        fetchApprovals();
      }
    } catch (error) {
      console.error('Error updating Approval status:', error);
      showToast.error('Không thể cập nhật ttrạng thái phê duyệt khách sạn');
    }
  };

  const handleConfirmApproval = (approval) => {
    setApprovalToConfirm(approval);
    setConfirmModal(true);
  };
  // const recentApprovals = [
  //   {
  //     id: "A-7829",
  //     hotelName: "Luxury Palace Hotel",
  //     owner: "Nguyễn Văn A",
  //     location: "Hà Nội",
  //     category: "5 sao",
  //     submittedDate: "15/06/2025",
  //     status: "Đang chờ",
  //   },
  //   {
  //     id: "A-7830",
  //     hotelName: "Seaside Resort & Spa",
  //     owner: "Trần Thị B",
  //     location: "Đà Nẵng",
  //     category: "4 sao",
  //     submittedDate: "16/06/2025",
  //     status: "Đang xem xét",
  //   },
  //   {
  //     id: "A-7831",
  //     hotelName: "City Center Hotel",
  //     owner: "Lê Văn C",
  //     location: "TP.HCM",
  //     category: "3 sao",
  //     submittedDate: "16/06/2025",
  //     status: "Đang chờ",
  //   },
  //   {
  //     id: "A-7832",
  //     hotelName: "Mountain View Lodge",
  //     owner: "Phạm Thị D",
  //     location: "Đà Lạt",
  //     category: "4 sao",
  //     submittedDate: "17/06/2025",
  //     status: "Đang xem xét",
  //   },
  //   {
  //     id: "A-7833",
  //     hotelName: "Riverside Boutique Hotel",
  //     owner: "Hoàng Văn E",
  //     location: "Huế",
  //     category: "4 sao",
  //     submittedDate: "18/06/2025",
  //     status: "Đang chờ",
  //   },
  // ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã thanh toán":
      case "APPROVED":
        return "success";
      case "Đang xử lý":
      case "Đang xem xét":
      case "PENDING":
        return "warning";
      case "Tạm khóa":
      case "REJECTED":
        return "danger";
      default:
        return "secondary";
    }
  };

  // Filter, search, sort, and paginate approvals
  const getFilteredApprovals = () => {
    let filtered = recentApprovals || [];
    // Search
    if (searchTerm.trim() !== "") {
      const lower = searchTerm.toLowerCase();
      filtered = filtered.filter(item =>
        (item?._id && item._id.toString().toLowerCase().includes(lower)) ||
        (item?.hotelName && item.hotelName.toString().toLowerCase().includes(lower)) ||
        (item?.owner && item.owner.toString().toLowerCase().includes(lower))
      );
    }
    // Status filter
    if (statusFilter !== "ALL") {
      filtered = filtered.filter(item => item.adminStatus === statusFilter);
    }
    // Sort
    if (sortOption === "newest") {
      filtered = filtered.sort((a, b) => new Date(b.requestDate) - new Date(a.requestDate));
    } else if (sortOption === "hotelNameAZ") {
      filtered = filtered.sort((a, b) => (a.hotelName || "").localeCompare(b.hotelName || ""));
    }
    return filtered;
  };

  const filteredApprovals = getFilteredApprovals();
  const totalResults = filteredApprovals.length;
  const totalPages = Math.ceil(totalResults / pageSize);
  const paginatedApprovals = filteredApprovals.slice((currentPage - 1) * pageSize, currentPage * pageSize);
  const startResult = totalResults === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endResult = Math.min(currentPage * pageSize, totalResults);

  return (
    <div className="approvals-content">
      <div className="page-header">
        <h1>Phê duyệt Khách sạn</h1>
        <div className="page-actions">
          {/* <button className="btn btn-outline-primary">
                      <i className="bi bi-filter"></i> Lọc
                    </button> */}
          {/* <div className="btn-group">
                      <button className="btn btn-success">
                        <i className="bi bi-check-lg"></i> Phê duyệt đã chọn
                      </button>
                      <button className="btn btn-danger">
                        <i className="bi bi-x-lg"></i> Từ chối đã chọn
                      </button>
                    </div> */}
        </div>
      </div>

      <div className="content-container">
        <div className="filters-bar">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input
              type="text"
              placeholder="Tìm kiếm theo ID, tên khách sạn, ID chủ sở hữu..."
              value={searchTerm}
              onChange={e => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
          <div className="filters">
            <select
              className="form-select"
              value={statusFilter}
              onChange={e => {
                setStatusFilter(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="ALL">Tất cả trạng thái</option>
              <option value="PENDING">Đang chờ</option>
              <option value="APPROVED">Đã duyệt</option>
              <option value="REJECTED">Từ chối</option>
            </select>
            <select
              className="form-select"
              value={sortOption}
              onChange={e => {
                setSortOption(e.target.value);
                setCurrentPage(1);
              }}
            >
              <option value="newest">Ngày gửi (Mới nhất)</option>
              <option value="hotelNameAZ">Tên khách sạn A-Z</option>
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
                <th>Tên khách sạn</th>
                <th>ID Chủ sở hữu</th>
                <th>Địa điểm</th>
                <th>Sao đánh giá</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {paginatedApprovals.map((approval) => (
                <tr key={approval.id || approval._id}>
                  <td>
                    <input type="checkbox" className="form-check-input" />
                  </td>
                  <td>{approval?._id}</td>
                  <td>{approval?.hotelName}</td>
                  <td>{approval?.owner}</td>
                  <td>{approval?.address}</td>
                  <td>{approval?.star}</td>
                  <td>{new Date(approval?.requestDate).toLocaleDateString("vi-VN")}</td>
                  <td>
                    <span
                      className={`badge bg-${getStatusColor(approval?.adminStatus)}`}
                    >
                      {approval.adminStatus}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-primary"
                        title="Xem chi tiết"
                        onClick={() => getApprovalDetail(approval?.owner)}
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        title="Phê duyệt"
                        onClick={() => handleConfirmApproval(approval)}
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" title="Từ chối"
                      onClick={() => approval && updateApprovalStatus(approval?._id, "REJECTED")}> 
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container d-flex align-items-center justify-content-between">
          <div className="pagination-info">
            Hiển thị {startResult}-{endResult} của {totalResults} kết quả
          </div>
          <ul className="pagination mb-0">
            <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1}>
                Trước
              </button>
            </li>
            {Array.from({ length: totalPages }, (_, idx) => (
              <li key={idx + 1} className={`page-item${currentPage === idx + 1 ? " active" : ""}`}>
                <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>{idx + 1}</button>
              </li>
            ))}
            <li className={`page-item${currentPage === totalPages || totalPages === 0 ? " disabled" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages || totalPages === 0}>
                Sau
              </button>
            </li>
          </ul>
        </div>
      </div>
      <Modal show={confirmModal} onHide={() => setConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận phê duyệt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {approvalToConfirm && (
            <div>
              <p>Bạn có chắc chắn muốn phê duyệt khách sạn <strong>{approvalToConfirm?.hotelName}</strong>?</p>
              <p><strong>Id chủ sở hữu:</strong> {approvalToConfirm?.owner}</p>
              <p><strong>Ngày/Tháng/Năm:</strong> {new Date(approvalToConfirm?.requestDate).toLocaleDateString("vi-VN")}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="success" 
            onClick={() => approvalToConfirm && updateApprovalStatus(approvalToConfirm?._id, "APPROVED")}
          >
            Xác nhận phê duyệt
          </Button>
        </Modal.Footer>
      </Modal>

      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết khách sạn</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#f8f9fa' }}>
          {selectedApproval && (
            <Card className="shadow-sm border-0 mb-0" style={{ borderRadius: 16 }}>
              <Card.Body>
                <Row>
                  {/* Ảnh lớn và 4 ảnh nhỏ */}
                  <Col md={6} className="mb-4 mb-md-0">
                    {/* Ảnh cover lớn */}
                    <div style={{ width: '100%', borderRadius: 16, overflow: 'hidden', boxShadow: '0 2px 8px rgba(0,0,0,0.07)', marginBottom: 0 }}>
                      <img
                        src={selectedApproval.images && selectedApproval.images.length > 0 ? selectedApproval.images[0].url : 'https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg'}
                        alt="hotel-cover"
                        style={{ width: '100%', height: 300, objectFit: 'cover', display: 'block' }}
                      />
                    </div>     
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%', gap: 0, marginTop: 8 }}>
                      {(selectedApproval.images && selectedApproval.images.length > 1
                        ? selectedApproval.images.slice(1, 5)
                        : []
                      ).map((img, idx, arr) => (
                        <div key={idx} style={{ borderRadius: 8, overflow: 'hidden', border: '2px solid #e3e3e3', width: `calc(25% - 6px)`, height: 70, boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
                          <img
                            src={img.url}
                            alt={`hotel-thumb-${idx}`}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.2s', cursor: 'pointer' }}
                            onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
                            onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                          />
                        </div>
                      ))}
                    </div>
                  </Col>
                  {/* Thông tin khách sạn */}
                  <Col md={6}>
                    <div className="ps-md-3 pt-3 pt-md-0">
                      <h3 className="fw-bold mb-2" style={{ color: '#1a237e' }}>{selectedApproval.hotelName} <FaStar style={{ color: '#FFD600', marginLeft: 8, marginBottom: 4 }} /> <span style={{ fontSize: 18, color: '#FFD600' }}>{selectedApproval?.star || ''}</span></h3>
                      {/* Địa chỉ: label trên 1 dòng, địa chỉ chi tiết xuống dòng dưới */}
                      <div className="mb-3 d-flex align-items-start flex-column">
                        <span className="fw-semibold d-flex align-items-center"><FaMapMarkerAlt className="me-2" style={{ color: '#1976d2' }} />Địa chỉ:</span>
                        <span className="ms-4" style={{ wordBreak: 'break-word' }}>{selectedApproval.address || 'N/A'}</span>
                      </div>
                      <div className="mb-3 d-flex align-items-center"><FaClock className="me-2" style={{ color: '#1976d2' }} /><span className="fw-semibold">Giờ nhận phòng:</span> <span className="ms-2">{selectedApproval.checkInStart || '12:00'} đến {selectedApproval.checkInEnd || '13:00'}</span></div>
                      <div className="mb-3 d-flex align-items-center"><FaClock className="me-2" style={{ color: '#1976d2' }} /><span className="fw-semibold">Giờ trả phòng:</span> <span className="ms-2">{selectedApproval.checkOutStart || '10:00'} đến {selectedApproval.checkOutEnd || '11:00'}</span></div>
                      <div className="mb-3"><span className="fw-bold">Mô tả về khách sạn</span><div className="mt-1">{selectedApproval.description || 'Không có mô tả.'}</div></div>
                      <div className="mb-3"><span className="fw-bold">Liên lạc của khách sạn</span>
                        <div className="d-flex align-items-center mt-1"><FaPhoneAlt className="me-2" style={{ color: '#1976d2' }} />{selectedApproval.phoneNumber || 'N/A'}</div>
                        <div className="d-flex align-items-center mt-1"><FaEnvelope className="me-2" style={{ color: '#1976d2' }} />{selectedApproval.email || 'N/A'}</div>
                      </div>
                    </div>
                  </Col>
                </Row>
                {/* Thông tin ngân hàng và lý do (nếu có) */}
                {selectedApproval.accountHolderName && (
                  <div className="mt-3">
                    <Card className="border-0 bg-light p-2" style={{ borderRadius: 10 }}>
                      <Card.Body className="py-2 px-3">
                        <h6 className="fw-bold mb-2">Thông tin ngân hàng</h6>
                        <div><span className="fw-semibold">Chủ tài khoản:</span> {selectedApproval.accountHolderName}</div>
                        <div><span className="fw-semibold">Số tài khoản:</span> {selectedApproval.accountNumber}</div>
                        <div><span className="fw-semibold">Ngân hàng:</span> {selectedApproval.bankName}</div>
                        {selectedApproval.branchName && (
                          <div><span className="fw-semibold">Chi nhánh:</span> {selectedApproval.branchName}</div>
                        )}
                      </Card.Body>
                    </Card>
                  </div>
                )}
                {selectedApproval.reason && (
                  <div className="mt-3">
                    <Card className="border-0 bg-light p-2" style={{ borderRadius: 10 }}>
                      <Card.Body className="py-2 px-3">
                        <h6 className="fw-bold mb-2">Lý do</h6>
                        <div>{selectedApproval.reason}</div>
                      </Card.Body>
                    </Card>
                  </div>
                )}
              </Card.Body>
            </Card>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default React.memo(ApprovePage);
