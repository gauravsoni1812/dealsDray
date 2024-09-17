/* eslint-disable no-unused-vars */
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';
import EditEmployee from "./EditEmployee";

const ShowEmployee = () => {
    const [ShowEmployee, setShowEmployee] = useState(true);
    const [userData, setUserData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [editableData, setEditableData] = useState(null);
    const [sortField, setSortField] = useState(''); // Track sorting field
    const [sortOrder, setSortOrder] = useState('asc'); // Track sorting order
    const [currentPage, setCurrentPage] = useState(1); // Track current page
    const itemsPerPage = 8; // Items per page
    const navigate = useNavigate(); // Initialize useNavigate

    const f = () => {
        setShowEmployee(true);
    };

    // Fetch data from the API
    useEffect(() => {
        const fetchData = async () => {
            const token = Cookies.get('token');
            try {
                const response = await axios.get("http://localhost:3000/employees", {
                    headers: {
                        'Authorization': `Bearer ${token}`, // Add token to the Authorization header
                    },
                });
                const employeeData = response.data;
                setUserData(employeeData);
                setFilteredData(employeeData); // Set filtered data to the full list initially
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };
        fetchData();
    }, []);

    // Handle search input
    const handleSearch = (e) => {
        const query = e.target.value.toLowerCase();
        setSearchQuery(query);

        const filtered = userData.filter((user) => 
            user.Name.toLowerCase().includes(query) ||
            user.Email.toLowerCase().includes(query) ||
            user.Mobile.toLowerCase().includes(query)
        );
        setFilteredData(filtered);
        setCurrentPage(1); // Reset to first page after search
    };

    // Handle sorting
    const handleSort = (field) => {
        const order = sortOrder === 'asc' ? 'desc' : 'asc'; // Toggle sort order
        setSortOrder(order);
        setSortField(field);

        const sortedData = [...filteredData].sort((a, b) => {
            if (a[field] < b[field]) {
                return order === 'asc' ? -1 : 1;
            }
            if (a[field] > b[field]) {
                return order === 'asc' ? 1 : -1;
            }
            return 0;
        });

        setFilteredData(sortedData);
    };

    // Get current page data
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Handle pagination
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Navigate to create employee page
    const handleAddEmployeeClick = () => {
        navigate('/create-employee'); // Redirect to the create employee page
    };

    // Handle delete
    const handleDelete = async (id) => {
        const token = Cookies.get('token');
        try {
            await axios.delete(`http://localhost:3000/employees/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`, // Add token to the Authorization header
                },
            });
            // Update state to remove the deleted employee
            setUserData(userData.filter(user => user.id !== id));
            setFilteredData(filteredData.filter(user => user.id !== id));
        } catch (error) {
            console.error("Error deleting employee:", error);
        }
    };

    return (
        <>
            {!ShowEmployee && <EditEmployee employee={editableData} change={f} />}
            {ShowEmployee && <div className="App bg-gray-100">
                <div className="relative">
                    {/* Add Employee Button */}
                    <button
                        onClick={handleAddEmployeeClick}
                        className="absolute top-4 right-4 px-4 py-2 bg-blue-500 text-white rounded-xl hover:bg-blue-600"
                    >
                        Add Employee
                    </button>

                    <div className="">
                        <div className="flex justify-center items-center mb-2">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search by Name, Email or Mobile..."
                                className="my-2 mx-2 p-2 border border-gray-300 rounded-xl"
                            />
                            <button
                                className="search-icon px-4 py-2 bg-green-500 text-white rounded-xl hover:bg-green-600"
                            >
                                Search
                            </button>
                        </div>

                        <div className="flex justify-center">
                            <div className="min-w-screen h-[80vh] w-[90vw] flex justify-center bg-gray-100 font-sans overflow-x-scroll">
                                <div className="w-full lg:w-5/6">
                                    <div className="rounded my-6 flex justify-center">
                                        <table className="min-w-max w-full table-auto">
                                            <thead>
                                                <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                                                    <th className="py-3 px-6 text-center" onClick={() => handleSort('id')}>Unique id</th>
                                                    <th className="py-3 px-6 text-center">Image</th>
                                                    <th className="py-3 px-6 text-center" onClick={() => handleSort('Name')}>Name</th>
                                                    <th className="py-3 px-6 text-center" onClick={() => handleSort('Email')}>Email</th>
                                                    <th className="py-3 px-6 text-center">Mobile No</th>
                                                    <th className="py-3 px-6 text-center">Designation</th>
                                                    <th className="py-3 px-6 text-center">Gender</th>
                                                    <th className="py-3 px-6 text-center">Course</th>
                                                    <th className="py-3 px-6 text-center" onClick={() => handleSort('CreateDate')}>Create Date</th>
                                                    <th className="py-3 px-6 text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody className="text-gray-600 text-sm font-light">
                                                {currentItems.map((user) => (
                                                    <tr key={user.id} className="border-b border-grey-600">
                                                        <td className="py-3 px-6 text-center whitespace-nowrap">{user.id}</td>
                                                        <td className="py-3 px-6 text-center whitespace-nowrap">
                                                            <img className="h-8" src={`http://localhost:3000/${user.Image}`} alt="" />
                                                        </td>
                                                        <td className="py-3 px-6 text-center whitespace-nowrap">{user.Name}</td>
                                                        <td className="py-3 px-6 text-center whitespace-nowrap">{user.Email}</td>
                                                        <td className="py-3 px-6 text-center whitespace-nowrap">{user.Mobile}</td>
                                                        <td className="py-3 px-6 text-center whitespace-nowrap">{user.Designation}</td>
                                                        <td className="py-3 px-6 text-center whitespace-nowrap">{user.Gender}</td>
                                                        <td className="py-3 px-6 text-center whitespace-nowrap">{user.Course}</td>
                                                        <td className="py-3 px-6 text-center whitespace-nowrap">{user.CreateDate}</td>
                                                        <td className="py-3 px-6 text-center">
                                                            <div className="flex item-center justify-center">
                                                                <div
                                                                    className="edit w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                                                                    onClick={() => {
                                                                        setEditableData(user);
                                                                        setShowEmployee(false);
                                                                    }}
                                                                >
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                                <div className="w-4 mr-2 transform hover:text-red-500 hover:scale-110 cursor-pointer" onClick={() => handleDelete(user.id)}>
                                                                    <svg
                                                                        xmlns="http://www.w3.org/2000/svg"
                                                                        fill="none"
                                                                        viewBox="0 0 24 24"
                                                                        stroke="currentColor"
                                                                    >
                                                                        <path
                                                                            strokeLinecap="round"
                                                                            strokeLinejoin="round"
                                                                            strokeWidth={2}
                                                                            d="M6 19c0 1.104.896 2 2 2h8c1.104 0 2-.896 2-2V7H6v12zm4-10h4m-4 4h4m-4 4h4M4 7h16M5 7V5c0-1.104.896-2 2-2h10c1.104 0 2 .896 2 2v2h1c.553 0 1 .447 1 1v1H3V8c0-.553.447-1 1-1h1z"
                                                                        />
                                                                    </svg>
                                                                </div>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>

                                        {/* Pagination */}
                                     
                                    </div>
                                    <div className="flex justify-center my-4">
                                            {[...Array(Math.ceil(filteredData.length / itemsPerPage)).keys()].map((page) => (
                                                <button
                                                    key={page + 1}
                                                    onClick={() => paginate(page + 1)}
                                                    className={`mx-1 px-3 py-1 border rounded ${currentPage === page + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                                                >
                                                    {page + 1}
                                                </button>
                                            ))}
                                        </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>}
        </>
    );
};

export default ShowEmployee;
