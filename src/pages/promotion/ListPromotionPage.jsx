import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
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
  Pagination,
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
  FaSort,
  FaSortUp,
  FaSortDown,
  FaUsers,
} from "react-icons/fa";
import DetailPromotionPage from "./DetailPromotionPage";
import PromotionUsersModal from "./PromotionUsersModal";
import {
  fetchAllPromotions,
  createPromotion,
  updatePromotion,
  deletePromotion,
  togglePromotionStatus,
  clearPromotionError,
  setPromotionFilters,
  setPromotionPagination,
  resetPromotionFilters,
} from "../../redux/promotion/actions";
import "./promotion.css";

const ListPromotionPage = () => {
  const dispatch = useDispatch();

  // Redux state
  const {
    promotions,
    loading,
    creating,
    updating,
    deleting,
    error,
    pagination,
    filters,
    stats
  } = useSelector((state) => state.Promotion);

  // Local state
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedPromotion, setSelectedPromotion] = useState(null);
  const [modalType, setModalType] = useState("add");
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, id: null });
  const [alert, setAlert] = useState({ show: false, type: "", message: "" });

  // New modals for promotion user management
  const [showUsersModal, setShowUsersModal] = useState(false);
  const [selectedPromotionForUsers, setSelectedPromotionForUsers] = useState(null);

  const fetchPromotions = useCallback(() => {
    const params = {
      page: pagination.currentPage,
      limit: pagination.limit,
      search: filters.search,
      status: filters.status,
      sortBy: filters.sortBy,
      sortOrder: filters.sortOrder
    };

    dispatch(fetchAllPromotions({
      params,
      onSuccess: (data) => {
        console.log("✅ Promotions fetched successfully:", data);
      },
      onFailed: (error) => {
        console.error("❌ Failed to fetch promotions:", error);
      },
      onError: (error) => {
        console.error("❌ Server error:", error);
      }
    }));
  }, [dispatch, pagination.currentPage, pagination.limit, filters.search, filters.status, filters.sortBy, filters.sortOrder]);

  useEffect(() => {
    fetchPromotions();
  }, [fetchPromotions]);

  useEffect(() => {
    if (error) {
      setAlert({
        show: true,
        type: "danger",
        message: error
      });
      // Clear error after showing
      setTimeout(() => {
        dispatch(clearPromotionError());
        setAlert({ show: false, type: "", message: "" });
      }, 5000);
    }
  }, [error, dispatch]);

  // Filter and pagination handlers
  const handleSearchChange = (value) => {
    dispatch(setPromotionFilters({ search: value }));
    dispatch(setPromotionPagination({ currentPage: 1 }));
  };

  const handleStatusFilter = (status) => {
    dispatch(setPromotionFilters({ status }));
    dispatch(setPromotionPagination({ currentPage: 1 }));
  };

  const handleSort = (sortBy) => {
    const newSortOrder = filters.sortBy === sortBy && filters.sortOrder === 'asc' ? 'desc' : 'asc';
    dispatch(setPromotionFilters({ sortBy, sortOrder: newSortOrder }));
  };

  const handlePageChange = (page) => {
    dispatch(setPromotionPagination({ currentPage: page }));
  };

  const resetFilters = () => {
    dispatch(resetPromotionFilters());
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

  const confirmDelete = () => {
    dispatch(deletePromotion({
      id: deleteConfirm.id,
      onSuccess: () => {
        setAlert({
          show: true,
          type: "success",
          message: "Promotion deleted successfully!"
        });
        setDeleteConfirm({ show: false, id: null });
        setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
      },
      onFailed: (error) => {
        setAlert({
          show: true,
          type: "danger",
          message: error
        });
        setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
      },
      onError: (error) => {
        setAlert({
          show: true,
          type: "danger",
          message: "Server error occurred while deleting promotion"
        });
        setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
      }
    }));
  };

  const handleToggleStatus = (id, currentStatus) => {
    dispatch(togglePromotionStatus({
      id,
      status: !currentStatus,
      onSuccess: () => {
        setAlert({
          show: true,
          type: "success",
          message: `Promotion ${!currentStatus ? 'activated' : 'deactivated'} successfully!`
        });
        setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
      },
      onFailed: (error) => {
        setAlert({
          show: true,
          type: "danger",
          message: error
        });
        setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
      },
      onError: (error) => {
        setAlert({
          show: true,
          type: "danger",
          message: "Server error occurred while updating promotion status"
        });
        setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
      }
    }));
  };

  const handleSave = (promotionData) => {
    if (modalType === "add") {
      dispatch(createPromotion({
        data: promotionData,
        onSuccess: () => {
          setAlert({
            show: true,
            type: "success",
            message: "Promotion created successfully!"
          });
          setShowModal(false);
          setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
        },
        onFailed: (error) => {
          setAlert({
            show: true,
            type: "danger",
            message: error
          });
          setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
        },
        onError: (error) => {
          setAlert({
            show: true,
            type: "danger",
            message: "Server error occurred while creating promotion"
          });
          setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
        }
      }));
    } else {
      dispatch(updatePromotion({
        id: selectedPromotion._id,
        data: promotionData,
        onSuccess: () => {
          setAlert({
            show: true,
            type: "success",
            message: "Promotion updated successfully!"
          });
          setShowModal(false);
          setTimeout(() => setAlert({ show: false, type: "", message: "" }), 3000);
        },
        onFailed: (error) => {
          setAlert({
            show: true,
            type: "danger",
            message: error
          });
          setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
        },
        onError: (error) => {
          setAlert({
            show: true,
            type: "danger",
            message: "Server error occurred while updating promotion"
          });
          setTimeout(() => setAlert({ show: false, type: "", message: "" }), 5000);
        }
      }));
    }
  };

  // New handlers for promotion user management
  const handleViewUsers = (promotion) => {
    setSelectedPromotionForUsers(promotion);
    setShowUsersModal(true);
  };

  // Utility functions

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

    // If promotion is manually set to inactive
    if (!promotion.isActive) {
      return (
        <Badge bg="danger" className="status-badge status-inactive">
          ⚫ Inactive
        </Badge>
      );
    }

    // If promotion has expired
    if (now > endDate) {
      return (
        <Badge bg="secondary" className="status-badge status-expired">
          ⏰ Expired
        </Badge>
      );
    }

    // If promotion hasn't started yet
    if (now < startDate) {
      return (
        <Badge bg="warning" className="status-badge status-upcoming">
          ⏳ Coming Soon
        </Badge>
      );
    }

    // If promotion is currently active
    return (
      <Badge bg="success" className="status-badge status-active">
        ✅ Active
      </Badge>
    );
  };

  const getProgressColor = (percentage) => {
    if (percentage < 50) return "#28a745"; // Green
    if (percentage < 80) return "#ffc107"; // Yellow
    return "#dc3545"; // Red
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
      {/* Alert */}
      {alert.show && (
        <Alert
          variant={alert.type}
          dismissible
          onClose={() => setAlert({ show: false, type: "", message: "" })}
          className="mx-3 mt-3"
        >
          {alert.message}
        </Alert>
      )}

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
                disabled={creating}
              >
                {creating ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <FaPlus className="me-2" />
                    Create Promotion
                  </>
                )}
              </Button>
            </Col>
          </Row>

          {/* Statistics Cards */}
          <Row className="stats-row">
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="stat-card stat-card-total">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <FaTags />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-number">{stats.total}</h3>
                      <p className="stat-label">Total</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={4} sm={6} className="mb-3">
              <Card className="stat-card stat-card-active">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <FaChartLine />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-number">{stats.active}</h3>
                      <p className="stat-label">Active</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={4} sm={6} className="mb-3">
              <Card className="stat-card stat-card-upcoming">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <FaCalendar />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-number">{(stats.comingSoon || 0) + (stats.upcoming || 0)}</h3>
                      <p className="stat-label">Upcoming</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6} className="mb-3">
              <Card className="stat-card stat-card-inactive">
                <Card.Body>
                  <div className="stat-content">
                    <div className="stat-icon">
                      <FaToggleOff />
                    </div>
                    <div className="stat-info">
                      <h3 className="stat-number">{stats.inactive}</h3>
                      <p className="stat-label">Inactive</p>
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={2} md={4} sm={6} className="mb-3">
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
                    value={filters.search}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="search-field"
                  />
                </InputGroup>
              </Col>
              <Col lg={2} md={3} className="mb-3 mb-lg-0">
                <Form.Select
                  value={filters.status}
                  onChange={(e) => handleStatusFilter(e.target.value)}
                  className="filter-select"
                >
                  <option value="all">All Status</option>
                  <option value="active">✅ Active</option>
                  <option value="upcoming">⏳ Coming Soon</option>
                  <option value="inactive">⚫ Inactive</option>
                  <option value="expired">⏰ Expired</option>
                </Form.Select>
              </Col>
              <Col lg={2} md={3} className="mb-3 mb-lg-0">
                <Form.Select
                  value={`${filters.sortBy}-${filters.sortOrder}`}
                  onChange={(e) => {
                    const [sortBy, sortOrder] = e.target.value.split('-');
                    dispatch(setPromotionFilters({ sortBy, sortOrder }));
                  }}
                  className="filter-select"
                >
                  <option value="status-asc">📊 Status (Active First)</option>
                  <option value="createdAt-desc">🕒 Newest First</option>
                  <option value="createdAt-asc">🕒 Oldest First</option>
                  <option value="name-asc">📝 Name A-Z</option>
                  <option value="name-desc">📝 Name Z-A</option>
                  <option value="usedCount-desc">📈 Most Used</option>
                  <option value="usedCount-asc">📉 Least Used</option>
                </Form.Select>
              </Col>
              <Col lg={4} md={6} className="text-lg-end">
                <div className="results-info">
                  Showing <strong>{promotions.length}</strong> of <strong>{pagination.totalPromotions}</strong> promotions
                  {filters.search && (
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      className="ms-2"
                      onClick={resetFilters}
                    >
                      Clear Filters
                    </Button>
                  )}
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
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('name')}
                    >
                      Promotion
                      {filters.sortBy === 'name' && (
                        filters.sortOrder === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />
                      )}
                      {filters.sortBy !== 'name' && <FaSort className="ms-1 text-muted" />}
                    </th>
                    <th>Type & Visibility</th>
                    <th>Discount</th>
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('startDate')}
                    >
                      Valid Period
                      {filters.sortBy === 'startDate' && (
                        filters.sortOrder === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />
                      )}
                      {filters.sortBy !== 'startDate' && <FaSort className="ms-1 text-muted" />}
                    </th>
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('usedCount')}
                    >
                      Usage Stats
                      {filters.sortBy === 'usedCount' && (
                        filters.sortOrder === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />
                      )}
                      {filters.sortBy !== 'usedCount' && <FaSort className="ms-1 text-muted" />}
                    </th>
                    <th
                      style={{ cursor: 'pointer' }}
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {filters.sortBy === 'status' && (
                        filters.sortOrder === 'asc' ? <FaSortUp className="ms-1" /> : <FaSortDown className="ms-1" />
                      )}
                      {filters.sortBy !== 'status' && <FaSort className="ms-1 text-muted" />}
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promotions.map((promotion) => {
                    const usagePercentage = promotion.usageLimit
                      ? (promotion.usedCount / promotion.usageLimit) * 100
                      : 0;

                    // Determine status class for row styling
                    const now = new Date();
                    const startDate = new Date(promotion.startDate);
                    const endDate = new Date(promotion.endDate);

                    let statusClass = '';
                    if (!promotion.isActive) {
                      statusClass = 'status-inactive';
                    } else if (now > endDate) {
                      statusClass = 'status-expired';
                    } else if (now < startDate) {
                      statusClass = 'status-upcoming';
                    } else {
                      statusClass = 'status-active';
                    }

                    return (
                      <tr key={promotion._id} className={`promotion-row ${statusClass}`}>
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
                          <div className="type-visibility-info">
                            <div className="promotion-type">
                              <Badge
                                bg={promotion.type === 'PUBLIC' ? 'primary' : 'warning'}
                                className="type-badge"
                              >
                                {promotion.type === 'PUBLIC' ? (
                                  <>🌍 PUBLIC</>
                                ) : (
                                  <>🔒 PRIVATE</>
                                )}
                              </Badge>
                            </div>
                            <div className="visibility-description">
                              {promotion.type === 'PUBLIC'
                                ? 'Visible to all users'
                                : 'Code-only access'}
                            </div>
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
                              disabled={updating}
                            >
                              <FaEdit />
                            </Button>
                            <Button
                              variant={promotion.isActive ? "outline-success" : "outline-secondary"}
                              size="sm"
                              onClick={() => handleToggleStatus(promotion._id, promotion.isActive)}
                              className="action-btn toggle-btn"
                              title={promotion.isActive ? "Deactivate" : "Activate"}
                              disabled={updating}
                            >
                              {updating ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                promotion.isActive ? <FaToggleOn /> : <FaToggleOff />
                              )}
                            </Button>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              onClick={() => handleViewUsers(promotion)}
                              className="action-btn users-btn"
                              title="Manage Users"
                            >
                              <FaUsers />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleDelete(promotion._id)}
                              className="action-btn delete-btn"
                              title="Delete Promotion"
                              disabled={deleting}
                            >
                              {deleting ? (
                                <Spinner animation="border" size="sm" />
                              ) : (
                                <FaTrash />
                              )}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </Table>
            </div>

            {promotions.length === 0 && !loading && (
              <div className="empty-state">
                <div className="empty-icon">
                  <FaGift />
                </div>
                <h4 className="empty-title">No promotions found</h4>
                <p className="empty-description">
                  {filters.search || filters.status !== "all"
                    ? "Try adjusting your search criteria or filters"
                    : "Create your first promotion to get started"}
                </p>
                {!filters.search && filters.status === "all" && (
                  <Button variant="primary" onClick={handleAdd}>
                    <FaPlus className="me-2" />
                    Create First Promotion
                  </Button>
                )}
              </div>
            )}

            {loading && (
              <div className="loading-state text-center py-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Loading promotions...</p>
              </div>
            )}
          </Card.Body>
        </Card>

        {/* Pagination */}
        {pagination.totalPromotions > 0 && (
          <div className="pagination-wrapper">
            <Row className="align-items-center">
              <Col md={12}>
                <Pagination className="justify-content-center mb-0">
                  <Pagination.First
                    disabled={!pagination.hasPrevPage || pagination.totalPages <= 1}
                    onClick={() => handlePageChange(1)}
                  />
                  <Pagination.Prev
                    disabled={!pagination.hasPrevPage || pagination.totalPages <= 1}
                    onClick={() => handlePageChange(pagination.currentPage - 1)}
                  />

                  {/* Page numbers */}
                  {Array.from({ length: Math.min(5, pagination.totalPages) }, (_, i) => {
                    let pageNum;
                    if (pagination.totalPages <= 5) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage <= 3) {
                      pageNum = i + 1;
                    } else if (pagination.currentPage >= pagination.totalPages - 2) {
                      pageNum = pagination.totalPages - 4 + i;
                    } else {
                      pageNum = pagination.currentPage - 2 + i;
                    }

                    return (
                      <Pagination.Item
                        key={pageNum}
                        active={pageNum === pagination.currentPage}
                        onClick={() => handlePageChange(pageNum)}
                        disabled={pagination.totalPages <= 1}
                      >
                        {pageNum}
                      </Pagination.Item>
                    );
                  })}

                  <Pagination.Next
                    disabled={!pagination.hasNextPage || pagination.totalPages <= 1}
                    onClick={() => handlePageChange(pagination.currentPage + 1)}
                  />
                  <Pagination.Last
                    disabled={!pagination.hasNextPage || pagination.totalPages <= 1}
                    onClick={() => handlePageChange(pagination.totalPages)}
                  />
                </Pagination>
              </Col>
            </Row>
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

      {/* Promotion Users Modal */}
      <PromotionUsersModal
        show={showUsersModal}
        onHide={() => setShowUsersModal(false)}
        promotion={selectedPromotionForUsers}
      />
    </div>
  );
};

export default ListPromotionPage;