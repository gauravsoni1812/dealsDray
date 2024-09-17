/* eslint-disable no-unused-vars */
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
 
  useEffect(() => {
    // Function to check if the user is authenticated
    const checkAuth = async () => {
      try {
        // Make a request to a protected endpoint or check a token in cookies/local storage
        // For example, you could check if a token exists
        const token = document.cookie.split('; ').find(row => row.startsWith('token='));
        if (!token) {
          // Redirect to login if no token is found
          navigate('/login');
        }
        // Optionally, make an API request to validate the token
        // const response = await axios.get('http://localhost:3000/validate-token', { withCredentials: true });
        // if (response.status !== 200) {
        //   navigate('/login');
        // }
      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-violet-100 h-screen">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-center text-3xl font-bold leading-9 tracking-tight text-gray-900 mb-6">
            Welcome to the Dashboard
          </h2>
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-2">
                View all the employees
              </p>
              <Link to="/show-employees" className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm ring-1 ring-gray-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600">
                View All Employees
              </Link>
            </div>
            <div className="text-center">
              <p className="text-lg text-gray-700 mb-2">
                Create a new employee
              </p>
              <Link to="/create-employee" className="inline-flex justify-center rounded-md border border-transparent bg-green-600 py-2 px-4 text-sm font-medium text-white shadow-sm ring-1 ring-gray-300 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-600">
                Create New Employee
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;
