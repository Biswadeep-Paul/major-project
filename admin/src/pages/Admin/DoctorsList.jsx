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
    <div className='m-5 max-h-[90vh] overflow-y-scroll'>
      <h1 className='text-lg font-medium'>All Doctors</h1>
      <div className='w-full flex flex-wrap gap-4 pt-5 gap-y-6'>
        {doctors.map((item, index) => (
          <div 
            className={`border rounded-xl max-w-56 overflow-hidden cursor-pointer group ${!item.isActive ? 'opacity-70 border-red-200' : 'border-[#C9D8FF]'}`} 
            key={index}
          >
            <img 
              className={`group-hover:bg-primary transition-all duration-500 ${!item.isActive ? 'bg-gray-200' : 'bg-[#EAEFFF]'}`} 
              src={item.image} 
              alt={item.name} 
            />
            <div className='p-4'>
              <p className='text-[#262626] text-lg font-medium'>{item.name}</p>
              <p className='text-[#5C5C5C] text-sm'>{item.speciality}</p>
              <p className="text-gray-600 text-sm">Rating: {item.averageRating || 'N/A'}</p>
              
              <div className='mt-2 flex flex-col gap-2 text-sm'>
                <div className='flex items-center gap-1'>
                  <input 
                    type="checkbox" 
                    checked={!!item.available} 
                    onChange={() => changeAvailability(item._id)} 
                    className="mr-1"
                  />
                  <p>Available</p>
                </div>
                
                <div className='flex items-center gap-1'>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={!!item.isActive} 
                      onChange={() => toggleDoctorAccess(item._id)} 
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-600"></div>
                    <span className="ml-2 text-sm font-medium">
                      {item.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default DoctorsList