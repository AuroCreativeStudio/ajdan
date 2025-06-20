import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { fetchContactList } from '../../services/contactService';
import { fetchProjectPopups } from '../../services/projectPopupService';
import { getNewsLetter } from '../../services/newsletterService';
import { Bar } from 'react-chartjs-2';
import { Chart, BarElement, CategoryScale, LinearScale } from 'chart.js';

Chart.register(BarElement, CategoryScale, LinearScale);

function Dashboard({ token, user }) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const [contactList, setContactList] = useState([]);
  const [projectList, setProjectList] = useState([]);
  const [newsletterList, setNewsletterList] = useState([]);
  const [filter, setFilter] = useState('30days'); // 'today', '7days', '30days'
  const [isLoading, setIsLoading] = useState(true);

  // Filter data based on selected time period (for graph only)
  const getGraphData = () => {
    const now = new Date();
    let cutoffDate;

    switch(filter) {
      case 'today':
        cutoffDate = new Date(now.setHours(0, 0, 0, 0));
        break;
      case '7days':
        cutoffDate = new Date(now.setDate(now.getDate() - 7));
        break;
      case '30days':
        cutoffDate = new Date(now.setDate(now.getDate() - 30));
        break;
      default:
        cutoffDate = new Date(0); // All time
    }

    const filterItems = (items) => {
      return items.filter(item => {
        const itemDate = new Date(item.attributes?.createdAt || item.createdAt || 0);
        return itemDate >= cutoffDate;
      }).length;
    };

    return {
      contactCount: filterItems(contactList),
      projectCount: filterItems(projectList),
      newsletterCount: filterItems(newsletterList),
    };
  };

  const { contactCount, projectCount, newsletterCount } = getGraphData();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const contactData = await fetchContactList();
        const processedContacts = Array.isArray(contactData?.data) ? contactData.data : Array.isArray(contactData) ? contactData : [];
        setContactList(processedContacts);

        const projectData = await fetchProjectPopups();
        const processedProjects = Array.isArray(projectData?.data) ? projectData.data : Array.isArray(projectData) ? projectData : [];
        setProjectList(processedProjects);

        const newsletterData = await getNewsLetter();
        const processedNewsletters = Array.isArray(newsletterData?.data) ? newsletterData.data : Array.isArray(newsletterData) ? newsletterData :[];
        setNewsletterList(processedNewsletters);
        console.log("contact List",processedNewsletters);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Chart data configuration
  const chartData = {
    labels: ['Contact Forms', 'Project Enquiries', 'Newsletters'],
    datasets: [
      {
        label: 'Submissions',
        data: [contactCount, projectCount, newsletterCount],
        backgroundColor: ['#8AA3B4', '#AEA4B6', '#A58C76'],
        borderColor: ['#6C8A9D', '#978D9F', '#8C7560'],
        borderWidth: 1,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: { 
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw}`;
          }
        }
      }
    },
    scales: {
      y: { 
        beginAtZero: true, 
        ticks: { 
          stepSize: 1,
          precision: 0
        } 
      },
    },
  };

  if (isLoading) {
    return (
      <div className="bg-gray-100 ml-64 p-8 font-sans min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-600"></div>
          <p className="mt-2 text-gray-600">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100 ml-64 p-8 font-sans min-h-screen">
      <div className="flex flex-col gap-8">
        {/* Greeting Card */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-indigo-500 text-white rounded-xl p-8">
          <div>
            <h2 className="text-2xl font-semibold mb-2">Good Morning, {user?.username || "Admin"}!</h2>
            <p className="mb-4">Here's what's happening with your website today.</p>
            <div className="flex gap-4">
              <div className="bg-white/20 px-4 py-3 rounded-lg">
                <span className="block text-lg font-semibold">{contactList.length} Contacts</span>
                <small className="text-sm">Total submissions</small>
              </div>
              <div className="bg-white/20 px-4 py-3 rounded-lg">
                <span className="block text-lg font-semibold">{projectList.length} Projects</span>
                <small className="text-sm">Total enquiries</small>
              </div>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Stats Chart */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-xl p-6 shadow">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold">Submission Statistics</h3>
              <select 
                className="border border-gray-300 rounded px-3 py-1 text-sm bg-white"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <option value="30days">Last 30 Days</option>
                <option value="7days">Last 7 Days</option>
                <option value="today">Today</option>
              </select>
            </div>
            <div className="h-52">  
              <Bar data={chartData} options={chartOptions} />
            </div>
          </div>

          {/* Side Cards */}
          <div className="flex flex-col gap-6">
            {/* Contact Form Card */}
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold">Contact Form Submissions</h4>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-4">{contactList.length}</p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Recent submissions</span>
                <span>Total</span>
              </div>
            </div>

            {/* Newsletter Card */}
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold">Newsletter Subscribers</h4>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-4">{newsletterList.length}</p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Recent signups</span>
                <span>Total</span>
              </div>
            </div>

            {/* Project Popup Card */}
            <div className="bg-white rounded-xl p-6 shadow">
              <div className="flex justify-between items-center mb-2">
                <h4 className="text-lg font-semibold">Project Enquiries</h4>
              </div>
              <p className="text-2xl font-bold text-gray-800 mb-4">{projectList.length}</p>
              <div className="flex justify-between text-sm text-gray-600">
                <span>Recent enquiries</span>
                <span>Total</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;