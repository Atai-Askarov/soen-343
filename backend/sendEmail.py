import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv
from abc import ABC, abstractmethod

# Load environment variables from .env file
load_dotenv()

class EmailBuilder(ABC):
    """Abstract Builder interface that defines all building methods"""
    
    @abstractmethod
    def reset(self) -> None:
        pass
    
    @abstractmethod
    def build_eventID(self, eventId) -> None:
        pass
    
    @abstractmethod
    def build_eventName(self, eventName) -> None:
        pass
    
    @abstractmethod
    def build_eventDate(self, eventDate) -> None:
        pass
    
    @abstractmethod
    def build_eventStartTime(self, eventStartTime) -> None:
        pass
    
    @abstractmethod
    def build_eventEndTime(self, eventEndTime) -> None:
        pass
    
    @abstractmethod
    def build_eventLocation(self, eventLocation) -> None:
        pass
    
    @abstractmethod
    def build_eventType(self, eventType) -> None:
        pass
    
    @abstractmethod
    def build_eventDescription(self, eventDescription) -> None:
        pass
    
    @abstractmethod
    def build_eventOrganizer(self, eventOrganizer) -> None:
        pass
    
    @abstractmethod
    def build_eventImg(self, eventImg) -> None:
        pass
    
    @abstractmethod
    def build_socialMediaLink(self, socialMediaLink) -> None:
        pass
    
    @abstractmethod
    def get_result(self) -> str:
        pass


class HTMLEmailBuilder(EmailBuilder):
    """Concrete Builder implementation that creates HTML email content"""
    
    def __init__(self):
        self.reset()
    
    def reset(self) -> None:
        self.event_dict = {}
    
    def build_eventName(self, eventName):
        self.event_dict["eventName"] = f"<p><strong>Event Name:</strong> {eventName}</p>"
        return self

    def build_eventID(self, eventId):
        self.event_dict["eventID"] = f"<p><strong>Event ID:</strong> {eventId}</p>"
        return self

    def build_eventDate(self, eventDate):
        self.event_dict["eventDate"] = f"<p><strong>Date:</strong> {eventDate}</p>"
        return self

    def build_eventStartTime(self, eventStartTime):
        self.event_dict["eventStartTime"] = f"<p><strong>Start Time:</strong> {eventStartTime}</p>"
        return self

    def build_eventEndTime(self, eventEndTime):
        self.event_dict["eventEndTime"] = f"<p><strong>End Time:</strong> {eventEndTime}</p>"
        return self

    def build_eventLocation(self, eventLocation):
        self.event_dict["eventLocation"] = f"<p><strong>Location:</strong> {eventLocation}</p>"
        return self

    def build_eventType(self, eventType):
        self.event_dict["eventType"] = f"<p><strong>Type:</strong> {eventType}</p>"
        return self

    def build_eventDescription(self, eventDescription):
        self.event_dict["eventDescription"] = f"<p><strong>Description:</strong> {eventDescription}</p>"
        return self

    def build_eventOrganizer(self, eventOrganizer):
        self.event_dict["eventOrganizer"] = f"<p><strong>Organizer:</strong> {eventOrganizer}</p>"
        return self

    def build_eventImg(self, eventImg):
        self.event_dict["eventImg"] = f'<img src="{eventImg}" alt="Event Image" style="max-width: 100%; border-radius: 10px; margin-bottom: 20px;" />'
        return self

    def build_socialMediaLink(self, socialMediaLink):
        self.event_dict["socialMediaLink"] = f"""
            <div style="text-align: center; margin-top: 30px;">
                <a href="{socialMediaLink}" style="padding: 12px 25px; background-color: #3498db; color: white; text-decoration: none; border-radius: 5px; font-weight: bold;">
                    Follow us on Social Media
                </a>
            </div>
        """
        return self

    def get_result(self):
        """Returns the final HTML email template"""
        return self._get_email_html()
    
    def _get_email_html(self):
        """Internal method to format the complete HTML email"""
        body_content = f"""
        <div style="max-width: 600px; margin: auto; background: #ffffff; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1);">
            <h1 style="color: #2c3e50;">Event Details</h1>
            
            {self.event_dict.get("eventImg", "")}
            {self.event_dict.get("eventID", "")}
            {self.event_dict.get("eventName", "")}
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


class EmailDirector:
    """Director class that orchestrates the building process"""
    
    def __init__(self):
        self._builder = None
    
    @property
    def builder(self) -> EmailBuilder:
        return self._builder
    
    @builder.setter
    def builder(self, builder: EmailBuilder) -> None:
        self._builder = builder
    
    def build_event_email(self, event_data):
        """Builds a complete event email using the provided data"""
        if not self._builder:
            raise ValueError("Builder hasn't been set")
            
        self._builder.reset()
        
        # Extract event data
        eventId = event_data.get("eventId")
        eventName = event_data.get("eventName")
        eventDate = event_data.get("eventDate")
        eventStartTime = event_data.get("eventStartTime")
        eventEndTime = event_data.get("eventEndTime")
        eventLocation = event_data.get("eventLocation")
        eventType = event_data.get("eventType")
        eventDescription = event_data.get("eventDescription")
        eventOrganizer = event_data.get("eventOrganizer")
        eventImg = event_data.get("eventImg")
        socialMediaLink = event_data.get("socialMediaLink")
        
        # Build the email components
        self._builder.build_eventID(eventId)
        self._builder.build_eventName(eventName)
        self._builder.build_eventDate(eventDate)
        self._builder.build_eventStartTime(eventStartTime)
        self._builder.build_eventEndTime(eventEndTime)
        self._builder.build_eventLocation(eventLocation)
        self._builder.build_eventType(eventType)
        self._builder.build_eventDescription(eventDescription)
        self._builder.build_eventOrganizer(eventOrganizer)
        self._builder.build_eventImg(eventImg)
        
        if socialMediaLink:  # Only include if it's provided
            self._builder.build_socialMediaLink(socialMediaLink)
            
        return self._builder.get_result()


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