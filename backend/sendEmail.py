import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

class Director(object):
    def __init__(self, event_data):
        self.eventId = event_data.get("eventId")
        self.eventName = event_data.get("eventName")
        self.eventDate = event_data.get("eventDate")
        self.eventStartTime = event_data.get("eventStartTime")
        self.eventEndTime = event_data.get("eventEndTime")
        self.eventLocation = event_data.get("eventLocation")
        self.eventType = event_data.get("eventType")
        self.eventDescription = event_data.get("eventDescription")
        self.eventOrganizer = event_data.get("eventOrganizer")
        self.eventImg = event_data.get("eventImg")
        self.socialMediaLink = event_data.get("socialMediaLink")
    def construct(self, builder):
        builder.build_eventID(self.eventId)
        builder.build_eventName(self.eventName)
        builder.build_eventDate(self.eventDate)
        builder.build_eventStartTime(self.eventStartTime)
        builder.build_eventEndTime(self.eventEndTime)
        builder.build_eventLocation(self.eventLocation)
        builder.build_eventType(self.eventType)
        builder.build_eventDescription(self.eventDescription)
        builder.build_eventOrganizer(self.eventOrganizer)
        builder.build_eventImg(self.eventImg)
        if self.socialMediaLink:  # Only include if it's provided
                    builder.build_socialMediaLink(self.socialMediaLink)
        return builder.get_email_html()
        

class Builder(object):
    def __init__(self):
        self.event_dict = {}
    def build_eventName(self, eventName):
        self.event_dict["eventName"] = f"<p><strong>Event Name:</strong> {eventName}</p>"

    def build_eventID(self, eventId):
        self.event_dict["eventID"] = f"<p><strong>Event ID:</strong> {eventId}</p>"

    def build_eventDate(self, eventDate):
        self.event_dict["eventDate"] = f"<p><strong>Date:</strong> {eventDate}</p>"

    def build_eventStartTime(self, eventStartTime):
        self.event_dict["eventStartTime"] = f"<p><strong>Start Time:</strong> {eventStartTime}</p>"

    def build_eventEndTime(self, eventEndTime):
        self.event_dict["eventEndTime"] = f"<p><strong>End Time:</strong> {eventEndTime}</p>"

    def build_eventLocation(self, eventLocation):
        self.event_dict["eventLocation"] = f"<p><strong>Location:</strong> {eventLocation}</p>"

    def build_eventType(self, eventType):
        self.event_dict["eventType"] = f"<p><strong>Type:</strong> {eventType}</p>"

    def build_eventDescription(self, eventDescription):
        self.event_dict["eventDescription"] = f"<p><strong>Description:</strong> {eventDescription}</p>"

    def build_eventOrganizer(self, eventOrganizer):
        self.event_dict["eventOrganizer"] = f"<p><strong>Organizer:</strong> {eventOrganizer}</p>"

    def build_eventImg(self, eventImg):
        self.event_dict["eventImg"] = f'<img src="{eventImg}" alt="Event Image" style="max-width: 100%; border-radius: 10px; margin-bottom: 20px;" />'

    def build_socialMediaLink(self, socialMediaLink):
        self.event_dict["socialMediaLink"] = f"""
            <div style="text-align: center; margin-top: 30px;">
                <a href="{socialMediaLink}" style="padding: 12px 25px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Follow us on Social Media
                </a>
            </div>
        """

    def get_email_html(self):
        body_content = f"""
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50;">Event Details</h1>
            
            {self.event_dict.get("eventImg", "")}
            {self.event_dict.get("eventID", "")}
            {self.event_dict.get("eventDate", "")}
            {self.event_dict.get("eventStartTime", "")}
            {self.event_dict.get("eventEndTime", "")}
            {self.event_dict.get("eventLocation", "")}
            {self.event_dict.get("eventType", "")}
            {self.event_dict.get("eventDescription", "")}
            {self.event_dict.get("eventOrganizer", "")}
            {self.event_dict.get("socialMediaLink", "")}
        </div>
        """

        full_email = f"""
        <html>
            <head>
                <meta charset="UTF-8">
                <title>Event Details</title>
            </head>
            <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px;">
                {body_content}
            </body>
        </html>
        """
        return full_email


# def format_email(eventId, eventName, eventDate, eventStartTime, eventEndTime, eventLocation, eventType, eventDescription, speakerId, eventOrganizer, eventImg, socialMediaLink):
#     html_content = f"""
#         <html>
#             <body>
#                 <h2>Exclusive Promotion Just for You!</h2>
#                 <p>Dear {subscriber_list['name']},</p>
#                 <p>We are excited to offer you a special promotion for the event: <strong>{event_dict['name']}</strong>.</p>
#                 <p>Event Details:</p>
#                 <ul>
#                     <li><strong>Type:</strong> {event_dict['eventType']}</li>
#                     <li><strong>Date:</strong> {event_dict['startDate']} to {event_dict['endDate']}</li>
#                     <li><strong>Time:</strong> {event_dict['startTime']} - {event_dict['endTime']}</li>
#                     <li><strong>Location:</strong> {event_dict['location']}</li>
#                     <li><strong>Description:</strong> {event_dict['description']}</li>
#                     <li><strong>Organizer:</strong> {event_dict['organizer']}</li>
#                     <li><strong>Speaker:</strong> {event_dict['speaker']}</li>
#                 </ul>
#                 <p>Don't miss out! Visit <a href="http://example.com/tickets">this link</a> to get your tickets now.</p>
#                 <p>This is an automated message, please do not reply.</p>
#             </body>
#         </html>
#     """
#     return html_content

def send_email(to_emails, event_name, html_content):
    from_email = os.getenv("EMAIL_ADDRESS")
    from_password = os.getenv("EMAIL_PASSWORD")

    # Safety check for required values
    if not from_email:
        raise ValueError("❌ Missing sender email (from_email).")
    if not from_password:
        raise ValueError("❌ Missing sender email password (from_password).")
    if not to_emails:
        raise ValueError("❌ No recipient emails provided (to_emails).")
    if not event_name:
        raise ValueError("❌ Missing event name (event_name).")
    if not html_content:
        raise ValueError("❌ Missing email content (html_content).")


    if isinstance(to_emails, str):
        to_emails = [to_emails]

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, from_password)


    for to_email in to_emails:
        try:
            if not to_email:
                print("⚠️ Skipped empty recipient.")
                continue

            msg = MIMEMultipart()
            msg['From'] = from_email
            msg['To'] = to_email
            msg['Subject'] = f"{event_name} — Exclusive Promotion is coming your way!"
            msg.attach(MIMEText(html_content, 'html'))

            server.sendmail(from_email, to_email, msg.as_string())
            print(f"✅ Email sent to {to_email}")
        except smtplib.SMTPAuthenticationError as e:
            print(f"❗ Authentication Error: {e}")
        except Exception as e:
            print(f"❗ Failed to send email to {to_email}: {e}")

    server.quit()
