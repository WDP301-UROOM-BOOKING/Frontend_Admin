import { useState } from "react"
import { Container, Table, Form, Row, Col, Pagination, InputGroup, Button, Modal } from "react-bootstrap"
import "bootstrap/dist/css/bootstrap.min.css"

function DetailReportedAdmin({ show, handleClose }) {
  const [entriesPerPage, setEntriesPerPage] = useState("10")
  const [searchTerm, setSearchTerm] = useState("")

  return (
    <Modal show={show} onHide={handleClose} size="xl">
    <Container className="p-4">
      <h2 className="text-secondary mb-4">Detail Report</h2>

      {/* Table Controls */}
      <Row className="mb-3 align-items-center">
        <Col xs={12} md={6} className="mb-3 mb-md-0">
          <div className="d-flex align-items-center">
            <span className="me-2">Show</span>
            <Form.Select
              style={{ width: "80px" }}
              value={entriesPerPage}
              onChange={(e) => setEntriesPerPage(e.target.value)}
              className="me-2"
            >
              <option value="10">10</option>
              <option value="25">25</option>
              <option value="50">50</option>
              <option value="100">100</option>
            </Form.Select>
            <span>entries</span>
          </div>
        </Col>
        <Col xs={12} md={6}>
          <InputGroup>
            <InputGroup.Text className="bg-white">Search:</InputGroup.Text>
            <Form.Control
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Id Feedback"
            />
          </InputGroup>
        </Col>
      </Row>

      <div className="d-flex justify-content-end mb-3">
        <Button variant="outline-danger" style={{width: '80px', marginRight: '10px'}}>Delete</Button>
        <Button variant="outline-warning" style={{width: '80px', marginRight: '10px'}}>Cancel</Button>
      </div>
      <Table bordered hover className="bg-white">
        <thead>
          <tr>
            <th className="text-center" style={{width: '80px'}}>ID </th>
            <th style={{width: '250px'}}>Name Account</th>
            <th>Reason</th>
            <th>Description</th>
            <th style={{width: '180px'}}>Date Report</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td className="text-center">1</td>
            <td>Lê Kim Hoàng Nguyên</td>
            <td>The hotel offers great service, clean room</td>
            <td>Thank you for bringing this to our attention. We take all feedback seriously and are working on improving this issue. Please let us know how we can make things right for you.</td>
            <td>12:03:12 20/10/2003</td>
          </tr>
          <tr>
            <td className="text-center">2</td>
            <td>Trương Thị Thiện Duyên</td>
            <td>The hotel relaxing atmosphere</td>
            <td>We apologize for any inconvenience caused. Your feedback helps us grow, and we will make sure to take necessary steps to improve. We truly value your input!</td>
            <td>12:03:12 05/02/2003</td>
          </tr>
          <tr>
            <td className="text-center">3</td>
            <td>Nguyễn Văn Duy An</td>
            <td>The hotel breakfast options could improve.</td>
            <td>We sincerely appreciate your feedback and are sorry to hear that your experience did not meet expectations. We always strive to improve and would love to understand more about your concerns.</td>
            <td>12:03:12 30/06/2003</td>
          </tr>
        </tbody>
      </Table>

      {/* Table Footer */}
      <Row className="align-items-center  mt-3">
        <Col>
          <p className="mb-0">Showing 0 to 0 of 0 entries</p>
        </Col>
        <Col className="d-flex justify-content-end">
          <Pagination className="mb-0">
            <Pagination.Item disabled >Previous</Pagination.Item>
            <Pagination.Item disabled>Next</Pagination.Item>
          </Pagination>
        </Col>
      </Row>
    </Container>
    </Modal>
  )
}

export default DetailReportedAdmin

