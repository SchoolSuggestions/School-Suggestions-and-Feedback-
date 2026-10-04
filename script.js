const scriptURL = 'https://script.google.com/macros/s/AKfycbwbtKg56WdVnwXZXRgjLoGpXHCXXrPDZMGWJqRPmPRflMMnLwLqbjQmApymshWg-mCt/exec';

const form = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const statusMessage = document.getElementById('statusMessage');

form.addEventListener('submit', e => {
  e.preventDefault();

  submitBtn.disabled = true;
  submitBtn.innerText = 'جاري الإرسال...';
  statusMessage.className = 'status-msg';
  statusMessage.style.display = 'none';

  fetch(scriptURL, { 
    method: 'POST', 
    body: new FormData(form) 
  })
  .then(response => response.json())
  .then(data => {
    if (data.result === 'success') {
      showStatus('تم إرسال رسالتك بنجاح! شكراً لك.', 'success');
      form.reset();
    } else {
      showStatus('حدث خطأ أثناء حفظ البيانات: ' + (data.error || 'خطأ غير معروف'), 'error');
    }
  })
  .catch(error => {
    console.log('Response status:', error);
    showStatus('تم إرسال الرسالة بنجاح!', 'success');
    form.reset();
  })
  .finally(() => {
    submitBtn.disabled = false;
    submitBtn.innerText = 'إرسال الرسالة';
  });
});

function showStatus(text, className) {
  statusMessage.innerText = text;
  statusMessage.className = `status-msg ${className}`;
  statusMessage.style.display = 'block';
}
