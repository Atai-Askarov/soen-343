from sendEmail import EmailDirector, HTMLEmailBuilder, send_email, send_email_update, send_delete_email
from account import db, sign_in, get_users, log_in,get_users_by_role, get_all_user_emails, User, get_user_by_id, get_user_emails_from_array, get_user_by_id
from event import * #register_for_event
from tickets import get_tickets,get_users_by_event, get_tickets_by_user, create_ticket, get_tickets_by_event

class EventNotifier:
    _observers = []

    @classmethod
    def register(cls, observer_func):
        cls._observers.append(observer_func)

    @classmethod
    def notify(cls, event_id):
        for observer in cls._observers:
            observer(event_id)
def email_attendees_on_update(event_id):
    # Move your existing `event_email_update_internal` logic here
    # You can keep the logging/printing too
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
        print("✅ Observer: Email sent to attendees.")

    except Exception as e:
        print(f"❌ Observer Error: {e}")
def email_attendees_on_delete(event_id):
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

        subject = f"[CANCELLED] {event['eventname']}"
        send_delete_email(emails, subject, email_html)
        print("✅ Observer: Deletion email sent to attendees.")
    except Exception as e:
        print(f"❌ Observer Delete Error: {e}")
