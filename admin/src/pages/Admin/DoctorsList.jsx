import React, { useContext, useEffect } from 'react'
import { AdminContext } from '../../context/AdminContext'

const DoctorsList = () => {
  const { doctors, toggleDoctorAccess, aToken, getAllDoctors, changeAvailability } = useContext(AdminContext)

  useEffect(() => {
    if (aToken) {
      getAllDoctors()
    }
  }, [aToken])

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header Section */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-800 mb-2'>Medical Team</h1>
          <p className='text-gray-600'>Manage doctors and their availability status</p>
          <div className='w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mt-3'></div>
        </div>

        {/* Stats Overview */}
        <div className='grid grid-cols-1 md:grid-cols-3 gap-4 mb-8'>
          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <div className='flex items-center'>
              <div className='p-2 bg-blue-100 rounded-lg mr-3'>
                <svg className='w-5 h-5 text-blue-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z'></path>
                </svg>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Total Doctors</p>
                <p className='text-xl font-semibold text-gray-800'>{doctors.length}</p>
              </div>
            </div>
          </div>
          
          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <div className='flex items-center'>
              <div className='p-2 bg-green-100 rounded-lg mr-3'>
                <svg className='w-5 h-5 text-green-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'></path>
                </svg>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Active Doctors</p>
                <p className='text-xl font-semibold text-gray-800'>{doctors.filter(doc => doc.isActive).length}</p>
              </div>
            </div>
          </div>
          
          <div className='bg-white rounded-xl p-4 shadow-sm border border-gray-100'>
            <div className='flex items-center'>
              <div className='p-2 bg-purple-100 rounded-lg mr-3'>
                <svg className='w-5 h-5 text-purple-600' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z' clipRule='evenodd'></path>
                </svg>
              </div>
              <div>
                <p className='text-sm text-gray-600'>Available Today</p>
                <p className='text-xl font-semibold text-gray-800'>{doctors.filter(doc => doc.available).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Doctors Grid */}
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
          {doctors.map((item, index) => (
            <div 
              className={`bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 ${
                !item.isActive ? 'opacity-75 ring-2 ring-red-200' : 'ring-1 ring-gray-100 hover:ring-blue-200'
              }`}
              key={index}
            >
              {/* Doctor Image */}
              <div className={`relative h-48 overflow-hidden ${!item.isActive ? 'bg-gray-100' : 'bg-gradient-to-br from-blue-50 to-indigo-100'}`}>
                <img 
                  className='w-full h-full object-cover transition-transform duration-300 hover:scale-105'
                  src={item.image} 
                  alt={item.name}
                />
                {/* Status Badge */}
                <div className='absolute top-3 right-3'>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    item.isActive 
                      ? 'bg-green-100 text-green-700 border border-green-200' 
                      : 'bg-red-100 text-red-700 border border-red-200'
                  }`}>
                    {item.isActive ? 'Active' : 'Inactive'}
                  </span>
                </div>
              </div>

              {/* Doctor Info */}
              <div className='p-6'>
                <div className='mb-4'>
                  <h3 className='text-lg font-bold text-gray-800 mb-1 line-clamp-1'>{item.name}</h3>
                  <p className='text-sm text-blue-600 font-medium bg-blue-50 px-2 py-1 rounded-full inline-block'>
                    {item.speciality}
                  </p>
                </div>

                {/* Rating */}
                <div className='flex items-center mb-4'>
                  <div className='flex items-center mr-2'>
                    {[...Array(5)].map((_, i) => (
                      <svg 
                        key={i}
                        className={`w-4 h-4 ${i < Math.floor(item.averageRating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill='currentColor' 
                        viewBox='0 0 20 20'
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                      </svg>
                    ))}
                  </div>
                  <span className='text-sm text-gray-600'>
                    {item.averageRating ? `${item.averageRating.toFixed(1)}` : 'No ratings'}
                  </span>
                </div>

                {/* Controls */}
                <div className='space-y-3'>
                  {/* Availability Toggle */}
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                    <div className='flex items-center'>
                      <div className={`w-2 h-2 rounded-full mr-2 ${item.available ? 'bg-green-400' : 'bg-gray-400'}`}></div>
                      <span className='text-sm font-medium text-gray-700'>Available Today</span>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={!!item.available}
                        onChange={() => changeAvailability(item._id)}
                        className='sr-only peer'
                      />
                      <div className='w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-green-500'></div>
                    </label>
                  </div>

                  {/* Active Status Toggle */}
                  <div className='flex items-center justify-between p-3 bg-gray-50 rounded-xl'>
                    <div className='flex items-center'>
                      <div className={`w-2 h-2 rounded-full mr-2 ${item.isActive ? 'bg-blue-400' : 'bg-red-400'}`}></div>
                      <span className='text-sm font-medium text-gray-700'>Account Status</span>
                    </div>
                    <label className='relative inline-flex items-center cursor-pointer'>
                      <input
                        type='checkbox'
                        checked={!!item.isActive}
                        onChange={() => toggleDoctorAccess(item._id)}
                        className='sr-only peer'
                      />
                      <div className='w-9 h-5 bg-gray-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[""] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500'></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {doctors.length === 0 && (
          <div className='text-center py-12'>
            <div className='w-24 h-24 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center'>
              <svg className='w-12 h-12 text-gray-400' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' />
              </svg>
            </div>
            <h3 className='text-lg font-medium text-gray-900 mb-2'>No doctors found</h3>
            <p className='text-gray-500'>Get started by adding your first doctor to the system.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default DoctorsList