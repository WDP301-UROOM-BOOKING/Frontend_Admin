const ApprovePage = () => {
  const recentApprovals = [
    {
      id: "A-7829",
      hotelName: "Luxury Palace Hotel",
      owner: "Nguyễn Văn A",
      location: "Hà Nội",
      category: "5 sao",
      submittedDate: "15/06/2025",
      status: "Đang chờ",
    },
    {
      id: "A-7830",
      hotelName: "Seaside Resort & Spa",
      owner: "Trần Thị B",
      location: "Đà Nẵng",
      category: "4 sao",
      submittedDate: "16/06/2025",
      status: "Đang xem xét",
    },
    {
      id: "A-7831",
      hotelName: "City Center Hotel",
      owner: "Lê Văn C",
      location: "TP.HCM",
      category: "3 sao",
      submittedDate: "16/06/2025",
      status: "Đang chờ",
    },
    {
      id: "A-7832",
      hotelName: "Mountain View Lodge",
      owner: "Phạm Thị D",
      location: "Đà Lạt",
      category: "4 sao",
      submittedDate: "17/06/2025",
      status: "Đang xem xét",
    },
    {
      id: "A-7833",
      hotelName: "Riverside Boutique Hotel",
      owner: "Hoàng Văn E",
      location: "Huế",
      category: "4 sao",
      submittedDate: "18/06/2025",
      status: "Đang chờ",
    },
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "Đã thanh toán":
      case "Hoạt động":
        return "success";
      case "Đang xử lý":
      case "Đang xem xét":
      case "Đang chờ":
        return "warning";
      case "Tạm khóa":
      case "Chưa xử lý":
        return "danger";
      default:
        return "secondary";
    }
  };

  return (
    <div className="approvals-content">
      <div className="page-header">
        <h1>Phê duyệt Khách sạn</h1>
        <div className="page-actions">
          {/* <button className="btn btn-outline-primary">
                      <i className="bi bi-filter"></i> Lọc
                    </button> */}
          {/* <div className="btn-group">
                      <button className="btn btn-success">
                        <i className="bi bi-check-lg"></i> Phê duyệt đã chọn
                      </button>
                      <button className="btn btn-danger">
                        <i className="bi bi-x-lg"></i> Từ chối đã chọn
                      </button>
                    </div> */}
        </div>
      </div>

      <div className="content-container">
        <div className="filters-bar">
          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="Tìm kiếm yêu cầu phê duyệt..." />
          </div>
          <div className="filters">
            <select className="form-select">
              <option>Tất cả trạng thái</option>
              <option>Đang chờ</option>
              <option>Đang xem xét</option>
            </select>
            <select className="form-select">
              <option>Sắp xếp theo</option>
              <option>Ngày gửi (Mới nhất)</option>
              <option>Tên khách sạn A-Z</option>
            </select>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table table-hover">
            <thead>
              <tr>
                <th>
                  <input type="checkbox" className="form-check-input" />
                </th>
                <th>ID</th>
                <th>Tên khách sạn</th>
                <th>Chủ sở hữu</th>
                <th>Địa điểm</th>
                <th>Hạng</th>
                <th>Ngày gửi</th>
                <th>Trạng thái</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {recentApprovals.map((approval) => (
                <tr key={approval.id}>
                  <td>
                    <input type="checkbox" className="form-check-input" />
                  </td>
                  <td>{approval.id}</td>
                  <td>{approval.hotelName}</td>
                  <td>{approval.owner}</td>
                  <td>{approval.location}</td>
                  <td>{approval.category}</td>
                  <td>{approval.submittedDate}</td>
                  <td>
                    <span
                      className={`badge bg-${getStatusColor(approval.status)}`}
                    >
                      {approval.status}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        className="btn btn-sm btn-primary"
                        title="Xem chi tiết"
                      >
                        <i className="bi bi-eye"></i>
                      </button>
                      <button
                        className="btn btn-sm btn-success"
                        title="Phê duyệt"
                      >
                        <i className="bi bi-check-lg"></i>
                      </button>
                      <button className="btn btn-sm btn-danger" title="Từ chối">
                        <i className="bi bi-x-lg"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="pagination-container">
          <div className="pagination-info">Hiển thị 1-5 của 58 kết quả</div>
          <ul className="pagination">
            <li className="page-item disabled">
              <a className="page-link" href="#">
                Trước
              </a>
            </li>
            <li className="page-item active">
              <a className="page-link" href="#">
                1
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                2
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                3
              </a>
            </li>
            <li className="page-item">
              <a className="page-link" href="#">
                Sau
              </a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default ApprovePage;
