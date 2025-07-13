import React, { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Table,
  Button,
  Form,
  InputGroup,
  Badge,
  Modal,
  Alert,
  Spinner,
} from "react-bootstrap";
import {
  FaSearch,
  FaEye,
  FaCheck,
  FaTimes,
  FaClock,
  FaMoneyBillWave,
  FaUser,
  FaCalendar,
  FaFileAlt,
} from "react-icons/fa";
import "./payment.css";
import { useDispatch, useSelector } from "react-redux";
import AuthActions from "@redux/auth/actions";
import axios from "axios";

const ListPaymentCustomer = () => {
  const [refunds, setRefunds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedRefund, setSelectedRefund] = useState(null);
  const [actionType, setActionType] = useState(""); // "approve" or "reject"
  const [reason, setReason] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);


  const dispatch = useDispatch();

  const sampleRefunds = useSelector((state) => state.Auth.Refund); // hoặc state.refund nếu bạn để reducer riêng
  console.log('sampleRefunds >> ', sampleRefunds);
  useEffect(() => {
    dispatch({
      type: AuthActions.GET_ALL_REFUND,
      payload: {
        onSuccess: (data) => {
          console.log("Fetched refunds successfully:", data);
        },
        onFailed: (msg) => {
          console.warn("Fetch failed:", msg);
        },
        onError: (err) => {
          console.error("Server error:", err);
        },
      },
    });
  }, [dispatch]);

  // Sample data based on refundingReservation model
  // const sampleRefunds = [
  //   {
  //     _id: "1",
  //     user: {
  //       _id: "101",
  //       name: "Nguyễn Văn An",
  //       email: "nguyenvanan@email.com",
  //       phoneNumber: "0901234567",
  //     },
  //     reservation: {
  //       _id: "res_001",
  //       hotel: {
  //         name: "Luxury Palace Hotel",
  //         address: "123 Đường ABC, Quận 1, TP.HCM",
  //       },
  //       checkInDate: "2024-06-15",
  //       checkOutDate: "2024-06-18",
  //       totalPrice: 4500000,
  //     },
  //     refundAmount: 3600000,
  //     status: "PENDING",
  //     reason: null,
  //     accountHolderName: "NGUYEN VAN AN",
  //     accountNumber: "1234567890",
  //     bankName: "Vietcombank",
  //     requestDate: "2024-06-10T08:30:00Z",
  //     decisionDate: null,
  //     createdAt: "2024-06-10T08:30:00Z",
  //   },
  //   {
  //     _id: "2",
  //     user: {
  //       _id: "102",
  //       name: "Trần Thị Bình",
  //       email: "tranthibinh@email.com",
  //       phoneNumber: "0987654321",
  //     },
  //     reservation: {
  //       _id: "res_002",
  //       hotel: {
  //         name: "Seaside Resort & Spa",
  //         address: "456 Đường XYZ, Vũng Tàu",
  //       },
  //       checkInDate: "2024-06-20",
  //       checkOutDate: "2024-06-25",
  //       totalPrice: 12800000,
  //     },
  //     refundAmount: 10240000,
  //     status: "APPROVED",
  //     reason: "Khách hàng hủy do lý do sức khỏe, đã xác minh đầy đủ",
  //     accountHolderName: "TRAN THI BINH",
  //     accountNumber: "9876543210",
  //     bankName: "Techcombank",
  //     requestDate: "2024-06-01T14:20:00Z",
  //     decisionDate: "2024-06-02T10:15:00Z",
  //     createdAt: "2024-06-01T14:20:00Z",
  //   },
  //   {
  //     _id: "3",
  //     user: {
  //       _id: "103",
  //       name: "Lê Minh Cường",
  //       email: "leminhcuong@email.com",
  //       phoneNumber: "0912345678",
  //     },
  //     reservation: {
  //       _id: "res_003",
  //       hotel: {
  //         name: "City Center Hotel",
  //         address: "789 Đường DEF, Quận 3, TP.HCM",
  //       },
  //       checkInDate: "2024-05-10",
  //       checkOutDate: "2024-05-12",
  //       totalPrice: 1200000,
  //     },
  //     refundAmount: 600000,
  //     status: "REJECTED",
  //     reason: "Không đủ điều kiện hoàn tiền theo chính sách khách sạn",
  //     accountHolderName: "LE MINH CUONG",
  //     accountNumber: "5555666677",
  //     bankName: "BIDV",
  //     requestDate: "2024-05-08T16:45:00Z",
  //     decisionDate: "2024-05-09T09:30:00Z",
  //     createdAt: "2024-05-08T16:45:00Z",
  //   },
  // ];

  useEffect(() => {
    fetchRefunds();
  }, []);

  const fetchRefunds = async () => {
    setLoading(true);
    try {
      // Replace with actual API call
      setTimeout(() => {
        setRefunds(sampleRefunds);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching refunds:", error);
      setLoading(false);
    }
  };

  const handleView = (refund) => {
    setSelectedRefund(refund);
    setShowDetailModal(true);
  };

  const handleAction = (refund, action) => {
    setSelectedRefund(refund);
    setActionType(action);
    setReason("");
    setShowActionModal(true);
  };

  const handleSubmitAction = async () => {
  if (!reason.trim()) {
    alert("Vui lòng nhập lý do");
    return;
  }

  try {
    const newStatus = actionType === "approve" ? "APPROVED" : "REJECTED";

    // Nếu là approve => gọi API Stripe refund
    if (actionType === "approve") {
      const response = await dispatch({
        type: AuthActions.REFUNDING,
        payload: {
        onSuccess: (data) => {
          console.log("Fetched refunds successfully:", data);
        },
        onFailed: (msg) => {
          console.warn("Fetch failed:", msg);
        },
        onError: (err) => {
          console.error("Server error:", err);
        },
        id: selectedRefund._id
      }
      });
      console.log("Stripe refund response:", response.data);
    }

    // Cập nhật local state
    const updatedRefunds = refunds.map(refund =>
      refund._id === selectedRefund._id
        ? {
            ...refund,
            status: newStatus,
            reason: reason,
            decisionDate: new Date().toISOString(),
          }
        : refund
    );

    setRefunds(updatedRefunds);
    setShowActionModal(false);
    setReason("");

    alert(`Đã ${actionType === "approve" ? "phê duyệt" : "từ chối"} yêu cầu hoàn tiền thành công!`);
  } catch (error) {
    console.error("Error handling refund:", error);
    alert("Có lỗi xảy ra, vui lòng thử lại!");
  }
};

  // Filter refunds (exclude WAITING_FOR_BANK_INFO)
  const filteredRefunds = refunds
    ?.filter(refund => refund.status !== "WAITING_FOR_BANK_INFO")
    ?.filter(refund => {
      const matchesSearch = 
        refund.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        refund.reservation.hotel.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = filterStatus === "all" || refund.status === filterStatus;
      
      return matchesSearch && matchesStatus;
    });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredRefunds?.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      PENDING: { bg: "warning", text: "Đang chờ", icon: <FaClock /> },
      APPROVED: { bg: "success", text: "Đã duyệt", icon: <FaCheck /> },
      REJECTED: { bg: "danger", text: "Từ chối", icon: <FaTimes /> },
    };

    const config = statusConfig[status] || { bg: "secondary", text: "Không xác định", icon: null };

    return (
      <Badge bg={config.bg} className="status-badge">
        {config.icon} {config.text}
      </Badge>
    );
  };

  const stats = {
    total: filteredRefunds.length,
    pending: filteredRefunds.filter(r => r.status === "PENDING").length,
    approved: filteredRefunds.filter(r => r.status === "APPROVED").length,
    rejected: filteredRefunds.filter(r => r.status === "REJECTED").length,
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spinner animation="border" variant="primary" size="lg" />
        <p className="loading-text">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="payment-customer-management">
      {/* Header */}
      <div className="page-header-section">
        <Container fluid>
          <Row className="align-items-center">
            <Col>
              <div className="page-header">
                <div className="page-title-wrapper">
                  <div className="page-icon">
                    <FaMoneyBillWave />
                  </div>
                  <div>
                    <h1 className="page-title">Quản lý Hoàn tiền Khách hàng</h1>
                    <p className="page-subtitle">Xử lý các yêu cầu hoàn tiền từ khách hàng</p>
                  </div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Statistics */}
          <Row className="stats-row">
            <Col md={3} sm={6}>
              <Card className="stat-card stat-card-total">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <FaFileAlt />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-number">{stats.total}</h3>
                      <p className="stat-label">Tổng yêu cầu</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card stat-card-pending">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <FaClock />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-number">{stats.pending}</h3>
                      <p className="stat-label">Đang chờ</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card stat-card-approved">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <FaCheck />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-number">{stats.approved}</h3>
                      <p className="stat-label">Đã duyệt</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card stat-card-rejected">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <FaTimes />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-number">{stats.rejected}</h3>
                      <p className="stat-label">Từ chối</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid className="content-section">
        {/* Filters */}
        <Card className="filters-card">
          <Card.Body>
            <Row className="align-items-center">
              <Col lg={6} md={6} className="mb-3 mb-lg-0">
                <InputGroup className="search-input">
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Tìm theo tên khách hàng, email, khách sạn..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col lg={3} md={3} className="mb-3 mb-lg-0">
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">Tất cả trạng thái</option>
                  <option value="PENDING">Đang chờ</option>
                  <option value="APPROVED">Đã duyệt</option>
                  <option value="REJECTED">Từ chối</option>
                </Form.Select>
              </Col>
              <Col lg={3} md={3} className="text-lg-end">
                <div className="results-info">
                  Hiển thị <strong>{currentItems.length}</strong> / <strong>{filteredRefunds.length}</strong> yêu cầu
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Table */}
        <Card className="table-card">
          <Card.Body className="p-0">
            <div className="table-responsive">
              <Table hover className="refunds-table">
                <thead>
                  <tr>
                    <th>Khách hàng</th>
                    <th>Khách sạn</th>
                    <th>Số tiền hoàn</th>
                    <th>Ngày yêu cầu</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((refund) => (
                    <tr key={refund._id} className="refund-row">
                      <td>
                        <div className="customer-info">
                          <div className="customer-header">
                            <FaUser className="customer-icon" />
                            <strong className="customer-name">{refund.user.name}</strong>
                          </div>
                          <div className="customer-details">
                            <small className="text-muted">{refund.user.email}</small>
                            <br />
                            <small className="text-muted">{refund.user.phoneNumber}</small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="hotel-info">
                          <strong className="hotel-name">{refund.reservation.hotel.name}</strong>
                          <div className="booking-details">
                            <small className="text-muted">
                              Check-in: {formatDate(refund.reservation.checkInDate).split(',')[0]}
                            </small>
                            <br />
                            <small className="text-muted">
                              Check-out: {formatDate(refund.reservation.checkOutDate).split(',')[0]}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="amount-info">
                          <strong className="refund-amount">
                            {formatCurrency(refund.refundAmount)}
                          </strong>
                          <div className="original-amount">
                            <small className="text-muted">
                              Gốc: {formatCurrency(refund.reservation.totalPrice)}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="date-info">
                          <FaCalendar className="date-icon" />
                          <span>{formatDate(refund.requestDate)}</span>
                        </div>
                      </td>
                      <td>
                        {getStatusBadge(refund.status)}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <Button
                            variant="outline-info"
                            size="sm"
                            onClick={() => handleView(refund)}
                            title="Xem chi tiết"
                          >
                            <FaEye />
                          </Button>
                          {refund.status === "PENDING" && (
                            <>
                              <Button
                                variant="outline-success"
                                size="sm"
                                onClick={() => handleAction(refund, "approve")}
                                title="Phê duyệt"
                              >
                                <FaCheck />
                              </Button>
                              <Button
                                variant="outline-danger"
                                size="sm"
                                onClick={() => handleAction(refund, "reject")}
                                title="Từ chối"
                              >
                                <FaTimes />
                              </Button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>

            {currentItems.length === 0 && (
              <div className="empty-state">
                <FaMoneyBillWave className="empty-icon" />
                <h4>Không có yêu cầu hoàn tiền nào</h4>
                <p>Hiện tại chưa có yêu cầu hoàn tiền nào phù hợp với tiêu chí tìm kiếm</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="pagination-wrapper">
            <div className="pagination-container">
              <Button
                variant="outline-primary"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
              >
                Trước
              </Button>
              
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "primary" : "outline-primary"}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline-primary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
              >
                Sau
              </Button>
            </div>
          </div>
        )}
      </Container>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <FaEye className="me-2" />
            Chi tiết yêu cầu hoàn tiền
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedRefund && (
            <div className="refund-detail">
              <Row>
                <Col md={6}>
                  <Card className="detail-card">
                    <Card.Header>
                      <h6><FaUser className="me-2" />Thông tin khách hàng</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Tên:</strong> {selectedRefund.user.name}</p>
                      <p><strong>Email:</strong> {selectedRefund.user.email}</p>
                      <p><strong>Điện thoại:</strong> {selectedRefund.user.phoneNumber}</p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="detail-card">
                    <Card.Header>
                      <h6><FaCalendar className="me-2" />Thông tin ngân hàng</h6>
                    </Card.Header>
                    <Card.Body>
                      <p><strong>Chủ tài khoản:</strong> {selectedRefund.accountHolderName}</p>
                      <p><strong>Số tài khoản:</strong> {selectedRefund.accountNumber}</p>
                      <p><strong>Ngân hàng:</strong> {selectedRefund.bankName}</p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="detail-card mt-3">
                <Card.Header>
                  <h6>Thông tin đặt phòng</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Khách sạn:</strong> {selectedRefund.reservation.hotel.name}</p>
                      <p><strong>Địa chỉ:</strong> {selectedRefund.reservation.hotel.address}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Check-in:</strong> {formatDate(selectedRefund.reservation.checkInDate)}</p>
                      <p><strong>Check-out:</strong> {formatDate(selectedRefund.reservation.checkOutDate)}</p>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              <Card className="detail-card mt-3">
                <Card.Header>
                  <h6>Thông tin hoàn tiền</h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p><strong>Tổng tiền gốc:</strong> {formatCurrency(selectedRefund.reservation.totalPrice)}</p>
                      <p><strong>Số tiền hoàn:</strong> {formatCurrency(selectedRefund.refundAmount)}</p>
                    </Col>
                    <Col md={6}>
                      <p><strong>Ngày yêu cầu:</strong> {formatDate(selectedRefund.requestDate)}</p>
                      <p><strong>Trạng thái:</strong> {getStatusBadge(selectedRefund.status)}</p>
                      {selectedRefund.decisionDate && (
                        <p><strong>Ngày quyết định:</strong> {formatDate(selectedRefund.decisionDate)}</p>
                      )}
                    </Col>
                  </Row>
                  {selectedRefund.reason && (
                    <div className="mt-3">
                      <strong>Lý do:</strong>
                      <div className="reason-text">{selectedRefund.reason}</div>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Action Modal */}
      <Modal show={showActionModal} onHide={() => setShowActionModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "approve" ? (
              <>
                <FaCheck className="me-2 text-success" />
                Phê duyệt yêu cầu
              </>
            ) : (
              <>
                <FaTimes className="me-2 text-danger" />
                Từ chối yêu cầu
              </>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="action-form">
            <Alert variant={actionType === "approve" ? "success" : "danger"}>
              Bạn có chắc chắn muốn <strong>{actionType === "approve" ? "phê duyệt" : "từ chối"}</strong> yêu cầu hoàn tiền này?
            </Alert>
            
            {selectedRefund && (
              <div className="refund-summary">
                <p><strong>Khách hàng:</strong> {selectedRefund.user.name}</p>
                <p><strong>Số tiền:</strong> {formatCurrency(selectedRefund.refundAmount)}</p>
              </div>
            )}

            <Form.Group>
              <Form.Label>Lý do <span className="text-danger">*</span></Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Nhập lý do ${actionType === "approve" ? "phê duyệt" : "từ chối"}...`}
                required
              />
            </Form.Group>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowActionModal(false)}>
            Hủy
          </Button>
          <Button
            variant={actionType === "approve" ? "success" : "danger"}
            onClick={handleSubmitAction}
            disabled={!reason.trim()}
          >
            {actionType === "approve" ? "Phê duyệt" : "Từ chối"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListPaymentCustomer;