"use client";

import { useEffect, useState } from "react";
import DetailReportedAdmin from "./DetailReportedAdmin";
import { useAppDispatch } from "../../redux/store";
import ReportFeedbackActions from "../../redux/reportedFeedback/actions";

function ReportedFeedbackAdmin() {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [loading, setLoading] = useState(false);

  const [reports, setReports] = useState([]); 

  // Gọi API khi component mount
  useEffect(() => {
    setLoading(true);
    dispatch({
      type: ReportFeedbackActions.GET_ALL_REPORTED_FEEDBACKS,
      payload: {
        onSuccess: (data) => {
          setLoading(false);
          setReports(data);
          console.log("Fetched reports:", data);
        },
        onFailed: (msg) => {
          console.error("Lỗi lấy danh sách báo cáo:", msg);
          setLoading(false);
        },
      },
    });
  }, [dispatch]);

  // Lọc dữ liệu
  const filteredReports = reports.filter((item) => {
    const matchesSearch =
      searchTerm === "" ||
      item.feedback?.hotel?.hotelName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.reports?.[0]?.reportedBy?.name
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      item.reports?.[0]?.reason
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "" || item.reports?.[0]?.status === statusFilter;

    return matchesSearch && matchesStatus;
  });



  const getStatusColor = (status) => {
    switch (status) {
      case "APPROVED":
        return "success";
      case "PENDING":
        return "warning";
      case "REJECT":
        return "danger";
      default:
        return "secondary";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "APPROVED":
        return "Đã duyệt";
      case "PENDING":
        return "Chờ xử lý";
      case "REJECT":
        return "Từ chối";
      default:
        return status || "Không xác định";
    }
  };

  const getSeverity = (count) => {
    if (count >= 5) return { text: "Cao", color: "danger" };
    if (count >= 3) return { text: "Trung bình", color: "warning" };
    return { text: "Thấp", color: "info" };
  };




  if (loading) {
    return (
      <div className="reports-content">
        <h1>Đang tải dữ liệu...</h1>
      </div>
    );
  }



  return (
    <div className="reports-content">
      {/* Header */}
      <div className="page-header">
        <h1>Báo cáo vi phạm</h1>
        <p className="text-muted">Quản lý các báo cáo vi phạm từ người dùng</p>
        <div className="page-actions">
         
        
        </div>
      </div>

      {/* Filter */}
      <div className="filters-bar">
        <div className="search-box">
          <input
            type="text"
            placeholder="Tìm kiếm báo cáo..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filters">
          <select
            className="form-select"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="PENDING">Chờ xử lý</option>
            <option value="APPROVED">Đã duyệt</option>
            <option value="REJECT">Từ chối</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-responsive">
        <table className="table">
          <thead>
            <tr>
              <th>#</th>
              <th>Khách sạn</th>
              <th>Người đánh giá</th>
              <th>Nội dung</th>
              <th>Lý do</th>
              <th>Ngày</th>
              <th>Trạng thái</th>

            </tr>
          </thead>
          <tbody>
            {filteredReports.map((item, index) => {
              const latest = item.reports?.[0];
            
              return (
                <tr key={item.feedback?._id || index}  onClick={() => {
                  setSelectedReport(item);
                  setShowModal(true);
                }}
                style={{ cursor: "pointer" }} >
                  <td>{index + 1}</td>
                  <td>{item.feedback?.hotel?.hotelName}</td>
                  <td>{item.feedback?.user?.name}</td>
                  <td>
                    <span
                      className="text-truncate d-inline-block"
                      style={{ maxWidth: "200px" }}
                      title={item.feedback?.content}
                    >
                      {item.feedback?.content || "N/A"}
                    </span>
                  </td>
                  <td>{latest?.reason}</td>
                  <td>
                    {new Date(latest?.createdAt).toLocaleDateString("vi-VN")}
                  </td>
                  <td>
                    <span
                      className={`badge bg-${getStatusColor(latest?.status)}`}
                    >
                      {getStatusText(latest?.status)}
                    </span>
                  </td>
                 
                 
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedReport && (
        <DetailReportedAdmin
          show={showModal}
          onHide={() => setShowModal(false)}
          handleClose={() => setShowModal(false)}
          feedbackId={selectedReport.feedback?._id}
          feedbackData={selectedReport}
        />
      )}
    </div>
  );
}

export default ReportedFeedbackAdmin;
