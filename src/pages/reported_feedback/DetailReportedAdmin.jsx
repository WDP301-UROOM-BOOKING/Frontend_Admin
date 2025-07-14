import { useState, useEffect } from "react";
import {
  Container,
  Table,
  Form,
  Row,
  Col,
  Pagination,
  InputGroup,
  Button,
  Modal,
  Card,
  Alert,
  Badge,
} from "react-bootstrap";
import { useAppDispatch } from "../../redux/store";
import ReportFeedbackActions from "../../redux/reportedFeedback/actions";
import FeedbackActions from "../../redux/feedback/actions";
import "bootstrap/dist/css/bootstrap.min.css";
import { showToast, ToastProvider } from "@components/ToastContainer";

function DetailReportedAdmin({
  show,
  handleClose,
  feedbackId,
  feedbackData,
  onUpdateSuccess,
}) {
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [searchTerm, setSearchTerm] = useState("");
  const [reportStatuses, setReportStatuses] = useState({});
  const [rejectReasons, setRejectReasons] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [currentReportId, setCurrentReportId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showApproveConfirmModal, setShowApproveConfirmModal] = useState(false);

  const dispatch = useAppDispatch();
  const loadReports = () => {
    if (feedbackId) {
      setLoading(true);
      dispatch({
        type: ReportFeedbackActions.GET_REPORTS_BY_FEEDBACK_ID,
        payload: {
          feedbackId,
          onSuccess: (data) => {
            setReports(data);
            setLoading(false);
          },
          onFailed: () => {
            setReports([]);
            setLoading(false);
          },
        },
      });
    }
  };

  useEffect(() => {
    if (show && feedbackId) {
      setLoading(true);
      dispatch({
        type: ReportFeedbackActions.GET_REPORTS_BY_FEEDBACK_ID,
        payload: {
          feedbackId,
          onSuccess: (data) => {
            setReports(data);
            setLoading(false);
          },
          onFailed: (msg) => {
            setReports([]);
            setLoading(false);
          },
        },
      });
    } else if (!show) {
      setReports([]);
      setReportStatuses({});
      setRejectReasons({});
    }
  }, [show, feedbackId, dispatch]);

  const currentFeedback =
    feedbackData && reports.length > 0
      ? {
          id: feedbackData.feedback?._id,
          hotelName: feedbackData.feedback?.hotel?.hotelName || "N/A",
          customerName: feedbackData.feedback?.user?.name || "N/A",
          feedbackContent: feedbackData.feedback?.content || "N/A",
          rating: feedbackData.feedback?.rating || 0,
          submittedDate: feedbackData.feedback?.createdAt
            ? new Date(feedbackData.feedback.createdAt).toLocaleDateString(
                "vi-VN"
              )
            : "N/A",
          reportCount: reports.length,
          reports: reports.map((r) => ({
            id: r._id,
            reporterName: r.user?.name || "N/A",
            reason: r.reason || "N/A",
            description: r.description || "N/A",
            reportDate: r.createdAt
              ? new Date(r.createdAt).toLocaleString("vi-VN")
              : "N/A",
            status:
              r.status === "PENDING"
                ? "Chưa xử lý"
                : r.status === "APPROVED"
                ? "Đã phê duyệt"
                : r.status === "REJECT"
                ? "Đã từ chối"
                : "Chưa xử lý",
          })),
        }
      : {
          id: "-",
          hotelName: "-",
          customerName: "-",
          feedbackContent: "-",
          rating: 0,
          submittedDate: "-",
          reportCount: 0,
          reports: [],
        };

  const getCurrentStatus = (originalStatus, id) =>
    reportStatuses[id] || originalStatus;

  const handleBulkApproveConfirmed = () => {
    const approvingReports = currentFeedback.reports.filter(
      (r) => getCurrentStatus(r.status, r.id) === "Chưa xử lý"
    );

    if (approvingReports.length === 0) {
      showToast.warning("Không có báo cáo nào cần phê duyệt!");
      return;
    }

    let completedCount = 0;
    const totalReports = approvingReports.length;

    // Hiển thị toast bắt đầu xử lý
    showToast.info("Đang xử lý phê duyệt báo cáo...");

    approvingReports.forEach((r) => {
      dispatch({
        type: ReportFeedbackActions.UPDATE_REPORT_STATUS,
        payload: {
          reportId: r.id,
          data: {
            status: "APPROVED",
          },
          onSuccess: () => {
            completedCount++;
            if (completedCount === totalReports) {
              showToast.success(`Đã phê duyệt ${totalReports} báo cáo thành công!`);
              loadReports();
              onUpdateSuccess();
            }
          },
          onFailed: (msg) => {
            showToast.error(`Phê duyệt báo cáo thất bại: ${msg}`);
          },
        },
      });
    });

    const newStatuses = {};
    approvingReports.forEach((r) => {
      newStatuses[r.id] = "Đã phê duyệt";
    });

    setReportStatuses((prev) => ({
      ...prev,
      ...newStatuses,
    }));

    dispatch({
      type: FeedbackActions.UPDATE_FEEDBACK_STATUS,
      payload: {
        feedbackId: currentFeedback.id,
        status: "NONACTIVE",
        onSuccess: () => {
          showToast.success("Feedback đã được ẩn khỏi hệ thống!");
          loadReports();
          handleClose();
          onUpdateSuccess();
        },
        onFailed: (msg) => {
          showToast.error(`Cập nhật trạng thái feedback thất bại: ${msg}`);
        },
      },
    });
    setShowApproveConfirmModal(false);
  };

  const handleBulkReject = () => {
    setShowRejectModal(true);
    setCurrentReportId("bulk");
  };
  const handleConfirmApprove = () => {
    setShowApproveConfirmModal(true);
  };

  const handleRejectConfirm = () => {
    if (!rejectReason.trim()) {
      showToast.warning("Vui lòng nhập lý do từ chối!");
      return;
    }

    const rejectingReports = currentFeedback.reports.filter(
      (r) => getCurrentStatus(r.status, r.id) === "Chưa xử lý"
    );

    if (currentReportId === "bulk") {
      let completedCount = 0;
      const totalReports = rejectingReports.length;

      // Hiển thị toast bắt đầu xử lý
      showToast.info("Đang xử lý từ chối báo cáo...");

      rejectingReports.forEach((r) => {
        dispatch({
          type: ReportFeedbackActions.UPDATE_REPORT_STATUS,
          payload: {
            reportId: r.id,
            data: {
              status: "REJECT",
              rejectReason,
            },
            onSuccess: () => {
              completedCount++;
              if (completedCount === totalReports) {
                showToast.success(`Đã từ chối ${totalReports} báo cáo thành công!`);
                loadReports();
                onUpdateSuccess();
              }
            },
            onFailed: (msg) => {
              showToast.error(`Từ chối báo cáo thất bại: ${msg}`);
            },
          },
        });
      });
    }

    setShowRejectModal(false);
    setRejectReason("");
    setCurrentReportId(null);
    loadReports();
  };

  const getStatusColor = (status, id) => {
    const current = getCurrentStatus(status, id);
    if (current === "Đã phê duyệt") return "success";
    if (current === "Đã từ chối") return "danger";
    if (current === "Chưa xử lý") return "warning";
    return "secondary";
  };

  const filteredReports = currentFeedback.reports.filter(
    (r) =>
      r.reporterName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.reason.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <ToastProvider />
      <Modal show={show} onHide={handleClose} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết báo cáo Feedback </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading ? (
            <div className="text-center p-4">
              <div className="spinner-border" />
              <p className="mt-2">Đang tải dữ liệu...</p>
            </div>
          ) : currentFeedback.reports.length === 0 ? (
            <Alert variant="info" className="text-center">
              Không có báo cáo nào cho feedback này.
            </Alert>
          ) : (
            <Container className="p-0">
              <Card className="mb-4">
                <Card.Header className="bg-primary text-white">
                  <h5>Thông tin Feedback được báo cáo</h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <p>
                        <strong>ID:</strong> {currentFeedback.id}
                      </p>
                      <p>
                        <strong>Khách sạn:</strong> {currentFeedback.hotelName}
                      </p>
                      <p>
                        <strong>Khách hàng:</strong>{" "}
                        {currentFeedback.customerName}
                      </p>
                    </Col>
                    <Col md={6}>
                      <p>
                        <strong>Ngày gửi:</strong>{" "}
                        {currentFeedback.submittedDate}
                      </p>
                      <p>
                        <strong>Rating:</strong>{" "}
                        <Badge bg={getStatusColor("none", "none")}>
                          {currentFeedback.rating} ⭐
                        </Badge>
                      </p>
                      <p>
                        <strong>Số báo cáo:</strong>{" "}
                        <Badge bg="danger">{currentFeedback.reportCount}</Badge>
                      </p>
                    </Col>
                  </Row>
                  <p>
                    <strong>Nội dung:</strong> {currentFeedback.feedbackContent}
                  </p>
                </Card.Body>
              </Card>

              <Row className="mb-3">
                <Col>
                  <Form.Select
                    value={entriesPerPage}
                    onChange={(e) => setEntriesPerPage(e.target.value)}
                    style={{ width: 100 }}
                  >
                    {[10, 25, 50, 100].map((n) => (
                      <option key={n} value={n}>
                        {n}
                      </option>
                    ))}
                  </Form.Select>
                </Col>
                <Col>
                  <Form.Control
                    placeholder="Tìm kiếm..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </Col>
              </Row>

              {currentFeedback.reports.some(
                (r) => getCurrentStatus(r.status, r.id) === "Chưa xử lý"
              ) && (
                <div className="mb-3 d-flex gap-2 justify-content-end">
                  <Button variant="success" onClick={handleConfirmApprove}>
                    Phê duyệt tất cả
                  </Button>

                  <Button variant="danger" onClick={handleBulkReject}>
                    Từ chối tất cả
                  </Button>
                </div>
              )}

              <Table bordered hover>
                <thead>
                  <tr>
                    <th>Người báo cáo</th>
                    <th>Lý do</th>
                    <th>Mô tả</th>
                    <th>Ngày báo cáo</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredReports.map((r) => (
                    <tr key={r.id}>
                      <td>{r.reporterName}</td>
                      <td>
                        <Badge bg="info">{r.reason}</Badge>
                      </td>
                      <td>
                        {r.description}
                        {rejectReasons[r.id] &&
                          getCurrentStatus(r.status, r.id) === "Đã từ chối" && (
                            <div className="mt-2 text-danger">
                              <strong>Lý do từ chối:</strong>{" "}
                              {rejectReasons[r.id]}
                            </div>
                          )}
                      </td>
                      <td>{r.reportDate}</td>
                      <td>
                        <Badge bg={getStatusColor(r.status, r.id)}>
                          {getCurrentStatus(r.status, r.id)}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Container>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={handleClose}>Đóng</Button>
        </Modal.Footer>
      </Modal>

      {/* Modal lý do từ chối */}
      <Modal show={showRejectModal} onHide={() => setShowRejectModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Từ chối báo cáo</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Lý do từ chối *</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRejectModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={handleRejectConfirm}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showApproveConfirmModal}
        onHide={() => setShowApproveConfirmModal(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận phê duyệt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn{" "}
          <strong>phê duyệt tất cả các báo cáo chưa xử lý</strong> không? Hành
          động này sẽ làm feedback bị ẩn khỏi hệ thống.
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowApproveConfirmModal(false)}
          >
            Hủy
          </Button>
          <Button variant="success" onClick={handleBulkApproveConfirmed}>
            Xác nhận phê duyệt
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default DetailReportedAdmin;
