  import React, { useState, useEffect, useContext } from 'react';
  import axios from 'axios';
  import { useNavigate } from 'react-router-dom';
  import { AppContext } from '../context/AppContext';
  import { toast } from 'react-toastify';

  const PrescriptionPage = () => {
    const [prescriptions, setPrescriptions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { backendUrl, token } = useContext(AppContext);

    useEffect(() => {
      const fetchPrescriptions = async () => {
        try {
          if (!token) {
            navigate('/login');
            return;
          }

          const { data } = await axios.get(`${backendUrl}/api/user/prescriptions`, {
            headers: { token },
          });

          if (data.success) {
            setPrescriptions(data.prescriptions);
          } else {
            setError(data.message || 'Failed to fetch prescriptions');
            toast.error(data.message || 'Failed to fetch prescriptions');
          }
        } catch (err) {
          console.error('Error fetching prescriptions:', err);
          setError(err.response?.data?.message || 'An error occurred while fetching prescriptions');
          toast.error(err.response?.data?.message || 'An error occurred while fetching prescriptions');
        } finally {
          setLoading(false);
        }
      };

      fetchPrescriptions();
    }, [backendUrl, token, navigate]);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });

    const handlePrint = () => {
      const printContents = document.getElementById("prescription-content").innerHTML;
      const originalContents = document.body.innerHTML;

      document.body.innerHTML = printContents;
      window.print();
      document.body.innerHTML = originalContents;
    };

    if (loading) {
      return (
        <div className="flex justify-center items-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      );
    }

    if (error) {
      return (
        <div className="min-h-screen bg-gray-50 py-8">
          <div className="max-w-4xl mx-auto px-4">
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              <p>Error: {error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-2 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">My Prescriptions</h1>

          {prescriptions.length === 0 ? (
            <div className="bg-white shadow rounded-lg p-6 text-center">
              <p className="text-gray-600">You don't have any prescriptions yet.</p>
            </div>
          ) : (
            <div className="space-y-6" id="prescription-content">
              {prescriptions.map((prescription) => (
                <div key={prescription._id} className="bg-white shadow rounded-lg overflow-hidden">
                  <div className="bg-primary px-6 py-4">
                    <div className="flex justify-between items-center">
                      <h2 className="text-xl font-semibold text-white">
                        Dr. {prescription.doctor.name}
                      </h2>
                      <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                        {prescription.doctor.speciality}
                      </span>
                    </div>
                    <p className="text-blue-100 text-sm">
                      {formatDate(prescription.createdAt)}
                    </p>
                  </div>

                  <div className="p-6">
                    <div className="mb-4">
                      <h3 className="text-lg font-semibold text-gray-700 mb-2">Medications</h3>
                      {prescription.medicines.length > 0 ? (
                        <ul className="space-y-2">
                          {prescription.medicines.map((med, index) => (
                            <li key={index} className="bg-gray-50 p-3 rounded">
                              <div className="font-medium">{med.name}</div>
                              <div className="text-sm text-gray-600">
                                {med.dosage} - {med.duration}
                              </div>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-gray-600">No medications prescribed</p>
                      )}
                    </div>

                    {prescription.notes && (
                      <div className="mb-4">
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">Notes</h3>
                        <p className="text-gray-600">{prescription.notes}</p>
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 px-6 py-3 flex justify-end">
                    <button 
                      onClick={handlePrint} 
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-300 transition-colors"
                    >
                      Print Prescription
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  export default PrescriptionPage;