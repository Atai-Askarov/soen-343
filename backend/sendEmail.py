import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText



def getEventDetails(eventID):
    # mock for now
    name= "John Manning"
    startDate = "10/10/2021"
    endDate = "10/10/2021"
    startTime= "10:00"
    endTime= "11:00"
    location= "123 Main St"
    eventType= "workshop"
    description= "This is a workshop"
    organizer= "Sam Altman"
    speaker= "Mike Tyson"
    
def getSubscribers(subscriberList):
    # mock for now
    subscriberList = [
        {'email': 'user1@example.com', 'name': 'John'},
        {'email': 'user2@example.com', 'name': 'Jane'},
    ]
    