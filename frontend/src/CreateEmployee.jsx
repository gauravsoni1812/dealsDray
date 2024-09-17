/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie'; // Import js-cookie
export default function CreateEmployee() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [designation, setDesignation] = useState('');
  const [gender, setGender] = useState('');
  const [courses, setCourses] = useState([]);
  const [image, setImage] = useState(null);

  // Handle form submission
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

      } catch (error) {
        console.error('Error checking authentication:', error);
        navigate('/login');
      }
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form from reloading the page

    // Retrieve token from cookies
    const token = Cookies.get('token');

    // Create FormData object
    const formData = new FormData();
    // formData.append('preview', preview);
    formData.append('Name', name);
    formData.append('Email', email);
    formData.append('Mobile', phone);
    formData.append('Designation', designation);
    formData.append('Gender', gender);
    formData.append('Course', courses.join(',')); // Join courses array into a comma-separated string
    formData.append('CreateDate', new Date().toISOString());
    if (image) formData.append('Image', image);

    try {
      const response = await axios.post('http://localhost:3000/employees', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`, // Add token to the Authorization header
        },
      });

      if (response.status === 201) {
        console.log('Employee created successfully', response.data);

        // Reset form fields
        setName('');
        setEmail('');
        setPhone('');
        setDesignation('');
        setGender('');
        setCourses([]);
        setImage(null);

        // Optionally, redirect or show a success message
        navigate('/show-employees');

      } else {
        console.log('Failed to create employee', response.data.message);
        // Handle failure (show an error message)
      }
    } catch (error) {
      console.error('Error during employee creation:', error.response?.data || error.message);
      // Handle error (show an error message)
    }
  };

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8 bg-violet-100">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Create an Employee
          </h2>
          <div className="mt-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium leading-6 text-gray-900">
                  Name
                </label>
                <div className="mt-2">
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    autoComplete="name"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                  Email address
                </label>
                <div className="mt-2">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    autoComplete="email"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="phone" className="block text-sm font-medium leading-6 text-gray-900">
                  Phone
                </label>
                <div className="mt-2">
                  <input
                    id="phone"
                    name="phone"
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    autoComplete="tel"
                    className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
              <div>
                <label htmlFor="designation" className="block text-sm font-medium leading-6 text-gray-900">
                  Designation
                </label>
                <div className="mt-2">
                  <select
                    id="designation"
                    name="designation"
                    value={designation}
                    onChange={(e) => setDesignation(e.target.value)}
                    className="p-2 block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  >
                    <option value="Hr">HR</option>
                    <option value="Manager">Manager</option>
                    <option value="Sales">Sales</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Gender
                </label>
                <div className="mt-2 flex gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="male"
                      checked={gender === 'male'}
                      onChange={(e) => setGender(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300"
                    />
                    <span className="ml-2 text-gray-900">Male</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="radio"
                      name="gender"
                      value="female"
                      checked={gender === 'female'}
                      onChange={(e) => setGender(e.target.value)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300"
                    />
                    <span className="ml-2 text-gray-900">Female</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Courses
                </label>
                <div className="mt-2 flex flex-wrap gap-4">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="courses"
                      value="MBA"
                      checked={courses.includes('MBA')}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCourses((prevCourses) =>
                          prevCourses.includes(value)
                            ? prevCourses.filter((course) => course !== value)
                            : [...prevCourses, value]
                        );
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300"
                    />
                    <span className="ml-2 text-gray-900">MBA</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="courses"
                      value="BCA"
                      checked={courses.includes('BCA')}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCourses((prevCourses) =>
                          prevCourses.includes(value)
                            ? prevCourses.filter((course) => course !== value)
                            : [...prevCourses, value]
                        );
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300"
                    />
                    <span className="ml-2 text-gray-900">BCA</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      name="courses"
                      value="BSC"
                      checked={courses.includes('BSC')}
                      onChange={(e) => {
                        const value = e.target.value;
                        setCourses((prevCourses) =>
                          prevCourses.includes(value)
                            ? prevCourses.filter((course) => course !== value)
                            : [...prevCourses, value]
                        );
                      }}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-600 border-gray-300"
                    />
                    <span className="ml-2 text-gray-900">BSC</span>
                  </label>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-gray-900">
                  Upload an Image
                </label>
                <div className="mt-2 border-2 border-dashed border-gray-300 rounded-md p-4">
                  <input
                    type="file"
                    accept=".jpg, .jpeg, .png"
                    onChange={(e) => {
                      setImage(e.target.files[0])
                    }}
                    className="block w-full text-gray-900 border-gray-300 rounded-md shadow-sm focus:ring-indigo-600 focus:border-indigo-600"
                  />
                  <p className="mt-1 text-gray-500 text-xs">
                    Only .jpg, .jpeg, and .png files are allowed.
                  </p>
                </div>
              </div>
              <div className="flex justify-center">
                <button
                  type="submit"
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm ring-1 ring-gray-300 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                >
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
