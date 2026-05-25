const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

const generateReceipt = (booking, bus, user) => {
  const receiptsDir = path.join(__dirname, "../receipts");

  if (!fs.existsSync(receiptsDir)) {
    fs.mkdirSync(receiptsDir);
  }

  const filePath = path.join(
    receiptsDir,
    `receipt-${booking._id}.pdf`
  );

  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(filePath));

  doc.fontSize(24).text("HighwayGo LK", { align: "center" });
  doc.moveDown();

  doc.fontSize(18).text("Booking Receipt", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Booking ID: ${booking._id}`);
  doc.text(`Passenger: ${user.name}`);
  doc.text(`Email: ${user.email}`);
  doc.moveDown();

  doc.text(`Bus: ${bus.busName}`);
  doc.text(`Bus Number: ${bus.busNumber}`);
  doc.text(`Route: ${bus.routeFrom} → ${bus.routeTo}`);
  doc.text(`Departure: ${bus.departureTime}`);
  doc.text(`Arrival: ${bus.arrivalTime || "N/A"}`);
  doc.moveDown();

  doc.text(`Travel Date: ${booking.travelDate}`);
  doc.text(`Seats: ${booking.seatNumbers.join(", ")}`);
  doc.text(`Total Amount: LKR ${booking.totalAmount}`);
  doc.text(`Status: ${booking.status}`);

  doc.moveDown();
  doc.text("Thank you for booking with HighwayGo LK!", {
    align: "center",
  });

  doc.end();

  return filePath;
};

module.exports = generateReceipt;