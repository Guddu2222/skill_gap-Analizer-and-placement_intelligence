import React, { useState } from 'react';
import { MapPin, Briefcase, IndianRupee, Map, ChevronLeft } from 'lucide-react';

const Step6Preferences = ({ formData, updateFormData, onNext, onBack }) => {
  const [errors, setErrors] = useState({});

  const validateStep = () => {
    const newErrors = {};

    if (!formData.addressLine1?.trim()) newErrors.addressLine1 = 'Address line 1 is required';
    if (!formData.city?.trim()) newErrors.city = 'City is required';
    if (!formData.state?.trim()) newErrors.state = 'State is required';
    if (!formData.pincode?.trim()) newErrors.pincode = 'Pincode is required';
    if (!formData.pincode?.match(/^[0-9]{6}$/)) newErrors.pincode = 'Valid 6-digit Pincode required';

    if (formData.expectedSalaryMin && formData.expectedSalaryMax) {
      if (Number(formData.expectedSalaryMin) > Number(formData.expectedSalaryMax)) {
        newErrors.salary = 'Min salary cannot be greater than max salary';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const fetchLocationFromPincode = async (pincode) => {
    updateFormData({ pincode });
    
    // Auto-fetch city and state only when exactly 6 digits are typed
    if (pincode.length === 6) {
      try {
        setErrors(prev => ({ ...prev, pincode: null }));
        const response = await fetch(`https://api.postalpincode.in/pincode/${pincode}`);
        const data = await response.json();
        
        if (data && data[0] && data[0].Status === 'Success') {
          const postOffice = data[0].PostOffice[0];
          updateFormData({
            pincode,
            city: postOffice.District || postOffice.Block,
            state: postOffice.State,
            country: postOffice.Country || 'India'
          });
        } else {
          setErrors(prev => ({ ...prev, pincode: 'Invalid Pincode. Please check and try again.' }));
        }
      } catch (err) {
        console.error('Error fetching pincode data:', err);
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateStep()) {
      onNext();
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4">
      <div className="max-w-3xl w-full">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Preferences & Address</h2>
          <p className="text-gray-600">Help employers find you and match your expectations</p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-600">Step 6 of 6</span>
            <span className="text-sm text-gray-500">Preferences</span>
          </div>
          <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            
            {/* Address Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b pb-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-bold text-gray-900">Current Address</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 1 *</label>
                  <input
                    type="text" required
                    value={formData.addressLine1 || ''}
                    onChange={(e) => updateFormData({ addressLine1: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.addressLine1 ? 'border-red-500' : 'border-gray-300'}`}
                    placeholder="House No, Street, Landmark"
                  />
                  {errors.addressLine1 && <p className="mt-1 text-sm text-red-600">{errors.addressLine1}</p>}
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Address Line 2 <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <input
                    type="text"
                    value={formData.addressLine2 || ''}
                    onChange={(e) => updateFormData({ addressLine2: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Locality, Area"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">City *</label>
                  <input
                    type="text" required
                    value={formData.city || ''}
                    onChange={(e) => updateFormData({ city: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.city ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">State *</label>
                  <input
                    type="text" required
                    value={formData.state || ''}
                    onChange={(e) => updateFormData({ state: e.target.value })}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.state ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.state && <p className="mt-1 text-sm text-red-600">{errors.state}</p>}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Pincode *</label>
                  <input
                    type="text" required maxLength="6"
                    value={formData.pincode || ''}
                    onChange={(e) => fetchLocationFromPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.pincode ? 'border-red-500' : 'border-gray-300'}`}
                  />
                  {errors.pincode && <p className="mt-1 text-sm text-red-600">{errors.pincode}</p>}
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Country</label>
                  <input
                    type="text" disabled
                    value={formData.country || 'India'}
                    className="w-full px-4 py-3 border border-gray-300 bg-gray-100 rounded-lg"
                  />
                </div>
              </div>
            </div>

            {/* Career Preferences Section */}
            <div>
              <div className="flex items-center gap-2 mb-4 border-b pb-2">
                <Briefcase className="w-5 h-5 text-indigo-600" />
                <h3 className="text-lg font-bold text-gray-900">Career Preferences</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">Preferred Locations</label>
                  <div className="relative">
                    <Map className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      value={formData.preferredLocations?.join(', ') || ''}
                      onChange={(e) => updateFormData({ preferredLocations: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="E.g. Bangalore, Delhi NCR, Remote (comma separated)"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Expected Salary Min (LPA)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number" step="0.5" min="0"
                      value={formData.expectedSalaryMin || ''}
                      onChange={(e) => updateFormData({ expectedSalaryMin: e.target.value })}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
                      placeholder="e.g. 6.0"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 flex items-center gap-2">
                    Expected Salary Max (LPA)
                  </label>
                  <div className="relative">
                    <IndianRupee className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="number" step="0.5" min="0"
                      value={formData.expectedSalaryMax || ''}
                      onChange={(e) => updateFormData({ expectedSalaryMax: e.target.value })}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${errors.salary ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g. 12.0"
                    />
                  </div>
                </div>
                {errors.salary && <div className="md:col-span-2"><p className="mt-1 text-sm text-red-600">{errors.salary}</p></div>}
                
                <div className="md:col-span-2 mt-4 bg-indigo-50 p-4 rounded-xl border border-indigo-100 flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold text-indigo-900 text-sm">Open to Relocation</h4>
                    <p className="text-xs text-indigo-700">Are you willing to relocate to a different city for a job?</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      className="sr-only peer"
                      checked={formData.willingToRelocate ?? true}
                      onChange={(e) => updateFormData({ willingToRelocate: e.target.checked })}
                    />
                    <div className="w-11 h-6 bg-indigo-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                  </label>
                </div>
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onBack}
                className="flex-1 bg-white text-gray-700 border-2 border-gray-300 py-3 px-6 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center justify-center"
              >
                <ChevronLeft className="w-5 h-5 mr-1" /> Back
              </button>
              <button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 shadow-lg flex items-center justify-center gap-2"
              >
                Submit Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Step6Preferences;
