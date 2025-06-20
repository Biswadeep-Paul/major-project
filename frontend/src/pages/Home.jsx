import React, { useContext, useEffect, useState } from "react";
import Header from "../components/Header";
import SpecialityMenu from "../components/SpecialityMenu";
import TopDoctors from "../components/TopDoctors";
import Banner from "../components/Banner";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";
import axios from "axios";
// import { XMarkIcon } from "@heroicons/react/24/outline";

const Home = () => {
  const { userData, setUserData, token, backendUrl, loadUserProfileData } = useContext(AppContext);
  const [showPopup, setShowPopup] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const calculateAge = (dob) => {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age;
  };

  useEffect(() => {
    const isProfileComplete = () => {
      const requiredFields = ["name", "phone", "address", "gender", "dob", "econtact", "premedical", "allergy", "blood"];
      return requiredFields.every((field) => userData && userData[field]);
    };

    if (userData && !isProfileComplete()) {
      setShowPopup(true);
    }
  }, [userData]);

  const updateUserProfileData = async () => {
    setIsUpdating(true);
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);
      formData.append("age", userData.age);
      formData.append("econtact", userData.econtact);
      formData.append("premedical", userData.premedical);
      formData.append("allergy", userData.allergy);
      formData.append("blood", userData.blood);

      const { data } = await axios.post(backendUrl + "/api/user/update-profile", formData, { headers: { token } });

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setShowPopup(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error(error);
      toast.error("An error occurred while updating the profile.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div>
      <Header />
      <SpecialityMenu />
      <TopDoctors />
      <Banner />

      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-75 z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-primary border-b px-6 py-4 flex justify-between items-center">
              <h2 className="text-2xl font-semibold text-white">Complete Your Profile</h2>
              {/* <button onClick={() => setShowPopup(false)} className="text-gray-500 hover:text-gray-700">
                <XMarkIcon className="h-6 w-6" />
              </button> */}
            </div>

            <div className="p-6">
              <p className="text-gray-600 mb-6">
                To ensure we can provide you with the best possible care, please complete your profile information.
              </p>

              <form onSubmit={(e) => { e.preventDefault(); updateUserProfileData(); }}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Personal Information</h3>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        id="name"
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="John Doe"
                        value={userData.name || ''}
                        onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <input
                        id="phone"
                        type="tel"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="+1 (555) 123-4567"
                        value={userData.phone || ''}
                        onChange={(e) => setUserData(prev => ({ ...prev, phone: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="dob" className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                      <input
                        id="dob"
                        type="date"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        value={userData.dob || ''}
                        onChange={(e) => {
                          const dob = e.target.value;
                          const age = calculateAge(dob);
                          setUserData(prev => ({ ...prev, dob, age }));
                        }}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                      <input
                        id="age"
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder=""
                        value={userData.age || ''}
                        readOnly
                      />
                    </div>

                    <div>
                      <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                      <select
                        id="gender"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        value={userData.gender || ''}
                        onChange={(e) => setUserData(prev => ({ ...prev, gender: e.target.value }))}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                        <option value="Other">Other</option>
                        <option value="Prefer not to say">Prefer not to say</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Contact & Medical Information</h3>

                    <div>
                      <label htmlFor="econtact" className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                      <input
                        id="econtact"
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="Emergency contact name and number"
                        value={userData.econtact || ''}
                        onChange={(e) => setUserData(prev => ({ ...prev, econtact: e.target.value }))}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="blood" className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
                      <select
                        id="blood"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        value={userData.blood || ''}
                        onChange={(e) => setUserData(prev => ({ ...prev, blood: e.target.value }))}
                        required
                      >
                        <option value="">Select Blood Type</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                      </select>
                    </div>

                    <div>
                      <label htmlFor="address1" className="block text-sm font-medium text-gray-700 mb-1">Address Line 1</label>
                      <input
                        id="address1"
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="Street address, P.O. box"
                        value={userData.address?.line1 || ''}
                        onChange={(e) => setUserData(prev => ({
                          ...prev, address: { ...prev.address, line1: e.target.value }
                        }))}
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="address2" className="block text-sm font-medium text-gray-700 mb-1">Address Line 2</label>
                      <input
                        id="address2"
                        type="text"
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                        placeholder="Apartment, suite, unit, building, floor, etc."
                        value={userData.address?.line2 || ''}
                        onChange={(e) => setUserData(prev => ({
                          ...prev, address: { ...prev.address, line2: e.target.value }
                        }))}
                      />
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <h3 className="text-lg font-medium text-gray-900 border-b pb-2">Medical History</h3>

                  <div>
                    <label htmlFor="premedical" className="block text-sm font-medium text-gray-700 mb-1">Pre-existing Medical Conditions</label>
                    <textarea
                      id="premedical"
                      rows={3}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      placeholder="List any chronic illnesses, past surgeries, or major medical events"
                      value={userData.premedical || ''}
                      onChange={(e) => setUserData(prev => ({ ...prev, premedical: e.target.value }))}
                    />
                  </div>

                  <div>
                    <label htmlFor="allergy" className="block text-sm font-medium text-gray-700 mb-1">Allergies</label>
                    <textarea
                      id="allergy"
                      rows={2}
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2 border"
                      placeholder="List any known allergies (medications, foods, environmental, etc.)"
                      value={userData.allergy || ''}
                      onChange={(e) => setUserData(prev => ({ ...prev, allergy: e.target.value }))}
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={() => setShowPopup(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isUpdating}
                    className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isUpdating ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
