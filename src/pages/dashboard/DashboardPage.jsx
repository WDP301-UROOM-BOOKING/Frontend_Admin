import { useState, useEffect } from "react";
import { Line, Bar, Pie, Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import AdminDashboardActions from "../../redux/adminDashboard/actions";
import { FaFilePdf, FaFileExcel } from 'react-icons/fa';
import pdfMake from '../../utils/fonts';
import { showToast } from '../../components/ToastContainer';
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
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [exportLoading, setExportLoading] = useState(false);
  const [excelExportLoading, setExcelExportLoading] = useState(false);



  // Fetch dashboard data on component mount and when period/year changes
  useEffect(() => {
    const params = { period: selectedPeriod };
    if (selectedPeriod === 'month') {
      params.year = selectedYear;
    }

    dispatch({
      type: AdminDashboardActions.FETCH_ADMIN_DASHBOARD_METRICS,
      payload: {
        params,
        onSuccess: (data) => {
          console.log('Dashboard data loaded successfully:', data);
          // Set selectedYear to first available year if not set
          if (data.availableYears && data.availableYears.length > 0 && selectedYear === new Date().getFullYear() && !data.availableYears.includes(selectedYear)) {
            setSelectedYear(data.availableYears[0]);
          }
        },
        onFailed: (error) => {
          console.error('Failed to load dashboard data:', error);
        }
      }
    });
  }, [dispatch, selectedPeriod, selectedYear]);

  // Handle period change
  const handlePeriodChange = (period) => {
    setSelectedPeriod(period);
    // Reset year to current year when switching periods
    if (period === 'month') {
      setSelectedYear(new Date().getFullYear());
    }
  };



  // Calculate total revenue from all available data
  const calculateTotalRevenue = () => {
    if (!dashboardData?.revenueData?.datasets?.[0]?.data) {
      return "0";
    }
    const totalRevenue = dashboardData.revenueData.datasets[0].data.reduce((sum, value) => sum + (value || 0), 0);
    return totalRevenue.toLocaleString();
  };

  // Get revenue breakdown for PDF
  const getRevenueBreakdown = () => {
    if (!dashboardData?.revenueData?.labels || !dashboardData?.revenueData?.datasets?.[0]?.data) {
      return [["No data available", "$0"]];
    }

    const labels = dashboardData.revenueData.labels;
    const data = dashboardData.revenueData.datasets[0].data;
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth() + 1; // 1-12

    return labels.map((label, index) => {
      // Parse year and month from label (e.g., "Jan 2025", "Feb 2025")
      const labelParts = label.split(' ');
      if (labelParts.length === 2) {
        const labelYear = parseInt(labelParts[1]);
        const labelMonth = new Date(`${labelParts[0]} 1, ${labelYear}`).getMonth() + 1;

        // Skip future months in current year
        if (labelYear === currentYear && labelMonth > currentMonth) {
          return null; // Will be filtered out
        }
      }

      return [
        label,
        `$${(data[index] || 0).toLocaleString()}`
      ];
    }).filter(item => item !== null); // Remove null entries
  };

  // Get hotel distribution for PDF
  const getHotelDistribution = () => {
    if (!dashboardData?.locationBreakdown) {
      return [["No data available", "0", "0", "0%"]];
    }

    return dashboardData.locationBreakdown.map(item => [
      item.region || "Unknown",
      item.total?.toString() || "0",
      item.active?.toString() || "0",
      `${item.activePercentage || "0"}%`
    ]);
  };

  // Export dashboard report as PDF
  const exportDashboardPDF = () => {
    if (!dashboardData) {
      showToast.error("No data available for export");
      return;
    }

    setExportLoading(true);

    try {
      const currentDate = new Date().toLocaleDateString('en-US');
      const periodText = "COMPREHENSIVE DASHBOARD REPORT";



      const docDefinition = {
        content: [
          // Header
          {
            text: "UROOM ADMIN DASHBOARD",
            style: "header",
            alignment: "center",
            margin: [0, 0, 0, 20],
          },
          {
            text: periodText.toUpperCase(),
            style: "subheader",
            alignment: "center",
            margin: [0, 0, 0, 20],
          },
          {
            text: `Export Date: ${currentDate}`,
            alignment: "right",
            margin: [0, 0, 0, 30],
          },

          // Summary Statistics
          {
            text: "I. OVERVIEW STATISTICS",
            style: "sectionHeader",
            margin: [0, 0, 0, 15],
          },
          {
            table: {
              widths: ["50%", "50%"],
              body: [
                ["Total Hotels", (dashboardData.totalHotels || 0).toString()],
                ["Active Hotels", (dashboardData.activeHotels || 0).toString()],
                ["Total Users", (dashboardData.totalUsers || 0).toString()],
                ["Total Hotel Hosts", (dashboardData.totalOwners || 0).toString()],
                ["Total System Revenue", `$${calculateTotalRevenue()}`],
              ],
            },
            margin: [0, 0, 0, 20],
          },

          // Revenue Breakdown
          {
            text: "II. REVENUE BREAKDOWN",
            style: "sectionHeader",
            margin: [0, 20, 0, 15],
          },
          {
            table: {
              widths: ["50%", "50%"],
              body: [
                ["Period", "Revenue (USD)"],
                ...getRevenueBreakdown()
              ],
            },
            margin: [0, 0, 0, 20],
          },

          // Hotel Distribution
          {
            text: "III. HOTEL DISTRIBUTION BY REGION",
            style: "sectionHeader",
            margin: [0, 20, 0, 15],
          },
          {
            table: {
              widths: ["40%", "20%", "20%", "20%"],
              body: [
                ["Region", "Total", "Active", "Percentage"],
                ...getHotelDistribution()
              ],
            },
            margin: [0, 0, 0, 20],
          },

          // Footer
          {
            text: "Report generated automatically by UROOM Admin Dashboard System",
            style: "footer",
            alignment: "center",
            margin: [0, 30, 0, 0],
          },
        ],
        styles: {
          header: {
            fontSize: 20,
            bold: true,
            color: "#212B49",
          },
          subheader: {
            fontSize: 16,
            bold: true,
            color: "#212B49",
          },
          sectionHeader: {
            fontSize: 14,
            bold: true,
            color: "#212B49",
          },
          footer: {
            fontSize: 10,
            italics: true,
            color: "#666666",
          },
        },
        defaultStyle: {
          font: "Roboto",
          fallbackFonts: ['Times-Roman']
        },
      };

      // Generate PDF
      pdfMake.createPdf(docDefinition).download(`dashboard-comprehensive-report-${new Date().getTime()}.pdf`);
      showToast.success("PDF report exported successfully!");
    } catch (error) {
      console.error("Error exporting dashboard report:", error);
      showToast.error("Error exporting PDF report: " + (error.message || "Unknown error"));
    } finally {
      setExportLoading(false);
    }
  };

  // Export dashboard report as Excel (HTML format)
  const exportDashboardExcel = () => {
    if (!dashboardData) {
      showToast.error("No data available for export");
      return;
    }

    setExcelExportLoading(true);

    try {
      const currentDate = new Date().toLocaleDateString('en-US');
      const periodText = "COMPREHENSIVE DASHBOARD REPORT";

      // Create HTML table that Excel can open
      let htmlContent = `
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; font-weight: bold; }
            .header { font-size: 16px; font-weight: bold; text-align: center; }
            .section { font-weight: bold; background-color: #e6f3ff; }
          </style>
        </head>
        <body>
          <table>
            <tr><td colspan="2" class="header">UROOM ADMIN DASHBOARD</td></tr>
            <tr><td colspan="2" class="header">${periodText.toUpperCase()}</td></tr>
            <tr><td colspan="2">Export Date: ${currentDate}</td></tr>
            <tr><td colspan="2"></td></tr>
            <tr><td colspan="2" class="section">OVERVIEW STATISTICS</td></tr>
            <tr><th>Metric</th><th>Value</th></tr>
            <tr><td>Total Hotels</td><td>${dashboardData.totalHotels || 0}</td></tr>
            <tr><td>Active Hotels</td><td>${dashboardData.activeHotels || 0}</td></tr>
            <tr><td>Total Users</td><td>${dashboardData.totalUsers || 0}</td></tr>
            <tr><td>Hotel Owners</td><td>${dashboardData.totalOwners || 0}</td></tr>
            <tr><td>Total Revenue</td><td>$${(dashboardData.totalRevenue || 0).toLocaleString()}</td></tr>
            <tr><td colspan="2"></td></tr>
            <tr><td colspan="2" class="section">REVENUE DATA</td></tr>
            <tr><th>Period</th><th>Revenue (USD)</th></tr>`;

      // Add revenue data
      if (dashboardData.revenueData && dashboardData.revenueData.labels) {
        dashboardData.revenueData.labels.forEach((label, index) => {
          const amount = dashboardData.revenueData.datasets[0]?.data[index] || 0;
          htmlContent += `<tr><td>${label}</td><td>$${amount.toLocaleString()}</td></tr>`;
        });
      }

      htmlContent += `
          </table>
        </body>
        </html>`;

      // Create and download file
      const blob = new Blob([htmlContent], {
        type: 'application/vnd.ms-excel'
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `dashboard-comprehensive-report-${new Date().getTime()}.xls`;
      a.click();
      URL.revokeObjectURL(url);

      showToast.success("Excel report exported successfully!");
    } catch (error) {
      console.error("Error exporting Excel report:", error);
      showToast.error("Error exporting Excel report: " + (error.message || "Unknown error"));
    } finally {
      setExcelExportLoading(false);
    }
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

  // Format revenue for display (USD)
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
          <h4 className="alert-heading">Error!</h4>
          <p>{error}</p>
        </div>
      </div>
    );
  }




  return (
    <div className="dashboard-content">
      <div className="page-header">
        <h1>Tổng quan hệ thống</h1>
        <div className="page-actions">
          <button
            className="btn btn-primary me-2"
            onClick={exportDashboardPDF}
            disabled={exportLoading || loading}
          >
            {exportLoading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Đang xuất...
              </>
            ) : (
              <>
                <FaFilePdf className="me-2" />
                Xuất PDF
              </>
            )}
          </button>
          <button
            className="btn btn-success"
            onClick={exportDashboardExcel}
            disabled={excelExportLoading || loading}
          >
            {excelExportLoading ? (
              <>
                <div className="spinner-border spinner-border-sm me-2" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                Đang xuất...
              </>
            ) : (
              <>
                <FaFileExcel className="me-2" />
                Export Excel
              </>
            )}
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
            <h3>{dashboardData.totalUsers || 0}</h3>
            <p>Tổng số người dùng</p>
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
          <div className="chart-actions d-flex gap-2">
            <div className="btn-group">
              <button
                className={`btn btn-sm ${selectedPeriod === 'month' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => handlePeriodChange('month')}
              >
                Tháng
              </button>
              <button
                className={`btn btn-sm ${selectedPeriod === 'year' ? 'btn-primary' : 'btn-outline-secondary'}`}
                onClick={() => handlePeriodChange('year')}
              >
                Năm
              </button>
            </div>
            {selectedPeriod === 'month' && dashboardData?.availableYears && (
              <select
                className="form-select form-select-sm"
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                style={{ minWidth: '100px' }}
              >
                {dashboardData.availableYears.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            )}
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
                      callback: (value) => '$' + formatRevenue(value),
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
                }}
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
