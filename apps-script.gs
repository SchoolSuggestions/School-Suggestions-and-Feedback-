/**
 * نظام الاقتراحات والشكاوى — المتوسطة التاسعة والستون + المتوسطة الثانية لتحفيظ القرآن
 * يُلصق كاملاً في Apps Script المرتبط بجدول Google Sheets جديد.
 * بعد أي تعديل: Deploy > Manage deployments > القلم > Version: New version > Deploy
 */
const ACCESS_KEY = 'hayat1school';   // رمز دخول اللوحة
const ALERT_EMAIL = 'tootaa.b.o.j@gmail.com';
const SHEET_NAME = 'Messages';
const DRIVE_FOLDER_NAME = 'مرفقات الاقتراحات والشكاوى';
const SCHOOLS = ['المتوسطة التاسعة والستون', 'المتوسطة الثانية لتحفيظ القرآن'];
const TYPES = ['شكوى', 'اقتراح'];
const MAX_TEXT = 2000;
// الأعمدة: 0 الوقت | 1 التاريخ | 2 المدرسة | 3 النوع | 4 التصنيف | 5 ولي الأمر | 6 التواصل | 7 النص | 8 المرفق | 9 المعرف الداخلي | 10 الحالة | 11 ملاحظة

function doPost(e) {
  try {
    const d = JSON.parse(e.postData.contents);

    if (d.action === 'update' || d.action === 'delete') {
      if (d.key !== ACCESS_KEY) return out({ status: 'unauthorized' });
      const sheet = getSheet();
      const v = sheet.getDataRange().getValues();
      for (let i = 1; i < v.length; i++) {
        if (v[i][9] === d.id) {
          if (d.action === 'delete') sheet.deleteRow(i + 1);
          else {
            if (['new', 'progress', 'done'].indexOf(d.status) < 0) return out({ status: 'error' });
            sheet.getRange(i + 1, 11, 1, 2).setValues([[d.status, String(d.note || '').slice(0, 500)]]);
          }
          return out({ status: 'ok' });
        }
      }
      return out({ status: 'not_found' });
    }

    // رسالة جديدة
    if (d.website) return out({ status: 'ok' }); // فخ للروبوتات
    const text = String(d.text || '').trim();
    if (SCHOOLS.indexOf(d.school) < 0 || TYPES.indexOf(d.type) < 0 || !d.date || text.length < 10) {
      return out({ status: 'invalid' });
    }

    const sheet = getSheet();
    // منع الإرسال المتكرر السريع لنفس النص
    const last = sheet.getLastRow();
    if (last > 1 && sheet.getRange(last, 8).getValue() === text.slice(0, MAX_TEXT)) return out({ status: 'duplicate' });

    const fileUrl = (d.fileBase64 && d.fileName) ? saveFile(d.fileBase64, d.fileName, d.fileMime) : '';
    const rowId = Utilities.getUuid().replace(/-/g, '').slice(0, 8).toUpperCase();
    sheet.appendRow([new Date(), '', d.school, d.type, d.category || '', String(d.parentName || '').slice(0, 80),
      '', text.slice(0, MAX_TEXT), fileUrl, rowId, 'new', '']);
    const r = sheet.getLastRow();
    // تثبيت التاريخ ورقم التواصل كنص حتى لا يحوّلها Sheets
    sheet.getRange(r, 2).setNumberFormat('@STRING@').setValue(d.date);
    sheet.getRange(r, 7).setNumberFormat('@STRING@').setValue(String(d.contact || '').slice(0, 30));

    if (d.type === 'شكوى') {
      MailApp.sendEmail(ALERT_EMAIL, 'شكوى جديدة — ' + d.school,
        'وصلت شكوى جديدة إلى ' + d.school + '\nالتصنيف: ' + (d.category || 'غير محدد') + '\n\nيرجى مراجعة لوحة التوجيه الطلابي.');
    }
    return out({ status: 'ok' });
  } catch (err) {
    return out({ status: 'error', message: String(err) });
  }
}

function doGet(e) {
  if (e.parameter.key !== ACCESS_KEY) return out({ status: 'unauthorized' });
  const rows = getSheet().getDataRange().getValues().slice(1).filter(r => r[9]).map(r => ({
    date: String(r[1]), school: r[2], type: r[3], category: r[4], parentName: r[5],
    contact: String(r[6]), text: r[7], fileUrl: r[8], id: r[9], status: r[10] || 'new', note: r[11]
  }));
  return out({ status: 'ok', records: rows });
}

function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let s = ss.getSheetByName(SHEET_NAME);
  if (!s) {
    s = ss.insertSheet(SHEET_NAME);
    s.appendRow(['الوقت', 'التاريخ', 'المدرسة', 'النوع', 'التصنيف', 'ولي الأمر', 'التواصل', 'النص', 'رابط المرفق', 'المعرف', 'الحالة', 'ملاحظة']);
  }
  return s;
}

function saveFile(b64, name, mime) {
  const it = DriveApp.getFoldersByName(DRIVE_FOLDER_NAME);
  const folder = it.hasNext() ? it.next() : DriveApp.createFolder(DRIVE_FOLDER_NAME);
  const file = folder.createFile(Utilities.newBlob(Utilities.base64Decode(b64), mime, name));
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  return file.getUrl();
}

function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }
