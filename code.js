function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['ID', 'Timestamp', 'Name', 'Email', 'Category', 'Subject', 'Message', 'Status']);
    }

    var reqId = 'REQ-' + Math.floor(100000 + Math.random() * 900000);
    var timestamp = new Date().toLocaleString('ar-SA');
    var name = e.parameter.name || '';
    var email = e.parameter.email || '';
    var category = e.parameter.category || 'عام';
    var subject = e.parameter.subject || '';
    var message = e.parameter.message || '';
    var status = 'قيد المراجعة';

    sheet.appendRow([reqId, timestamp, name, email, category, subject, message, status]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "id": reqId }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    lock.releaseLock();
  }
}

function doGet(e) {
  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return ContentService
        .createTextOutput(JSON.stringify({ "result": "success", "data": [] }))
        .setMimeType(ContentService.MimeType.JSON);
    }

    var headers = data[0];
    var rows = [];

    for (var i = 1; i < data.length; i++) {
      var rowObj = {};
      for (var j = 0; j < headers.length; j++) {
        rowObj[headers[j]] = data[i][j];
      }
      rows.push(rowObj);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success", "data": rows }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ "result": "error", "error": error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}
