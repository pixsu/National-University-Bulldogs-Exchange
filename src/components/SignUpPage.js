import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoadingPopUp from './LoadingPopUp';
import { toApiUrl } from '../config/api';

import './components_css/signuppagestyle.css';
import logo3 from '../imgs/websitelogo2.png';

const SignUpPage = () => {
  // Define state variables for form fields and UI behavior
  const [passwordVisible, setPasswordVisible] = useState(false); // Toggles password visibility
  const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false); // Toggles confirm password visibility
  const [selectedCourse, setSelectedCourse] = useState(""); // Stores the selected course
  const [email, setEmail] = useState(""); // Stores the user's email
  const [password, setPassword] = useState(""); // Stores the user's password
  const [confirmPassword, setConfirmPassword] = useState(""); // Stores the password confirmation
  const [firstName, setFirstName] = useState(""); // Stores the user's first name
  const [lastName, setLastName] = useState(""); // Stores the user's last name
  const [loading, setLoading] = useState(false); // Indicates if the signup process is loading
  const [errorMessage, setErrorMessage] = useState(""); // Stores error messages for validation
  const [fieldErrors, setFieldErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    selectedCourse: "",
  });

  const emailPattern = /^[a-zA-Z0-9._%+-]+@students\.nu-moa\.edu\.ph$/;
  const passwordUppercasePattern = /(?=.*[A-Z])(?=.*\d)/;

  const validateFirstName = (value) => {
    if (!value) return "";
    return value.length > 10 ? "First name must be 10 characters or less." : "";
  };

  const validateLastName = (value) => {
    if (!value) return "";
    return value.length > 10 ? "Last name must be 10 characters or less." : "";
  };

  const validateEmail = (value) => {
    if (!value) return "";
    return emailPattern.test(value)
      ? ""
      : "Please enter a valid email address ending with @students.nu-moa.edu.ph.";
  };

  const validatePassword = (value) => {
    if (!value) return "";
    if (value.length < 8) {
      return "Password must be at least 8 characters long.";
    }
    if (!passwordUppercasePattern.test(value)) {
      return "Password must contain at least one uppercase letter and one number.";
    }
    return "";
  };

  const validateConfirmPassword = (value, passwordValue) => {
    if (!value) return "";
    return value === passwordValue ? "" : "Passwords do not match.";
  };

  const validateCourse = (value) => {
    if (!value) return "";
    return "";
  };

  const updateFieldErrors = (updates) => {
    setFieldErrors((previousErrors) => ({
      ...previousErrors,
      ...updates,
    }));
  };

  // Toggles the visibility of the password input field
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // Toggles the visibility of the confirm password input field
  const toggleConfirmPasswordVisibility = () => {
    setConfirmPasswordVisible(!confirmPasswordVisible);
  };

  const handleFirstNameChange = (e) => {
    const value = e.target.value;
    setFirstName(value);
    updateFieldErrors({ firstName: validateFirstName(value) });
  };

  const handleLastNameChange = (e) => {
    const value = e.target.value;
    setLastName(value);
    updateFieldErrors({ lastName: validateLastName(value) });
  };

  const handleEmailChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    updateFieldErrors({ email: validateEmail(value) });
  };

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    updateFieldErrors({
      password: validatePassword(value),
      confirmPassword: confirmPassword ? validateConfirmPassword(confirmPassword, value) : "",
    });
  };

  const handleConfirmPasswordChange = (e) => {
    const value = e.target.value;
    setConfirmPassword(value);
    updateFieldErrors({ confirmPassword: validateConfirmPassword(value, password) });
  };

  const handleCourseChange = (e) => {
    const value = e.target.value;
    setSelectedCourse(value);
    updateFieldErrors({ selectedCourse: validateCourse(value) });
  };

  // Initialize navigation hook to redirect after signup
  const navigate = useNavigate();

  // Handles the form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(""); // Clear any previous error message

    const nextFieldErrors = {
      firstName: firstName ? validateFirstName(firstName) : "First name is required.",
      lastName: lastName ? validateLastName(lastName) : "Last name is required.",
      email: email ? validateEmail(email) : "School email is required.",
      password: password ? validatePassword(password) : "Password is required.",
      confirmPassword: confirmPassword
        ? validateConfirmPassword(confirmPassword, password)
        : "Please confirm your password.",
      selectedCourse: selectedCourse ? validateCourse(selectedCourse) : "Please select your course.",
    };

    setFieldErrors(nextFieldErrors);

    if (Object.values(nextFieldErrors).some((message) => message)) {
      setErrorMessage("Please fix the highlighted fields before continuing.");
      return;
    }

    try {
      setLoading(true); // Show loading spinner while waiting for response

      // Send signup request to server
      const response = await axios.post(toApiUrl('/api/auth/signup'), {
        firstName,
        lastName,
        email,
        password,
        course: selectedCourse,
      });

      // Redirect to login page if signup was successful
      if (response.status === 201) {
        navigate('/login');
      } else {
        // Handle unexpected response status here (optional)
      }
    } catch (error) {
      console.error("Error during signup:", error);
    } finally {
      completeSignup(); // Complete signup process by hiding the loader and navigating
    }
  };

  // Completes signup by stopping loading, clearing errors, and redirecting to login
  const completeSignup = () => {
    setTimeout(() => {
      setLoading(false);
      navigate('/login');
      setErrorMessage(""); // Clear error message on completion
    }, 2000);
  };

  return (
    <section className='bgsec'>
      {/* Show loading popup if loading is true */}
      {loading && <LoadingPopUp />}
      <div className="signup-container">
        {/* Display logo */}
        <img src={logo3} alt="NU MOA Logo" className="signup-logo" />
        <h2>Sign Up to continue</h2>
        <p>Please enter your school email address and password.</p>

        {/* Display error message if it exists */}
        {errorMessage && <p className="error-message">{errorMessage}</p>}

        {/* Signup form with input fields */}
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* First Name and Last Name input fields */}
          <div className="name-inputs">
            <div className="name-input-group">
              <input
                className={fieldErrors.firstName ? 'input-error' : ''}
                type="text"
                placeholder="First Name"
                required
                maxLength={10}
                value={firstName}
                onChange={handleFirstNameChange}
              />
              {fieldErrors.firstName && <p className="field-error">{fieldErrors.firstName}</p>}
            </div>
            <div className="name-input-group">
              <input
                className={fieldErrors.lastName ? 'input-error' : ''}
                type="text"
                placeholder="Last Name"
                required
                maxLength={10}
                value={lastName}
                onChange={handleLastNameChange}
              />
              {fieldErrors.lastName && <p className="field-error">{fieldErrors.lastName}</p>}
            </div>
          </div>

          {/* Email input field */}
          <div className="email-input-group">
            <i className="fas fa-envelope"></i>
            <input
              className={fieldErrors.email ? 'input-error' : ''}
              type="email"
              placeholder="School Email"
              required
              value={email}
              onChange={handleEmailChange}
            />
          </div>
          {fieldErrors.email && <p className="field-error field-error-block">{fieldErrors.email}</p>}

          {/* Password input field with toggle visibility */}
          <div className="password-input-group">
            <i className="fas fa-lock"></i>
            <input
              className={fieldErrors.password ? 'input-error' : ''}
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              required
              minLength={8}
              maxLength={20}
              value={password}
              onChange={handlePasswordChange}
            />
            <i
              className={passwordVisible ? "fas fa-eye-slash" : "fas fa-eye"}
              onClick={togglePasswordVisibility}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>
          {fieldErrors.password && <p className="field-error field-error-block">{fieldErrors.password}</p>}

          {/* Confirm Password input field */}
          <div className="confirmpassword-input-group">
            <i className="fas fa-lock"></i>
            <input
              className={fieldErrors.confirmPassword ? 'input-error' : ''}
              type={confirmPasswordVisible ? "text" : "password"}
              placeholder="Confirm Password"
              required
              minLength={8}
              maxLength={20}
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <i
              className={confirmPasswordVisible ? "fas fa-eye-slash" : "fas fa-eye"}
              onClick={toggleConfirmPasswordVisibility}
              style={{ cursor: 'pointer' }}
            ></i>
          </div>
          {fieldErrors.confirmPassword && <p className="field-error field-error-block">{fieldErrors.confirmPassword}</p>}

          {/* Course selection dropdown */}
          <div className="course-input-group">
            <select
              className={fieldErrors.selectedCourse ? 'input-error' : ''}
              required
              value={selectedCourse}
              onChange={handleCourseChange}
            >
              <option value="" disabled>Select Your Course</option>
              {/* List of course options */}
              <option value="BS Architecture">BS Architecture</option>
              <option value="BS Financial Management">BS Financial Management</option>
              <option value="BS Information Technology - MWA">BS Information Technology - MWA</option>
              <option value="BS Marketing Management">BS Marketing Management</option>
              <option value="BS Medical Technology">BS Medical Technology</option>
              <option value="BS Nursing">BS Nursing</option>
              <option value="BS Psychology">BS Psychology</option>
              <option value="Doctor of Dental Medicine">Doctor of Dental Medicine</option>
              <option value="Doctor of Optometry">Doctor of Optometry</option>
              <option value="Senior High School">Senior High School</option>
            </select>
          </div>
          {fieldErrors.selectedCourse && <p className="field-error field-error-block">{fieldErrors.selectedCourse}</p>}

          {/* Signup button */}
          <button type="submit" className="signup-btn" disabled={loading}>
            {loading ? "Signing Up..." : "Sign Up"}
          </button>

          {/* Link to login page */}
          <p className="login-link">
            Already have an account? <a href="/login">Log In</a>
          </p>
        </form>
      </div>
    </section>
  );
};

export default SignUpPage;
