// src/pages/Dashboard.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchContactList } from '../../services/contactService';
import { fetchProjectPopups } from '../../services/projectPopupService';
import { subscribeToNewsletter } from '../../services/newsletterService';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register required Chart.js components
Chart.register(BarElement, CategoryScale, LinearScale);

function Dashboard({ token, user }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [contactFormCount, setContactFormCount] = useState(0);
  const [projectPopupCount, setProjectPopupCount] = useState(0);
  const [newsletterCount, setNewsletterCount] = useState(0);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    fetchContactList().then(data => {
      setContactFormCount(Array.isArray(data?.data) ? data.data.length : Array.isArray(data) ? data.length : 0);
    });
    fetchProjectPopups().then(data => {
      setProjectPopupCount(Array.isArray(data?.data) ? data.data.length : Array.isArray(data) ? data.length : 0);
    });
    subscribeToNewsletter().then(data => {
      setNewsletterCount(Array.isArray(data?.data) ? data.data.length : Array.isArray(data) ? data.length : 0);
    });
  }, []);

  // Chart data for last 30 days (dummy data, replace with real if available)
  const chartData = {
    labels: ['Contact Forms', 'Project Popups', 'Newsletters'],
    datasets: [
      {
        label: 'Last 30 Days',
        data: [contactFormCount, projectPopupCount, newsletterCount],
        backgroundColor: [
          '#8AA3B4', // Contact Forms
          '#AEA4B6', // Project Popups
          '#A58C76', // Newsletters
        ],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true, ticks: { stepSize: 1 } },
    },
  };

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
              <Bar
                data={chartData}
                options={chartOptions}
                redraw // Ensures chart is destroyed and recreated to avoid canvas reuse error
              />
            </div>
          </div>

          {/* Side Cards */}
          <div className="flex flex-col gap-6">
            {/* Total Orders */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="text-lg font-semibold">Total Entries of Contact Forms</h4>
              <p className="text-xl font-bold mt-2">
                {contactFormCount}
              </p>
              <div className="h-14 bg-gray-200 rounded my-4 flex items-center justify-center text-gray-500 text-sm">
                [Orders Chart]
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Recent 30 days</span>
                <span>Pending 38%</span>
              </div>
            </div>

            {/* Total Customers */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="text-lg font-semibold">Total Newsletter Subscriptions</h4>
              <p className="text-xl font-bold mt-2">
                {newsletterCount}
              </p>
              <div className="h-14 bg-gray-200 rounded my-4 flex items-center justify-center text-gray-500 text-sm">
                [Customers Chart]
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Recent 30 days</span>
                <span>Others 25%</span>
              </div>
            </div>

            {/* Total Revenue */}
            <div className="bg-white rounded-xl p-6 shadow">
              <h4 className="text-lg font-semibold">Total Enquiries of Project Listing</h4>
              <p className="text-xl font-bold mt-2">
                {projectPopupCount}
              </p>
              <div className="h-14 bg-gray-200 rounded my-4 flex items-center justify-center text-gray-500 text-sm">
                [Revenue Chart]
              </div>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Recent 30 days</span>
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
