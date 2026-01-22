// frontend/assets/js/utils/printTable.js
// Employee Management System - Print utilities

export function buildPrintableTableHTML(title, rows, columns) {
  const esc = (v) =>
    String(v ?? "")
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;");

  return `
    <div class="print-header">
      <h1>${esc(title)}</h1>
      <p>Generated on: ${new Date().toLocaleDateString()}</p>
    </div>
    <table class="print-table">
      <thead>
        <tr>
          ${columns.map((c) => `<th>${esc(c.label)}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${(rows || [])
          .map(
            (r) => `
          <tr>
            ${columns.map((c) => `<td>${esc(r?.[c.key])}</td>`).join("")}
          </tr>
        `
          )
          .join("")}
      </tbody>
    </table>
    <div class="print-footer">
      <p>Employee Management System - Total Records: ${rows?.length || 0}</p>
    </div>
  `;
}

export function printEmployeeTable(employees) {
  const columns = [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Name'},
    {key: 'email', label: 'Email'},
    {key: 'department_name', label: 'Department'},
    {key: 'year', label: 'Year/Level'}
  ];
  printTable('Employee Records', employees, columns);
}

export function printPayrollTable(payroll) {
  const columns = [
    {key: 'id', label: 'ID'},
    {key: 'employee_id', label: 'Employee ID'},
    {key: 'salary', label: 'Salary'},
    {key: 'month', label: 'Month'}
  ];
  printTable('Payroll Records', payroll, columns);
}

export function printDepartmentTable(departments) {
  const columns = [
    {key: 'id', label: 'ID'},
    {key: 'name', label: 'Department'},
    {key: 'manager', label: 'Manager'},
    {key: 'budget', label: 'Budget'},
    {key: 'location', label: 'Location'}
  ];
  printTable('Department Records', departments, columns);
}

export function printTable(title, rows, columns) {
  const html = buildPrintableTableHTML(title, rows, columns);
  const printWindow = window.open('', '_blank');
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>${title} - Employee Management System</title>
      <style>
        body { 
          font-family: 'Arial', sans-serif; 
          margin: 20px; 
          color: #333;
        }
        .print-header {
          text-align: center;
          margin-bottom: 30px;
          border-bottom: 2px solid #333;
          padding-bottom: 10px;
        }
        .print-header h1 {
          color: #ff6b35;
          margin: 0;
          font-size: 24px;
        }
        .print-header p {
          margin: 5px 0 0 0;
          color: #666;
        }
        .print-table { 
          border-collapse: collapse; 
          width: 100%; 
          margin: 20px 0;
        }
        .print-table th, .print-table td { 
          border: 1px solid #ddd; 
          padding: 12px 8px; 
          text-align: left; 
        }
        .print-table th { 
          background-color: #ff6b35; 
          color: white;
          font-weight: bold;
        }
        .print-table tr:nth-child(even) {
          background-color: #f9f9f9;
        }
        .print-footer {
          text-align: center;
          margin-top: 30px;
          padding-top: 10px;
          border-top: 1px solid #ddd;
          color: #666;
          font-size: 12px;
        }
        @media print {
          body { margin: 0; }
          .print-header, .print-footer { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      ${html}
    </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.print();
}