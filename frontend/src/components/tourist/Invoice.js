import React from 'react';
import { useLocation } from 'react-router-dom';
import { jsPDF } from 'jspdf';

const Invoice = () => {
    const location = useLocation();
    const flight = location.state?.flight;

    if (!flight) return <p>No flight details available</p>;

    const handleDownloadTicket = () => {
        const doc = new jsPDF();
        doc.text(`Flight Number: ${flight.flightNumber || "N/A"}`, 10, 10);
        doc.text(`Airline: ${flight.validatingAirlineCodes ? flight.validatingAirlineCodes[0] : "Unknown"}`, 10, 20);
        doc.text(`Departure: ${flight.itineraries[0].segments[0].departure.iataCode} at ${new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString()}`, 10, 30);
        doc.text(`Arrival: ${flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode} at ${new Date(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at).toLocaleString()}`, 10, 40);
        doc.text(`Price: ${flight.price.currency} ${flight.price.total}`, 10, 50);
        doc.save(`FlightTicket_${flight.flightNumber}.pdf`);
    };

    return (
        <div className="invoice-container">
            <h1>Booking Confirmation</h1>
            <div className="invoice-details">
                <p><strong>Flight Number:</strong> {flight.flightNumber || "N/A"}</p>
                <p><strong>Airline:</strong> {flight.validatingAirlineCodes ? flight.validatingAirlineCodes[0] : "Unknown"}</p>
                <p><strong>Departure:</strong> {flight.itineraries[0].segments[0].departure.iataCode} at {new Date(flight.itineraries[0].segments[0].departure.at).toLocaleString()}</p>
                <p><strong>Arrival:</strong> {flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.iataCode} at {new Date(flight.itineraries[0].segments[flight.itineraries[0].segments.length - 1].arrival.at).toLocaleString()}</p>
                <p><strong>Price:</strong> {flight.price.currency} {flight.price.total}</p>
            </div>

            <button onClick={handleDownloadTicket} className="download-button">Download Ticket as PDF</button>
        </div>
    );
};

export default Invoice;
