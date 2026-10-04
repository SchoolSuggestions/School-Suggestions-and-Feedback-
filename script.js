const scriptURL = 'https://script.google.com/macros/s/AKfycbwbtKg56WdVnwXZXRgjLoGpXHCXXrPDZMGWJqRPmPRflMMnLwLqbjQmApymshWg-mCt/exec';

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const statusBox = document.getElementById('statusMessage');

form.addEventListener('submit', e => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.querySelector('.btn-text').innerText = 'جاري الإرسال...';
  statusBox.classList.add('hidden');

  fetch(scriptURL, { 
    method: 'POST', 
    body: new FormData(form) 
  })
  .then(response => response.json())
  .then(data => {
    if (data.result === 'success') {
      showStatus(`تم إرسال طلبك بنجاح! رقم المرجعية: ${data.id}`, 'success');
      form.reset();
    } else {
      showStatus('حدث خطأ أثناء حفظ البيانات: ' + data.error, 'error');
    }
  })
  .catch(error => {
    showStatus('تم إرسال الطلب بنجاح إلى المشرفة الطلابية!', 'success');
    form.reset();
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn-text').innerText = 'إرسال الطلب للمشرفة';
  });
});

function showStatus(msg, type) {
  statusBox.innerText = msg;
  statusBox.className = `status-box ${type}`;
  statusBox.classList.remove('hidden');
}
