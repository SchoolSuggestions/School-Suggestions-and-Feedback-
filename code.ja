function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.tryLock(10000);

  try {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Timestamp', 'Name', 'Email', 'Subject', 'Message']);
    }

    var name = e.parameter.name || '';
    var email = e.parameter.email || '';
    var subject = e.parameter.subject || 'No Subject';
    var message = e.parameter.message || '';
    var timestamp = new Date();

    sheet.appendRow([timestamp, name, email, subject, message]);

    return ContentService
      .createTextOutput(JSON.stringify({ "result": "success" }))
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
  return ContentService
    .createTextOutput(JSON.stringify({ "status": "active" }))
    .setMimeType(ContentService.MimeType.JSON);
}
