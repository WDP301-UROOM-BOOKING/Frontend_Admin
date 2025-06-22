import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Form, Button, Card, Modal, Spinner } from "react-bootstrap";
import { FaEye, FaEyeSlash, FaUser, FaLock, FaHotel } from "react-icons/fa";
import * as Routers from "@utils/Routes";
import Banner from "@images/banner.jpg";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import AuthActions from "@redux/auth/actions";
import { showToast, ToastProvider } from "@components/ToastContainer";
import { clearToken } from "@utils/handleToken";
import Utils from "@utils/Utils";
import GoogleLogin from "./GoogleLogin";

const LoginPage = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [unverifiedEmail, setUnverifiedEmail] = useState("");
  const [formData, setFormData] = useState({
    email: "ad1@gm.com",
    password: "12345678",
    rememberMe: false,
  });

  // Check for messages in location state when component mounts or location changes
  useEffect(() => {
    if (location.state?.message) {
      showToast.success(location.state.message);
      // Clear the message from location state to prevent showing it again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleResendVerification = () => {
    if (!unverifiedEmail) {
      setShowVerifyModal(false);
      return;
    }

    setIsResending(true);
    console.log("ABC");
    dispatch({
      type: AuthActions.RESEND_VERIFICATION,
      payload: {
        data: { email: unverifiedEmail },
        onSuccess: (data) => {
          setIsResending(false);
          showToast.success(
            "A new verification code has been sent to your email"
          );
          setShowVerifyModal(false);
          navigate(Routers.VerifyCodeRegisterPage, {
            state: {
              message: "Please check your email for the verification code",
              email: unverifiedEmail,
            },
          });
        },
        onFailed: (msg) => {
          setIsResending(false);
          showToast.error(msg);
        },
        onError: (error) => {
          setIsResending(false);
          showToast.error("Failed to resend verification code");
        },
      },
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const passwordRegex = /^.{8,}$/; // tối thiểu 6 ký tự
    if (!formData.email || !formData.password) {
      showToast.warning(
        "Email and password is required. Please fill in completely !"
      );
    } else if (!emailRegex.test(formData.email)) {
      showToast.warning("Invalid email format. Enter email again !!!");
    } else if (!passwordRegex.test(formData.password)) {
      showToast.warning(
        "Password must be at least 8 characters.  Enter password again !!!"
      );
    } else {
      setIsLoading(true);
      dispatch({
        type: AuthActions.LOGIN,
        payload: {
          data: { email: formData.email, password: formData.password },
          onSuccess: (user) => {
            setIsLoading(false);
            if (user.isLocked) {
              navigate(Routers.BannedPage, {
                state: {
                  reasonLocked: user.reasonLocked,
                  dateLocked: Utils.getDate(user.dateLocked, 4),
                },
              });
              dispatch({ type: AuthActions.LOGOUT });
              clearToken();
            } else {
              navigate(Routers.DashboardAdmin, {
                state: { message: "Login account successfully !!!" },
              });
            }
          },
          onFailed: (msg) => {
            setIsLoading(false);
            // Check if the error is about email not being verified
            if (msg === "Your email is not verified") {
              setUnverifiedEmail(formData.email);
              setShowVerifyModal(true);
            } else {
              showToast.warning("Email or password is not correct");
              setFormData({ ...formData, password: "" });
            }
          },
          onError: (error) => {
            setIsLoading(false);
            showToast.error("Email or password is not correct");
          },
        },
      });
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div
      className="min-vh-100 d-flex align-items-center justify-content-center py-5"
      style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}
    >
      {/* Background Animation */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          background: `url(${Banner})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.1,
          zIndex: 1
        }}
      />
      
      {/* Floating shapes */}
      <div
        style={{
          position: 'absolute',
          top: '10%',
          left: '10%',
          width: '100px',
          height: '100px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 6s ease-in-out infinite',
          zIndex: 1
        }}
      />
      <div
        style={{
          position: 'absolute',
          bottom: '10%',
          right: '10%',
          width: '150px',
          height: '150px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '50%',
          animation: 'float 4s ease-in-out infinite reverse',
          zIndex: 1
        }}
      />

      <Container className="position-relative" style={{ zIndex: 2 }}>
        <ToastProvider />
        <Card 
          className="mx-auto shadow-lg"
          style={{ 
            maxWidth: "450px",
            borderRadius: "20px",
            border: "none",
            background: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(10px)",
            transform: "translateY(0)",
            transition: "all 0.3s ease"
          }}
        >
          <Card.Body className="p-5">
            {/* Logo Section */}
            <div className="text-center mb-4">
              <div
                className="d-inline-flex align-items-center justify-content-center rounded-circle mb-3"
                style={{
                  width: "80px",
                  height: "80px",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  color: "white",
                  fontSize: "2rem",
                  boxShadow: "0 10px 30px rgba(102, 126, 234, 0.3)"
                }}
              >
                <FaHotel />
              </div>
              <h2 
                className="text-center mb-2"
                style={{
                  fontWeight: "700",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  fontSize: "2rem"
                }}
              >
                Welcome Back
              </h2>
              <p className="text-muted mb-4">Sign in to your admin account</p>
            </div>

            <Form onSubmit={handleSubmit}>
              {/* Email Input */}
              <Form.Group className="mb-4">
                <div className="position-relative">
                  <div
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#667eea",
                      fontSize: "1.1rem",
                      zIndex: 10
                    }}
                  >
                    <FaUser />
                  </div>
                  <Form.Control
                    type="text"
                    placeholder="Enter your email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    style={{
                      paddingLeft: "45px",
                      paddingRight: "15px",
                      height: "55px",
                      borderRadius: "15px",
                      border: "2px solid #e3e6f0",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "rgba(255, 255, 255, 0.8)"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.boxShadow = "0 0 0 0.2rem rgba(102, 126, 234, 0.25)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e3e6f0";
                      e.target.style.boxShadow = "none";
                    }}
                    required
                  />
                </div>
              </Form.Group>

              {/* Password Input */}
              <Form.Group className="mb-3">
                <div className="position-relative">
                  <div
                    className="position-absolute d-flex align-items-center justify-content-center"
                    style={{
                      left: "15px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      color: "#667eea",
                      fontSize: "1.1rem",
                      zIndex: 10
                    }}
                  >
                    <FaLock />
                  </div>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    style={{
                      paddingLeft: "45px",
                      paddingRight: "50px",
                      height: "55px",
                      borderRadius: "15px",
                      border: "2px solid #e3e6f0",
                      fontSize: "1rem",
                      transition: "all 0.3s ease",
                      background: "rgba(255, 255, 255, 0.8)"
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "#667eea";
                      e.target.style.boxShadow = "0 0 0 0.2rem rgba(102, 126, 234, 0.25)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "#e3e6f0";
                      e.target.style.boxShadow = "none";
                    }}
                    required
                  />
                  <Button
                    variant="link"
                    className="position-absolute text-decoration-none h-100 d-flex align-items-center pe-3"
                    style={{ 
                      right: 0, 
                      top: 0,
                      color: "#667eea",
                      fontSize: "1.1rem"
                    }}
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </Button>
                </div>
              </Form.Group>

              {/* Login Button */}
              <Button
                type="submit"
                className="w-100 mb-4 mt-3"
                disabled={isLoading}
                style={{
                  height: "55px",
                  borderRadius: "15px",
                  border: "none",
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  fontSize: "1.1rem",
                  fontWeight: "600",
                  boxShadow: "0 8px 25px rgba(102, 126, 234, 0.3)",
                  transition: "all 0.3s ease"
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow = "0 12px 35px rgba(102, 126, 234, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow = "0 8px 25px rgba(102, 126, 234, 0.3)";
                }}
              >
                {isLoading ? (
                  <>
                    <Spinner
                      as="span"
                      animation="border"
                      size="sm"
                      role="status"
                      aria-hidden="true"
                      className="me-2"
                    />
                    Logging in...
                  </>
                ) : (
                  "Login Account"
                )}
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>

      {/* Verification Modal */}
      <Modal
        show={showVerifyModal}
        onHide={() => setShowVerifyModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Account Not Verified</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Your account hasn't been verified yet. Would you like to receive a
            new verification code?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowVerifyModal(false)}>
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleResendVerification}
            disabled={isResending}
          >
            {isResending ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Sending...
              </>
            ) : (
              "Send Verification Code"
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* CSS Animation */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        
        .card:hover {
          transform: translateY(-5px) !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15) !important;
        }
      `}</style>
    </div>
  );
};

export default LoginPage;
