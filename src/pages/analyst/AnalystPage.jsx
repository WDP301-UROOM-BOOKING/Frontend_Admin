import React, { useState } from "react";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Container, Row, Col, Card, Form, Badge } from "react-bootstrap";
import { format } from "date-fns";
import {
  loginData,
  citySearchData,
  hotelVisitsData,
  getDailyStats,
} from "@utils/mockData";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const AnalystPage = () => {
  const [viewMode, setViewMode] = useState("month");
  const [selectedDate, setSelectedDate] = useState(
    format(new Date(), "yyyy-MM-dd")
  );
  const [selectedMonth, setSelectedMonth] = useState(format(new Date(), "MM"));
  const [selectedYear, setSelectedYear] = useState(format(new Date(), "yyyy"));

  // Get daily stats once and memoize it
  const dailyStats = getDailyStats(loginData);

  // Tính toán thống kê
  const getTotalStats = (data) => {
    if (viewMode === "month") {
      // Khi xem theo tháng
      const monthYearStr = `${selectedYear}-${selectedMonth}`;
      return {
        today: data
          .filter(
            (item) =>
              format(new Date(item.date), "yyyy-MM-dd") ===
              format(new Date(), "yyyy-MM-dd")
          )
          .reduce((sum, item) => sum + item.logins, 0),
        selected: data
          .filter((item) => item.date.startsWith(monthYearStr))
          .reduce((sum, item) => sum + item.logins, 0),
        year: data
          .filter(
            (item) => format(new Date(item.date), "yyyy") === selectedYear
          )
          .reduce((sum, item) => sum + item.logins, 0),
      };
    } else {
      // Khi xem theo ngày
      return {
        today: data
          .filter(
            (item) =>
              format(new Date(item.date), "yyyy-MM-dd") ===
              format(new Date(), "yyyy-MM-dd")
          )
          .reduce((sum, item) => sum + item.logins, 0),
        selected: data
          .filter(
            (item) => format(new Date(item.date), "yyyy-MM-dd") === selectedDate
          )
          .reduce((sum, item) => sum + item.logins, 0),
        year: data
          .filter(
            (item) => format(new Date(item.date), "yyyy") === selectedYear
          )
          .reduce((sum, item) => sum + item.logins, 0),
      };
    }
  };

  const getChartData = () => {
    if (viewMode === "month") {
      // Lọc dữ liệu theo tháng và năm được chọn
      const filteredData = dailyStats.filter((stat) => {
        const statDate = new Date(stat.date);
        const statMonth = format(statDate, "MM");
        const statYear = format(statDate, "yyyy");
        return statMonth === selectedMonth && statYear === selectedYear;
      });

      // Trả về null nếu không có dữ liệu
      if (filteredData.length === 0) {
        return null;
      }

      return filteredData.map((stat) => ({
        date: stat.date,
        totalLogins: stat.totalLogins,
      }));
    } else {
      const dayData = dailyStats.find((stat) => stat.date === selectedDate);
      if (!dayData) return [];

      return [
        { time: "Night 0-6h", logins: dayData.night },
        { time: "Sáng 6-12h", logins: dayData.morning },
        { time: "Chiều 12-18h", logins: dayData.afternoon },
        { time: "Tối 18-0h", logins: dayData.evening },
      ];
    }
  };

  const stats = getTotalStats(loginData);
  const chartData = getChartData();

  return (
    <Container fluid className="py-4">
      <div className="mb-4">
        <h1 className="h3 mb-3">Dashboard Phân Tích</h1>

        <Row className="g-3 align-items-center">
          <Col xs="auto">
            <Form.Group>
              <Form.Select
                value={viewMode}
                onChange={(e) => setViewMode(e.target.value)}
                style={{ minWidth: "200px" }}
              >
                <option value="month">Xem theo tháng</option>
                <option value="day">Xem theo ngày</option>
              </Form.Select>
            </Form.Group>
          </Col>

          {viewMode === "month" && (
            <>
              <Col xs="auto">
                <Form.Group>
                  <Form.Select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{ minWidth: "150px" }}
                  >
                    {Array.from({ length: 12 }, (_, i) => i + 1).map(
                      (month) => (
                        <option
                          key={month}
                          value={month.toString().padStart(2, "0")}
                        >
                          Tháng {month}
                        </option>
                      )
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col xs="auto">
                <Form.Group>
                  <Form.Select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{ minWidth: "150px" }}
                  >
                    {Array.from({ length: 5 }, (_, i) => 2025 - i).map(
                      (year) => (
                        <option key={year} value={year}>
                          Năm {year}
                        </option>
                      )
                    )}
                  </Form.Select>
                </Form.Group>
              </Col>
            </>
          )}

          {viewMode === "day" && (
            <Col xs="auto">
              <Form.Group>
                <Form.Select
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  style={{ minWidth: "200px" }}
                >
                  {dailyStats.map((stat) => (
                    <option key={stat.date} value={stat.date}>
                      {format(new Date(stat.date), "dd/MM/yyyy")}
                    </option>
                  ))}
                </Form.Select>
              </Form.Group>
            </Col>
          )}
        </Row>
      </div>

      <Row className="g-3 mb-4">
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">
                    Hôm nay ({format(new Date(), "dd/MM/yyyy")})
                  </h6>
                  <h3 className="mb-0">{stats.today.toLocaleString()}</h3>
                </div>
                <div className="icon-box bg-primary bg-opacity-10 rounded p-3">
                  <i className="bi bi-calendar-check text-primary fs-4"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">
                    {viewMode === "month"
                      ? `Tháng ${selectedMonth} / ${selectedYear}`
                      : `Ngày ${format(new Date(selectedDate), "dd/MM/yyyy")}`}
                  </h6>
                  <h3 className="mb-0">{stats.selected.toLocaleString()}</h3>
                </div>
                <div className="icon-box bg-success bg-opacity-10 rounded p-3">
                  <i className="bi bi-graph-up text-success fs-4"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <div className="d-flex justify-content-between align-items-start">
                <div>
                  <h6 className="text-muted mb-2">Năm {selectedYear}</h6>
                  <h3 className="mb-0">{stats.year.toLocaleString()}</h3>
                </div>
                <div className="icon-box bg-warning bg-opacity-10 rounded p-3">
                  <i className="bi bi-bar-chart text-warning fs-4"></i>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row className="g-3">
        {/* Biểu đồ thời gian trong ngày */}
        <Col xs={12}>
          <Card className="h-100 shadow-sm">
            <Card.Header>
              <h6 className="mb-0">
                {viewMode === "month"
                  ? "Số lượt truy cập theo ngày trong tháng"
                  : `Số lượt truy cập theo buổi ngày ${format(
                      new Date(selectedDate),
                      "dd/07/yyyy"
                    )}`}
              </h6>
            </Card.Header>
            <Card.Body>
              {chartData === null ? (
                <div className="text-center py-5">
                  <i className="bi bi-exclamation-circle text-muted fs-1"></i>
                  <p className="text-muted mt-3 mb-0">
                    Không có dữ liệu cho tháng {selectedMonth}/{selectedYear}
                  </p>
                </div>
              ) : (
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey={viewMode === "month" ? "date" : "time"}
                      tickFormatter={
                        viewMode === "month"
                          ? (date) => format(new Date(date), "dd/07")
                          : null
                      }
                    />
                    <YAxis />
                    <Tooltip
                      labelFormatter={
                        viewMode === "month"
                          ? (date) => format(new Date(date), "dd/07/yyyy")
                          : null
                      }
                    />
                    <Legend />
                    {viewMode === "month" ? (
                      <Bar
                        dataKey="totalLogins"
                        name="Tổng lượt truy cập"
                        fill="#8884d8"
                      />
                    ) : (
                      <Bar
                        dataKey="logins"
                        name="Lượt truy cập"
                        fill="#82ca9d"
                      />
                    )}
                  </BarChart>
                </ResponsiveContainer>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Biểu đồ tìm kiếm thành phố */}
        <Col xs={12} md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header>
              <h6 className="mb-0">Tình, thành phố được tìm kiếm nhiều nhất</h6>
            </Card.Header>
            <Card.Body>
              <ResponsiveContainer width="100%" height={350}>
                <PieChart>
                  <Pie
                    data={citySearchData}
                    dataKey="searches"
                    nameKey="city"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {citySearchData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Card.Body>
          </Card>
        </Col>

        {/* Khách sạn có lượt truy cập cao */}
        <Col xs={12} md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Header>
              <h6 className="mb-0">Top khách sạn có lượt truy cập cao</h6>
            </Card.Header>
            <Card.Body style={{ maxHeight: "400px", overflowY: "auto" }}>
              {hotelVisitsData
                .sort((a, b) => b.visits - a.visits)
                .slice(0, 5)
                .map((hotel, index) => (
                  <div
                    key={hotel.id}
                    className="p-3 mb-2 bg-light rounded d-flex justify-content-between align-items-center"
                  >
                    <div>
                      <h6 className="mb-1">
                        {index + 1}. {hotel.name}
                      </h6>
                      <small className="text-muted">
                        {hotel.location} • {hotel.rating}⭐
                      </small>
                    </div>
                    <Badge bg="primary" className="fs-6">
                      {hotel.visits.toLocaleString()}
                    </Badge>
                  </div>
                ))}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <style jsx>{`
        .card {
          transition: transform 0.2s ease;
        }
        .card:hover {
          transform: translateY(-5px);
        }
        .card-header {
          background-color: rgba(0, 0, 0, 0.03);
        }
        .badge {
          font-weight: 500;
        }
      `}</style>
    </Container>
  );
};

export default AnalystPage;
