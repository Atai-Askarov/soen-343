import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import os
from dotenv import load_dotenv

# Load environment variables from .env file
load_dotenv()

def get_event_details(eventID):
    # mock for now
    name= "SOEN 343 Meeting"
    startDate = "10/10/2021"
    endDate = "10/10/2021"
    startTime= "10:00"
    endTime= "11:00"
    location= "123 Main St"
    eventType= "workshop"
    description= "This is a workshop"
    organizer= "Sam Altman"
    speaker= "Mike Tyson"
    event_dict = {key: value for key, value in locals().items()}
    return event_dict

#For testing
print (get_event_details(1))

def get_subscribers(subscriber_list):
    # mock for now
    subscriber_list = [
        {'email': 'shanvinluo@gmail.com', 'name': 'John'},
        {'email': 'ragedlog@gmail.com', 'name': 'Jane'},
    ]
    return subscriber_list

def format_email(eventID, subscriber_name, subscriber_list, event_dict):
    html_content = f"""
        <html>
            <body>
                <h2>Exclusive Promotion Just for You!</h2>
                <p>Dear {subscriber_list['name']},</p>
                <p>We are excited to offer you a special promotion for the event: <strong>{event_dict['name']}</strong>.</p>
                <p>Event Details:</p>
                <ul>
                    <li><strong>Type:</strong> {event_dict['eventType']}</li>
                    <li><strong>Date:</strong> {event_dict['startDate']} to {event_dict['endDate']}</li>
                    <li><strong>Time:</strong> {event_dict['startTime']} - {event_dict['endTime']}</li>
                    <li><strong>Location:</strong> {event_dict['location']}</li>
                    <li><strong>Description:</strong> {event_dict['description']}</li>
                    <li><strong>Organizer:</strong> {event_dict['organizer']}</li>
                    <li><strong>Speaker:</strong> {event_dict['speaker']}</li>
                </ul>
                <p>Don't miss out! Visit <a href="http://example.com/tickets">this link</a> to get your tickets now.</p>
                <p>This is an automated message, please do not reply.</p>
            </body>
        </html>
    """
    return html_content

def send_email (to_email, event_name, html_content):
    # mock for now
    from_email = os.getenv("EMAIL_ADDRESS")
    from_password = os.getenv("EMAIL_PASSWORD")
    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, from_password)
    try:
        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = event_name + "Exclusive Promotion is coming your way!"
        msg.attach(MIMEText(html_content, 'html'))
        server.sendmail(from_email, to_email, msg.as_string())
        print (f"✅ Email sent to {to_email}")
    except smtplib.SMTPAuthenticationError as e:
        print(f"❗ Authentication Error: {e}")
    except Exception as e:
        print(f"❗ Failed to send email: {e}")
    finally:
        server.quit()


mock_event = get_event_details(1)
subscriber_list = get_subscribers(1)

# Loop through the subscriber list and send an email to each one
for subscriber in subscriber_list:
    html_content = format_email(1, 2, subscriber, mock_event)
    send_email(subscriber['email'], "SOEN343 Project", html_content)
