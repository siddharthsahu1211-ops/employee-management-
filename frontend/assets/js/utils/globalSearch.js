// Global search functionality

class GlobalSearch {
  constructor() {
    this.searchData = {
      employees: [],
      departments: [],
      payroll: [],
      complaints: []
    };
    this.init();
  }

  init() {
    const searchInput = document.getElementById('globalSearch');
    if (searchInput) {
      searchInput.addEventListener('input', (e) => this.handleSearch(e.target.value));
      searchInput.addEventListener('focus', () => this.showSearchResults());
      document.addEventListener('click', (e) => {
        if (!e.target.closest('#globalSearch') && !e.target.closest('#searchResults')) {
          this.hideSearchResults();
        }
      });
    }
    this.createSearchResultsContainer();
    this.loadSearchData();
  }

  createSearchResultsContainer() {
    const container = document.createElement('div');
    container.id = 'searchResults';
    container.className = 'absolute top-full left-0 right-0 mt-2 bg-gray-800 border border-gray-600 rounded-lg shadow-xl max-h-96 overflow-y-auto z-50 hidden';
    
    const searchInput = document.getElementById('globalSearch');
    if (searchInput && searchInput.parentElement) {
      searchInput.parentElement.appendChild(container);
    }
  }

  async loadSearchData() {
    try {
      const [employees, departments, payroll, complaints] = await Promise.all([
        fetch('/api/employees').then(r => r.ok ? r.json() : []),
        fetch('/api/departments').then(r => r.ok ? r.json() : []),
        fetch('/api/payroll').then(r => r.ok ? r.json() : []),
        fetch('/api/complaints').then(r => r.ok ? r.json() : [])
      ]);

      this.searchData = { employees, departments, payroll, complaints };
    } catch (err) {
      console.error('Failed to load search data:', err);
    }
  }

  handleSearch(query) {
    if (!query.trim()) {
      this.hideSearchResults();
      return;
    }

    const results = this.performSearch(query.toLowerCase());
    this.displayResults(results);
  }

  performSearch(query) {
    const results = [];

    // Search employees
    this.searchData.employees.forEach(emp => {
      if (emp.name?.toLowerCase().includes(query) || 
          emp.email?.toLowerCase().includes(query) ||
          emp.course?.toLowerCase().includes(query)) {
        results.push({
          type: 'employee',
          title: emp.name,
          subtitle: emp.email,
          icon: 'fa-user',
          action: () => window.location.href = '/employee'
        });
      }
    });

    // Search departments
    this.searchData.departments.forEach(dept => {
      if (dept.name?.toLowerCase().includes(query) || 
          dept.manager?.toLowerCase().includes(query)) {
        results.push({
          type: 'department',
          title: dept.name,
          subtitle: `Manager: ${dept.manager}`,
          icon: 'fa-building',
          action: () => window.location.href = '/departments'
        });
      }
    });

    // Search complaints
    this.searchData.complaints.forEach(complaint => {
      if (complaint.title?.toLowerCase().includes(query) || 
          complaint.description?.toLowerCase().includes(query)) {
        results.push({
          type: 'complaint',
          title: complaint.title,
          subtitle: complaint.description?.substring(0, 50) + '...',
          icon: 'fa-exclamation-triangle',
          action: () => window.location.href = '/complaints'
        });
      }
    });

    return results.slice(0, 8); // Limit results
  }

  displayResults(results) {
    const container = document.getElementById('searchResults');
    if (!container) return;

    if (results.length === 0) {
      container.innerHTML = '<div class="p-4 text-gray-400 text-center">No results found</div>';
    } else {
      container.innerHTML = results.map(result => `
        <div class="p-3 hover:bg-gray-700 cursor-pointer transition-colors border-b border-gray-700 last:border-b-0" onclick="(${result.action})()">
          <div class="flex items-center space-x-3">
            <div class="w-8 h-8 bg-orange-500 bg-opacity-20 rounded-lg flex items-center justify-center">
              <i class="fas ${result.icon} text-orange-400 text-sm"></i>
            </div>
            <div class="flex-1">
              <div class="text-white font-medium text-sm">${result.title}</div>
              <div class="text-gray-400 text-xs">${result.subtitle}</div>
            </div>
            <div class="text-xs px-2 py-1 bg-gray-600 rounded text-gray-300">${result.type}</div>
          </div>
        </div>
      `).join('');
    }

    this.showSearchResults();
  }

  showSearchResults() {
    const container = document.getElementById('searchResults');
    if (container) {
      container.classList.remove('hidden');
    }
  }

  hideSearchResults() {
    const container = document.getElementById('searchResults');
    if (container) {
      container.classList.add('hidden');
    }
  }
}

// Initialize global search when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  new GlobalSearch();
});