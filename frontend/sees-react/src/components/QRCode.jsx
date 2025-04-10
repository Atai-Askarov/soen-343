import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { useNavigate } from 'react-router-dom';
function QRCode({ endpoint, params = {}, size = 128 }) {
  // Construct the URL with query parameters

  const queryString = new URLSearchParams(params).toString();
  const url = `${endpoint}?${queryString}`;

  const navigate = useNavigate();

  const handleQRCodeClick = async (e) => {
    e.preventDefault(); // Prevent navigation
    try {
        
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      });
      console.log(params.event_id)
      
      try {
        const response = await fetch(`http://localhost:5000/events/${params.event_id}`);
        if (!response.ok) {
          throw new Error(`Error fetching event: ${response.statusText}`);
        }
        const event = await response.json();
         // Assign the fetched event to a variable
          
         navigate(`attendance-confirmation-page/${params.ticket_id}}`, {
            state: {
              eventname: event.eventname,
              eventdate: event.eventdate,
              eventstarttime: event.eventstarttime,
              eventendtime: event.eventendtime,
              eventdescription: event.eventdescription,
              venue_id: event.venue_id ?? "online" ,
            },
          });


      } catch (err) {
        console.error("Error fetching event:", err);
        return null; // Return null if there's an error
      }

      //console.log(eventname)
      
      
      const data = await response.json();
      console.log('POST request successful:', data);
    } catch (error) {
      console.error('Error making POST request:', error);
    }
  };

  return (
    <div className="qr-code-container">
      <a href={url} onClick={handleQRCodeClick}>
        <QRCodeSVG 
          value={url} 
          size={size}
          level="H"
          includeMargin={true}
        />
      </a>
    </div>
  );
}

export default QRCode;