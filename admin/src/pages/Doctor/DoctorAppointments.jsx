import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
// import MedicalChatbot from '../../components/MedicalChatbot copy';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
//pdfMake.vfs = pdfFonts.pdfMake.vfs;

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, addPrescription, getPrescriptions } = useContext(DoctorContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);
  const [prescription, setPrescription] = useState({
    medicines: [{ name: '', dosage: '', frequency: '' }],
    notes: ''
  });

  const [filterUserId, setFilterUserId] = useState(''); // State for filtering by user ID
  const [filteredAppointments, setFilteredAppointments] = useState([]); // State to store filtered appointments
  const generateAppointmentsReport = () => {
    const docDefinition = {
      content: [
        { text: 'Doctor Appointments Report', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', '*', '*'],
            body: [
              ['#', 'Patient Name', 'Patient ID', 'Payment', 'Age', 'Fees'],
              ...filteredAppointments.map((item, index) => [
                index + 1,
                item.userData.name,
                item.userData._id,
                item.payment ? 'Online' : 'Cash',
                calculateAge(item.userData.age),
                `${currency}${item.amount}`,
              ]),
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
  
    pdfMake.createPdf(docDefinition).download('appointments-report.pdf');
  };
  useEffect(() => {
    if (dToken) {
      getAppointments();
    }
  }, [dToken]);

  // Update filtered appointments whenever appointments or filterUserId changes
  useEffect(() => {
    if (filterUserId) {
      const filtered = appointments.filter(appointment =>
        appointment.userData._id.includes(filterUserId)
      );
      setFilteredAppointments(filtered);
    } else {
      setFilteredAppointments(appointments); // If no filter, show all appointments
    }
  }, [appointments, filterUserId]);

  // Fetch prescriptions when an appointment is selected
  const handleViewPrescriptions = async (appointmentId) => {
    const prescriptions = await getPrescriptions(appointmentId);
    setSelectedPrescriptions(prescriptions);
  };

  // Handle Input Change for prescription form
  const handlePrescriptionChange = (index, field, value) => {
    const updatedMedicines = [...prescription.medicines];
    updatedMedicines[index][field] = value;
    setPrescription({ ...prescription, medicines: updatedMedicines });
  };

  // Add a new medicine field
  const addMedicineField = () => {
    setPrescription({ ...prescription, medicines: [...prescription.medicines, { name: '', dosage: '', frequency: '' }] });
  };

  // Handle Prescription Submission
  const handlePrescriptionSubmit = async () => {
    await addPrescription(selectedAppointment, prescription);
    setSelectedAppointment(null); // Close form after submission
    setPrescription({ medicines: [{ name: '', dosage: '', frequency: '' }], notes: '' }); // Reset form
  };

  return (
    <div className='w-full max-w-6xl m-5'>
      <p className='mb-3 text-lg font-medium'>All Appointments</p>

      {/* Filter Input */}
      <div className='mb-4'>
        <input
          type='text'
          placeholder='Filter by User ID'
          value={filterUserId}
          onChange={(e) => setFilterUserId(e.target.value)}
          className='border p-2 rounded w-full max-w-xs'
        />
      </div>

      <div className='bg-white border rounded text-sm max-h-[80vh] overflow-y-scroll'>
        <div className='grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr_1fr_1fr] gap-1 py-3 px-6 border-b'>
          <p>#</p>
          <p>Patient</p>
          <p>Patient_id</p>
          <p>Payment</p>
          <p>Date & Time</p>
          <p>Fees</p>
          <p>Action</p>
          <p>Add Presc.</p>
          <p>View Presc.</p>
        </div>
        {filteredAppointments.map((item, index) => (
          <div className='grid grid-cols-[0.5fr_2fr_1fr_1fr_3fr_1fr_1fr_1fr_1fr] gap-1 items-center text-gray-500 py-3 px-6 border-b hover:bg-gray-50' key={index}>
            <p>{index + 1}</p>
            <div className='flex items-center gap-2'>
              <img src={item.userData.image} className='w-8 rounded-full' alt="" />
              <p>{item.userData.name} <br></br>
             </p>
            </div>
            <p className='text-xs border border-primary px-2 rounded-full'>
              {item.payment ? 'Online' : 'CASH'}
            </p>
            <p>{calculateAge(item.userData.dob)}</p>
            <p>{slotDateFormat(item.slotDate)}, {item.slotTime}</p>
            <p>{currency}{item.amount}</p>
            {item.cancelled ? (
              <p className='text-red-400 text-xs font-medium'>Cancelled</p>
            ) : item.isCompleted ? (
              <>
                <p className='text-green-500 text-xs font-medium'>Completed</p>
                <button
                  className='text-blue-500 text-xs font-medium underline cursor-pointer'
                  onClick={() => setSelectedAppointment(item._id)}
                >
                  📝 Add Prescription
                </button>
                <button
                  className='text-green-500 text-xs font-medium underline cursor-pointer ml-2'
                  onClick={() => handleViewPrescriptions(item._id)}
                >
                  📜 View Prescriptions
                </button>
                <button
  onClick={generateAppointmentsReport}
  className="bg-green-600 text-white px-4 py-2 rounded mb-4 hover:bg-green-700"
>
  📄 Download Appointments Report
</button>
              </>
            ) : (
              <div className='flex'>
                <img onClick={() => cancelAppointment(item._id)} className='w-10 cursor-pointer' src={assets.cancel_icon} alt="" />
                <img onClick={() => completeAppointment(item._id)} className='w-10 cursor-pointer' src={assets.tick_icon} alt="" />
              </div>
            )}
          </div>
        ))}
      </div>

      {selectedAppointment && (
        <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50'>
          <div className='bg-white p-6 rounded-lg w-96'>
            <h2 className='text-lg font-bold'>Add Prescription</h2>
            {prescription.medicines.map((med, index) => (
              <div key={index} className='mb-2'>
                <input type="text" placeholder="Medicine Name" value={med.name} onChange={(e) => handlePrescriptionChange(index, 'name', e.target.value)} className="border p-1 w-full" />
                <input type="text" placeholder="Dosage" value={med.dosage} onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)} className="border p-1 w-full mt-1" />
                <input type="text" placeholder="Frequency" value={med.frequency} onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)} className="border p-1 w-full mt-1" />
              </div>
            ))}
            <button className='bg-gray-300 p-1 rounded mt-2' onClick={addMedicineField}>+ Add Medicine</button>
            <textarea placeholder="Notes" value={prescription.notes} onChange={(e) => setPrescription({ ...prescription, notes: e.target.value })} className="border p-1 w-full mt-2" />
            <button className='bg-blue-500 text-white px-4 py-1 rounded mt-3' onClick={handlePrescriptionSubmit}>Submit</button>
            <button className='ml-2 text-gray-500' onClick={() => setSelectedAppointment(null)}>Cancel</button>
          </div>
        </div>
      )}
{selectedPrescriptions.length > 0 && (
  <div className='fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 px-4'>
    <div className='bg-white p-4 sm:p-6 rounded-lg w-full max-w-lg max-h-[80vh] overflow-y-auto'>
      <h2 className='text-sm sm:text-lg font-bold text-center'>Previous Prescriptions</h2>

      {/* User ID Filter Input */}
      <input
        type='text'
        placeholder='Filter by User ID'
        value={filterUserId}
        onChange={(e) => setFilterUserId(e.target.value)}
        className='border p-2 rounded w-full max-w-xs mb-3 text-sm'
      />

      {selectedPrescriptions
        .filter(presc => presc.userId?._id.includes(filterUserId))
        .map((presc, index) => (
          <div key={index} className='mb-2 p-2 border rounded'>
            <p className='text-xs sm:text-sm font-semibold'>
              User ID: {presc.userId?._id|| "N/A"}
            </p>
            <p className='text-xs sm:text-sm font-semibold'>Patient Name: {presc.userId?.name || "N/A"}</p>
            
            <p className='text-xs sm:text-sm font-semibold mt-2'>Medicines:</p>
            {presc.medicines.map((med, i) => (
              <p key={i} className='text-xs sm:text-sm'>{med.name} - {med.dosage} - {med.frequency}</p>
            ))}
            
            <p className='text-xs sm:text-sm mt-1 text-gray-500'>Notes: {presc.notes}</p>
          </div>
        ))
      }

      <button className='text-gray-500 w-full text-center py-2 mt-3 border rounded hover:bg-gray-100' onClick={() => setSelectedPrescriptions([])}>
        Close
      </button>
    </div>
  </div>
)}
     </div>
  );
};

export default DoctorAppointments;