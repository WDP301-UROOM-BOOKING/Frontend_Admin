import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Button,
  Row,
  Col,
  Alert,
  Badge,
  Card,
  InputGroup,
} from "react-bootstrap";
import {
  FaPercentage,
  FaDollarSign,
  FaCalendar,
  FaSave,
  FaTimes,
  FaInfoCircle,
} from "react-icons/fa";

const DetailPromotionPage = ({ show, onHide, promotion, onSave, mode = "view" }) => {
  const [formData, setFormData] = useState({
    code: "",
    name: "",
    description: "",
    discountType: "PERCENTAGE",
    discountValue: "",
    maxDiscountAmount: "",
    minOrderAmount: "",
    startDate: "",
    endDate: "",
    usageLimit: "",
    isActive: true,
  });

  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (promotion && (mode === "edit" || mode === "view")) {
      setFormData({
        code: promotion.code || "",
        name: promotion.name || "",
        description: promotion.description || "",
        discountType: promotion.discountType || "PERCENTAGE",
        discountValue: promotion.discountValue || "",
        maxDiscountAmount: promotion.maxDiscountAmount || "",
        minOrderAmount: promotion.minOrderAmount || "",
        startDate: promotion.startDate ? promotion.startDate.split('T')[0] : "",
        endDate: promotion.endDate ? promotion.endDate.split('T')[0] : "",
        usageLimit: promotion.usageLimit || "",
        isActive: promotion.isActive !== undefined ? promotion.isActive : true,
      });
    } else if (mode === "add") {
      setFormData({
        code: "",
        name: "",
        description: "",
        discountType: "PERCENTAGE",
        discountValue: "",
        maxDiscountAmount: "",
        minOrderAmount: "",
        startDate: "",
        endDate: "",
        usageLimit: "",
        isActive: true,
      });
    }
    setErrors({});
  }, [promotion, mode, show]);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    // Required fields
    if (!formData.code.trim()) {
      newErrors.code = "Promotion code is required";
    } else if (formData.code.length < 3) {
      newErrors.code = "Code must be at least 3 characters";
    }

    if (!formData.name.trim()) {
      newErrors.name = "Promotion name is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    }

    if (!formData.discountValue || formData.discountValue <= 0) {
      newErrors.discountValue = "Discount value must be greater than 0";
    }

    if (formData.discountType === "PERCENTAGE" && formData.discountValue > 100) {
      newErrors.discountValue = "Percentage cannot exceed 100%";
    }

    if (!formData.startDate) {
      newErrors.startDate = "Start date is required";
    }

    if (!formData.endDate) {
      newErrors.endDate = "End date is required";
    }

    if (formData.startDate && formData.endDate && 
        new Date(formData.startDate) >= new Date(formData.endDate)) {
      newErrors.endDate = "End date must be after start date";
    }

    if (formData.usageLimit && formData.usageLimit <= 0) {
      newErrors.usageLimit = "Usage limit must be greater than 0";
    }

    if (formData.maxDiscountAmount && formData.maxDiscountAmount <= 0) {
      newErrors.maxDiscountAmount = "Max discount amount must be greater than 0";
    }

    if (formData.minOrderAmount && formData.minOrderAmount < 0) {
      newErrors.minOrderAmount = "Minimum order amount cannot be negative";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const submitData = {
        ...formData,
        discountValue: parseFloat(formData.discountValue),
        maxDiscountAmount: formData.maxDiscountAmount ? parseFloat(formData.maxDiscountAmount) : null,
        minOrderAmount: formData.minOrderAmount ? parseFloat(formData.minOrderAmount) : 0,
        usageLimit: formData.usageLimit ? parseInt(formData.usageLimit) : null,
      };

      await onSave(submitData);
      onHide();
    } catch (error) {
      console.error("Error saving promotion:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getModalTitle = () => {
    switch (mode) {
      case "add":
        return "Add New Promotion";
      case "edit":
        return "Edit Promotion";
      case "view":
        return "Promotion Details";
      default:
        return "Promotion";
    }
  };

  const isReadOnly = mode === "view";

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>
          <FaPercentage className="me-2" />
          {getModalTitle()}
        </Modal.Title>
      </Modal.Header>

      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          {mode === "view" && promotion && (
            <Alert variant="info" className="mb-4">
              <FaInfoCircle className="me-2" />
              <strong>Usage Statistics:</strong> {promotion.usedCount} times used
              {promotion.usageLimit && ` out of ${promotion.usageLimit} limit`}
            </Alert>
          )}

          <Row>
            {/* Basic Information */}
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Basic Information</h6>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Promotion Code *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.code}
                      onChange={(e) => handleInputChange("code", e.target.value.toUpperCase())}
                      isInvalid={!!errors.code}
                      disabled={isReadOnly}
                      placeholder="e.g., SUMMER2024"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.code}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Promotion Name *</Form.Label>
                    <Form.Control
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      isInvalid={!!errors.name}
                      disabled={isReadOnly}
                      placeholder="Enter promotion name"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.name}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Description *</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      isInvalid={!!errors.description}
                      disabled={isReadOnly}
                      placeholder="Describe the promotion..."
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.description}
                    </Form.Control.Feedback>
                  </Form.Group>

                  {!isReadOnly && (
                    <Form.Group className="mb-0">
                      <Form.Check
                        type="checkbox"
                        id="isActive"
                        label="Active"
                        checked={formData.isActive}
                        onChange={(e) => handleInputChange("isActive", e.target.checked)}
                      />
                    </Form.Group>
                  )}

                  {isReadOnly && (
                    <div>
                      <strong>Status: </strong>
                      <Badge bg={formData.isActive ? "success" : "danger"}>
                        {formData.isActive ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                  )}
                </Card.Body>
              </Card>
            </Col>

            {/* Discount Configuration */}
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Discount Configuration</h6>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Discount Type *</Form.Label>
                    <Form.Select
                      value={formData.discountType}
                      onChange={(e) => handleInputChange("discountType", e.target.value)}
                      disabled={isReadOnly}
                    >
                      <option value="PERCENTAGE">Percentage (%)</option>
                      <option value="FIXED_AMOUNT">Fixed Amount ($)</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Discount Value *</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        {formData.discountType === "PERCENTAGE" ? (
                          <FaPercentage />
                        ) : (
                          <FaDollarSign />
                        )}
                      </InputGroup.Text>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        max={formData.discountType === "PERCENTAGE" ? "100" : undefined}
                        value={formData.discountValue}
                        onChange={(e) => handleInputChange("discountValue", e.target.value)}
                        isInvalid={!!errors.discountValue}
                        disabled={isReadOnly}
                        placeholder={formData.discountType === "PERCENTAGE" ? "0-100" : "0.00"}
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.discountValue}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  {formData.discountType === "PERCENTAGE" && (
                    <Form.Group className="mb-3">
                      <Form.Label>Max Discount Amount</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FaDollarSign />
                        </InputGroup.Text>
                        <Form.Control
                          type="number"
                          step="0.01"
                          min="0"
                          value={formData.maxDiscountAmount}
                          onChange={(e) => handleInputChange("maxDiscountAmount", e.target.value)}
                          isInvalid={!!errors.maxDiscountAmount}
                          disabled={isReadOnly}
                          placeholder="Optional maximum cap"
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.maxDiscountAmount}
                        </Form.Control.Feedback>
                      </InputGroup>
                      <Form.Text className="text-muted">
                        Maximum discount amount (leave empty for no limit)
                      </Form.Text>
                    </Form.Group>
                  )}

                  <Form.Group className="mb-0">
                    <Form.Label>Minimum Order Amount</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FaDollarSign />
                      </InputGroup.Text>
                      <Form.Control
                        type="number"
                        step="0.01"
                        min="0"
                        value={formData.minOrderAmount}
                        onChange={(e) => handleInputChange("minOrderAmount", e.target.value)}
                        isInvalid={!!errors.minOrderAmount}
                        disabled={isReadOnly}
                        placeholder="0.00"
                      />
                      <Form.Control.Feedback type="invalid">
                        {errors.minOrderAmount}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            {/* Date Range */}
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <FaCalendar className="me-2" />
                    Valid Period
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-3">
                    <Form.Label>Start Date *</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.startDate}
                      onChange={(e) => handleInputChange("startDate", e.target.value)}
                      isInvalid={!!errors.startDate}
                      disabled={isReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.startDate}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group className="mb-0">
                    <Form.Label>End Date *</Form.Label>
                    <Form.Control
                      type="date"
                      value={formData.endDate}
                      onChange={(e) => handleInputChange("endDate", e.target.value)}
                      isInvalid={!!errors.endDate}
                      disabled={isReadOnly}
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.endDate}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>

            {/* Usage Limits */}
            <Col md={6}>
              <Card className="mb-3">
                <Card.Header>
                  <h6 className="mb-0">Usage Limits</h6>
                </Card.Header>
                <Card.Body>
                  <Form.Group className="mb-0">
                    <Form.Label>Usage Limit</Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      value={formData.usageLimit}
                      onChange={(e) => handleInputChange("usageLimit", e.target.value)}
                      isInvalid={!!errors.usageLimit}
                      disabled={isReadOnly}
                      placeholder="Leave empty for unlimited"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.usageLimit}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      Maximum number of times this promotion can be used
                    </Form.Text>
                  </Form.Group>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Preview (for view mode) */}
          {isReadOnly && formData.code && (
            <Card className="border-info">
              <Card.Header className="bg-info text-white">
                <h6 className="mb-0">Promotion Preview</h6>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <p><strong>Code:</strong> <Badge bg="primary">{formData.code}</Badge></p>
                    <p><strong>Discount:</strong> {
                      formData.discountType === "PERCENTAGE" 
                        ? `${formData.discountValue}%` 
                        : formatCurrency(formData.discountValue)
                    }</p>
                    {formData.maxDiscountAmount && (
                      <p><strong>Max Discount:</strong> {formatCurrency(formData.maxDiscountAmount)}</p>
                    )}
                  </Col>
                  <Col md={6}>
                    <p><strong>Valid:</strong> {formatDate(formData.startDate)} - {formatDate(formData.endDate)}</p>
                    {formData.minOrderAmount > 0 && (
                      <p><strong>Min Order:</strong> {formatCurrency(formData.minOrderAmount)}</p>
                    )}
                    <p><strong>Usage Limit:</strong> {formData.usageLimit || "Unlimited"}</p>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          )}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={onHide}>
            <FaTimes className="me-2" />
            {isReadOnly ? "Close" : "Cancel"}
          </Button>
          {!isReadOnly && (
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
            >
              <FaSave className="me-2" />
              {loading ? "Saving..." : (mode === "add" ? "Create Promotion" : "Update Promotion")}
            </Button>
          )}
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default DetailPromotionPage;