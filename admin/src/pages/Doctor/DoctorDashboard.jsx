import React, { useContext, useEffect } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Calendar, CheckCircle, XCircle, Download, Activity, Users, DollarSign } from 'lucide-react';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const DoctorDashboard = () => {
  const { dToken, dashData, getDashData, cancelAppointment, completeAppointment } = useContext(DoctorContext);
  const { slotDateFormat, currency } = useContext(AppContext);
  
  const chartData = {
    labels: ['Earnings', 'Appointments', 'Patients'],
    datasets: [
      {
        label: 'Statistics',
        data: [
          dashData?.earnings ?? 0,
          dashData?.appointments ?? 0,
          dashData?.patients ?? 0,
        ],
        backgroundColor: ['rgba(52, 211, 153, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(249, 115, 22, 0.8)'],
        borderColor: ['rgb(16, 185, 129)', 'rgb(79, 70, 229)', 'rgb(234, 88, 12)'],
        borderWidth: 2,
        borderRadius: 8,
        hoverBackgroundColor: ['rgba(52, 211, 153, 1)', 'rgba(99, 102, 241, 1)', 'rgba(249, 115, 22, 1)'],
      },
    ],
  };
  
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            family: "'Inter', sans-serif",
            size: 12
          }
        }
      },
      title: {
        display: true,
        text: 'Dashboard Statistics',
        font: {
          family: "'Inter', sans-serif",
          size: 16,
          weight: 'bold'
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        }
      },
      x: {
        grid: {
          display: false
        }
      }
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  const generateEarningsReport = () => {
    const docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 40, 40, 40],
      content: [
        { text: 'Doctor Earnings Report', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*'],
            body: [
              ['Earnings', `${currency} ${dashData?.earnings ?? 0}`],
              ['Appointments', `${dashData?.appointments ?? 0}`],
              ['Patients', `${dashData?.patients ?? 0}`],
            ],
          },
        },
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          margin: [0, 0, 0, 10],
        },
      },
    };

    pdfMake.createPdf(docDefinition).open();
  };

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return dashData && (
    <div className="bg-gray-50 min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Doctor Dashboard</h1>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-px">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-green-100 text-green-600 mr-4">
                <DollarSign size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-bold text-gray-800">{currency} {dashData.earnings}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-px">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-indigo-100 text-indigo-600 mr-4">
                <Calendar size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Appointments</p>
                <p className="text-2xl font-bold text-gray-800">{dashData.appointments}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-md p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-px">
            <div className="flex items-center">
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-600 mr-4">
                <Users size={24} />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-500">Total Patients</p>
                <p className="text-2xl font-bold text-gray-800">{dashData.patients}</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Chart Component */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-800 flex items-center">
              <Activity size={20} className="mr-2 text-indigo-600" />
              Performance Analytics
            </h2>
            <button
              onClick={generateEarningsReport}
              className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center transition-colors hover:bg-indigo-700"
            >
              <Download size={16} className="mr-1" />
              Generate Report
            </button>
          </div>
          <div className="mt-4">
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
        
        {/* Latest Bookings Section */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="bg-gradient-to-r from-indigo-600 to-indigo-500 px-6 py-4">
            <h2 className="text-lg font-bold text-white flex items-center">
              <Calendar size={20} className="mr-2" />
              Latest Bookings
            </h2>
          </div>
          
          <div className="divide-y divide-gray-100">
            {dashData.latestAppointments.slice(0, 5).map((item, index) => (
              <div className="flex items-center px-6 py-4 hover:bg-gray-50 transition-colors" key={index}>
                <div className="relative">
                  <img 
                    className="w-12 h-12 rounded-full object-cover border-2 border-gray-200" 
                    src={item.userData.image} 
                    alt={item.userData.name} 
                  />
                  {item.cancelled && (
                    <div className="absolute -top-1 -right-1 bg-red-500 rounded-full w-4 h-4"></div>
                  )}
                  {item.isCompleted && (
                    <div className="absolute -top-1 -right-1 bg-green-500 rounded-full w-4 h-4"></div>
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <p className="text-sm font-semibold text-gray-800">{item.userData.name}</p>
                  <p className="text-xs text-gray-500 flex items-center">
                    <Calendar size={12} className="mr-1" />
                    Appointment on {slotDateFormat(item.slotDate)}
                  </p>
                </div>
                
                <div className="ml-auto">
                  {item.cancelled ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Cancelled
                    </span>
                  ) : item.isCompleted ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Completed
                    </span>
                  ) : (
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => cancelAppointment(item._id)}
                        className="p-1 rounded-full text-red-600 hover:bg-red-100 transition-colors"
                      >
                        <XCircle size={24} />
                      </button>
                      <button 
                        onClick={() => completeAppointment(item._id)}
                        className="p-1 rounded-full text-green-600 hover:bg-green-100 transition-colors"
                      >
                        <CheckCircle size={24} />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            
            {dashData.latestAppointments.length === 0 && (
              <div className="py-8 text-center text-gray-500">
                No appointments available
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;