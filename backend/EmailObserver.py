from sendEmail import EmailDirector, HTMLEmailBuilder, send_email, send_email_update, send_delete_email
from account import db, sign_in, get_users, log_in,get_users_by_role, get_all_user_emails, User, get_user_by_id, get_user_emails_from_array, get_user_by_id
from event import * #register_for_event
from tickets import get_tickets,get_users_by_event, get_tickets_by_user, create_ticket, get_tickets_by_event
class Observer:
    def update(self, event_id):
        raise NotImplementedError("Subclass must implement this method")
class EmailObserver(Observer):
    def update(self, event_id):
        try:
            users = get_users_by_event(event_id)
            emails = get_user_emails_from_array(users)
            event = fetch_event_by_id(event_id)

            if not event:
                print(f"❌ No event found with ID {event_id}")
                return

            event_data = {
                "eventId": event["eventid"],
                "eventName": event["eventname"],
                "eventDate": event["eventdate"].strftime("%B %d, %Y"),
                "eventStartTime": event["eventstarttime"].strftime("%I:%M %p"),
                "eventEndTime": event["eventendtime"].strftime("%I:%M %p"),
                "eventLocation": event["eventlocation"],
                "eventType": event["event_type"],
                "eventDescription": event["eventdescription"],
                "eventOrganizer": event["organizerid"],
                "eventImg": event["event_img"],
                "socialMediaLink": event["social_media_link"]
            }

            director = EmailDirector()
            builder = HTMLEmailBuilder()
            director.builder = builder
            email_html = director.build_event_email(event_data)

            subject = f"{event['eventname']}"
            send_email_update(emails, subject, email_html)
            print("✅ EmailObserver: Email sent to attendees.")

        except Exception as e:
            print(f"❌ EmailObserver Error: {e}")
