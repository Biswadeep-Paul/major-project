import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const backendUrl = import.meta.env.VITE_BACKEND_URL
    const [aToken, setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [appointments, setAppointments] = useState([])
    const [doctors, setDoctors] = useState([])
    const [dashData, setDashData] = useState(false)
    const [ratings, setRatings] = useState([]) 
// Add this to your context value
const changeAvailability = async (docId) => {
    try {
        // Optimistically update the UI first for better user experience
        setDoctors(prevDoctors => 
            prevDoctors.map(doc => 
                doc._id === docId ? { ...doc, available: !doc.available } : doc
            )
        );
        
        const { data } = await axios.post(
            backendUrl + '/api/admin/change-availability', 
            { docId }, 
            { headers: { aToken } }
        )
        
        if (data.success) {
            toast.success(data.message)
            // Refresh doctor list after a small delay to ensure backend has updated
            setTimeout(() => getAllDoctors(), 300)
        } else {
            toast.error(data.message)
            // Revert the optimistic update if the API call fails
            setDoctors(prevDoctors => 
                prevDoctors.map(doc => 
                    doc._id === docId ? { ...doc, available: !doc.available } : doc
                )
            );
        }
    } catch (error) {
        console.log(error)
        toast.error(error.message)
        // Revert the optimistic update if the API call fails
        setDoctors(prevDoctors => 
            prevDoctors.map(doc => 
                doc._id === docId ? { ...doc, available: !doc.available } : doc
            )
        );
    }
}


 const getRatingsData = async (doctorId) => {
    try {
        const { data } = await axios.get(`${backendUrl}/api/doctor/${doctorId}/ratings`) // <-- replace docId in URL
        if (data.success) {
            setRatings(data.ratings)
            return { ratings: data.ratings, avgRating: data.avgRating }
        } else {
            toast.error(data.message)
        }
    } catch (error) {
        console.log(error);
        toast.error(error.message)
    }
}

    // Getting all Doctors data from Database using API
    const getAllDoctors = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/all-doctors', { 
                headers: { aToken },
                params: { _t: new Date().getTime() }
            })
            
            if (data.success) {
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    // Function to toggle doctor access
    const toggleDoctorAccess = async (doctorId) => {
        try {
            // Optimistically update the UI first
            setDoctors(prevDoctors => 
                prevDoctors.map(doc => 
                    doc._id === doctorId ? { ...doc, isActive: !doc.isActive } : doc
                )
            );
            
            const { data } = await axios.post(
                backendUrl + '/api/admin/toggle-doctor-access', 
                { doctorId }, 
                { headers: { aToken } }
            )
            
            if (data.success) {
                toast.success(data.message)
                // Refresh doctor list after a small delay
                setTimeout(() => getAllDoctors(), 300)
            } else {
                toast.error(data.message)
                // Revert the optimistic update if the API call fails
                setDoctors(prevDoctors => 
                    prevDoctors.map(doc => 
                        doc._id === doctorId ? { ...doc, isActive: !doc.isActive } : doc
                    )
                );
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
            // Revert the optimistic update if the API call fails
            setDoctors(prevDoctors => 
                prevDoctors.map(doc => 
                    doc._id === doctorId ? { ...doc, isActive: !doc.isActive } : doc
                )
            );
        }
    }

    // Getting all appointment data from Database using API
    const getAllAppointments = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/appointments', { headers: { aToken } })
            if (data.success) {
                setAppointments(data.appointments.reverse())
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    // Function to cancel appointment using API
    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(
                backendUrl + '/api/admin/cancel-appointment', 
                { appointmentId }, 
                { headers: { aToken } }
            )

            if (data.success) {
                toast.success(data.message)
                getAllAppointments()
            } else {
                toast.error(data.message)
            };
        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }
    }

    // Getting Admin Dashboard data from Database using API
    const getDashData = async () => {
        try {
            const { data } = await axios.get(backendUrl + '/api/admin/dashboard', { headers: { aToken } })
            if (data.success) {
                setDashData(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = {
        aToken, setAToken,
        doctors,
        getAllDoctors,
        toggleDoctorAccess, // Add the new function
        appointments,
        getAllAppointments,
        getDashData,
        cancelAppointment,
        dashData,
        changeAvailability,
        ratings,getRatingsData,
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider