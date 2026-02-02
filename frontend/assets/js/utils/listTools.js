// List manipulation utilities

export function filterList(items, searchTerm, searchFields = []) {
  if (!searchTerm) return items;
  
  const term = searchTerm.toLowerCase();
  return items.filter(item => {
    if (searchFields.length === 0) {
      // Search all string properties
      return Object.values(item).some(value => 
        String(value).toLowerCase().includes(term)
      );
    } else {
      // Search specific fields
      return searchFields.some(field => 
        String(item[field] || '').toLowerCase().includes(term)
      );
    }
  });
}

export function sortList(items, sortBy, sortDir = 'asc') {
  return [...items].sort((a, b) => {
    let aVal = a[sortBy];
    let bVal = b[sortBy];
    
    // Handle numbers
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return sortDir === 'asc' ? aVal - bVal : bVal - aVal;
    }
    
    // Handle strings
    aVal = String(aVal || '').toLowerCase();
    bVal = String(bVal || '').toLowerCase();
    
    if (sortDir === 'asc') {
      return aVal.localeCompare(bVal);
    } else {
      return bVal.localeCompare(aVal);
    }
  });
}