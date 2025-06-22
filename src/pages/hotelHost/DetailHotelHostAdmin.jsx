import {
  Container,
  Row,
  Col,
  Card,
  Button,
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
import { Form } from "react-bootstrap";

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
  const [activeTab, setActiveTab] = useState("info");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [payments, setPayments] = useState([]);
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

  // Mock data - in a real app, this would come from an API
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
                <Button variant="dark">Lock</Button>
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
                <Button variant="success" disabled>
                  Active
                </Button>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Tabs
          activeKey={activeTab}
          onSelect={setActiveTab}
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
      </div>
    </div>
  );
};

export default DetailHotelHostAdmin;
