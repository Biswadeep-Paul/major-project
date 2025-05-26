import axios from "axios";
import { createContext, useState } from "react";
import { toast } from "react-toastify";


export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currency = import.meta.env.VITE_CURRENCY
    const backendUrl = import.meta.env.VITE_BACKEND_URL

     const [ratings, setRatings] = useState([]) 

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

    // Function to format the date eg. ( 20_01_2000 => 20 Jan 2000 )
    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_')
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
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

    // Function to calculate the age eg. ( 20_01_2000 => 24 )
    const calculateAge = (dob) => {
        
        return dob
    }

    const value = {
        backendUrl,
        currency,
        slotDateFormat,
        calculateAge,
        ratings,getRatingsData,
    }

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )

}

export default AppContextProvider