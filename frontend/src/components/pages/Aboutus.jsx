import React, { useEffect, useState } from 'react';
import { fetchteam } from '../../services/aboutusService';

function Aboutus() {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function getTeam() {
      try {
        const data = await fetchteam();
        // Adjust this according to your API response structure
        setTeam(Array.isArray(data) ? data : data.data);
      } catch (error) {
        setTeam([]);
      } finally {
        setLoading(false);
      }
    }
    getTeam();
  }, []);

  return (
    <>
      <div className='m-12 mx-auto bg-blue-700 h-24'>
        <div className='my-auto'>
          <h1 className='text-white mt-4 text-4xl'>Aboutus</h1>
        </div>
      </div>

      {loading ? (
        <div className="m-12">Loading...</div>
      ) : (
        <div className="flex flex-wrap">
          {team.map((member, idx) => (
            <div key={member.id || idx} className="w-64 m-12 bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-80 overflow-hidden">
                <img
                  src={member.image || "https://docs.material-tailwind.com/img/team-3.jpg"}
                  alt={member.name || "profile"}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-6 text-center">
                <h4 className="text-2xl font-semibold text-blue-gray-700 mb-2">
                  {member.member
                   || "Name"}
                </h4>
                <p className="text-blue-gray-500 font-medium">{member.role || "Role"}</p>
              </div>
              <div className="flex justify-center gap-7 p-4 border-t">
                {/* Example social links, adjust as needed */}
                <a href={member.facebook || "#facebook"} className="text-blue-600 text-xl hover:text-blue-800" title="Like">
                  <i className="fab fa-facebook"></i>
                </a>
                <a href={member.twitter || "#twitter"} className="text-sky-500 text-xl hover:text-sky-700" title="Follow">
                  <i className="fab fa-twitter"></i>
                </a>
                <a href={member.instagram || "#instagram"} className="text-purple-500 text-xl hover:text-purple-700" title="Follow">
                  <i className="fab fa-instagram"></i>
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}

export default Aboutus;