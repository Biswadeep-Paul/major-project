import React, { useContext, useEffect, useState } from 'react';
import { DoctorContext } from '../../context/DoctorContext';
import { AppContext } from '../../context/AppContext';
import { assets } from '../../assets/assets';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { Calendar, Clipboard, FileText, Filter, X, RefreshCw, Download, Plus, CheckCircle, XCircle, Eye } from 'lucide-react';

const DoctorAppointments = () => {
  const { dToken, appointments, getAppointments, cancelAppointment, completeAppointment, addPrescription, getPrescriptions } = useContext(DoctorContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [selectedPrescriptions, setSelectedPrescriptions] = useState([]);
  const [prescription, setPrescription] = useState({
    medicines: [{ name: '', dosage: '', frequency: '' }],
    notes: ''
  });

  const [filterUserId, setFilterUserId] = useState('');
  const [filteredAppointments, setFilteredAppointments] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [prescriptionSearch, setPrescriptionSearch] = useState(''); // New state for prescription search

  const generateAppointmentsReport = () => {
    const docDefinition = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      pageMargins: [40, 40, 40, 40],
      content: [
        { text: 'Doctor Appointments Report', style: 'header' },
        {
          table: {
            headerRows: 1,
            widths: ['auto', '*', '*', '*', '*'],
            body: [
              ['#', 'Patient Name', 'Patient ID', 'Payment', 'Fees'],
              ...filteredAppointments.map((item, index) => [
                index + 1,
                item.userData.name,
                item.userData._id,
                item.payment ? 'Online' : 'Cash',
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
      defaultStyle: {
        fontSize: 10,
        color: '#333'
      },
    };

    pdfMake.createPdf(docDefinition).open();
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      if (dToken) {
        await getAppointments();
      }
      setIsLoading(false);
    };
    
    fetchData();
  }, [dToken]);

  useEffect(() => {
    let filtered = [...appointments];
    
    if (filterUserId) {
      filtered = filtered.filter(appointment => 
        appointment.userData._id.toLowerCase().includes(filterUserId.toLowerCase())
      );
    }
    
    if (selectedStatus !== 'all') {
      if (selectedStatus === 'completed') {
        filtered = filtered.filter(appt => appt.isCompleted && !appt.cancelled);
      } else if (selectedStatus === 'pending') {
        filtered = filtered.filter(appt => !appt.isCompleted && !appt.cancelled);
      } else if (selectedStatus === 'cancelled') {
        filtered = filtered.filter(appt => appt.cancelled);
      }
    }
    
    setFilteredAppointments(filtered);
  }, [appointments, filterUserId, selectedStatus]);

  const handleViewPrescriptions = async (appointmentId) => {
    setIsLoading(true);
    const prescriptions = await getPrescriptions(appointmentId);
    setSelectedPrescriptions(prescriptions);
    setPrescriptionSearch(''); // Reset search when opening modal
    setIsLoading(false);
  };

  const handlePrescriptionChange = (index, field, value) => {
    const updatedMedicines = [...prescription.medicines];
    updatedMedicines[index][field] = value;
    setPrescription({ ...prescription, medicines: updatedMedicines });
  };

  const addMedicineField = () => {
    setPrescription({ ...prescription, medicines: [...prescription.medicines, { name: '', dosage: '', frequency: '' }] });
  };

  const handlePrescriptionSubmit = async () => {
    setIsLoading(true);
    await addPrescription(selectedAppointment, prescription);
    setSelectedAppointment(null);
    setPrescription({ medicines: [{ name: '', dosage: '', frequency: '' }], notes: '' });
    setIsLoading(false);
  };

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
  };

  const refreshAppointments = async () => {
    setIsLoading(true);
    await getAppointments();
    setIsLoading(false);
  };

  const getStatusBadge = (item) => {
    if (item.cancelled) {
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-600">Cancelled</span>;
    } else if (item.isCompleted) {
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-600">Completed</span>;
    } else {
      return <span className="px-3 py-1 text-xs font-medium rounded-full bg-yellow-100 text-yellow-600">Pending</span>;
    }
  };

  const getPaymentBadge = (paymentType) => {
    return paymentType ? 
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-600">Online</span> :
      <span className="px-3 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Cash</span>;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-5 bg-gray-50 rounded-lg shadow-sm">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 mb-1">Patient Appointments</h1>
          <p className="text-gray-500">Manage your appointments and prescriptions</p>
        </div>
        
        <div className="flex flex-wrap gap-2 mt-3 md:mt-0">
          <button
            onClick={refreshAppointments}
            className="flex items-center gap-1 bg-white text-gray-700 px-4 py-2 rounded-lg border border-gray-200 hover:bg-gray-50 shadow-sm transition-all"
          >
            <RefreshCw size={16} />
            <span>Refresh</span>
          </button>
          
          <button
            onClick={generateAppointmentsReport}
            className="flex items-center gap-1 bg-emerald-600 text-white px-4 py-2 rounded-lg hover:bg-emerald-700 shadow-sm transition-all"
          >
            <Download size={16} />
            <span>Export Report</span>
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center gap-3 justify-between">
            <div className="flex items-center gap-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Patient ID"
                  value={filterUserId}
                  onChange={(e) => setFilterUserId(e.target.value)}
                  className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none w-full md:w-64"
                />
                <Filter size={16} className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                {filterUserId && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setFilterUserId('')}
                  >
                    <X size={16} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="flex gap-2">
              <button
                onClick={() => handleStatusChange('all')}
                className={`px-4 py-2 text-sm rounded-lg border ${
                  selectedStatus === 'all'
                    ? 'bg-blue-100 border-blue-200 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                All
              </button>
              <button
                onClick={() => handleStatusChange('pending')}
                className={`px-4 py-2 text-sm rounded-lg border ${
                  selectedStatus === 'pending'
                    ? 'bg-yellow-100 border-yellow-200 text-yellow-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Pending
              </button>
              <button
                onClick={() => handleStatusChange('completed')}
                className={`px-4 py-2 text-sm rounded-lg border ${
                  selectedStatus === 'completed'
                    ? 'bg-green-100 border-green-200 text-green-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Completed
              </button>
              <button
                onClick={() => handleStatusChange('cancelled')}
                className={`px-4 py-2 text-sm rounded-lg border ${
                  selectedStatus === 'cancelled'
                    ? 'bg-red-100 border-red-200 text-red-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Cancelled
              </button>
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center p-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredAppointments.length === 0 ? (
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
              <Calendar size={24} className="text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-800">No appointments found</h3>
            <p className="text-gray-500 mt-1">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patient</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Age</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Schedule</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Payment</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fees</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredAppointments.map((item, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <img className="h-10 w-10 rounded-full object-cover" src={item.userData.image} alt="" />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{item.userData.name}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-500">{item.userData._id.substring(0, 8)}...</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.userData.age}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{slotDateFormat(item.slotDate)}</div>
                      <div className="text-sm text-gray-500">{item.slotTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPaymentBadge(item.payment)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {currency}{item.amount}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(item)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {item.cancelled ? (
                        <span className="text-red-500">No actions available</span>
                      ) : item.isCompleted ? (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => setSelectedAppointment(item._id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-blue-300 text-xs font-medium rounded text-blue-700 bg-blue-50 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                          >
                            <Clipboard size={14} className="mr-1" />
                            Prescribe
                          </button>
                          <button
                            onClick={() => handleViewPrescriptions(item._id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-green-300 text-xs font-medium rounded text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <Eye size={14} className="mr-1" />
                            View
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-2">
                          <button
                            onClick={() => completeAppointment(item._id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-green-300 text-xs font-medium rounded text-green-700 bg-green-50 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                          >
                            <CheckCircle size={14} className="mr-1" />
                            Complete
                          </button>
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className="inline-flex items-center px-2.5 py-1.5 border border-red-300 text-xs font-medium rounded text-red-700 bg-red-50 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                          >
                            <XCircle size={14} className="mr-1" />
                            Cancel
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Prescription Modal */}
      {selectedAppointment && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">Add Prescription</h3>
              <button onClick={() => setSelectedAppointment(null)} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              {prescription.medicines.map((med, index) => (
                <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                  <div className="mb-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Medicine Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Amoxicillin" 
                      value={med.name} 
                      onChange={(e) => handlePrescriptionChange(index, 'name', e.target.value)} 
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 mb-2">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Dosage</label>
                      <input 
                        type="text" 
                        placeholder="e.g., 500mg" 
                        value={med.dosage} 
                        onChange={(e) => handlePrescriptionChange(index, 'dosage', e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Frequency</label>
                      <input 
                        type="text" 
                        placeholder="e.g., 3 times daily" 
                        value={med.frequency} 
                        onChange={(e) => handlePrescriptionChange(index, 'frequency', e.target.value)} 
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
              ))}
              
              <button 
                onClick={addMedicineField}
                className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <Plus size={16} className="mr-2" />
                Add Another Medicine
              </button>
              
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea 
                  placeholder="Add any special instructions or notes here..." 
                  value={prescription.notes} 
                  onChange={(e) => setPrescription({ ...prescription, notes: e.target.value })} 
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 h-24"
                />
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button 
                className="mr-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => setSelectedAppointment(null)}
              >
                Cancel
              </button>
              <button 
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={handlePrescriptionSubmit}
              >
                Save Prescription
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Prescriptions Modal with Search */}
      {selectedPrescriptions.length > 0 && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black bg-opacity-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <div className="flex items-center">
                <FileText size={20} className="text-blue-600 mr-2" />
                <h3 className="text-lg font-medium text-gray-900">Previous Prescriptions</h3>
              </div>
              <button onClick={() => {
                setSelectedPrescriptions([]);
                setPrescriptionSearch('');
              }} className="text-gray-400 hover:text-gray-500">
                <X size={20} />
              </button>
            </div>
            
            {/* Search Bar for Prescriptions */}
            <div className="px-6 py-3 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by Patient ID"
                  value={prescriptionSearch}
                  onChange={(e) => setPrescriptionSearch(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:border-blue-400 outline-none"
                />
                <Filter size={16} className="text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                {prescriptionSearch && (
                  <button 
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                    onClick={() => setPrescriptionSearch('')}
                  >
                    <X size={16} className="text-gray-400 hover:text-gray-600" />
                  </button>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 max-h-96 overflow-y-auto">
              {selectedPrescriptions
                .filter(presc => 
                  prescriptionSearch === '' || 
                  (presc.userId?._id && 
                   presc.userId._id.toLowerCase().includes(prescriptionSearch.toLowerCase()))
                )
                .map((presc, index) => (
                  <div key={index} className="mb-4 p-4 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium text-gray-900">{presc.userId?.name || "Unknown Patient"}</h4>
                        <p className="text-xs text-gray-500">ID: {presc.userId?._id || "N/A"}</p>
                      </div>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full">Rx #{index + 1}</span>
                    </div>
                    
                    <div className="mt-3">
                      <h5 className="text-sm font-medium text-gray-700 mb-1">Medications:</h5>
                      <ul className="list-disc pl-5 space-y-1">
                        {presc.medicines.map((med, i) => (
                          <li key={i} className="text-sm">
                            <span className="font-medium">{med.name}</span> - {med.dosage} ({med.frequency})
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {presc.notes && (
                      <div className="mt-3 pt-3 border-t border-gray-200">
                        <h5 className="text-sm font-medium text-gray-700 mb-1">Doctor's Notes:</h5>
                        <p className="text-sm italic text-gray-600">{presc.notes}</p>
                      </div>
                    )}
                  </div>
                ))}
              
              {selectedPrescriptions.filter(presc => 
                prescriptionSearch === '' || 
                (presc.userId?._id && 
                 presc.userId._id.toLowerCase().includes(prescriptionSearch.toLowerCase()))
              ).length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No prescriptions found matching your search
                </div>
              )}
            </div>
            
            <div className="px-6 py-4 border-t border-gray-200">
              <button 
                className="w-full px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                onClick={() => {
                  setSelectedPrescriptions([]);
                  setPrescriptionSearch('');
                }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DoctorAppointments;