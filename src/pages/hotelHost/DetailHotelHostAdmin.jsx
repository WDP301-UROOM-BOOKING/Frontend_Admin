import {
  Container,
  Row,
  Col,
  Card,
  Badge,
  Tab,
  Table,
  Tabs,
} from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useEffect, useState } from "react";
import {
  FaStar,
  FaDumbbell,
  FaUtensils,
  FaSwimmingPool,
  FaWifi,
  FaMapMarkerAlt,
  FaPhone,
  FaEnvelope,
  FaRegStar, FaStarHalfAlt, FaArrowLeft } from "react-icons/fa";
import ListFeedbackAdminPage from "../feedback/ListFeedbackAdminPage";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form } from 'react-bootstrap';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import ToggleButton from 'react-bootstrap/ToggleButton';
import ApiConstants from '../../adapter/ApiConstants';

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

const renderStars = (rating) => {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    if (i <= rating) {
      stars.push(<FaStar key={i} className="text-warning" />);
    } else if (i - 0.5 === rating) {
      stars.push(<FaStarHalfAlt key={i} className="text-warning" />);
    } else {
      stars.push(<FaRegStar key={i} className="text-warning" />);
    }
  }
  return stars;
};

const DetailHotelHostAdmin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTabLocal] = useState("info");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [payments, setPayments] = useState([]);
  // Host state
  const [host, setHost] = useState(null);
  // Lock/unlock modal state
  const [showLockReasonModal, setShowLockReasonModal] = useState(false);
  const [lockReason, setLockReason] = useState(LOCK_REASONS[0]);
  const [lockDuration, setLockDuration] = useState(LOCK_DURATIONS[0].value);
  const [showAcceptModal, setShowAcceptModal] = useState(false);
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  const years = Array.from(
    { length: 5 },
    (_, i) => new Date().getFullYear() - 2 + i
  );
  // Calculate totals
  const totalCustomerPaid = payments.reduce(
    (sum, payment) => sum + payment.customerPaid,
    0
  );
  const totalCommission = payments.reduce(
    (sum, payment) => sum + payment.commission,
    0
  );
  const totalAmountToHost = payments.reduce(
    (sum, payment) => sum + payment.amountToHost,
    0
  );


  useEffect(() => {
    // Load selected host from localStorage
    const stored = localStorage.getItem('selectedHotelHostAdmin');
    if (stored) {
      setHost(JSON.parse(stored));
    }
  }, []);

  // Lock host
  const handleConfirmLock = async () => {
    if (!host) return;
    const token = localStorage.getItem("token");
    const url = `http://localhost:5000/api${ApiConstants.LOCK_CUSTOMER.replace(":id", host._id)}`;
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
      setHost(data.data);
      localStorage.setItem('selectedHotelHostAdmin', JSON.stringify(data.data));
    } else {
      setHost(prev => ({ ...prev, status: 'LOCK', isLocked: true }));
    }
    setShowLockReasonModal(false);
  };
  // Unlock host
  const handleUnlockHost = async () => {
    if (!host) return;
    const token = localStorage.getItem("token");
    const url = `http://localhost:5000/api${ApiConstants.UNLOCK_CUSTOMER.replace(":id", host._id)}`;
    const res = await fetch(url, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await res.json();
    if (data && data.data) {
      setHost(data.data);
      localStorage.setItem('selectedHotelHostAdmin', JSON.stringify(data.data));
    } else {
      setHost(prev => ({ ...prev, status: 'ACTIVE', isLocked: false }));
    }
    setShowAcceptModal(false);
  };

  // Countdown logic
  let unlockCountdown = null;
  if (host && host.lockDuration && host.lockDuration !== 'permanent' && host.lockExpiresAt) {
    const now = new Date();
    const expires = new Date(host.lockExpiresAt);
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

  useEffect(() => {
    // Simulate API call
    const fetchPayments = () => {
      const mockPayments = [
        {
          id: 1,
          date: "2025-03-05",
          customerPaid: 5000000,
          commission: 750000,
          amountToHost: 4250000,
          status: "Completed",
          description: "Room booking - Deluxe Suite",
        },
        {
          id: 2,
          date: "2025-03-12",
          customerPaid: 3500000,
          commission: 525000,
          amountToHost: 2975000,
          status: "Pending",
          description: "Room booking - Standard Room",
        },
        {
          id: 3,
          date: "2025-03-18",
          customerPaid: 8400000,
          commission: 1260000,
          amountToHost: 7140000,
          status: "Completed",
          description: "Room booking - Presidential Suite",
        },
        {
          id: 4,
          date: "2025-03-25",
          customerPaid: 6000000,
          commission: 900000,
          amountToHost: 5100000,
          status: "Processing",
          description: "Room booking - Family Room",
        },
      ];
      setPayments(mockPayments);
    };

    fetchPayments();
  });

  return (
    <div className="container_fluid">

      <div className="main-content_1">
        <h2 className=" fw-bold mb-4">Hotel management</h2>
        <Row>
          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="fw-bold bg-light d-flex align-items-center">
                <span role="img" aria-label="lock" className="me-2">
                  🔒
                </span>
                Account management
              </Card.Header>
              <Card.Body className="text-center">
                {host && !host.isLocked && (
                  <Button variant="danger" onClick={() => {
                    setLockReason(LOCK_REASONS[0]);
                    setLockDuration(LOCK_DURATIONS[0].value);
                    setShowLockReasonModal(true);
                  }}>
                    Lock
                  </Button>
                )}
                {host && host.isLocked && (
                  <Button variant="success" onClick={() => setShowAcceptModal(true)}>
                    Unlock
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>

          <Col md={6}>
            <Card className="shadow-sm">
              <Card.Header className="fw-bold bg-light d-flex align-items-center">
                <span role="img" aria-label="lock" className="me-2">
                  🔒
                </span>
                Status Hotel
              </Card.Header>
              <Card.Body className="text-center">
                {host && (
                  <Button variant={host.isLocked ? "secondary" : "success"} disabled>
                    {host.isLocked ? "Locked" : "Active"}
                  </Button>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Tabs
          activeKey={activeTab}
          onSelect={setActiveTabLocal}
          className="mb-4 mt-3 gap-3"
          variant="pills"
        >
          {/* Hotel Information Tab */}
          <Tab
            eventKey="info"
            title={<span>Hotel Information</span>}
            tabClassName={
              activeTab === "info"
                ? "text-light bg-dark fw-bold"
                : "text-dark bg-white fw-bold border"
            }
          >
            <Card className="p-4 shadow-sm border-0 bg-light">
              <h3 className="mb-4 text-success">Hotel Information</h3>
              <Row>
                <Col md={4} className="text-center">
                  <img
                    src="https://i.pinimg.com/736x/f4/30/5b/f4305bc51ee926d99fc9f0c6cefabfdc.jpg"
                    alt="Hotel"
                    className="img-fluid"
                  />
                  <div className="hotel-rating mt-2">{renderStars(5)}</div>
                </Col>
                <Col md={8}>
                  <Row>
                    {[
                      { label: "Hotel Name", value: "Grand Palace Hotel" },
                      {
                        label: "Email",
                        value: (
                          <>
                            <FaEnvelope /> hotel@example.com
                          </>
                        ),
                      },
                      {
                        label: "Phone",
                        value: (
                          <>
                            <FaPhone /> 0123 456 789
                          </>
                        ),
                      },
                      {
                        label: "Address",
                        value: (
                          <>
                            <FaMapMarkerAlt /> 123 Nguyen Trai, Hanoi
                          </>
                        ),
                      },
                    ].map((item, index) => (
                      <Col md={6} key={index}>
                        <Card className="p-3 mb-3 border-0 shadow-sm">
                          <small className="text-muted">{item.label}</small>
                          <h5 className="fw-bold">{item.value}</h5>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                  <Card className="p-3 border-0 shadow-sm">
                    <small className="text-muted">Amenities</small>
                    <div className="d-flex gap-2 mt-2">
                      {[FaWifi, FaSwimmingPool, FaUtensils, FaDumbbell].map(
                        (Icon, index) => (
                          <Badge key={index} bg="dark">
                            <Icon />{" "}
                            {
                              ["Wifi", "Swimming Pool", "Restaurant", "Gym"][
                                index
                              ]
                            }
                          </Badge>
                        )
                      )}
                    </div>
                  </Card>
                </Col>
              </Row>
            </Card>
          </Tab>

          {/* Transaction History Tab */}
          <Tab
            eventKey="transactions"
            title={<span>Transaction History</span>}
            tabClassName={
              activeTab === "transactions"
                ? "text-light bg-dark fw-bold"
                : "text-dark bg-white fw-bold border"
            }
          >
            <div className="main-content_1">
              <Row className="mb-4">
                <Col md={6}>
                  <Card>
                    <Card.Header as="h5">Payment Period</Card.Header>
                    <Card.Body>
                      <Row>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>Month</Form.Label>
                            <Form.Select
                              value={selectedMonth}
                              onChange={(e) =>
                                setSelectedMonth(
                                  Number.parseInt(e.target.value)
                                )
                              }
                            >
                              {months.map((month, index) => (
                                <option key={index} value={index}>
                                  {month}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>Year</Form.Label>
                            <Form.Select
                              value={selectedYear}
                              onChange={(e) =>
                                setSelectedYear(Number.parseInt(e.target.value))
                              }
                            >
                              {years.map((year) => (
                                <option key={year} value={year}>
                                  {year}
                                </option>
                              ))}
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>Status</Form.Label>
                            <Form.Select
                              value="All"
                              onChange={(e) =>
                                setSelectedYear(Number.parseInt(e.target.value))
                              }
                            >
                              <option key="All" value="All">
                                All
                              </option>
                              <option key="Pending" value="Pending">
                                Pending
                              </option>
                              <option key="Proccessing" value="Proccessing">
                                Proccessing
                              </option>
                              <option key="Compeleted" value="Compeleted">
                                Compeleted
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                        <Col>
                          <Form.Group className="mb-3">
                            <Form.Label>Filter by:</Form.Label>
                            <Form.Select
                              value="All"
                              onChange={(e) =>
                                setSelectedYear(Number.parseInt(e.target.value))
                              }
                            >
                              <option key="Newest" value="Newest">
                                Newest
                              </option>
                              <option key="Oldest" value="Oldest">
                                Oldest
                              </option>
                              <option key="Ascending" value="Ascending">
                                A -&gt; Z
                              </option>
                              <option key="Descending" value="Descending">
                                Z -&gt; A
                              </option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6}>
                  <Card>
                    <Card.Header as="h5">Payment Summary</Card.Header>
                    <Card.Body>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Customer Payments:</span>
                        <strong>{formatCurrency(totalCustomerPaid)}</strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Commission (Admin):</span>
                        <strong className="text-danger">
                          {formatCurrency(totalCommission)}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Total Amount to Hotel Host:</span>
                        <strong className="text-success">
                          {formatCurrency(totalAmountToHost)}
                        </strong>
                      </div>
                      <div className="d-flex justify-content-between mb-2">
                        <span>Completed/Processing/Pending Payments:</span>
                        <strong>3/4/5</strong>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              <Card className="mb-4">
                <Card.Header as="h5">
                  Payment List for {months[selectedMonth]} {selectedYear}
                </Card.Header>
                <Card.Body>
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Description</th>
                        <th>Customer Paid</th>
                        <th>Commission</th>
                        <th>Amount to Host</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {payments.length > 0 ? (
                        payments.map((payment, index) => (
                          <tr
                            key={payment.id}
                            onClick={() => {}}
                            style={{ cursor: "pointer" }}
                          >
                            <td>{index + 1}</td>
                            <td>{payment.date}</td>
                            <td>
                              <a>{payment.description}</a>
                            </td>
                            <td>{formatCurrency(payment.customerPaid)}</td>
                            <td className="text-danger">
                              {formatCurrency(payment.commission)}
                            </td>
                            <td className="text-success">
                              {formatCurrency(payment.amountToHost)}
                            </td>
                            <td>
                              <span
                                className={`badge ${
                                  payment.status === "Completed"
                                    ? "bg-success"
                                    : payment.status === "Pending"
                                    ? "bg-warning"
                                    : "bg-info"
                                }`}
                              >
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="7" className="text-center">
                            No payments found for this period
                          </td>
                        </tr>
                      )}
                    </tbody>
                    <tfoot>
                      <tr className="table-secondary">
                        <td colSpan="3" className="text-end">
                          <strong>Total:</strong>
                        </td>
                        <td>
                          <strong>{formatCurrency(totalCustomerPaid)}</strong>
                        </td>
                        <td>
                          <strong>{formatCurrency(totalCommission)}</strong>
                        </td>
                        <td>
                          <strong>{formatCurrency(totalAmountToHost)}</strong>
                        </td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </Table>
                </Card.Body>
              </Card>
            </div>
          </Tab>

          {/* Customer Reviews Tab */}
          <Tab
            eventKey="reviews"
            title={<span>Customer Reviews</span>}
            tabClassName={
              activeTab === "reviews"
                ? "text-light bg-dark fw-bold"
                : "text-dark bg-white fw-bold border"
            }
          >
            <ListFeedbackAdminPage />
          </Tab>
        </Tabs>
        {/* Lock Reason Modal */}
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
        <Modal show={showAcceptModal} onHide={() => setShowAcceptModal(false)} centered>
          <Modal.Header closeButton>
            <Modal.Title>Xác nhận mở khóa tài khoản</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            {host && host.lockDuration && host.lockDuration !== 'permanent' && unlockCountdown
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
      </div>
    </div>
  );
};

export default DetailHotelHostAdmin;
