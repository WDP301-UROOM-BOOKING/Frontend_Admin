import "bootstrap/dist/css/bootstrap.min.css";
import { useState, useEffect } from "react";
import { Col, Form, Row, Modal, Button } from "react-bootstrap";
import api from "../../libs/api";
import ApiConstants from "../../adapter/ApiConstants";
import { showToast, ToastProvider } from "../../components/ToastContainer";
import "../../css/admin/payment.css";

const ListPaymentHotel = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [confirmModal, setConfirmModal] = useState(false);
  const [paymentToConfirm, setPaymentToConfirm] = useState(null);
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  // Fetch payments from API
  const fetchPayments = async () => {
    try {
      setLoading(true);
      const params = {};
      
      // Chỉ thêm params nếu có giá trị
      if (selectedMonth !== "" && selectedMonth !== undefined) {
        params.month = parseInt(selectedMonth);
      }
      if (selectedYear !== "" && selectedYear !== undefined) {
        params.year = parseInt(selectedYear);
      }
      if (selectedStatus !== "" && selectedStatus !== undefined) {
        params.status = selectedStatus;
      }

      console.log('Fetching payments with params:', params);
      const response = await api.get(ApiConstants.FETCH_ALL_MONTHLY_PAYMENTS, { params });
      console.log('API Response:', response.data);
      
      if (response.data.success) {
        setPayments(response.data.data);
        console.log('Payments loaded:', response.data.data.length);
        // Reset về trang đầu khi có dữ liệu mới
        setCurrentPage(1);
      } else {
        console.error('API returned error:', response.data);
        showToast.error('Không thể tải danh sách thanh toán');
      }
    } catch (error) {
      console.error('Error fetching payments:', error);
      showToast.error('Không thể tải danh sách thanh toán');
    } finally {
      setLoading(false);
    }
  };

  // Update payment status
  const updatePaymentStatus = async (paymentId) => {
    try {
      const response = await api.put(
        ApiConstants.UPDATE_PAYMENT_STATUS.replace(':paymentId', paymentId),
        { status: 'PAID' }
      );
      if (response.data.success) {
        // Refresh the payments list
        fetchPayments();
        setConfirmModal(false);
        setPaymentToConfirm(null);
        showToast.success('Xác nhận thanh toán thành công');
      }
    } catch (error) {
      console.error('Error updating payment status:', error);
      showToast.error('Không thể cập nhật trạng thái thanh toán');
    }
  };

  // Get payment detail
  const getPaymentDetail = async (paymentId) => {
    try {
      const response = await api.get(
        ApiConstants.GET_PAYMENT_BY_ID.replace(':paymentId', paymentId)
      );
      if (response.data.success) {
        setSelectedPayment(response.data.data);
        setShowDetailModal(true);
      }
    } catch (error) {
      console.error('Error fetching payment detail:', error);
      showToast.error('Không thể tải chi tiết thanh toán');
    }
  };

  // Handle confirm payment
  const handleConfirmPayment = (payment) => {
    setPaymentToConfirm(payment);
    setConfirmModal(true);
  };

  // Filter payments based on search term
  const filteredPayments = payments.filter((payment, index) => {
    const formattedId = `KS-${String(index + 1).padStart(3, '0')}`;
    return (
      payment.hotel?.hotelName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      payment._id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      formattedId.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  // Pagination logic
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPayments = filteredPayments.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPayments.length / itemsPerPage);

  // Generate page numbers
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };

  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    switch (filterType) {
      case 'month':
        setSelectedMonth(value);
        break;
      case 'year':
        setSelectedYear(value);
        break;
      case 'status':
        setSelectedStatus(value);
        break;
      default:
        break;
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [selectedMonth, selectedYear, selectedStatus]);

  // Lấy màu cho trạng thái
  const getStatusColor = (status) => {
    switch (status) {
      case "PAID":
        return "success";
      case "PENDING":
        return "warning";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "PAID":
        return "Đã thanh toán";
      case "PENDING":
        return "Đang chờ";
      default:
        return status;
    }
  };

  const months = [
    "Tháng 1",
    "Tháng 2",
    "Tháng 3",
    "Tháng 4",
    "Tháng 5",
    "Tháng 6",
    "Tháng 7",
    "Tháng 8",
    "Tháng 9",
    "Tháng 10",
    "Tháng 11",
    "Tháng 12",
  ];

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );

  // Format currency
  const formatCurrency = (amount) => {
    return amount.toLocaleString() + ' $';
  };

  // Format ID to KS- format
  const formatPaymentId = (index) => {
    return `KS-${String(index + 1).padStart(3, '0')}`;
  };

  return (
    <div className="payments-content">
      <div className="page-header">
        <h1>Quản lý Thanh toán</h1>
        <div className="page-actions">
          <button 
            className="btn btn-outline-primary"
            onClick={fetchPayments}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise"></i> Làm mới
          </button>
        </div>
      </div>

      <div className="content-container">
        <div className="filters-bar">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input 
              type="text" 
              placeholder="Tìm kiếm khách sạn hoặc ID..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filters">
            <select 
              className="form-select"
              value={selectedStatus}
              onChange={(e) => handleFilterChange('status', e.target.value)}
            >
              <option value="">Tất cả trạng thái</option>
              <option value="PENDING">Đang chờ</option>
              <option value="PAID">Đã thanh toán</option>
            </select>
            <Form.Group className="mb-3">
              <Form.Label>Tháng</Form.Label>
              <Form.Select
                value={selectedMonth}
                onChange={(e) => handleFilterChange('month', e.target.value)}
              >
                <option value="">Tất cả tháng</option>
                {months.map((month, index) => (
                  <option key={index} value={index}>
                    {month}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Năm</Form.Label>
              <Form.Select
                value={selectedYear}
                onChange={(e) => handleFilterChange('year', e.target.value)}
              >
                <option value="">Tất cả năm</option>
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
                <th>Tháng/Năm</th>
                <th>Trạng thái</th>
                <th className="action-col">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center">Đang tải...</td>
                </tr>
              ) : filteredPayments.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center">
                    {payments.length === 0 ? 'Không có dữ liệu thanh toán' : 'Không tìm thấy kết quả phù hợp'}
                  </td>
                </tr>
              ) : (
                currentPayments.map((payment, index) => (
                  <tr key={payment._id}>
                    <td>{formatPaymentId(indexOfFirstItem + index)}</td>
                    <td>{payment.hotel?.hotelName || 'N/A'}</td>
                    <td>{formatCurrency(payment.amount)}</td>
                    <td>{payment.month}/{payment.year}</td>
                    <td>
                      <span
                        className={`badge bg-${getStatusColor(payment.status)}`}
                      >
                        {getStatusText(payment.status)}
                      </span>
                    </td>
                    <td className="action-col">
                      <div className="action-buttons">
                        <button
                          className="btn btn-sm btn-primary"
                          title="Xem chi tiết"
                          onClick={() => getPaymentDetail(payment._id)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        {payment.status === 'PENDING' && (
                          <button
                            className="btn btn-sm btn-success"
                            title="Xác nhận thanh toán"
                            onClick={() => handleConfirmPayment(payment)}
                          >
                            <i className="bi bi-check-lg"></i>
                          </button>
                        )}
                        <button
                          className="btn btn-sm btn-warning"
                          title="In hóa đơn"
                          onClick={() => {
                            // TODO: Implement print invoice functionality
                            console.log('Print invoice for payment:', payment._id);
                          }}
                        >
                          <i className="bi bi-printer"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination-info">Hiển thị {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, filteredPayments.length)} của {filteredPayments.length} kết quả
            {payments.length > 0 && ` (tổng cộng ${payments.length} thanh toán)`}
          </div>
          <div className="pagination-right">
            {payments.length > 0 && (
              <div className="summary-info">
                <small className="text-muted">
                  PENDING: {payments.filter(p => p.status === 'PENDING').length} | 
                  PAID: {payments.filter(p => p.status === 'PAID').length}
                </small>
              </div>
            )}
            {/* Pagination */}
            {filteredPayments.length > itemsPerPage && (
              <ul className="pagination">
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                  <a 
                    className="page-link" 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) setCurrentPage(currentPage - 1);
                    }}
                  >
                    Trước
                  </a>
                </li>
                
                {getPageNumbers().map((pageNumber, index) => (
                  <li 
                    key={index} 
                    className={`page-item ${pageNumber === currentPage ? 'active' : ''} ${pageNumber === '...' ? 'disabled' : ''}`}
                  >
                    {pageNumber === '...' ? (
                      <span className="page-link">...</span>
                    ) : (
                      <a 
                        className="page-link" 
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(pageNumber);
                        }}
                      >
                        {pageNumber}
                      </a>
                    )}
                  </li>
                ))}
                
                <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                  <a 
                    className="page-link" 
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) setCurrentPage(currentPage + 1);
                    }}
                  >
                    Sau
                  </a>
                </li>
              </ul>
            )}
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPayment && (
            <div>
              <Row>
                <Col md={6}>
                  <h6>Thông tin khách sạn:</h6>
                  <p><strong>Tên khách sạn:</strong> {selectedPayment.hotel?.hotelName}</p>
                  <p><strong>Địa chỉ:</strong> {selectedPayment.hotel?.address || 'N/A'}</p>
                  <p><strong>Số điện thoại:</strong> {selectedPayment.hotel?.phoneNumber || 'N/A'}</p>
                  <p><strong>Email:</strong> {selectedPayment.hotel?.email || 'N/A'}</p>
                </Col>
                <Col md={6}>
                  <h6>Thông tin thanh toán:</h6>
                  <p><strong>Số tiền:</strong> {formatCurrency(selectedPayment.amount)}</p>
                  <p><strong>Tháng/Năm:</strong> {selectedPayment.month}/{selectedPayment.year}</p>
                  <p><strong>Trạng thái:</strong> {getStatusText(selectedPayment.status)}</p>
                  <p><strong>Ngày yêu cầu:</strong> {new Date(selectedPayment.requestDate).toLocaleDateString('vi-VN')}</p>
                  {selectedPayment.paymentDate && (
                    <p><strong>Ngày thanh toán:</strong> {new Date(selectedPayment.paymentDate).toLocaleDateString('vi-VN')}</p>
                  )}
                </Col>
              </Row>
              {selectedPayment.accountHolderName && (
                <Row className="mt-3">
                  <Col md={12}>
                    <h6>Thông tin ngân hàng:</h6>
                    <p><strong>Chủ tài khoản:</strong> {selectedPayment.accountHolderName}</p>
                    <p><strong>Số tài khoản:</strong> {selectedPayment.accountNumber}</p>
                    <p><strong>Ngân hàng:</strong> {selectedPayment.bankName}</p>
                    {selectedPayment.branchName && (
                      <p><strong>Chi nhánh:</strong> {selectedPayment.branchName}</p>
                    )}
                  </Col>
                </Row>
              )}
              {selectedPayment.reason && (
                <Row className="mt-3">
                  <Col md={12}>
                    <h6>Lý do:</h6>
                    <p>{selectedPayment.reason}</p>
                  </Col>
                </Row>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirm Payment Modal */}
      <Modal show={confirmModal} onHide={() => setConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thanh toán</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {paymentToConfirm && (
            <div>
              <p>Bạn có chắc chắn muốn xác nhận thanh toán cho khách sạn <strong>{paymentToConfirm.hotel?.hotelName}</strong>?</p>
              <p><strong>Số tiền:</strong> {formatCurrency(paymentToConfirm.amount)}</p>
              <p><strong>Tháng/Năm:</strong> {paymentToConfirm.month}/{paymentToConfirm.year}</p>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setConfirmModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="success" 
            onClick={() => paymentToConfirm && updatePaymentStatus(paymentToConfirm._id)}
          >
            Xác nhận thanh toán
          </Button>
        </Modal.Footer>
      </Modal>
      <ToastProvider />
    </div>
  );
};

export default ListPaymentHotel;
