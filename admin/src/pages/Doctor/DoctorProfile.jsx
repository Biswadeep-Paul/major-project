import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {
        try {
            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available,
                location: profileData.location,
                preferredDays: profileData.preferredDays || ['MON', 'TUE', 'WED', 'THU', 'FRI'],
                preferredHours: profileData.preferredHours || { start: '09:00', end: '17:00' }
            }

            const { data } = await axios.post(
                backendUrl + '/api/doctor/update-profile', 
                updateData, 
                { headers: { dToken } }
            )

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <div>
            <div className='flex flex-col gap-4 m-5'>
                <div>
                    <img className='bg-primary/80 w-full sm:max-w-64 rounded-lg' src={profileData.image} alt="" />
                </div>

                <div className='flex-1 border border-stone-100 rounded-lg p-8 py-7 bg-white'>
                    {/* Doctor Info */}
                    <p className='flex items-center gap-2 text-3xl font-medium text-gray-700'>{profileData.name}</p>
                    <div className='flex items-center gap-2 mt-1 text-gray-600'>
                        <p>{profileData.degree} - {profileData.speciality}</p>
                        <button className='py-0.5 px-2 border text-xs rounded-full'>{profileData.experience}</button>
                    </div>

                    {/* About Section */}
                    <div>
                        <p className='flex items-center gap-1 text-sm font-medium text-[#262626] mt-3'>About :</p>
                        <p className='text-sm text-gray-600 max-w-[700px] mt-1'>
                            {isEdit ? (
                                <textarea 
                                    onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} 
                                    type='text' 
                                    className='w-full outline-primary p-2' 
                                    rows={8} 
                                    value={profileData.about} 
                                />
                            ) : profileData.about}
                        </p>
                    </div>

                    {/* Appointment Fee */}
                    <p className='text-gray-600 font-medium mt-4'>
                        Appointment fee: <span className='text-gray-800'>
                            {currency} {isEdit ? (
                                <input 
                                    type='number' 
                                    onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} 
                                    value={profileData.fees} 
                                    className="border p-1 rounded w-24"
                                />
                            ) : profileData.fees}
                        </span>
                    </p>

                    {/* Rating */}
                    <p className="text-gray-600 text-sm">Rating: {profileData.averageRating}</p>

                    {/* Address */}
                    <div className='flex gap-2 py-2'>
                        <p>Address:</p>
                        <p className='text-sm'>
                            {isEdit ? (
                                <input 
                                    type='text' 
                                    onChange={(e) => setProfileData(prev => ({ 
                                        ...prev, 
                                        address: { ...prev.address, line1: e.target.value } 
                                    }))} 
                                    value={profileData.address.line1} 
                                    className="border p-1 rounded mb-1 w-full"
                                />
                            ) : profileData.address.line1}
                            <br />
                            {isEdit ? (
                                <input 
                                    type='text' 
                                    onChange={(e) => setProfileData(prev => ({ 
                                        ...prev, 
                                        address: { ...prev.address, line2: e.target.value } 
                                    }))} 
                                    value={profileData.address.line2} 
                                    className="border p-1 rounded w-full"
                                />
                            ) : profileData.address.line2}
                        </p>
                    </div>

                    {/* Location */}
                    <p className='text-gray-600 font-medium mt-4'>Location:
                        {isEdit ? (
                            <input 
                                type='text' 
                                placeholder='Enter location' 
                                onChange={(e) => setProfileData(prev => ({ 
                                    ...prev, 
                                    location: e.target.value 
                                }))} 
                                value={profileData.location || ''} 
                                className='border p-1 rounded ml-2 w-64'
                            />
                        ) : (
                            <span className='ml-2'>{profileData.location}</span>
                        )}
                    </p>

                    {/* Availability */}
                    <div className='flex gap-1 pt-2'>
                        <input 
                            type="checkbox" 
                            onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))} 
                            checked={profileData.available} 
                        />
                        <label htmlFor="">Available</label>
                    </div>

                    {/* Preferred Days and Times */}
                    <div className="mt-4">
                        <p className="text-sm font-medium text-gray-700">Working Schedule:</p>
                        {isEdit ? (
                            <>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'].map(day => (
                                        <label key={day} className="flex items-center gap-1 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={profileData.preferredDays?.includes(day)}
                                                onChange={(e) => {
                                                    const newDays = e.target.checked
                                                        ? [...(profileData.preferredDays || []), day]
                                                        : (profileData.preferredDays || []).filter(d => d !== day);
                                                    setProfileData(prev => ({ ...prev, preferredDays: newDays }));
                                                }}
                                                className="mr-1"
                                            />
                                            {day}
                                        </label>
                                    ))}
                                </div>

                                <div className="flex gap-4 mt-2 items-center">
                                    <div>
                                        <label className="block text-xs text-gray-500">From</label>
                                        <input
                                            type="time"
                                            value={profileData.preferredHours?.start || '09:00'}
                                            onChange={(e) => setProfileData(prev => ({
                                                ...prev,
                                                preferredHours: {
                                                    ...prev.preferredHours,
                                                    start: e.target.value
                                                }
                                            }))}
                                            className="border p-1 rounded"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs text-gray-500">To</label>
                                        <input
                                            type="time"
                                            value={profileData.preferredHours?.end || '17:00'}
                                            onChange={(e) => setProfileData(prev => ({
                                                ...prev,
                                                preferredHours: {
                                                    ...prev.preferredHours,
                                                    end: e.target.value
                                                }
                                            }))}
                                            className="border p-1 rounded"
                                        />
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Days:</span> {profileData.preferredDays?.join(', ') || 'Not specified'}
                                </p>
                                <p className="text-sm text-gray-600">
                                    <span className="font-medium">Hours:</span> {profileData.preferredHours?.start || '09:00'} - {profileData.preferredHours?.end || '17:00'}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Save/Edit Buttons */}
                    <div className="mt-6">
                        {isEdit ? (
                            <button 
                                onClick={updateProfile} 
                                className='px-4 py-2 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all bg-primary text-white'
                            >
                                Save Changes
                            </button>
                        ) : (
                            <button 
                                onClick={() => setIsEdit(true)} 
                                className='px-4 py-2 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all'
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile