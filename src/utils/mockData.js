import { format } from "date-fns";

// Dữ liệu đăng nhập cứng theo tháng 7/2025
export const loginData = [
  // July 1
  { date: "2025-07-01 04:30:00", timestamp: new Date("2025-07-01 04:30:00").getTime(), logins: 1, hour: 9 },
  { date: "2025-07-01 09:30:00", timestamp: new Date("2025-07-01 09:30:00").getTime(), logins: 0, hour: 9 },
  { date: "2025-07-01 15:00:00", timestamp: new Date("2025-07-01 15:00:00").getTime(), logins: 1, hour: 15 },
  { date: "2025-07-01 20:00:00", timestamp: new Date("2025-07-01 20:00:00").getTime(), logins: 2, hour: 20 },

  // July 2
    { date: "2025-07-02 04:30:00", timestamp: new Date("2025-07-02 04:30:00").getTime(), logins: 1, hour: 9 },

  { date: "2025-07-02 10:00:00", timestamp: new Date("2025-07-02 10:00:00").getTime(), logins: 3, hour: 10 },
  { date: "2025-07-02 14:00:00", timestamp: new Date("2025-07-02 14:00:00").getTime(), logins: 2, hour: 14 },
  { date: "2025-07-02 19:00:00", timestamp: new Date("2025-07-02 19:00:00").getTime(), logins: 4, hour: 19 },

  // July 3
  { date: "2025-07-03 09:00:00", timestamp: new Date("2025-07-03 09:00:00").getTime(), logins: 1, hour: 9 },
  { date: "2025-07-03 15:30:00", timestamp: new Date("2025-07-03 15:30:00").getTime(), logins: 0, hour: 15 },
  { date: "2025-07-03 20:00:00", timestamp: new Date("2025-07-03 20:00:00").getTime(), logins: 0, hour: 20 },

  // July 4
  { date: "2025-07-04 10:15:00", timestamp: new Date("2025-07-04 10:15:00").getTime(), logins: 4, hour: 10 },
  { date: "2025-07-04 14:45:00", timestamp: new Date("2025-07-04 14:45:00").getTime(), logins: 5, hour: 14 },
  { date: "2025-07-04 19:30:00", timestamp: new Date("2025-07-04 19:30:00").getTime(), logins: 1, hour: 19 },

  // July 5
  { date: "2025-07-05 09:45:00", timestamp: new Date("2025-07-05 09:45:00").getTime(), logins: 3, hour: 9 },
  { date: "2025-07-05 15:15:00", timestamp: new Date("2025-07-05 15:15:00").getTime(), logins: 8, hour: 15 },
  { date: "2025-07-05 20:30:00", timestamp: new Date("2025-07-05 20:30:00").getTime(), logins: 4, hour: 20 },

  // July 6
  { date: "2025-07-06 10:30:00", timestamp: new Date("2025-07-06 10:30:00").getTime(), logins: 5, hour: 10 },
  { date: "2025-07-06 14:15:00", timestamp: new Date("2025-07-06 14:15:00").getTime(), logins: 5, hour: 14 },
  { date: "2025-07-06 19:45:00", timestamp: new Date("2025-07-06 19:45:00").getTime(), logins: 1, hour: 19 },

  // July 7
  { date: "2025-07-07 09:15:00", timestamp: new Date("2025-07-07 09:15:00").getTime(), logins: 2, hour: 9 },
  { date: "2025-07-07 15:45:00", timestamp: new Date("2025-07-07 15:45:00").getTime(), logins: 3, hour: 15 },
  { date: "2025-07-07 20:15:00", timestamp: new Date("2025-07-07 20:15:00").getTime(), logins: 4, hour: 20 },

  // July 8
  { date: "2025-07-08 10:45:00", timestamp: new Date("2025-07-08 10:45:00").getTime(), logins: 1, hour: 10 },
  { date: "2025-07-08 14:30:00", timestamp: new Date("2025-07-08 14:30:00").getTime(), logins: 3, hour: 14 },
  { date: "2025-07-08 19:15:00", timestamp: new Date("2025-07-08 19:15:00").getTime(), logins: 2, hour: 19 },

  // July 9
  { date: "2025-07-09 09:30:00", timestamp: new Date("2025-07-09 09:30:00").getTime(), logins: 2, hour: 9 },
  { date: "2025-07-09 15:00:00", timestamp: new Date("2025-07-09 15:00:00").getTime(), logins: 3, hour: 15 },
  { date: "2025-07-09 20:45:00", timestamp: new Date("2025-07-09 20:45:00").getTime(), logins: 4, hour: 20 },

  // July 10
  { date: "2025-07-10 10:00:00", timestamp: new Date("2025-07-10 10:00:00").getTime(), logins: 0, hour: 10 },
  { date: "2025-07-10 14:45:00", timestamp: new Date("2025-07-10 14:45:00").getTime(), logins: 2, hour: 14 },
  { date: "2025-07-10 19:30:00", timestamp: new Date("2025-07-10 19:30:00").getTime(), logins: 1, hour: 19 },

  // July 11
  { date: "2025-07-11 09:45:00", timestamp: new Date("2025-07-11 09:45:00").getTime(), logins: 4, hour: 9 },
  { date: "2025-07-11 15:15:00", timestamp: new Date("2025-07-11 15:15:00").getTime(), logins: 2, hour: 15 },
  { date: "2025-07-11 20:00:00", timestamp: new Date("2025-07-11 20:00:00").getTime(), logins: 3, hour: 20 },

  // July 12
  { date: "2025-07-12 10:15:00", timestamp: new Date("2025-07-12 10:15:00").getTime(), logins: 5, hour: 10 },
  { date: "2025-07-12 14:30:00", timestamp: new Date("2025-07-12 14:30:00").getTime(), logins: 4, hour: 14 },
  { date: "2025-07-12 19:45:00", timestamp: new Date("2025-07-12 19:45:00").getTime(), logins: 6, hour: 19 },

  // July 13
  { date: "2025-07-13 09:00:00", timestamp: new Date("2025-07-13 09:00:00").getTime(), logins: 4, hour: 9 },
  { date: "2025-07-13 15:30:00", timestamp: new Date("2025-07-13 15:30:00").getTime(), logins: 4, hour: 15 },
  { date: "2025-07-13 20:15:00", timestamp: new Date("2025-07-13 20:15:00").getTime(), logins: 6, hour: 20 },

  // July 14
  { date: "2025-07-14 10:30:00", timestamp: new Date("2025-07-14 10:30:00").getTime(), logins: 6, hour: 10 },
  { date: "2025-07-14 14:15:00", timestamp: new Date("2025-07-14 14:15:00").getTime(), logins: 7, hour: 14 },
  { date: "2025-07-14 19:00:00", timestamp: new Date("2025-07-14 19:00:00").getTime(), logins: 6, hour: 19 },

  // July 15
    { date: "2025-07-06 04:30:00", timestamp: new Date("2025-07-06 04:30:00").getTime(), logins: 1, hour: 9 },

  { date: "2025-07-15 09:15:00", timestamp: new Date("2025-07-15 09:15:00").getTime(), logins: 3, hour: 9 },
  { date: "2025-07-15 15:45:00", timestamp: new Date("2025-07-15 15:45:00").getTime(), logins: 5, hour: 15 },
  { date: "2025-07-15 20:30:00", timestamp: new Date("2025-07-15 20:30:00").getTime(), logins: 4, hour: 20 },
    // July 16
  { date: "2025-07-16 04:30:00", timestamp: new Date("2025-07-16 04:30:00").getTime(), logins: 1, hour: 9 },
  { date: "2025-07-16 10:30:00", timestamp: new Date("2025-07-16 10:30:00").getTime(), logins: 2, hour: 10 },
  { date: "2025-07-16 14:15:00", timestamp: new Date("2025-07-16 14:15:00").getTime(), logins: 0, hour: 14 },
  { date: "2025-07-16 19:00:00", timestamp: new Date("2025-07-16 19:00:00").getTime(), logins: 0, hour: 19 },
];

// Tạo dữ liệu tổng hợp theo ngày
export const getDailyStats = (data) => {
  const dailyStats = {};

  data.forEach((item) => {
    const dayKey = format(new Date(item.date), "yyyy-MM-dd");
    if (!dailyStats[dayKey]) {
      dailyStats[dayKey] = {
        date: dayKey,
        totalLogins: 0,
        night: 0,     // 0-6h
        morning: 0,   // 6-12h
        afternoon: 0, // 12-18h
        evening: 0,   // 18-24h
      };
    }

    const hour = new Date(item.date).getHours();
    
    // Update time periods
    if (hour >= 0 && hour < 6) {
      dailyStats[dayKey].night += item.logins;
    } else if (hour >= 6 && hour < 12) {
      dailyStats[dayKey].morning += item.logins;
    } else if (hour >= 12 && hour < 18) {
      dailyStats[dayKey].afternoon += item.logins;
    } else if (hour >= 18 && hour < 24) {
      dailyStats[dayKey].evening += item.logins;
    }

    dailyStats[dayKey].totalLogins += item.logins;
  });

  return Object.values(dailyStats);
};

// Dữ liệu tìm kiếm thành phố
export const citySearchData = [
  { city: "Thành phố Đà Nẵng", searches: 21 },
  { city: "Thành phố Hà Nội", searches: 3 },
  { city: "Tỉnh Quảng Nam", searches: 6 },
  { city: "Thành phố Hồ Chí Minh", searches: 2 },
  { city: "Tỉnh thành khác", searches: 1 },
];

// Dữ liệu khách sạn được truy cập
export const hotelVisitsData = [
  {
    id: 1,
    name: "Maycasa Villa Da Nang",
    location: "Thành phố Đà Nẵng",
    visits: 15,
    rating: 5,
  },
  {
    id: 2,
    name: "Village Da Nang Camping",
    location: "Thành phố Đà Nẵng",
    visits: 7,
    rating: 1,
  },
];
