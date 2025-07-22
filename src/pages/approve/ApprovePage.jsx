import ApiConstants from "@adapter/ApiConstants";
import api from "@libs/api";
import HotelActions from "@redux/hotel/actions";
import React, { useEffect, useState } from "react";
import { Button, Col, Modal, Row } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { showToast, ToastProvider } from "../../components/ToastContainer";
const ApprovePage = ({props}) => {

  const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
  const [approvalToConfirm, setApprovalToConfirm] = useState(null);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
   const [confirmModal, setConfirmModal] = useState(false);
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
            <input type="text" placeholder="Tìm kiếm yêu cầu phê duyệt..." />
          </div>
          <div className="filters">
            <select className="form-select">
              <option>Tất cả trạng thái</option>
              <option>Đang chờ</option>
              <option>Đang xem xét</option>
            </select>
            <select className="form-select">
              <option>Sắp xếp theo</option>
              <option>Ngày gửi (Mới nhất)</option>
              <option>Tên khách sạn A-Z</option>
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
              {recentApprovals.map((approval) => (
                <tr key={approval.id}>
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

        <div className="pagination-container">
          <div className="pagination-info">Hiển thị 1-5 của 58 kết quả</div>
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

      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết khách sạn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedApproval && (
            <div>
              <Row>
                <Col md={12}>
                  <h6>Thông tin khách sạn:</h6>
                  <p><strong>Tên khách sạn:</strong> {selectedApproval.hotelName}</p>
                  <p><strong>Địa chỉ:</strong> {selectedApproval.address || 'N/A'}</p>
                  <p><strong>Số điện thoại:</strong> {selectedApproval.phoneNumber || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedApproval.email || 'N/A'}</p>
                  <p><strong>Sao đánh giá:</strong> {selectedApproval?.star}</p>
                  <p><strong>Ngày yêu cầu:</strong> {new Date(selectedApproval.requestDate).toLocaleDateString('vi-VN')}</p>
                  {selectedApproval.paymentDate && (
                    <p><strong>Ngày thanh toán:</strong> {new Date(selectedApproval.paymentDate).toLocaleDateString('vi-VN')}</p>
                  )}
                </Col>  
              </Row>
              {selectedApproval.accountHolderName && (
                <Row className="mt-3">
                  <Col md={12}>
                    <h6>Thông tin ngân hàng:</h6>
                    <p><strong>Chủ tài khoản:</strong> {selectedApproval.accountHolderName}</p>
                    <p><strong>Số tài khoản:</strong> {selectedApproval.accountNumber}</p>
                    <p><strong>Ngân hàng:</strong> {selectedApproval.bankName}</p>
                    {selectedApproval.branchName && (
                      <p><strong>Chi nhánh:</strong> {selectedApproval.branchName}</p>
                    )}
                  </Col>
                </Row>
              )}
              {selectedApproval.reason && (
                <Row className="mt-3">
                  <Col md={12}>
                    <h6>Lý do:</h6>
                    <p>{selectedApproval.reason}</p>
                  </Col>
                </Row>
              )}
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default React.memo(ApprovePage);
