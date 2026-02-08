export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-800 mb-8">Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Health Overview Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Health Overview</h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Heart Rate</span>
                <span className="text-green-600 font-medium">72 BPM</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Blood Pressure</span>
                <span className="text-blue-600 font-medium">120/80</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Temperature</span>
                <span className="text-orange-600 font-medium">98.6°F</span>
              </div>
            </div>
          </div>

          {/* Recent Appointments Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Appointments</h2>
            <div className="space-y-3">
              <div className="border-l-4 border-blue-500 pl-3">
                <p className="font-medium text-gray-800">Dr. Smith</p>
                <p className="text-sm text-gray-600">Cardiology - Nov 20, 2025</p>
              </div>
              <div className="border-l-4 border-green-500 pl-3">
                <p className="font-medium text-gray-800">Dr. Johnson</p>
                <p className="text-sm text-gray-600">General - Nov 15, 2025</p>
              </div>
            </div>
          </div>

          {/* Quick Actions Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors">
                Schedule Appointment
              </button>
              <button className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 transition-colors">
                View Medical Records
              </button>
              <button className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 transition-colors">
                AI Health Analysis
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
