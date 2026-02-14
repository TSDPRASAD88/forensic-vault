const PDFDocument = require("pdfkit");

exports.generateForensicPDF = (res, report) => {
  const doc = new PDFDocument();

  res.setHeader(
    "Content-Disposition",
    `attachment; filename=forensic-report-${report.evidenceId}.pdf`
  );
  res.setHeader("Content-Type", "application/pdf");

  doc.pipe(res);

  doc.fontSize(20).text("Forensic Evidence Report", {
    align: "center",
  });

  doc.moveDown();

  doc.fontSize(12).text(`Evidence ID: ${report.evidenceId}`);
  doc.text(`File Name: ${report.fileName}`);
  doc.text(`Uploaded By: ${report.uploadedBy?.name}`);
  doc.text(`Timestamp: ${report.uploadTimestamp}`);

  doc.moveDown();

  doc.text("Integrity Checks:", { underline: true });
  doc.text(`File Integrity: ${report.fileIntegrity}`);
  doc.text(`Signature Integrity: ${report.signatureIntegrity}`);
  doc.text(`Blockchain Integrity: ${report.blockchainIntegrity}`);
  doc.text(`Block Link Integrity: ${report.blockLinkIntegrity}`);

  doc.moveDown();

  doc.fontSize(14).text(
    report.tampered ? "STATUS: TAMPERED" : "STATUS: VALID",
    {
      align: "center",
    }
  );

  doc.end();
};
