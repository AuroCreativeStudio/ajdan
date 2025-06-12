// src/pages/Dashboard.jsx
import { useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

function Dashboard({ token, user }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  return (
    <div className="bg-gray-100 ml-64 p-8 font-sans min-h-screen">
      <div className="flex flex-col gap-8">

        {/* Greeting Card */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-indigo-500 text-white rounded-xl p-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Good Morning, {user?.username || "William"}!</h2>
            <p className="mb-4">Here’s what’s happening with your store today.</p>
            <div className="flex gap-4">
              <div className="bg-white/20 px-4 py-3 rounded-lg">
                <span className="block text-lg font-semibold">86 New orders</span>
                <small className="text-sm">Awaiting processing</small>
              </div>
              <div className="bg-white/20 px-4 py-3 rounded-lg">
                <span className="block text-lg font-semibold">35 Products</span>
                <small className="text-sm">Out of stock</small>
              </div>
            </div>
          </div>
          <div className="mt-6 md:mt-0">
            <img
              src="https://i.ibb.co/k14zppP/illustration.png"
              alt="Illustration"
              className="w-32"
            />
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Total Sales Chart */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Total Sales</h3>
              <select className="border border-gray-300 rounded px-3 py-1 text-sm">
                <option>Monthly</option>
              </select>
            </div>
            <div className="h-52 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              [Total Sales Chart]
            </div>
          </div>

          {/* Side Cards */}
          <div className="flex flex-col gap-6">

            {/* Total Orders */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="text-lg font-semibold">Total Orders</h4>
              <p className="text-xl font-bold mt-2">
                $72,458 <span className="text-red-600 text-sm">-7.8%</span>
              </p>
              <div className="h-14 bg-gray-200 rounded my-4 flex items-center justify-center text-gray-500 text-sm">
                [Orders Chart]
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Completed 62%</span>
                <span>Pending 38%</span>
              </div>
            </div>

            {/* Total Customers */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="text-lg font-semibold">Total Customers</h4>
              <p className="text-xl font-bold mt-2">
                1,528 <span className="text-green-600 text-sm">+5.4</span>
              </p>
              <div className="h-14 bg-gray-200 rounded my-4 flex items-center justify-center text-gray-500 text-sm">
                [Customers Chart]
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="text-lg font-semibold">Total Revenue</h4>
              <p className="text-xl font-bold mt-2">
                $165,458 <span className="text-green-600 text-sm">+10%</span>
              </p>
              <div className="h-14 bg-gray-200 rounded my-4 flex items-center justify-center text-gray-500 text-sm">
                [Revenue Chart]
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Fashion 75%</span>
                <span>Others 25%</span>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
