import React from 'react';
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const parseDuration = (duration) => {
    const regex = /^PT(\d+H)?(\d+M)?$/;
    const match = duration.match(regex);
    const hours = match[1] ? parseInt(match[1].replace('H', '')) : 0;
    const minutes = match[2] ? parseInt(match[2].replace('M', '')) : 0;
    return `${hours} hours and ${minutes} minutes`;
};

const Invoice = () => {
    const location = useLocation();
    const flight = location.state?.flight;
    const tourist = location.state?.touristInfo;
    const today = new Date().toLocaleString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: 'numeric',
        minute: 'numeric',
        second: 'numeric',
        hour12: true,
    });

    if (!flight) return <p>No flight details available</p>;

    const handleDownloadTicket = () => {
        const doc = new jsPDF();
        let yOffset = 10;

        doc.text(`Tourist Username: ${tourist?.userName || "N/A"}`, 10, yOffset);
        yOffset += 10;
        doc.text(`Tourist Email: ${tourist?.email || "N/A"}`, 10, yOffset);
        yOffset += 20;
        doc.text(`Date of Booking: ${today}`, 10, yOffset); // Use today's date here
        yOffset += 20;
        flight.itineraries.forEach((itinerary, idx) => {
            doc.text(`Flight ${idx + 1} - Flight Number: ${itinerary?.segments[0]?.carrierCode || "N/A"}${itinerary?.segments[0]?.number || ""}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Airline: ${flight.validatingAirlineCodes ? flight.validatingAirlineCodes[0] : "Unknown"}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Departure: ${itinerary?.segments[0]?.departure?.iataCode} at ${new Date(itinerary?.segments[0]?.departure?.at).toLocaleString()}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Arrival: ${itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.iataCode} at ${new Date(itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.at).toLocaleString()}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Duration: ${parseDuration(itinerary?.segments[0]?.duration || "PT0H0M")}`, 10, yOffset);
            yOffset += 10;
            doc.text(`Price: ${flight.price.currency} ${flight.price.total}`, 10, yOffset);
            yOffset += 20;
        });

        doc.save(`FlightTicket_${flight.itineraries[0]?.segments[0]?.carrierCode || "N/A"}${flight.itineraries[0]?.segments[0]?.number || ""}.pdf`);
    };

    return (
        <div className="invoice-container">
            <h1>Booking Confirmation</h1>


            <div className="tourist-details">
                <p><strong>Username:</strong> {tourist?.userName || "N/A"}</p>
                <p><strong>Email:</strong> {tourist?.email || "N/A"}</p>
                <p><strong>Date of Booking:</strong> {today}</p>
            </div>


            <div className="invoice-details">
                {flight.itineraries.map((itinerary, idx) => (
                    <div key={idx} className="itinerary-details">
                        <h3>Flight {idx + 1}</h3>
                        <p><strong>Flight Number:</strong> {`${itinerary?.segments[0]?.carrierCode || "N/A"}${itinerary?.segments[0]?.number || ""}`}</p>
                        <p><strong>Airline:</strong> {flight.validatingAirlineCodes ? flight.validatingAirlineCodes[0] : "Unknown"}</p>
                        <p><strong>Departure:</strong> {itinerary?.segments[0]?.departure?.iataCode} at {new Date(itinerary?.segments[0]?.departure?.at).toLocaleString()}</p>
                        <p><strong>Arrival:</strong> {itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.iataCode} at {new Date(itinerary?.segments[itinerary?.segments.length - 1]?.arrival?.at).toLocaleString()}</p>
                        <p><strong>Duration:</strong> {parseDuration(itinerary?.segments[0]?.duration || "PT0H0M")}</p>
                        <p><strong>Price:</strong> {flight.price.currency} {flight.price.total}</p>
                    </div>
                ))}
            </div>

            <button onClick={handleDownloadTicket} className="download-button">Download Ticket as PDF</button>
        </div>
    );
};

export default Invoice;
