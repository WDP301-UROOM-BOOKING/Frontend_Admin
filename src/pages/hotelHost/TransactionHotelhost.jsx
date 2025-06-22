import { Col, Badge, Table, InputGroup, Form } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import React, { useState } from "react";
import Sidebar from "../SidebarAdmin";


const transactions = [
  {
    date: "10/03/2025",
    id: "TX-2025-0342",
    type: "Completed",
    amount: "$4000",
    typeClass: "success",
    hotelName: "Grand Plaza Hotel",
    address: "123 Main St, City A",
  },
  {
    date: "15/03/2025",
    id: "TX-2025-0356",
    type: "Completed",
    amount: "$200",
    typeClass: "success",
    hotelName: "Ocean View Resort",
    address: "456 Beach Road, City B",
  },
  {
    date: "17/03/2025",
    id: "TX-2025-0361",
    type: "Pending",
    amount: "1,500,000 VND",
    typeClass: "primary",
    hotelName: "Skyline Inn",
    address: "789 Mountain Ave, City C",
  },
];

export default function TransactionHotelhost() {
  const [filter, setFilter] = useState("");

  const filteredTransactions = transactions.filter(
    (tx) =>
      tx.hotelName.toLowerCase().includes(filter.toLowerCase()) ||
      tx.address.toLowerCase().includes(filter.toLowerCase()) ||
      tx.type.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="d-flex">
      <div className="col-md-2"></div>
      <Sidebar />
      <div className="col-md-10">
        <div className="main-content_1 p-3">
        <h2 style={{ color: "black" }}>Transaction History</h2>

        <Form className="mb-3">
          <Form.Control
            type="text"
            placeholder="Search by hotel name, address, or status"
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
          />
          {/* <Col className="d-flex flex-grow-1">
            <InputGroup
              className="border w-100"
              style={{ borderRadius: "10px" }}
            >
              <InputGroup.Text className="bg-transparent border-0">
                <FaCalendarAlt />
              </InputGroup.Text>
              <Form.Control type="date" className="border-0 bg-transparent" />
            </InputGroup>
          </Col> */}
        </Form>

        <Table striped bordered hover className="mt-3">
          <thead>
            <tr>
              <th>Date</th>
              <th>Transaction ID</th>
              <th>Hotel Name</th>
              <th>Address</th>
              <th>Type</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map((tx, index) => (
              <tr key={index}>
                <td>{tx.date}</td>
                <td>{tx.id}</td>
                <td>{tx.hotelName}</td>
                <td>{tx.address}</td>
                <td>
                  <Badge bg={tx.typeClass}>{tx.type}</Badge>
                </td>
                <td>{tx.amount}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
    </div>
  );
}
