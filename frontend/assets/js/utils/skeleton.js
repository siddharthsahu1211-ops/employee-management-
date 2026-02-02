// Skeleton loading utilities

export function createTableSkeleton(rows = 5, cols = 5) {
  return Array(rows).fill().map(() => `
    <tr class="backdrop-blur-sm">
      ${Array(cols).fill().map(() => `
        <td class="px-6 py-4">
          <div class="skeleton h-4 rounded w-3/4"></div>
        </td>
      `).join('')}
    </tr>
  `).join('');
}

export function createCardSkeleton() {
  return `
    <div class="card rounded-3xl p-6 animate-pulse">
      <div class="skeleton h-6 rounded w-1/2 mb-4"></div>
      <div class="skeleton h-4 rounded w-3/4 mb-2"></div>
      <div class="skeleton h-4 rounded w-1/2"></div>
    </div>
  `;
}

export function createProfileSkeleton() {
  return `
    <div class="space-y-4 animate-pulse">
      <div class="flex items-center space-x-4">
        <div class="skeleton w-16 h-16 rounded-2xl"></div>
        <div class="flex-1">
          <div class="skeleton h-6 rounded w-1/2 mb-2"></div>
          <div class="skeleton h-4 rounded w-1/3"></div>
        </div>
      </div>
      <div class="grid grid-cols-2 gap-4">
        <div class="skeleton h-20 rounded-xl"></div>
        <div class="skeleton h-20 rounded-xl"></div>
      </div>
    </div>
  `;
}

export function showSkeleton(containerId, type = 'table', count = 5) {
  const container = document.getElementById(containerId);
  if (!container) return;
  
  let skeletonHTML = '';
  switch (type) {
    case 'table':
      skeletonHTML = createTableSkeleton(count);
      break;
    case 'card':
      skeletonHTML = Array(count).fill().map(() => createCardSkeleton()).join('');
      break;
    case 'profile':
      skeletonHTML = createProfileSkeleton();
      break;
  }
  
  container.innerHTML = skeletonHTML;
}

export function hideSkeleton(containerId) {
  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = '';
  }
}