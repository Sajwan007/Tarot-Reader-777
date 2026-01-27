import React, { useState } from 'react';
import BookingForm from '../components/forms/BookingForm';
import { SERVICES, TIME_SLOTS } from '../utils/constants';

const ClientBooking = () => {
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [showForm, setShowForm] = useState(false);

  const handleServiceSelect = (service) => {
    setSelectedService(service);
  };

  const handleDateTimeSelect = (date, time) => {
    setSelectedDate(date);
    setSelectedTime(time);
    setShowForm(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Book Your Tarot Reading
          </h1>
          <p className="text-lg text-gray-600">
            Choose your service and schedule your mystical journey
          </p>
        </div>

        {!showForm ? (
          <div className="space-y-12">
            {/* Service Selection */}
            <div>
              <h2 className="text-2xl font-semibold text-gray-900 mb-6">Choose Your Reading</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {SERVICES.map((service) => (
                  <div
                    key={service.id}
                    className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all duration-200 hover:shadow-xl ${
                      selectedService?.id === service.id ? 'ring-2 ring-indigo-500' : ''
                    }`}
                    onClick={() => handleServiceSelect(service)}
                  >
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {service.name}
                    </h3>
                    <p className="text-gray-600 mb-4">{service.duration}</p>
                    <p className="text-2xl font-bold text-indigo-600">${service.price}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Date and Time Selection */}
            {selectedService && (
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Select Date & Time</h2>
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Date
                      </label>
                      <input
                        type="date"
                        min={new Date().toISOString().split('T')[0]}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => setSelectedDate(e.target.value)}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Select Time
                      </label>
                      <select
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        onChange={(e) => setSelectedTime(e.target.value)}
                      >
                        <option value="">Select a time</option>
                        {TIME_SLOTS.map((time) => (
                          <option key={time} value={time}>
                            {time}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDateTimeSelect(selectedDate, selectedTime)}
                    disabled={!selectedDate || !selectedTime}
                    className="mt-6 w-full bg-indigo-600 text-white py-3 px-4 rounded-md hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Continue to Booking Details
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <BookingForm
            service={selectedService}
            date={selectedDate}
            time={selectedTime}
            onBack={() => setShowForm(false)}
          />
        )}
      </div>
    </div>
  );
};

export default ClientBooking;
