import React, { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const LoginRegister = () => {
  const [isSignInForm, setIsSignInForm] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const emailRef = useRef(null);
  const passwordRef = useRef(null);
  const nameRef = useRef(null);
  const navigate = useNavigate();
  const { login, register, currentUser } = useAuth(); 

  useEffect(() => {
    if (currentUser) {
      navigate('/tasks');
    }
  }, [currentUser, navigate]);

  const handleButtonClick = async (e) => {
    e.preventDefault();
    setErrorMessage(''); // Reset error message

    // Validate input fields
    const email = emailRef.current.value;
    const password = passwordRef.current.value;
    const name = nameRef.current?.value;

    if (isSignInForm) {
      // Sign-in validation
      if (!email || !password) {
        setErrorMessage('Email and Password are required.');
        return;
      }

      try {
        const loginResponse = await login(email, password);
        
        if (loginResponse.error) {
          setErrorMessage(loginResponse.error); 
          return; 
        }

        console.log('Login successful!', loginResponse.data);
        navigate('/tasks'); 

      } catch (error) {
        console.error('An unexpected error occurred:', error);
        setErrorMessage('An unexpected error occurred. Please try again.'); 
      }
    } else {
      // Registration validation
      if (!name || !email || !password) {
        setErrorMessage('Full Name, Email, and Password are required.');
        return;
      }

      try {
        const registerResponse = await register(name, email, password);

        if (registerResponse.error) {
          setErrorMessage(registerResponse.error); 
          return;
        }

        console.log('Registration successful!', registerResponse.data);
        navigate('/tasks'); 

      } catch (error) {
        console.error('An unexpected error occurred:', error);
        setErrorMessage('An unexpected error occurred. Please try again.'); 
      }
    }
  };

  return (
    <div className="flex justify-center items-center h-screen absolute top-0 left-0 right-0 bottom-0 ">
      <form className="bg-white p-8 rounded-lg shadow-lg w-96" onSubmit={handleButtonClick}>
        <h1 className="text-3xl font-bold mb-6 text-center text-gray-800">
          {isSignInForm ? 'Login' : 'Register'}
        </h1>

        {!isSignInForm && (
          <input
            type="text"
            ref={nameRef}
            placeholder="Full Name"
            className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          />
        )}

        <input
          type="email"
          ref={emailRef}
          placeholder="Email"
          className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        <input
          type="password"
          ref={passwordRef}
          placeholder="Password"
          className="border border-gray-300 p-3 rounded-lg w-full mb-4 focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />

        {errorMessage && <p className="text-red-500 text-center font-semibold mb-4">{errorMessage}</p>}

        <button 
          className="bg-blue-500 text-white w-full py-3 rounded-lg hover:bg-blue-600 transition-colors"
          type="submit" 
        >
          {isSignInForm ? 'Login' : 'Register'}
        </button>

        <p className="text-center font-semibold text-gray-600 mt-6">
          {isSignInForm ? 'New to TaskFlow?' : 'Already have an account?'}{' '}
          <span
            className="text-blue-500 cursor-pointer hover:underline"
            onClick={() => setIsSignInForm(!isSignInForm)}
          >
            {isSignInForm ? 'Register' : 'Login'}
          </span>
        </p>
      </form>
    </div>
  );
};

export default LoginRegister;
