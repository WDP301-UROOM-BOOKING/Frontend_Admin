import { useState, useEffect } from "react";
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  InputGroup,
  Modal,
} from "react-bootstrap";
import { Calendar, Lock, Unlock } from "lucide-react";
import "bootstrap/dist/css/bootstrap.min.css";
import ConfirmationModal from "@components/ConfirmationModal";
import ApiConstants from "../../adapter/ApiConstants";
import { useRef } from "react";
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

export default function CustomerDetail({ show, handleClose, customer, onLockChange }) {
  // State to control the avatar modal
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Functions to handle modal open/close
  const handleOpenModal = () => setShowAvatarModal(true);
  const handleCloseModal = () => setShowAvatarModal(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false);

  // State cho modal lý do/mức độ lock
  const [showLockReasonModal, setShowLockReasonModal] = useState(false);
  const [lockReason, setLockReason] = useState(LOCK_REASONS[0]);
  const [lockDuration, setLockDuration] = useState(LOCK_DURATIONS[0].value);

  // Hàm lock
  const handleLockCustomer = async () => {
    if (!customer) return;
    setShowDeleteModal(false);
    setShowLockReasonModal(true);
  };

  // Xác nhận lock với lý do và mức độ
  const handleConfirmLock = async () => {
    if (!customer) return;
    const token = localStorage.getItem("token");
    const url = `${BASE_URL}/api${ApiConstants.LOCK_CUSTOMER.replace(":id", customer._id)}`;
    await fetch(url, {
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
    setShowLockReasonModal(false);
    if (onLockChange) onLockChange(customer._id, true);
    handleClose();
  };
  // Hàm unlock
  const handleUnlockCustomer = async () => {
    if (!customer) return;
    const token = localStorage.getItem("token");
    const url = `${BASE_URL}/api${ApiConstants.UNLOCK_CUSTOMER.replace(":id", customer._id)}`;
    await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    setShowAcceptModal(false);
    if (onLockChange) onLockChange(customer._id, false);
    handleClose();
  };

  // Tính thời gian còn lại (nếu có)
  let unlockCountdown = null;
  if (customer && customer.lockDuration && customer.lockDuration !== 'permanent' && customer.lockExpiresAt) {
    const now = new Date();
    const expires = new Date(customer.lockExpiresAt);
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

  if (!customer) return null;

  return (
    <>
    <Modal show={show} onHide={handleClose} size="xl">
      <Container className="py-4">
        <div className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="text-secondary">View Customer Information</h2>
            <div className="d-flex gap-2">
              {!customer.isLocked && (
                <Button
                  variant="outline-danger"
                  className="d-flex align-items-center gap-2"
                  style={{ width: "100px" }}
                    onClick={() => {
                      setLockReason(LOCK_REASONS[0]);
                      setLockDuration(LOCK_DURATIONS[0].value);
                      setShowLockReasonModal(true);
                    }}
                >
                  <Lock size={16} />
                  Lock
                </Button>
              )}
              {customer.isLocked && (
                <Button
                  variant="outline-success"
                  className="d-flex align-items-center gap-2"
                  style={{ width: "100px" }}
                  onClick={() => setShowAcceptModal(true)}
                >
                  <Unlock size={16} />
                  Unlock
                </Button>
              )}
            </div>
          </div>

          <Card>
            <Card.Body className="p-4">
              <Row className="mb-4">
                <Col md={6} className="d-flex flex-column">
                  <Form.Label>Avatar Customer</Form.Label>
                  <div className="d-flex flex-column align-items-center">
                    <div
                      className="position-relative rounded-circle overflow-hidden mb-3 border"
                      style={{ width: "200px", height: "200px" }}
                    >
                      <img
                        src={customer?.image?.url || "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"}
                        alt="Customer avatar"
                        className="w-100 h-100 object-fit-cover"
                      />
                    </div>
                    <Button
                      variant="outline-primary"
                      className="fw-semibold"
                      onClick={handleOpenModal}
                    >
                      View Avatar
                    </Button>
                  </div>
                </Col>

                <Col md={6}>
                  <Row className="mb-3 mt-md-4">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Full name</Form.Label>
                        <Form.Control
                          type="text"
                          value={customer.name || ""}
                          readOnly
                          className="bg-light"
                        />
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="mb-3">
                    <Col xs={12}>
                      <Form.Group>
                        <Form.Label>Gender</Form.Label>
                        <div>
                          <Form.Check
                            inline
                            type="radio"
                            label="Male"
                            name="gender"
                            id="male"
                            value="male"
                            checked={customer.gender === "MALE"}
                            disabled
                          />
                          <Form.Check
                            inline
                            type="radio"
                            label="Female"
                            name="gender"
                            id="female"
                            value="female"
                            checked={customer.gender === "FEMALE"}
                            disabled
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Birthdate</Form.Label>
                    <InputGroup>
                      <Form.Control
                        type="text"
                        value={customer.birthDate ? new Date(customer.birthDate).toLocaleDateString() : ""}
                        readOnly
                        className="bg-light"
                      />
                      <InputGroup.Text>
                        <Calendar size={16} />
                      </InputGroup.Text>
                    </InputGroup>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>CMND</Form.Label>
                    <Form.Control
                      type="text"
                      value={customer.cmnd || ""}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Number phone</Form.Label>
                    <Form.Control
                      type="text"
                      value={customer.phoneNumber || ""}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="text"
                      value={customer.email || ""}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>

              <Row className="mb-3">
                <Col xs={12}>
                  <Form.Group>
                    <Form.Label>Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={customer.address || ""}
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>
        </Container>
      </Modal>

        {/* Avatar Modal */}
        <Modal
          show={showAvatarModal}
          onHide={handleCloseModal}
          centered
          size="lg"
        >
          <Modal.Header closeButton>
            <Modal.Title>Customer Avatar</Modal.Title>
          </Modal.Header>
          <Modal.Body className="text-center p-4">
            <img
              src={customer?.image?.url || "https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"}
              alt="Customer avatar"
              className="img-fluid"
              style={{ maxHeight: "70vh" }}
            />
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Close
            </Button>
          </Modal.Footer>
        </Modal>

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
          customer && customer.lockDuration && customer.lockDuration !== 'permanent' && unlockCountdown
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
    </>
  );
}
