const ApiConstants = {
  //AUTH:
  LOGIN_CUSTOMER: "/auth/login_customer",
  GOOGLE_LOGIN: "./auth/google_login",
  REGISTER_CUSTOMER: "/auth/register_customer",
  UPDATE_PROFILE: "/auth/updateProfile_customer",
  CHANGE_PASSWORD: "/auth/changePassword_customer",
  VERIFY_EMAIL: "/auth/verify-email",
  RESEND_VERIFICATION: "/auth/resend-verification",
  UPDATE_PROFILE: "/auth/updateProfile_customer",
  CHANGE_PASSWORD: "/auth/changePassword_customer",
  UPDATE_AVATAR: "/auth/update_avatar",
  FORGOT_PASSWORD: "/auth/forgot_password",
  RESET_PASSWORD: "/auth/reset_password",
  VERIFY_FORGOT_PASSWORD: "/auth/verify_forgot_password",
  //SEARCH:
  SEARCH_HOTEL: "/search",
  FETCH_FAVORITE_HOTELS: "/hotel/get-hotel-byId",
  REMOVE_FAVORITE_HOTELS: "/hotel/remove-favorite",
  ADD_FAVORITE_HOTELS: "/hotel/add-favorite",
  //HOTEL
  FETCH_DETAIL_HOTELS: "/hotel/hotel_detail/:hotelId",
  FETCH_ROOM: "/room/rooms_information/:hotelId",
  FETCH_ALL_HOTEL: "/hotel/get-all-hotel",

  //FEEDBACK:
  FETCH_ROOM_DETAIL: "/room/rooms_detail/:roomId",
  FETCH_TOP3_HOTEL:"hotel/top-bookings",
  //FEEDBACK:
  FETCH_FEEDBACK_BY_HOTELID: 'feedback/get-feedback-hotel/:hotelId',
  LIKE_FEEDBACK: 'feedback/like',
  DISLIKE_FEEDBACK: 'feedback/dislike',
  FETCH_FEEDBACK_BY_ID:'feedback/getFeedbackById/:feedbackId',

  //CREATE_BOOKING:
  CREATE_BOOKING: 'payment/create-booking',
  CHECKOUT_BOOKING: 'payment/checkout-booking',
  CANCEL_PAYMENT: 'payment/cancel-payment',
  ACCEPT_PAYMENT: 'payment/accept-payment',

  //RESERVATION:
  FETCH_DETAIL_RESERVATION: '/reservations/detail',
  FETCH_USER_RESERVATIONS: "reservations/get-reservation",
  FETCH_RESERVATION_DETAIL:"reservations/reservations-detail/:id",
  UPDATE_RESERVATION:"reservations/update-reservations/:id",
  
  //FEEDBACK
  FETCH_FEEDBACK_BY_HOTELID: "feedback/get-feedback-hotel/:hotelId",
  FETCH_USER_FEEDBACKS: "feedback/my-feedbacks",
  UPDATE_FEEDBACK: "feedback/update-feedback/:feedbackId",
  DELETE_FEEDBACK: "",
  CREATE_FEEDBACK:"feedback/create-feedback",
  UPDATE_FEEDBACK_STATUS: "feedback/updateStatusFeedback/:feedbackId",

  //REFUNDING_RESERVATION
  CREATE_REFUNDING_RESERVATION: "refunding_reservation/create",
  GET_REFUNDING_RESERVATION_BYUSERID: "refunding_reservation/by_userId",
  UPDATE_BANKING_INFO: "refunding_reservation/banking-info",
  
  ///REPORTFEEDBACK
  REPORT_FEEDBACK:"reportFeedback/create_report_feedback",
  FETCH_REPORTS_BY_USERID:"reportFeedback/my-reports",
  DELETE_REPORTED_FEEDBACK:"reportFeedback/delete_report_feedback/:reportId",
  GET_ALL_REPORTED_FEEDBACKS: "/reportFeedback/getReportedFeedbackDetails",
  GET_REPORTS_BY_FEEDBACK_ID: "/reportFeedback/getReportedFeedbackByFeedbackId/:feedbackId",
  UPDATE_REPORT_STATUS: "/reportFeedback/updateReportStatus/:reportId",


  //chat
  FETCH_CHAT_MESSAGE: '/chat/chat-history/:receiverId',
  FETCH_CHAT_ALL_USERS: '/chat/chat-users',

  //ADMIN DASHBOARD
  ADMIN_DASHBOARD_METRICS: '/dashboard-admin/metrics',

  //MONTHLY PAYMENT (Admin)
  FETCH_ALL_MONTHLY_PAYMENTS: "/monthly-payment/admin/all",
  UPDATE_PAYMENT_STATUS: "/monthly-payment/admin/:paymentId/status",
  GET_PAYMENT_BY_ID: "/monthly-payment/admin/:paymentId",

  //PROMOTION (Admin)
  FETCH_ALL_PROMOTIONS: "/promotions",
  CREATE_PROMOTION: "/promotions",
  UPDATE_PROMOTION: "/promotions/:id",
  DELETE_PROMOTION: "/promotions/:id",
  GET_PROMOTION_BY_ID: "/promotions/:id",
  TOGGLE_PROMOTION_STATUS: "/promotions/:id/status",

  // PROMOTION USER MANAGEMENT (Admin)
  GET_PROMOTION_USERS: "/promotions/:id/users",
  GET_USER_PROMOTIONS: "/promotions/users/:userId",
  REMOVE_USER_FROM_PROMOTION: "/promotions/:id/users/:userId",
  RESET_USER_PROMOTION_USAGE: "/promotions/:id/users/:userId/reset",


  GET_ALL_REFUND: "/payment/getAllRefund",
  REFUND:"payment/stripe-refund/:id",
  // CUSTOMER MANAGEMENT (Admin)
  LOCK_CUSTOMER: "/auth/lock-customer/:id",
  UNLOCK_CUSTOMER: "/auth/unlock-customer/:id",
  // HOTEL
  FETCH_HOTELS_NOT_APPROVAL: "/hotel/get-hotels-not-approval",
  UPDATE_APPROVAL_STATUS: "/hotel/update-approval-status/:approvalId",
  GET_APPROVAL_BY_ID:"hotel/get-approval-by-id/:id"
};

export default ApiConstants;
