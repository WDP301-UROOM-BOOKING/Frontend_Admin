import { useState } from "react";
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
import ConfirmationModal from "components/ConfirmationModal";

export default function CustomerDetail({ show, handleClose }) {
  // State to control the avatar modal
  const [showAvatarModal, setShowAvatarModal] = useState(false);

  // Functions to handle modal open/close
  const handleOpenModal = () => setShowAvatarModal(true);
  const handleCloseModal = () => setShowAvatarModal(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showAcceptModal, setShowAcceptModal] = useState(false)
  const handleAccept = () => {
    console.log("Item accepted!")
  }
  const handleDelete = () => {
    console.log("Item deleted!")
  }
  return (
    <Modal show={show} onHide={handleClose} size="xl">
      <Container className="py-4">
        <div className="d-flex flex-column gap-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h2 className="text-secondary">View Customer Information</h2>
            <div className="d-flex gap-2">
              <Button
                variant="outline-danger"
                className="d-flex align-items-center gap-2"
                style={{ width: "100px" }}
                onClick={()=>{
                  setShowDeleteModal(true)
                  
                }}
              >
                <Lock size={16} />
                Lock
              </Button>
              {/* <Button
                variant="outline-success"
                className="d-flex align-items-center gap-2"
                style={{ width: "100px" }}
                onClick={()=>{
                  setShowAcceptModal(true)
                }}
              >
                <Unlock size={16} />
                Unlock
              </Button> */}
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
                        src="https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
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
                          value="Lê Kim Hoang Nguyên"
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
                            disabled
                          />
                          <Form.Check
                            inline
                            type="radio"
                            label="Female"
                            name="gender"
                            id="female"
                            value="female"
                            checked={true}
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
                        value="30/06/2025"
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
                      value="40312120945"
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
                      value="0934726073"
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
                      value="lkhnguyen3006@gmail.com"
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
                      value="650/7 Trần Cao Vân"
                      readOnly
                      className="bg-light"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </div>

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
              src="https://i.pinimg.com/736x/8f/1c/a2/8f1ca2029e2efceebd22fa05cca423d7.jpg"
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
      </Container>
      {/* Delete Confirmation Modal */}
      <ConfirmationModal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
        title="Confirm Lock Customer"
        message="Are you sure you want to lock this customer ?"
        confirmButtonText="Confirm"
        type="danger"
      />

      {/* Accept Confirmation Modal */}
      <ConfirmationModal
        show={showAcceptModal}
        onHide={() => setShowAcceptModal(false)}
        onConfirm={handleAccept}
        title="Confirm Unlock Customer"
        message="Are you sure you want to unlock this customer ?"
        confirmButtonText="Confirm"
        type="accept"
      />
    </Modal>
  );
}
