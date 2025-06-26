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
  Dropdown,
} from "react-bootstrap";
import {
  FaPlus,
  FaEdit,
  FaTrash,
  FaSearch,
  FaFilter,
  FaEye,
  FaToggleOn,
  FaToggleOff,
  FaPercentage,
  FaDollarSign,
  FaCalendar,
  FaGift,
  FaTags,
  FaChartLine,
} from "react-icons/fa";
import DetailPromotionPage from "./DetailPromotionPage";
import "./promotion.css";

const ListPromotionPage = () => {
  const [promotions, setPromotions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [modalType, setModalType] = useState("add");
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(8);

  // Sample data with more variety
  const samplePromotions = [
    {
      _id: "1",
      code: "SUMMER2024",
      name: "Summer Sale 2024",
      description: "Get 20% off on all bookings during summer season. Perfect for vacation planning!",
      discountType: "PERCENTAGE",
      discountValue: 20,
      maxDiscountAmount: 100,
      minOrderAmount: 200,
      startDate: "2025-06-01",
      endDate: "2025-08-31",
      usageLimit: 1000,
      usedCount: 245,
      isActive: true,
      createdAt: "2024-05-15",
    },
    {
      _id: "2",
      code: "WELCOME50",
      name: "Welcome Discount",
      description: "Fixed $50 discount for new customers on their first booking",
      discountType: "FIXED_AMOUNT",
      discountValue: 50,
      maxDiscountAmount: null,
      minOrderAmount: 150,
      startDate: "2025-01-01",
      endDate: "2025-12-31",
      usageLimit: null,
      usedCount: 1250,
      isActive: true,
      createdAt: "2024-01-01",
    },
    {
      _id: "3",
      code: "FLASH30",
      name: "Flash Sale 30%",
      description: "Limited time flash sale - 30% off all premium rooms",
      discountType: "PERCENTAGE",
      discountValue: 30,
      maxDiscountAmount: 200,
      minOrderAmount: 300,
      startDate: "2025-03-01",
      endDate: "2026-03-15",
      usageLimit: 500,
      usedCount: 480,
      isActive: false,
      createdAt: "2024-02-28",
    },
    {
      _id: "4",
      code: "EARLY2025",
      name: "Early Bird 2025",
      description: "Book early for 2025 and save big on your future stays",
      discountType: "PERCENTAGE",
      discountValue: 15,
      maxDiscountAmount: 150,
      minOrderAmount: 400,
      startDate: "2025-01-01",
      endDate: "2025-03-31",
      usageLimit: 2000,
      usedCount: 0,
      isActive: true,
      createdAt: "2024-12-01",
    },
  ];

  useEffect(() => {
    fetchPromotions();
  }, []);

  const fetchPromotions = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setPromotions(samplePromotions);
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error("Error fetching promotions:", error);
      setLoading(false);
    }
  };

  const handleAdd = () => {
    setSelectedPromotion(null);
    setModalType("add");
    setShowModal(true);
  };

  const handleEdit = (promotion) => {
    setSelectedPromotion(promotion);
    setModalType("edit");
    setShowModal(true);
  };

  const handleView = (promotion) => {
    setSelectedPromotion(promotion);
    setShowDetailModal(true);
  };

  const handleDelete = (id) => {
    setDeleteConfirm({ show: true, id });
  };

  const confirmDelete = async () => {
    try {
      setPromotions(promotions.filter(p => p._id !== deleteConfirm.id));
      setDeleteConfirm({ show: false, id: null });
    } catch (error) {
      console.error("Error deleting promotion:", error);
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      setPromotions(promotions.map(p => 
        p._id === id ? { ...p, isActive: !currentStatus } : p
      ));
    } catch (error) {
      console.error("Error updating promotion status:", error);
    }
  };

  const handleSave = (promotionData) => {
    if (modalType === "add") {
      const newPromotion = {
        ...promotionData,
        _id: Date.now().toString(),
        usedCount: 0,
        createdAt: new Date().toISOString(),
      };
      setPromotions([newPromotion, ...promotions]);
    } else {
      setPromotions(promotions.map(p => 
        p._id === selectedPromotion._id ? { ...p, ...promotionData } : p
      ));
    }
    setShowModal(false);
  };

  // Filter and search logic
  const filteredPromotions = promotions.filter(promotion => {
    const matchesSearch = promotion.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         promotion.code.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === "all" || 
                         (filterStatus === "active" && promotion.isActive) ||
                         (filterStatus === "inactive" && !promotion.isActive);
    const matchesType = filterType === "all" || promotion.discountType === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredPromotions.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredPromotions.length / itemsPerPage);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    });
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusBadge = (promotion) => {
    const now = new Date();
    const startDate = new Date(promotion.startDate);
    const endDate = new Date(promotion.endDate);

    if (!promotion.isActive) {
      return <Badge bg="danger" className="status-badge">Inactive</Badge>;
    } else if (now < startDate) {
      return <Badge bg="warning" className="status-badge">Upcoming</Badge>;
    } else if (now > endDate) {
      return <Badge bg="secondary" className="status-badge">Expired</Badge>;
    } else {
      return <Badge bg="success" className="status-badge">Active</Badge>;
    }
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return "#28a745"; // Green
    if (percentage < 80) return "#ffc107"; // Yellow
    return "#dc3545"; // Red
  };

  // Statistics
  const stats = {
    total: promotions.length,
    active: promotions.filter(p => p.isActive).length,
    expired: promotions.filter(p => new Date(p.endDate) < new Date()).length,
    upcoming: promotions.filter(p => new Date(p.startDate) > new Date()).length,
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <Spinner animation="border" variant="primary" size="lg" />
          <p className="loading-text">Loading promotions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="promotion-management">
      {/* Header Section */}
      <div className="page-header-section">
        <Container fluid>
          <Row className="align-items-center">
            <Col>
              <div className="page-header">
                <div className="page-title-wrapper">
                  <div className="page-icon">
                    <FaGift />
                  </div>
                  <div>
                    <h1 className="page-title">Promotion Management</h1>
                    <p className="page-subtitle">Manage discount codes and promotional offers</p>
                  </div>
                </div>
              </div>
            </Col>
            <Col xs="auto">
              <Button
                variant="primary"
                onClick={handleAdd}
                className="btn-add-promotion"
                size="lg"
              >
                <FaPlus className="me-2" />
                Create Promotion
              </Button>
            </Col>
          </Row>

          {/* Statistics Cards */}
          <Row className="stats-row">
            <Col md={3} sm={6}>
              <Card className="stat-card stat-card-total">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <FaTags />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-number">{stats.total}</h3>
                      <p className="stat-label">Total Promotions</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card stat-card-active">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <FaChartLine />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-number">{stats.active}</h3>
                      <p className="stat-label">Active Now</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card stat-card-upcoming">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <FaCalendar />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-number">{stats.upcoming}</h3>
                      <p className="stat-label">Upcoming</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3} sm={6}>
              <Card className="stat-card stat-card-expired">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <FaPercentage />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-number">{stats.expired}</h3>
                      <p className="stat-label">Expired</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>

      <Container fluid className="content-section">
        {/* Filters Section */}
        <Card className="filters-card">
          <Card.Body>
            <Row className="align-items-center">
              <Col lg={4} md={6} className="mb-3 mb-lg-0">
                <InputGroup className="search-input">
                  <InputGroup.Text>
                    <FaSearch />
                  </InputGroup.Text>
                  <Form.Control
                    type="text"
                    placeholder="Search promotions..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="search-field"
                  />
                </InputGroup>
              </Col>
              <Col lg={2} md={3} className="mb-3 mb-lg-0">
                <Form.Select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </Form.Select>
              </Col>
              <Col lg={2} md={3} className="mb-3 mb-lg-0">
                <Form.Select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Types</option>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FIXED_AMOUNT">Fixed Amount</option>
                </Form.Select>
              </Col>
              <Col lg={4} md={12} className="text-lg-end">
                <div className="results-info">
                  Showing <strong>{currentItems.length}</strong> of <strong>{filteredPromotions.length}</strong> promotions
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        {/* Promotions Table */}
        <Card className="table-card">
          <Card.Body className="p-0">
            <div className="table-wrapper">
              <Table hover className="promotions-table">
                <thead>
                  <tr>
                    <th>Promotion</th>
                    <th>Type & Discount</th>
                    <th>Valid Period</th>
                    <th>Usage Stats</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {currentItems.map((promotion) => {
                    const usagePercentage = promotion.usageLimit 
                      ? (promotion.usedCount / promotion.usageLimit) * 100 
                      : 0;

                    return (
                      <tr key={promotion._id} className="promotion-row">
                        <td>
                          <div className="promotion-info">
                            <div className="promotion-header">
                              <Badge className="code-badge">{promotion.code}</Badge>
                              <h6 className="promotion-name">{promotion.name}</h6>
                            </div>
                            <p className="promotion-description">
                              {promotion.description.length > 60
                                ? `${promotion.description.substring(0, 60)}...`
                                : promotion.description}
                            </p>
                          </div>
                        </td>
                        <td>
                          <div className="discount-info">
                            <div className="discount-type">
                              {promotion.discountType === "PERCENTAGE" ? (
                                <FaPercentage className="discount-icon percentage" />
                              ) : (
                                <FaDollarSign className="discount-icon fixed" />
                              )}
                              <span className="discount-type-text">
                                {promotion.discountType === "PERCENTAGE" ? "Percentage" : "Fixed Amount"}
                              </span>
                            </div>
                            <div className="discount-value">
                              {promotion.discountType === "PERCENTAGE"
                                ? `${promotion.discountValue}%`
                                : formatCurrency(promotion.discountValue)}
                            </div>
                            {promotion.maxDiscountAmount && (
                              <div className="max-discount">
                                Max: {formatCurrency(promotion.maxDiscountAmount)}
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className="date-info">
                            <div className="date-range">
                              <FaCalendar className="date-icon" />
                              <span>{formatDate(promotion.startDate)}</span>
                            </div>
                            <div className="date-separator">to</div>
                            <div className="date-range">
                              <span>{formatDate(promotion.endDate)}</span>
                            </div>
                          </div>
                        </td>
                        <td>
                          <div className="usage-stats">
                            <div className="usage-numbers">
                              <span className="used-count">{promotion.usedCount.toLocaleString()}</span>
                              <span className="usage-limit">
                                {promotion.usageLimit ? `/${promotion.usageLimit.toLocaleString()}` : "/∞"}
                              </span>
                            </div>
                            {promotion.usageLimit && (
                              <div className="usage-progress-wrapper">
                                <div className="usage-progress">
                                  <div
                                    className="usage-bar"
                                    style={{
                                      width: `${Math.min(usagePercentage, 100)}%`,
                                      backgroundColor: getProgressColor(usagePercentage),
                                    }}
                                  />
                                </div>
                                <span className="usage-percentage">
                                  {Math.round(usagePercentage)}%
                                </span>
                              </div>
                            )}
                          </div>
                        </td>
                        <td>
                          {getStatusBadge(promotion)}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <Button
                              variant="outline-info"
                              size="sm"
                              onClick={() => handleView(promotion)}
                              className="action-btn view-btn"
                              title="View Details"
                            >
                              <FaEye />
                            </Button>
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleEdit(promotion)}
                              className="action-btn edit-btn"
                              title="Edit Promotion"
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant={promotion.isActive ? "outline-success" : "outline-secondary"}
                              size="sm"
                              onClick={() => handleToggleStatus(promotion._id, promotion.isActive)}
                              className="action-btn toggle-btn"
                              title={promotion.isActive ? "Activate" : "Deactivate"}
                            >
                              {promotion.isActive ? <FaToggleOn /> : <FaToggleOff />}
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(promotion._id)}
                              className="action-btn delete-btn"
                              title="Delete Promotion"
                            >
                              <FaTrash />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            {currentItems.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaGift />
                </div>
                <h4 className="empty-title">No promotions found</h4>
                <p className="empty-description">
                  {searchTerm || filterStatus !== "all" || filterType !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "Create your first promotion to get started"}
                </p>
                {!searchTerm && filterStatus === "all" && filterType === "all" && (
                  <Button variant="primary" onClick={handleAdd}>
                    <FaPlus className="me-2" />
                    Create First Promotion
                  </Button>
                )}
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
                className="pagination-nav"
              >
                Previous
              </Button>
              
              <div className="pagination-numbers">
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i + 1}
                    variant={currentPage === i + 1 ? "primary" : "outline-primary"}
                    onClick={() => setCurrentPage(i + 1)}
                    className="pagination-number"
                  >
                    {i + 1}
                  </Button>
                ))}
              </div>

              <Button
                variant="outline-primary"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="pagination-nav"
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Container>

      {/* Modals */}
      <DetailPromotionPage
        show={showModal}
        onHide={() => setShowModal(false)}
        promotion={selectedPromotion}
        onSave={handleSave}
        mode={modalType}
      />

      <DetailPromotionPage
        show={showDetailModal}
        onHide={() => setShowDetailModal(false)}
        promotion={selectedPromotion}
        mode="view"
      />

      {/* Delete Confirmation Modal */}
      <Modal
        show={deleteConfirm.show}
        onHide={() => setDeleteConfirm({ show: false, id: null })}
        centered
        className="delete-modal"
      >
        <Modal.Header closeButton className="delete-modal-header">
          <Modal.Title>
            <FaTrash className="me-2" />
            Delete Promotion
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="delete-modal-body">
          <div className="delete-confirmation">
            <div className="delete-icon">
              <FaTrash />
            </div>
            <h5>Are you sure?</h5>
            <p>This will permanently delete the promotion. This action cannot be undone.</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setDeleteConfirm({ show: false, id: null })}
          >
            Cancel
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Delete Promotion
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ListPromotionPage;