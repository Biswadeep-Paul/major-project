import React, { useEffect, useState } from 'react'
import { useContext } from 'react'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AppContext'

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext)
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext)
  const [filter, setFilter] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    if (aToken) {
      getAllAppointments()
    }
  }, [aToken])

  // Filter appointments based on status
  const filteredAppointments = appointments?.filter(appointment => {
    const matchesFilter = filter === 'all' || 
      (filter === 'completed' && appointment.isCompleted) ||
      (filter === 'cancelled' && appointment.cancelled) ||
      (filter === 'pending' && !appointment.isCompleted && !appointment.cancelled)
    
    const matchesSearch = searchTerm === '' ||
      appointment.userData.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.docData.name.toLowerCase().includes(searchTerm.toLowerCase())
    
    return matchesFilter && matchesSearch
  }) || []

  const getStatusColor = (appointment) => {
    if (appointment.cancelled) return 'bg-red-100 text-red-700 border-red-200'
    if (appointment.isCompleted) return 'bg-green-100 text-green-700 border-green-200'
    return 'bg-yellow-100 text-yellow-700 border-yellow-200'
  }

  const getStatusText = (appointment) => {
    if (appointment.cancelled) return 'Cancelled'
    if (appointment.isCompleted) return 'Completed'
    return 'Pending'
  }

  const stats = {
    total: appointments?.length || 0,
    completed: appointments?.filter(apt => apt.isCompleted).length || 0,
    cancelled: appointments?.filter(apt => apt.cancelled).length || 0,
    pending: appointments?.filter(apt => !apt.isCompleted && !apt.cancelled).length || 0
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='mb-8'>
          <div className='flex items-center gap-3 mb-4'>
            <div className='p-3 bg-blue-100 rounded-xl'>
              <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2' />
              </svg>
            </div>
            <div>
              <h1 className='text-3xl font-bold text-gray-800'>All Appointments</h1>
              <p className='text-gray-600'>Manage and monitor patient appointments</p>
            </div>
          </div>
          <div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'></div>
        </div>

        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-4 gap-4 mb-8'>
          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Total Appointments</p>
                <p className='text-2xl font-bold text-gray-800'>{stats.total}</p>
              </div>
              <div className='p-3 bg-blue-100 rounded-lg'>
                <svg className='w-6 h-6 text-blue-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2' />
                </svg>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Completed</p>
                <p className='text-2xl font-bold text-green-600'>{stats.completed}</p>
              </div>
              <div className='p-3 bg-green-100 rounded-lg'>
                <svg className='w-6 h-6 text-green-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' />
                </svg>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Pending</p>
                <p className='text-2xl font-bold text-yellow-600'>{stats.pending}</p>
              </div>
              <div className='p-3 bg-yellow-100 rounded-lg'>
                <svg className='w-6 h-6 text-yellow-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z' />
                </svg>
              </div>
            </div>
          </div>

          <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100'>
            <div className='flex items-center justify-between'>
              <div>
                <p className='text-sm text-gray-600 mb-1'>Cancelled</p>
                <p className='text-2xl font-bold text-red-600'>{stats.cancelled}</p>
              </div>
              <div className='p-3 bg-red-100 rounded-lg'>
                <svg className='w-6 h-6 text-red-600' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Filters and Search */}
        <div className='bg-white rounded-xl p-6 shadow-sm border border-gray-100 mb-6'>
          <div className='flex flex-col md:flex-row gap-4 items-center justify-between'>
            <div className='flex gap-2'>
              {[
                { key: 'all', label: 'All', color: 'blue' },
                { key: 'pending', label: 'Pending', color: 'yellow' },
                { key: 'completed', label: 'Completed', color: 'green' },
                { key: 'cancelled', label: 'Cancelled', color: 'red' }
              ].map(({ key, label, color }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    filter === key
                      ? `bg-${color}-100 text-${color}-700 border border-${color}-200`
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className='relative'>
              <input
                type="text"
                placeholder="Search patients or doctors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className='pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64'
              />
              <svg className='absolute left-3 top-2.5 w-5 h-5 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z' />
              </svg>
            </div>
          </div>
        </div>

        {/* Appointments Table */}
        <div className='bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden'>
          {/* Desktop Header */}
          <div className='hidden lg:grid grid-cols-[60px_1fr_80px_200px_1fr_100px_120px] gap-4 p-6 bg-gray-50 border-b border-gray-200 text-sm font-semibold text-gray-700'>
            <div>#</div>
            <div>Patient</div>
            <div>Age</div>
            <div>Date & Time</div>
            <div>Doctor</div>
            <div>Fees</div>
            <div>Status</div>
          </div>

          {/* Appointments List */}
          <div className='max-h-[600px] overflow-y-auto'>
            {filteredAppointments.length === 0 ? (
              <div className='text-center py-12'>
                <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
                  <svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M8 7V3a2 2 0 012-2h4a2 2 0 012 2v4m-6 0V6a2 2 0 012-2h4a2 2 0 012 2v1m-6 0h8m-8 0H6a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2V9a2 2 0 00-2-2h-2' />
                  </svg>
                </div>
                <h3 className='text-lg font-medium text-gray-900 mb-2'>No appointments found</h3>
                <p className='text-gray-500'>No appointments match your current filter criteria.</p>
              </div>
            ) : (
              filteredAppointments.map((item, index) => (
                <div key={index} className='border-b border-gray-100 hover:bg-gray-50 transition-colors duration-200'>
                  {/* Desktop Layout */}
                  <div className='hidden lg:grid grid-cols-[60px_1fr_80px_200px_1fr_100px_120px] gap-4 p-6 items-center text-sm'>
                    <div className='text-gray-500 font-medium'>{index + 1}</div>
                    
                    <div className='flex items-center gap-3'>
                      <div className='relative'>
                        <img 
                          src={item.userData.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTIwIDIyQzE2IDIyIDEzIDE5IDEzIDE1QzEzIDExIDE2IDggMjAgOEMyNCA4IDI3IDExIDI3IDE1QzI3IDE5IDI0IDIyIDIwIDIyWk0yMCAyNEMyNiAyNCAzMiAyNiAzMiAyOFYzMEg4VjI4QzggMjYgMTQgMjQgMjAgMjRaIiBmaWxsPSIjOUI5Qjk4Ii8+Cjwvc3ZnPgo='} 
                          className='w-10 h-10 rounded-full object-cover border-2 border-gray-200' 
                          alt="Patient" 
                        />
                        <div className='absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-white'></div>
                      </div>
                      <div>
                        <p className='font-medium text-gray-800'>{item.userData.name}</p>
                        <p className='text-xs text-gray-500'>Patient ID: #{item.userData._id?.slice(-6) || '000000'}</p>
                      </div>
                    </div>
                    
                    <div className='text-gray-600 font-medium'>{calculateAge(item.userData.dob)}</div>
                    
                    <div>
                      <p className='font-medium text-gray-800'>{slotDateFormat(item.slotDate)}</p>
                      <p className='text-sm text-blue-600'>{item.slotTime}</p>
                    </div>
                    
                    <div className='flex items-center gap-3'>
                      <img 
                        src={item.docData.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTIwIDIyQzE2IDIyIDEzIDE5IDEzIDE1QzEzIDExIDE2IDggMjAgOEMyNCA4IDI3IDExIDI3IDE1QzI3IDE5IDI0IDIyIDIwIDIyWk0yMCAyNEMyNiAyNCAzMiAyNiAzMiAyOFYzMEg4VjI4QzggMjYgMTQgMjQgMjAgMjRaIiBmaWxsPSIjOUI5Qjk4Ii8+Cjwvc3ZnPgo='} 
                        className='w-10 h-10 rounded-full object-cover border-2 border-blue-200' 
                        alt="Doctor" 
                      />
                      <div>
                        <p className='font-medium text-gray-800'>{item.docData.name}</p>
                        <p className='text-xs text-gray-500'>{item.docData.speciality}</p>
                      </div>
                    </div>
                    
                    <div className='font-semibold text-gray-800'>{currency}{item.amount}</div>
                    
                    <div className='flex items-center gap-2'>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item)}`}>
                        {getStatusText(item)}
                      </span>
                      {!item.cancelled && !item.isCompleted && (
                        <button
                          onClick={() => cancelAppointment(item._id)}
                          className='p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200 group'
                          title="Cancel Appointment"
                        >
                          <svg className='w-4 h-4 group-hover:scale-110 transition-transform duration-200' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                            <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                          </svg>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Mobile Layout */}
                  <div className='lg:hidden p-4 space-y-3'>
                    <div className='flex items-center justify-between'>
                      <div className='flex items-center gap-3'>
                        <img 
                          src={item.userData.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTIwIDIyQzE2IDIyIDEzIDE5IDEzIDE1QzEzIDExIDE2IDggMjAgOEMyNCA4IDI3IDExIDI3IDE1QzI3IDE5IDI0IDIyIDIwIDIyWk0yMCAyNEMyNiAyNCAzMiAyNiAzMiAyOFYzMEg4VjI4QzggMjYgMTQgMjQgMjAgMjRaIiBmaWxsPSIjOUI5Qjk4Ii8+Cjwvc3ZnPgo='} 
                          className='w-12 h-12 rounded-full object-cover border-2 border-gray-200' 
                          alt="Patient" 
                        />
                        <div>
                          <p className='font-medium text-gray-800'>{item.userData.name}</p>
                          <p className='text-sm text-gray-500'>Age: {calculateAge(item.userData.dob)}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(item)}`}>
                        {getStatusText(item)}
                      </span>
                    </div>
                    
                    <div className='flex items-center gap-3 pl-15'>
                      <img 
                        src={item.docData.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMjAiIGZpbGw9IiNGM0Y0RjYiLz4KPHBhdGggZD0iTTIwIDIyQzE2IDIyIDEzIDE5IDEzIDE1QzEzIDExIDE2IDggMjAgOEMyNCA4IDI3IDExIDI3IDE1QzI3IDE5IDI0IDIyIDIwIDIyWk0yMCAyNEMyNiAyNCAzMiAyNiAzMiAyOFYzMEg4VjI4QzggMjYgMTQgMjQgMjAgMjRaIiBmaWxsPSIjOUI5Qjk4Ii8+Cjwvc3ZnPgo='} 
                        className='w-8 h-8 rounded-full object-cover border-2 border-blue-200' 
                        alt="Doctor" 
                      />
                      <div className='flex-1'>
                        <p className='font-medium text-gray-800'>{item.docData.name}</p>
                        <p className='text-sm text-gray-500'>{item.docData.speciality}</p>
                      </div>
                    </div>
                    
                    <div className='flex items-center justify-between pl-15'>
                      <div>
                        <p className='text-sm font-medium text-gray-800'>{slotDateFormat(item.slotDate)}</p>
                        <p className='text-sm text-blue-600'>{item.slotTime}</p>
                      </div>
                      <div className='flex items-center gap-3'>
                        <span className='font-semibold text-gray-800'>{currency}{item.amount}</span>
                        {!item.cancelled && !item.isCompleted && (
                          <button
                            onClick={() => cancelAppointment(item._id)}
                            className='p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors duration-200'
                          >
                            <svg className='w-4 h-4' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M6 18L18 6M6 6l12 12' />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AllAppointments