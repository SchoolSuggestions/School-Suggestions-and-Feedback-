const scriptURL = 'https://script.google.com/macros/s/AKfycbwbtKg56WdVnwXZXRgjLoGpXHCXXrPDZMGWJqRPmPRflMMnLwLqbjQmApymshWg-mCt/exec';

const tableBody = document.getElementById('supervisorTableBody');
const searchInput = document.getElementById('searchInput');
const refreshBtn = document.getElementById('refreshBtn');

const totalReqEl = document.getElementById('totalRequests');
const pendingReqEl = document.getElementById('pendingRequests');
const completedReqEl = document.getElementById('completedRequests');

let allData = [];

function loadData() {
  tableBody.innerHTML = '<tr><td colspan="8" class="text-center">جاري تحميل البيانات...</td></tr>';
  
  fetch(scriptURL)
    .then(res => res.json())
    .then(data => {
      if (data.result === 'success') {
        allData = data.data;
        renderTable(allData);
        updateStats(allData);
      } else {
        tableBody.innerHTML = '<tr><td colspan="8" class="text-center">فشل تحميل البيانات.</td></tr>';
      }
    })
    .catch(err => {
      console.error(err);
      tableBody.innerHTML = '<tr><td colspan="8" class="text-center">خطأ في الاتصال بالخادم.</td></tr>';
    });
}

function renderTable(data) {
  if (data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="8" class="text-center">لا توجد طلبات واردة حتى الآن.</td></tr>';
    return;
  }

  tableBody.innerHTML = data.map(row => `
    <tr>
      <td><strong>${row['ID'] || '-'}</strong></td>
      <td>${row['Timestamp'] || '-'}</td>
      <td>${row['Name'] || '-'}</td>
      <td>${row['Email'] || '-'}</td>
      <td><span class="badge">${row['Category'] || 'عام'}</span></td>
      <td>${row['Subject'] || '-'}</td>
      <td>${row['Message'] || '-'}</td>
      <td><span class="badge badge-pending">${row['Status'] || 'قيد المراجعة'}</span></td>
    </tr>
  `).join('');
}

function updateStats(data) {
  totalReqEl.innerText = data.length;
  pendingReqEl.innerText = data.filter(r => (r['Status'] || '').includes('قيد المراجعة') || !r['Status']).length;
  completedReqEl.innerText = data.filter(r => (r['Status'] || '').includes('مكتمل')).length;
}

searchInput.addEventListener('input', e => {
  const query = e.target.value.toLowerCase();
  const filtered = allData.filter(item => 
    (item['Name'] && item['Name'].toLowerCase().includes(query)) ||
    (item['Subject'] && item['Subject'].toLowerCase().includes(query)) ||
    (item['Email'] && item['Email'].toLowerCase().includes(query))
  );
  renderTable(filtered);
});

refreshBtn.addEventListener('click', loadData);

document.addEventListener('DOMContentLoaded', loadData);
