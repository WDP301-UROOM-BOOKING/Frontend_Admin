import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Modal,
  Table,
  Button,
  Form,
  InputGroup,
  Badge,
  Spinner,
  Alert,
  Row,
  Col,
  Card,
  Pagination,
  Dropdown,
  OverlayTrigger,
  Tooltip,
} from "react-bootstrap";
import {
  FaSearch,
  FaFilter,
  FaUser,
  FaCalendar,
  FaTrash,
  FaUndo,
  FaSort,
  FaSortUp,
  FaSortDown,
  FaEye,
  FaTimes,
} from "react-icons/fa";
import {
  getPromotionUsers,
  removeUserFromPromotion,
  resetUserPromotionUsage,
} from "../../redux/promotion/actions";

const PromotionUsersModal = ({ show, onHide, promotion }) => {
  const dispatch = useDispatch();
  const { promotionUsers, removingUser, resettingUsage } = useSelector(
    (state) => state.Promotion
  );

  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    sortBy: "claimedAt",
    sortOrder: "desc",
  });

  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [actionType, setActionType] = useState(""); // 'remove' or 'reset'

  useEffect(() => {
    if (show && promotion?._id) {
      loadPromotionUsers();
    }
  }, [show, promotion, filters]);

  const loadPromotionUsers = () => {
    const params = {
      page: promotionUsers.pagination.currentPage,
      limit: promotionUsers.pagination.limit,
      ...filters,
    };

    dispatch(
      getPromotionUsers({
        promotionId: promotion._id,
        params,
        onSuccess: (data) => {
          console.log("✅ Promotion users loaded:", data);
        },
        onFailed: (error) => {
          console.error("❌ Failed to load promotion users:", error);
        },
      })
    );
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleSort = (sortBy) => {
    const newSortOrder =
      filters.sortBy === sortBy && filters.sortOrder === "asc" ? "desc" : "asc";
    setFilters((prev) => ({
      ...prev,
      sortBy,
      sortOrder: newSortOrder,
    }));
  };

  const handlePageChange = (page) => {
    setFilters((prev) => ({
      ...prev,
      page,
    }));
  };

  const handleRemoveUser = (user) => {
    setSelectedUser(user);
    setActionType("remove");
    setShowConfirmModal(true);
  };

  const handleResetUsage = (user) => {
    setSelectedUser(user);
    setActionType("reset");
    setShowConfirmModal(true);
  };

  const confirmAction = () => {
    if (!selectedUser) return;

    if (actionType === "remove") {
      dispatch(
        removeUserFromPromotion({
          promotionId: promotion._id,
          userId: selectedUser.user._id,
          onSuccess: () => {
            setShowConfirmModal(false);
            setSelectedUser(null);
            loadPromotionUsers();
          },
          onFailed: (error) => {
            console.error("❌ Failed to remove user:", error);
          },
        })
      );
    } else if (actionType === "reset") {
      dispatch(
        resetUserPromotionUsage({
          promotionId: promotion._id,
          userId: selectedUser.user._id,
          onSuccess: () => {
            setShowConfirmModal(false);
            setSelectedUser(null);
            loadPromotionUsers();
          },
          onFailed: (error) => {
            console.error("❌ Failed to reset usage:", error);
          },
        })
      );
    }
  };



  const getStatusBadge = (user) => {
    switch (user.status) {
      case "not_claimed":
        return <Badge bg="secondary">Not Claimed</Badge>;
      case "claimed_not_used":
        return <Badge bg="info">Claimed</Badge>;
      case "active":
        return <Badge bg="success">Active</Badge>;
      case "used_up":
        return <Badge bg="warning">Used Up</Badge>;
      default:
        return <Badge bg="light">Unknown</Badge>;
    }
  };

  const getSortIcon = (column) => {
    if (filters.sortBy !== column) return <FaSort className="text-muted" />;
    return filters.sortOrder === "asc" ? <FaSortUp /> : <FaSortDown />;
  };

  const formatDate = (date) => {
    if (!date) return "N/A";
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Modal show={show} onHide={onHide} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>
            <FaUser className="me-2" />
            Users for Promotion: {promotion?.code}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Filters */}
          <Row className="mb-3">
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <FaSearch />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="Search by name, email, or phone..."
                  value={filters.search}
                  onChange={(e) => handleFilterChange("search", e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3}>
              <Form.Select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="claimed">Claimed</option>
                <option value="used">Used</option>
              </Form.Select>
            </Col>
            <Col md={3}>
              <Button
                variant="outline-secondary"
                onClick={() =>
                  setFilters({
                    search: "",
                    status: "all",
                    sortBy: "claimedAt",
                    sortOrder: "desc",
                  })
                }
                className="w-100"
                title="Reset filters"
              >
                <FaUndo className="me-1" />
                Reset
              </Button>
            </Col>
          </Row>

          {/* Users Table */}
          {promotionUsers.loading ? (
            <div className="text-center py-4">
              <Spinner animation="border" />
              <p className="mt-2">Loading users...</p>
            </div>
          ) : promotionUsers.error ? (
            <Alert variant="danger">{promotionUsers.error}</Alert>
          ) : (
            <>
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("user.name")}
                    >
                      User {getSortIcon("user.name")}
                    </th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("usedCount")}
                    >
                      Usage {getSortIcon("usedCount")}
                    </th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("claimedAt")}
                    >
                      Claimed At {getSortIcon("claimedAt")}
                    </th>
                    <th
                      style={{ cursor: "pointer" }}
                      onClick={() => handleSort("lastUsedAt")}
                    >
                      Last Used {getSortIcon("lastUsedAt")}
                    </th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {promotionUsers.data.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div>
                          <strong>{user.user.name}</strong>
                          <br />
                          <small className="text-muted">{user.user.email}</small>
                          {user.user.phone && (
                            <>
                              <br />
                              <small className="text-muted">
                                {user.user.phone}
                              </small>
                            </>
                          )}
                        </div>
                      </td>
                      <td>
                        <Badge bg="primary">
                          {user.usedCount} / {promotion?.maxUsagePerUser || 1}
                        </Badge>
                      </td>
                      <td>{formatDate(user.claimedAt)}</td>
                      <td>{formatDate(user.lastUsedAt)}</td>
                      <td>{getStatusBadge(user)}</td>
                      <td>
                        <div className="d-flex gap-1">
                          <OverlayTrigger
                            overlay={<Tooltip>Reset Usage</Tooltip>}
                          >
                            <Button
                              variant="outline-warning"
                              size="sm"
                              onClick={() => handleResetUsage(user)}
                              disabled={resettingUsage || user.usedCount === 0}
                            >
                              <FaUndo />
                            </Button>
                          </OverlayTrigger>
                          <OverlayTrigger
                            overlay={<Tooltip>Remove User</Tooltip>}
                          >
                            <Button
                              variant="outline-danger"
                              size="sm"
                              onClick={() => handleRemoveUser(user)}
                              disabled={removingUser}
                            >
                              <FaTrash />
                            </Button>
                          </OverlayTrigger>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* Pagination */}
              {promotionUsers.pagination.totalPages > 1 && (
                <div className="d-flex justify-content-center">
                  <Pagination>
                    <Pagination.Prev
                      disabled={!promotionUsers.pagination.hasPrevPage}
                      onClick={() =>
                        handlePageChange(
                          promotionUsers.pagination.currentPage - 1
                        )
                      }
                    />
                    {[...Array(promotionUsers.pagination.totalPages)].map(
                      (_, index) => (
                        <Pagination.Item
                          key={index + 1}
                          active={
                            index + 1 === promotionUsers.pagination.currentPage
                          }
                          onClick={() => handlePageChange(index + 1)}
                        >
                          {index + 1}
                        </Pagination.Item>
                      )
                    )}
                    <Pagination.Next
                      disabled={!promotionUsers.pagination.hasNextPage}
                      onClick={() =>
                        handlePageChange(
                          promotionUsers.pagination.currentPage + 1
                        )
                      }
                    />
                  </Pagination>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {actionType === "remove" ? "Remove User" : "Reset Usage"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {actionType === "remove" ? (
            <p>
              Are you sure you want to remove{" "}
              <strong>{selectedUser?.user?.name}</strong> from this promotion?
              This action cannot be undone.
            </p>
          ) : (
            <p>
              Are you sure you want to reset the usage count for{" "}
              <strong>{selectedUser?.user?.name}</strong>? This will set their
              usage count back to 0.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowConfirmModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant={actionType === "remove" ? "danger" : "warning"}
            onClick={confirmAction}
            disabled={removingUser || resettingUsage}
          >
            {removingUser || resettingUsage ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {actionType === "remove" ? "Removing..." : "Resetting..."}
              </>
            ) : actionType === "remove" ? (
              "Remove User"
            ) : (
              "Reset Usage"
            )}
          </Button>
        </Modal.Footer>
      </Modal>


    </>
  );
};

export default PromotionUsersModal;
