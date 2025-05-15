import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'

const DoctorProfile = () => {
    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)
    const [loading, setLoading] = useState(true) // Add loading state
    const [error, setError] = useState(null) // Add error state

    // Modified function to handle loading and errors
    const fetchProfileData = async () => {
        try {
            setLoading(true)
            setError(null)
            await getProfileData()
        } catch (err) {
            console.error("Error fetching profile data:", err)
            setError(err.message || "Failed to load profile data")
            toast.error("Failed to load profile data")
        } finally {
            setLoading(false)
        }
    }

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
            fetchProfileData()
        } else {
            setLoading(false) // If no token, don't keep showing loading
            setError("Authentication required")
        }
    }, [dToken])

    // Helper function to render day selector
    const renderDaySelector = (day) => (
        <label key={day} className="flex items-center gap-1 text-sm bg-gray-50 px-3 py-2 rounded-lg shadow-sm hover:bg-gray-100 transition-all">
            <input
                type="checkbox"
                checked={profileData?.preferredDays?.includes(day)}
                onChange={(e) => {
                    const newDays = e.target.checked
                        ? [...(profileData?.preferredDays || []), day]
                        : (profileData?.preferredDays || []).filter(d => d !== day);
                    setProfileData(prev => ({ ...prev, preferredDays: newDays }));
                }}
                className="mr-1 accent-primary"
            />
            {day}
        </label>
    )

    // Show loading state
    if (loading) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="flex justify-center mb-4">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
                    </div>
                    <p className="text-gray-600">Loading profile data...</p>
                </div>
            </div>
        )
    }

    // Show error state
    if (error || !profileData) {
        return (
            <div className="bg-gradient-to-br from-blue-50 to-slate-50 min-h-screen flex items-center justify-center">
                <div className="bg-white p-8 rounded-xl shadow-lg max-w-md w-full text-center">
                    <div className="flex justify-center mb-4 text-red-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Unable to load profile</h2>
                    <p className="text-gray-600 mb-6">{error || "Profile data not available"}</p>
                    <button 
                        onClick={fetchProfileData} 
                        className="px-6 py-2 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary/90 transition-all"
                    >
                        Retry
                    </button>
                </div>
            </div>
        )
    }

    return (
        <div className="bg-gradient-to-br from-blue-50 to-slate-50 min-h-screen py-8 px-4">
            <div className="max-w-6xl mx-auto">
                <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
                    {/* Header Banner */}
                    <div className="h-32 bg-gradient-to-r from-primary/80 to-blue-600/80 relative">
                        {profileData.available && (
                            <div className="absolute top-4 right-4 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-medium flex items-center">
                                <span className="h-2 w-2 bg-green-500 rounded-full mr-2"></span>
                                Available for Appointments
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row">
                        {/* Profile Image Section */}
                        <div className="md:w-1/3 px-8 -mt-16 relative">
                            <div className="relative">
                                <img 
                                    className="h-48 w-48 rounded-full object-cover border-4 border-white shadow-lg" 
                                    src={profileData.image} 
                                    alt={`Dr. ${profileData.name}`}
                                />
                                {isEdit && (
                                    <button className="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-gray-100 transition-all">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                    </button>
                                )}
                            </div>

                            <div className="mt-6">
                                <div className="flex items-center text-yellow-500 mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <svg key={i} xmlns="http://www.w3.org/2000/svg" className={`h-5 w-5 ${i < Math.floor(profileData.rating || 0) ? 'text-yellow-500' : 'text-gray-300'}`} viewBox="0 0 20 20" fill="currentColor">
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                    <span className="ml-2 text-gray-600 font-medium">{(profileData.rating || 0).toFixed(1)}</span>
                                </div>

                                <div className="py-4 border-t border-b border-gray-100">
                                    <div className="text-gray-600 mb-2">
                                        <div className="flex gap-2 items-center mb-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                            </svg>
                                            {isEdit ? (
                                                <input 
                                                    type="text" 
                                                    placeholder="Enter location" 
                                                    onChange={(e) => setProfileData(prev => ({ 
                                                        ...prev, 
                                                        location: e.target.value 
                                                    }))} 
                                                    value={profileData.location || ''} 
                                                    className="border p-1 rounded w-full"
                                                />
                                            ) : (
                                                <span>{profileData.location || 'Not specified'}</span>
                                            )}
                                        </div>
                                        
                                        <div className="flex gap-2 items-start mb-1">
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary mt-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                            </svg>
                                            <div>
                                                {isEdit ? (
                                                    <>
                                                        <input 
                                                            type="text" 
                                                            onChange={(e) => setProfileData(prev => ({ 
                                                                ...prev, 
                                                                address: { ...(prev.address || {}), line1: e.target.value } 
                                                            }))} 
                                                            value={profileData.address?.line1 || ''} 
                                                            className="border p-1 rounded mb-1 w-full"
                                                        />
                                                        <input 
                                                            type="text" 
                                                            onChange={(e) => setProfileData(prev => ({ 
                                                                ...prev, 
                                                                address: { ...(prev.address || {}), line2: e.target.value } 
                                                            }))} 
                                                            value={profileData.address?.line2 || ''} 
                                                            className="border p-1 rounded w-full"
                                                        />
                                                    </>
                                                ) : (
                                                    <>
                                                        <p>{profileData.address?.line1 || 'No address specified'}</p>
                                                        <p>{profileData.address?.line2 || ''}</p>
                                                    </>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center mt-6">
                                    <div className="bg-blue-50 rounded-lg px-4 py-2 text-center flex-1 mr-2">
                                        <p className="text-xs text-blue-500 font-medium">Fee</p>
                                        <p className="text-gray-800 font-bold">
                                            {isEdit ? (
                                                <input 
                                                    type="number" 
                                                    onChange={(e) => setProfileData(prev => ({ ...prev, fees: e.target.value }))} 
                                                    value={profileData.fees || ''} 
                                                    className="border p-1 rounded w-24 text-center"
                                                />
                                            ) : (
                                                `${currency} ${profileData.fees || 0}`
                                            )}
                                        </p>
                                    </div>
                                    
                                    <div className="bg-blue-50 rounded-lg px-4 py-2 text-center flex-1">
                                        <p className="text-xs text-blue-500 font-medium">Experience</p>
                                        <p className="text-gray-800 font-bold">{profileData.experience || 'N/A'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Details Section */}
                        <div className="md:w-2/3 p-8 pt-6">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-800">{profileData.name || 'Doctor'}</h1>
                                    <div className="flex items-center mt-2">
                                        <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium mr-2">{profileData.speciality || 'Specialist'}</span>
                                        <span className="text-gray-600">{profileData.degree || 'MD'}</span>
                                    </div>
                                </div>
                                
                                <div>
                                    {isEdit ? (
                                        <button 
                                            onClick={updateProfile} 
                                            className="px-6 py-2 bg-primary text-white font-medium rounded-lg shadow-md hover:bg-primary/90 transition-all flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                            </svg>
                                            Save Changes
                                        </button>
                                    ) : (
                                        <button 
                                            onClick={() => setIsEdit(true)} 
                                            className="px-6 py-2 border border-primary text-primary font-medium rounded-lg hover:bg-primary hover:text-white transition-all flex items-center"
                                        >
                                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                            </svg>
                                            Edit Profile
                                        </button>
                                    )}
                                </div>
                            </div>

                            {/* About Section */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    About
                                </h3>
                                {isEdit ? (
                                    <textarea 
                                        onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))} 
                                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-primary/50" 
                                        rows={6} 
                                        value={profileData.about || ''} 
                                    />
                                ) : (
                                    <p className="text-gray-600 leading-relaxed">{profileData.about || 'No information provided.'}</p>
                                )}
                            </div>

                            {/* Working Schedule */}
                            <div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    Working Schedule
                                </h3>

                                <div className="p-4 bg-gray-50 rounded-xl">
                                    <div className="flex justify-between items-center mb-4">
                                        <h4 className="font-medium text-gray-700">Available Days</h4>
                                        {isEdit && (
                                            <div className="flex items-center">
                                                <input 
                                                    type="checkbox" 
                                                    id="available" 
                                                    onChange={() => setProfileData(prev => ({ ...prev, available: !prev.available }))} 
                                                    checked={profileData.available || false} 
                                                    className="accent-primary mr-2"
                                                />
                                                <label htmlFor="available" className="text-sm">Currently Available</label>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {isEdit ? (
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-4">
                                            {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(day => renderDaySelector(day))}
                                        </div>
                                    ) : (
                                        <div className="flex flex-wrap gap-2 mb-4">
                                            {(profileData.preferredDays || ['MON', 'TUE', 'WED', 'THU', 'FRI']).map(day => (
                                                <span key={day} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                                                    {day}
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    <div className="flex justify-between items-center">
                                        <h4 className="font-medium text-gray-700">Working Hours</h4>
                                        {!isEdit && (
                                            <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg text-sm font-medium">
                                                {profileData.preferredHours?.start || '09:00'} - {profileData.preferredHours?.end || '17:00'}
                                            </div>
                                        )}
                                    </div>

                                    {isEdit && (
                                        <div className="flex gap-4 mt-2 items-center">
                                            <div className="relative">
                                                <label className="block text-xs text-gray-500 mb-1">From</label>
                                                <input
                                                    type="time"
                                                    value={profileData.preferredHours?.start || '09:00'}
                                                    onChange={(e) => setProfileData(prev => ({
                                                        ...prev,
                                                        preferredHours: {
                                                            ...(prev.preferredHours || {}),
                                                            start: e.target.value
                                                        }
                                                    }))}
                                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                />
                                            </div>
                                            <div className="pt-6">
                                                <hr className="w-8 border-gray-300" />
                                            </div>
                                            <div className="relative">
                                                <label className="block text-xs text-gray-500 mb-1">To</label>
                                                <input
                                                    type="time"
                                                    value={profileData.preferredHours?.end || '17:00'}
                                                    onChange={(e) => setProfileData(prev => ({
                                                        ...prev,
                                                        preferredHours: {
                                                            ...(prev.preferredHours || {}),
                                                            end: e.target.value
                                                        }
                                                    }))}
                                                    className="border rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-primary/50"
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DoctorProfile