import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { assets } from '../../assets/assets';
import { AppContext } from '../../context/AppContext';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

//const pdfMake.vfs = pdfFonts.pdfMake.vfs;

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
        backgroundColor: ['#4CAF50', '#FF9800', '#03A9F4'],
        borderColor: ['#388E3C', '#F57C00', '#0288D1'],
        borderWidth: 1,
      },
    ],
  };
  const chartOptions = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: false, // always start from 0
        suggestedMax: Math.max(
          dashData?.earnings ?? 0,
          dashData?.appointments ?? 0,
          dashData?.patients ?? 0
        ) + 500, // optional buffer
      },
    },
  };

  const generateEarningsReport = () => {
    const docDefinition = {
      pageSize: 'A4', // Set page size to A4
      pageOrientation: 'landscape', // Set page orientation to landscape
      pageMargins: [40, 40, 40, 40], // Add margins to avoid content being too close to edges
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

    // Generate the PDF
    pdfMake.createPdf(docDefinition).open();
  };

  useEffect(() => {
    if (dToken) {
      getDashData();
    }
  }, [dToken]);

  return dashData && (
    <div className='m-5'>
      <div className='flex flex-wrap gap-3'>
        {/* Existing components */}
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.earning_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{currency} {dashData.earnings}</p>
            <p className='text-gray-400'>Earnings</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.appointments_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.appointments}</p>
            <p className='text-gray-400'>Appointments</p>
          </div>
        </div>
        <div className='flex items-center gap-2 bg-white p-4 min-w-52 rounded border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all'>
          <img className='w-14' src={assets.patients_icon} alt="" />
          <div>
            <p className='text-xl font-semibold text-gray-600'>{dashData.patients}</p>
            <p className='text-gray-400'>Patients</p>
          </div>
        </div>
      </div>

      {/* Chart Component */}
      <div className="bg-white mt-6 p-6 rounded border-2">
        <p className="font-semibold text-lg">Earnings & Appointments</p>
        <Bar data={chartData} options={chartOptions} />
      </div>

      {/* Generate Earnings Report Button */}
      <div className="mt-6">
        <button
          onClick={generateEarningsReport}
          className="bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition-all"
        >
          Generate Earnings Report
        </button>
      </div>

      {/* Latest Bookings Section */}
      <div className='bg-white'>
        <div className='flex items-center gap-2.5 px-4 py-4 mt-10 rounded-t border'>
          <img src={assets.list_icon} alt="" />
          <p className='font-semibold'>Latest Bookings</p>
        </div>
        <div className='pt-4 border border-t-0'>
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div className='flex items-center px-6 py-3 gap-3 hover:bg-gray-100' key={index}>
              <img className='rounded-full w-10' src={item.userData.image} alt="" />
              <div className='flex-1 text-sm'>
                <p className='text-gray-800 font-medium'>{item.userData.name}</p>
                <p className='text-gray-600 '>Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled
                ? <p className='text-red-400 text-xs font-medium'>Cancelled</p>
                : item.isCompleted
                  ? <p className='text-green-500 text-xs font-medium'>Completed</p>
                  : <div className='flex'>
                    <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                    <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
                  </div>
              }
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default DoctorDashboard;