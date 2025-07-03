import { useState, useEffect } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import AdminDashboardActions from "../../redux/adminDashboard/actions";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const DashboardPage = () => {
  const dispatch = useDispatch();
  const { data: dashboardData, loading, error } = useSelector(state => state.AdminDashboard);
  const [selectedPeriod, setSelectedPeriod] = useState('month');

  // Fetch dashboard data on component mount and when period changes
  useEffect(() => {
    dispatch({
      type: AdminDashboardActions.FETCH_ADMIN_DASHBOARD_METRICS,
      payload: {
        params: { period: selectedPeriod },
        onSuccess: (data) => {
          console.log('Dashboard data loaded successfully:', data);
        },
        onFailed: (error) => {
          console.error('Failed to load dashboard data:', error);
        }
      }
    });
  }, [dispatch, selectedPeriod]);

  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
  };

  // Chart empty state component
  const ChartEmptyState = ({ icon, message }) => (
    <div className="d-flex align-items-center justify-content-center h-100 text-muted">
      <div className="text-center">
        <i className={`bi ${icon} fs-1 d-block mb-2`}></i>
        <p>{message}</p>
      </div>
    </div>
  );

  // Format revenue for display
  const formatRevenue = (revenue) => {
    if (revenue >= 1000000) {
      return (revenue / 1000000).toFixed(1) + 'M';
    } else if (revenue >= 1000) {
      return (revenue / 1000).toFixed(1) + 'K';
    }
    return revenue?.toLocaleString() || '0';
  };

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-content">
        <div className="d-flex justify-content-center align-items-center" style={{ height: '400px' }}>
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-content">
        <div className="alert alert-danger" role="alert">
          <h4 className="alert-heading">Lỗi!</h4>
          <p>{error}</p>
          <button
            className="btn btn-outline-danger"
            onClick={() => handlePeriodChange(selectedPeriod)}
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }




  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Tổng quan hệ thống</h1>
        <div className="page-actions">
          <div className="date-filter">
            <select
              className="form-select"
              value={selectedPeriod}
              onChange={(e) => handlePeriodChange(e.target.value)}
            >
              <option value="day">Hôm nay</option>
              <option value="week">Tuần này</option>
              <option value="month">Tháng này</option>
              <option value="year">Năm nay</option>
            </select>
          </div>
          <button
            className="btn btn-outline-secondary me-2"
            onClick={() => handlePeriodChange(selectedPeriod)}
            disabled={loading}
          >
            <i className="bi bi-arrow-clockwise"></i> Làm mới
          </button>
          <button className="btn btn-primary">
            <i className="bi bi-download"></i> Xuất báo cáo
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="stats-cards">
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>{dashboardData.totalHotels || 0}</h3>
            <p>Tổng số khách sạn</p>
          </div>
          <div className="stat-card-icon hotels">
            <i className="bi bi-building"></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>{dashboardData.activeHotels || 0}</h3>
            <p>Khách sạn hoạt động</p>
          </div>
          <div className="stat-card-icon active">
            <i className="bi bi-check-circle"></i>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card-content">
            <h3>{dashboardData.totalCustomers || 0}</h3>
            <p>Tổng số khách hàng</p>
          </div>
          <div className="stat-card-icon customers">
            <i className="bi bi-people"></i>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card-content">
            <h3>{dashboardData.totalOwners || 0}</h3>
            <p>Chủ khách sạn</p>
          </div>
          <div className="stat-card-icon owners">
            <i className="bi bi-person-badge"></i>
          </div>
        </div>
      </div>

      {/* Revenue Chart */}
      <div className="chart-container">
        <div className="chart-header">
          <h2>Doanh thu hệ thống</h2>
          <div className="chart-actions">
            <div className="btn-group">
              <button className="btn btn-sm btn-outline-secondary">Ngày</button>
              <button className="btn btn-sm btn-outline-secondary">Tuần</button>
              <button className="btn btn-sm btn-primary">Tháng</button>
              <button className="btn btn-sm btn-outline-secondary">Năm</button>
            </div>
          </div>
        </div>
        <div className="chart-body">
          {dashboardData.revenueData?.labels?.length > 0 ? (
            <Line
              data={dashboardData.revenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "top",
                  },
                },
                scales: {
                  y: {
                    beginAtZero: false,
                    grid: {
                      drawBorder: false,
                    },
                    ticks: {
                      callback: (value) => formatRevenue(value),
                    },
                  },
                  x: {
                    grid: {
                      display: false,
                    },
                  },
                },
              }}
            />
          ) : (
            <ChartEmptyState icon="bi-graph-up" message="Chưa có dữ liệu doanh thu" />
          )}
        </div>
      </div>

      {/* Distribution Charts */}
      <div className="charts-row">
        <div className="chart-container half">
          <div className="chart-header">
            <h2>Phân bố khách sạn theo khu vực</h2>
          </div>
          <div className="chart-body">
            {dashboardData.hotelDistributionData?.labels?.length > 0 ? (
              <Doughnut
                data={dashboardData.hotelDistributionData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        generateLabels: function(chart) {
                          const data = chart.data;
                          if (data.labels.length && data.datasets.length) {
                            const dataset = data.datasets[0];
                            const total = dataset.data.reduce((sum, value) => sum + value, 0);
                            return data.labels.map((label, i) => {
                              const value = dataset.data[i];
                              const percentage = ((value / total) * 100).toFixed(1);
                              return {
                                text: `${label}: ${value} (${percentage}%)`,
                                fillStyle: dataset.backgroundColor[i],
                                strokeStyle: dataset.borderColor?.[i] || '#fff',
                                lineWidth: 2,
                                hidden: false,
                                index: i
                              };
                            });
                          }
                          return [];
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed;
                          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} khách sạn (${percentage}%)`;
                        }
                      }
                    }
                  },
                  cutout: "70%",
                  onHover: (_, activeElements, chart) => {
                    if (activeElements.length > 0) {
                      const dataIndex = activeElements[0].index;
                      const dataset = chart.data.datasets[0];
                      const total = dataset.data.reduce((sum, val) => sum + val, 0);
                      const value = dataset.data[dataIndex];
                      const percentage = ((value / total) * 100).toFixed(1);
                      const label = chart.data.labels[dataIndex];

                      // Update center text
                      chart.options.plugins.centerText = {
                        display: true,
                        text: `${percentage}%`,
                        subtext: label,
                        value: value
                      };
                      chart.update('none');
                    } else {
                      // Reset center text
                      chart.options.plugins.centerText = {
                        display: true,
                        text: 'Hover',
                        subtext: 'để xem chi tiết',
                        value: ''
                      };
                      chart.update('none');
                    }
                  },
                }}
                plugins={[{
                  id: 'centerText',
                  beforeDraw: (chart) => {
                    const { ctx, width, height } = chart;
                    const centerText = chart.options.plugins.centerText || {
                      display: true,
                      text: 'Hover',
                      subtext: 'để xem chi tiết',
                      value: ''
                    };

                    if (centerText.display) {
                      ctx.save();
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';

                      const centerX = width / 2;
                      const centerY = height / 2;

                      // Main percentage text
                      ctx.font = 'bold 24px Arial';
                      ctx.fillStyle = '#333';
                      ctx.fillText(centerText.text, centerX, centerY - 10);

                      // Subtext (label)
                      ctx.font = '14px Arial';
                      ctx.fillStyle = '#666';
                      ctx.fillText(centerText.subtext, centerX, centerY + 15);

                      // Value
                      if (centerText.value) {
                        ctx.font = '12px Arial';
                        ctx.fillStyle = '#999';
                        ctx.fillText(`${centerText.value} khách sạn`, centerX, centerY + 35);
                      }

                      ctx.restore();
                    }
                  }
                }]}
              />
            ) : (
              <ChartEmptyState icon="bi-pie-chart" message="Chưa có dữ liệu phân bố" />
            )}
          </div>
        </div>
        <div className="chart-container half">
          <div className="chart-header">
            <h2>Phân loại khách sạn</h2>
          </div>
          <div className="chart-body">
            {dashboardData.hotelCategoryData?.labels?.length > 0 ? (
              <Pie
                data={dashboardData.hotelCategoryData}
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      position: "bottom",
                      labels: {
                        generateLabels: function(chart) {
                          const data = chart.data;
                          if (data.labels.length && data.datasets.length) {
                            const dataset = data.datasets[0];
                            const total = dataset.data.reduce((sum, value) => sum + value, 0);
                            return data.labels.map((label, i) => {
                              const value = dataset.data[i];
                              const percentage = ((value / total) * 100).toFixed(1);
                              return {
                                text: `${label}: ${value} (${percentage}%)`,
                                fillStyle: dataset.backgroundColor[i],
                                strokeStyle: dataset.borderColor?.[i] || '#fff',
                                lineWidth: 2,
                                hidden: false,
                                index: i
                              };
                            });
                          }
                          return [];
                        }
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          const label = context.label || '';
                          const value = context.parsed;
                          const total = context.dataset.data.reduce((sum, val) => sum + val, 0);
                          const percentage = ((value / total) * 100).toFixed(1);
                          return `${label}: ${value} khách sạn (${percentage}%)`;
                        }
                      }
                    }
                  },
                  onHover: (_, activeElements, chart) => {
                    if (activeElements.length > 0) {
                      const dataIndex = activeElements[0].index;
                      const dataset = chart.data.datasets[0];
                      const total = dataset.data.reduce((sum, val) => sum + val, 0);
                      const value = dataset.data[dataIndex];
                      const percentage = ((value / total) * 100).toFixed(1);
                      const label = chart.data.labels[dataIndex];

                      // Update center text
                      chart.options.plugins.centerText = {
                        display: true,
                        text: `${percentage}%`,
                        subtext: label,
                        value: value
                      };
                      chart.update('none');
                    } else {
                      // Reset center text
                      chart.options.plugins.centerText = {
                        display: true,
                        text: 'Click',
                        subtext: 'để xem chi tiết',
                        value: ''
                      };
                      chart.update('none');
                    }
                  },
                }}
                plugins={[{
                  id: 'centerTextPie',
                  beforeDraw: (chart) => {
                    const { ctx, width, height } = chart;
                    const centerText = chart.options.plugins.centerText || {
                      display: true,
                      text: 'Click',
                      subtext: 'để xem chi tiết',
                      value: ''
                    };

                    if (centerText.display) {
                      ctx.save();
                      ctx.textAlign = 'center';
                      ctx.textBaseline = 'middle';

                      const centerX = width / 2;
                      const centerY = height / 2;

                      // Main percentage text
                      ctx.font = 'bold 20px Arial';
                      ctx.fillStyle = '#333';
                      ctx.fillText(centerText.text, centerX, centerY - 8);

                      // Subtext (label)
                      ctx.font = '12px Arial';
                      ctx.fillStyle = '#666';
                      ctx.fillText(centerText.subtext, centerX, centerY + 12);

                      // Value
                      if (centerText.value) {
                        ctx.font = '10px Arial';
                        ctx.fillStyle = '#999';
                        ctx.fillText(`${centerText.value} khách sạn`, centerX, centerY + 28);
                      }

                      ctx.restore();
                    }
                  }
                }]}
              />
            ) : (
              <ChartEmptyState icon="bi-pie-chart-fill" message="Chưa có dữ liệu phân loại" />
            )}
          </div>
        </div>
      </div>

      {/* Detailed Analysis */}
      <div className="detailed-analysis mt-4">
        {/* Location Breakdown */}
        <div className="analysis-container mb-4 card">
          <div className="analysis-header d-flex justify-content-between align-items-center p-3 border-bottom">
            <h2 className="mb-0">
              <i className="bi bi-geo-alt me-2"></i>
              Phân tích chi tiết theo khu vực
            </h2>
          </div>
          <div className="analysis-body card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Khu vực</th>
                    <th>Tổng số</th>
                    <th>Đang hoạt động</th>
                    <th>Chờ phê duyệt</th>
                    <th>Tỷ lệ hoạt động</th>
                    <th>Trạng thái</th>
                  </tr>
                </thead>
                <tbody>
                  {(dashboardData.locationBreakdown || []).length > 0 ? (
                    (dashboardData.locationBreakdown || []).map((location, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{location.region}</strong>
                        </td>
                        <td>
                          <span className="badge bg-primary">{location.total}</span>
                        </td>
                        <td>
                          <span className="badge bg-success">{location.active}</span>
                        </td>
                        <td>
                          <span className="badge bg-warning">{location.pending}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${location.activePercentage}%` }}
                              ></div>
                            </div>
                            <small>{location.activePercentage}%</small>
                          </div>
                        </td>
                        <td>
                          {location.activePercentage >= 80 ? (
                            <span className="badge bg-success">Tốt</span>
                          ) : location.activePercentage >= 60 ? (
                            <span className="badge bg-warning">Trung bình</span>
                          ) : (
                            <span className="badge bg-danger">Cần cải thiện</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center text-muted py-4">
                        <i className="bi bi-geo fs-1 d-block mb-2"></i>
                        Chưa có dữ liệu phân tích khu vực
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="analysis-container mb-4 card">
          <div className="analysis-header d-flex justify-content-between align-items-center p-3 border-bottom">
            <h2 className="mb-0">
              <i className="bi bi-star me-2"></i>
              Phân tích theo phân loại khách sạn
            </h2>
          </div>
          <div className="analysis-body card-body">
            <div className="table-responsive">
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Phân loại</th>
                    <th>Tổng số</th>
                    <th>Đang hoạt động</th>
                    <th>Chờ phê duyệt</th>
                    <th>Đánh giá TB</th>
                    <th>Tỷ lệ hoạt động</th>
                    <th>Chất lượng</th>
                  </tr>
                </thead>
                <tbody>
                  {(dashboardData.categoryBreakdown || []).length > 0 ? (
                    (dashboardData.categoryBreakdown || []).map((category, index) => (
                      <tr key={index}>
                        <td>
                          <strong>{category.category}</strong>
                        </td>
                        <td>
                          <span className="badge bg-primary">{category.total}</span>
                        </td>
                        <td>
                          <span className="badge bg-success">{category.active}</span>
                        </td>
                        <td>
                          <span className="badge bg-warning">{category.pending}</span>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            {[...Array(5)].map((_, i) => (
                              <i
                                key={i}
                                className={`bi ${i < Math.floor(category.avgRating || 0) ? 'bi-star-fill' : 'bi-star'} text-warning me-1`}
                                style={{ fontSize: '12px' }}
                              ></i>
                            ))}
                            <small className="ms-1">({category.avgRating})</small>
                          </div>
                        </td>
                        <td>
                          <div className="d-flex align-items-center">
                            <div className="progress me-2" style={{ width: '60px', height: '8px' }}>
                              <div
                                className="progress-bar bg-success"
                                style={{ width: `${category.activePercentage}%` }}
                              ></div>
                            </div>
                            <small>{category.activePercentage}%</small>
                          </div>
                        </td>
                        <td>
                          {category.avgRating >= 4.5 ? (
                            <span className="badge bg-success">Xuất sắc</span>
                          ) : category.avgRating >= 4.0 ? (
                            <span className="badge bg-info">Tốt</span>
                          ) : category.avgRating >= 3.0 ? (
                            <span className="badge bg-warning">Trung bình</span>
                          ) : (
                            <span className="badge bg-danger">Cần cải thiện</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center text-muted py-4">
                        <i className="bi bi-star fs-1 d-block mb-2"></i>
                        Chưa có dữ liệu phân tích phân loại
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
};

export default DashboardPage;
