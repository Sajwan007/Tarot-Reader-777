import React from 'react';
import { User, Mail, Phone, Calendar, DollarSign } from 'lucide-react';

const ClientsList = ({ clients }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-6">Client Directory</h2>
      
      {clients.length === 0 ? (
        <div className="text-center py-12 text-purple-300">
          No clients yet
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clients.map((client) => (
            <div 
              key={client.id}
              className="bg-white bg-opacity-10 border border-purple-400 border-opacity-30 rounded-xl p-6 hover:bg-opacity-20 transition"
            >
              <div className="flex items-start gap-4 mb-4">
                <div className="bg-purple-600 rounded-full p-3">
                  <User className="text-white" size={24} />
                </div>
                <div className="flex-1">
                  <h3 className="text-white font-bold text-lg">{client.name}</h3>
                  <p className="text-purple-300 text-sm flex items-center gap-1 mt-1">
                    <Mail size={14} /> {client.email}
                  </p>
                  <p className="text-purple-300 text-sm flex items-center gap-1 mt-1">
                    <Phone size={14} /> {client.phone}
                  </p>
                </div>
              </div>

              <div className="space-y-2 pt-4 border-t border-purple-400 border-opacity-30">
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 text-sm">Total Bookings</span>
                  <span className="text-white font-bold">{client.total_bookings || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-purple-300 text-sm">Total Spent</span>
                  <span className="text-white font-bold">₹{client.total_spent || 0}</span>
                </div>
                {client.last_booking && (
                  <div className="flex justify-between items-center">
                    <span className="text-purple-300 text-sm">Last Visit</span>
                    <span className="text-white text-sm">
                      {new Date(client.last_booking).toLocaleDateString()}
                    </span>
                  </div>
                )}
              </div>

              {client.notes && (
                <div className="mt-4 pt-4 border-t border-purple-400 border-opacity-30">
                  <p className="text-purple-300 text-sm">Notes:</p>
                  <p className="text-white text-sm mt-1">{client.notes}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ClientsList;
