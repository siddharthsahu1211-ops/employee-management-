// Initialize profile controller
export function initProfileController() {
  console.log("Profile controller initialized");
  const app = document.querySelector("#app");
  if (app) {
    app.innerHTML = `
      <div class="min-h-screen bg-black py-8">
        <div class="max-w-6xl mx-auto px-4">
            <!-- Header Section -->
            <div class="text-center mb-12">
                <div class="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-2xl mb-4 shadow-lg">
                    <i class="fas fa-users text-white text-2xl"></i>
                </div>
                <h1 class="text-4xl font-bold text-white mb-2">Employee Profiles</h1>
                <p class="text-gray-300 text-lg">Click on any employee to view their complete profile</p>
            </div>

            <!-- Loading Spinner -->
            <div id="loadingSpinner" class="flex justify-center items-center py-12">
                <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
            </div>

            <!-- Error Message -->
            <div id="errorMessage" class="text-center py-12 text-red-400 hidden">
                <i class="fas fa-exclamation-triangle text-4xl mb-4"></i>
                <p>Failed to load employee profiles. Please try again.</p>
            </div>

            <!-- Employee Table Section -->
            <div id="employeeTableContainer" class="card rounded-3xl shadow-xl overflow-hidden relative hidden">
                <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-t-3xl"></div>
                <div class="bg-gradient-to-r from-blue-600 to-cyan-600 px-8 py-4">
                    <div class="flex items-center justify-between">
                        <div class="flex items-center space-x-3">
                            <div class="w-8 h-8 bg-white bg-opacity-20 rounded-lg flex items-center justify-center">
                                <i class="fas fa-users text-white"></i>
                            </div>
                            <h2 class="text-xl font-semibold text-white">Employee Directory</h2>
                        </div>
                        <div class="text-sm text-gray-200">
                            <i class="fas fa-mouse-pointer mr-1"></i>Click rows for details
                        </div>
                    </div>
                </div>

                <div class="overflow-x-auto bg-black">
                    <table class="w-full">
                        <thead class="bg-gray-900">
                            <tr>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Employee</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Email</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Department</th>
                                <th class="px-6 py-3 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">Year</th>
                            </tr>
                        </thead>
                        <tbody id="employeeTableBody" class="bg-black"></tbody>
                    </table>
                    <div id="noEmployees" class="px-8 py-16 text-center hidden bg-black">
                        <div class="flex flex-col items-center space-y-4">
                            <div class="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center">
                                <i class="fas fa-users text-gray-500 text-2xl"></i>
                            </div>
                            <p class="text-gray-400 text-lg font-medium">No employees found</p>
                            <p class="text-gray-500 text-sm">Add employees from the Employees page</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Employee Profile Modal -->
    <div id="employeeModal" class="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm hidden z-50">
        <div class="flex items-center justify-center min-h-screen p-4">
            <div class="bg-gray-900 rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
                <!-- Modal Header -->
                <div class="relative">
                    <div class="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-500 to-cyan-600 rounded-t-3xl"></div>
                    <div class="flex items-center justify-between p-8 pb-6">
                        <div class="flex items-center space-x-4">
                            <div class="w-16 h-16 bg-gradient-to-br from-blue-400 to-cyan-600 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg">
                                <span id="modalEmployeeId"></span>
                            </div>
                            <div>
                                <h2 id="modalEmployeeName" class="text-2xl font-bold text-white"></h2>
                                <p class="text-gray-400">Complete Employee Profile</p>
                            </div>
                        </div>
                        <button onclick="closeEmployeeModal()" class="w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-xl flex items-center justify-center text-gray-400 hover:text-white transition-colors">
                            <i class="fas fa-times"></i>
                        </button>
                    </div>
                </div>

                <!-- Modal Body -->
                <div class="px-8 pb-8">
                    <!-- Employee Basic Info -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                        <div class="bg-gray-800/50 rounded-xl p-6">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <i class="fas fa-envelope text-white text-xs"></i>
                                </div>
                                <span class="text-sm font-medium text-gray-300">Email Address</span>
                            </div>
                            <p id="modalEmployeeEmail" class="text-white font-semibold text-lg"></p>
                        </div>

                        <div class="bg-gray-800/50 rounded-xl p-6">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-8 h-8 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <i class="fas fa-building text-white text-xs"></i>
                                </div>
                                <span class="text-sm font-medium text-gray-300">Department</span>
                            </div>
                            <p id="modalEmployeeDepartment" class="text-white font-semibold text-lg"></p>
                        </div>

                        <div class="bg-gray-800/50 rounded-xl p-6">
                            <div class="flex items-center space-x-3 mb-3">
                                <div class="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                                    <i class="fas fa-calendar text-white text-xs"></i>
                                </div>
                                <span class="text-sm font-medium text-gray-300">Year</span>
                            </div>
                            <p id="modalEmployeeYear" class="text-white font-semibold text-lg"></p>
                        </div>
                    </div>

                    <!-- Payroll History -->
                    <div class="bg-gray-800/50 rounded-xl p-6 mb-6">
                        <div class="flex items-center space-x-3 mb-4">
                            <div class="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                                <i class="fas fa-money-bill-wave text-white text-xs"></i>
                            </div>
                            <span class="text-lg font-semibold text-white">Payroll History</span>
                        </div>
                        <div id="modalPayrollHistory" class="space-y-3">
                            <!-- Payroll history will be loaded here -->
                        </div>
                        <div id="modalNoPayroll" class="text-center py-4 text-gray-400">
                            <i class="fas fa-money-bill-wave text-2xl mb-2"></i>
                            <p>No payroll records found</p>
                        </div>
                    </div>

                    <!-- Complaints History -->
                    <div class="bg-gray-800/50 rounded-xl p-6">
                        <div class="flex items-center space-x-3 mb-4">
                            <div class="w-8 h-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-lg">
                                <i class="fas fa-exclamation-triangle text-white text-xs"></i>
                            </div>
                            <span class="text-lg font-semibold text-white">Complaints History</span>
                        </div>
                        <div id="modalComplaintsHistory" class="space-y-3">
                            <!-- Complaints history will be loaded here -->
                        </div>
                        <div id="modalNoComplaints" class="text-center py-4 text-gray-400">
                            <i class="fas fa-exclamation-triangle text-2xl mb-2"></i>
                            <p>No complaints found</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div id="alertContainer" class="fixed top-20 right-4 space-y-2 z-50"></div>
    `;
    loadEmployeeProfiles();
  } else {
    console.error("No #app container found");
  }
}