function doPost(e) {
  var params = e.parameter;
  var sheetId = "1ABCDEFGHIJKLMNOPQRSTUVWXYZ"; // Sheets ID'sini buraya yazın
  var sheet = SpreadsheetApp.openById(sheetId).getActiveSheet();
  
  // Yeni satıra verileri ekle
  var headers = sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
  var newRow = [];
  headers.forEach(function(header) {
    newRow.push(params[header] || "");
  });
  sheet.appendRow(newRow);
  
  // Excel dosyası oluştur (geçici olarak Drive'da)
  var tempFile = Drive.Files.insert({
    title: "SEGEM_Basvuru_" + new Date().toISOString() + ".xlsx",
    mimeType: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
  }, sheet.getAs("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"));
  
  // E-posta gönder (ek olarak Excel dosyası)
  var recipient = "ersinsunbul@gmail.com";
  var subject = "SEGEM Başvuru Formu - Yeni Cevap";
  var body = "Yeni bir başvuru alındı. Detaylar ekteki Excel dosyasındadır.";
  
  MailApp.sendEmail({
    to: recipient,
    subject: subject,
    body: body,
    attachments: [tempFile]
  });
  
  // Geçici dosyayı Drive'dan sil
  Drive.Files.remove(tempFile.id);
  
  return ContentService.createTextOutput("Başarıyla gönderildi.");
}