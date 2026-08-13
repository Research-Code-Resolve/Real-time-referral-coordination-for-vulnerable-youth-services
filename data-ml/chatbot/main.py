from fastapi import FastAPI
from pydantic import BaseModel
import os
from dotenv import load_dotenv
#from openai import OpenAI

load_dotenv()

# client = OpenAI(
#     api_key=os.getenv("OPENAI_API_KEY")
# )

app = FastAPI()

# Temporary in-memory conversation store
conversation_memory = {}

# This defines the structure of incoming messages
class ChatRequest(BaseModel):
    session_id: str
    message: str
    current_page: str = "dashboard"

# Simple home route
@app.get("/")
def home():
    return {"message": "Social Worker Chatbot API is running"}

def ask_ai(user_message, current_page):

    user_message = user_message.lower()

    # --- SAFEGUARDING / URGENT RISK DETECTION ---
    urgent_keywords = [
        "suicide",
        "kill myself",
        "self-harm",
        "abuse",
        "rape",
        "sexual assault",
        "violence",
        "beating",
        "unsafe",
        "emergency",
        "threatened",
        "trafficking"
    ]

    if any(keyword in user_message for keyword in urgent_keywords):
        return (
            "⚠️ This situation may require immediate safeguarding or emergency intervention. "
            "Please follow your organisation's child protection and emergency procedures, "
            "contact the appropriate supervisor or safeguarding focal person, and involve "
            "the relevant local authority or emergency service if the youth is in immediate danger."
        )

    # --- NORMAL CHATBOT RULES ---
    if "first" in user_message or "start" in user_message:
        return (
            "Welcome to Social Worker Connect! A good first step is to register "
            "or select a youth case, complete a needs assessment, search the "
            "service directory, and then create a referral."
        )

    elif "referral" in user_message:
        return (
            "To create a referral, make sure you have a youth case, a completed "
            "needs assessment, a receiving organisation, and a referral priority level."
        )

    elif "status" in user_message:
        return (
            "Referral statuses include Submitted, Received, Accepted, Appointment Scheduled, "
            "Client Arrived, Service In Progress, Service Completed, and Closed."
        )

    elif current_page == "needs_assessment":
        return (
            "During the needs assessment, identify whether the youth requires health services, "
            "mental health support, shelter, legal support, GBV services, education, "
            "vocational training, or psychosocial support."
        )

    else:
        return (
            "I can help you navigate Social Worker Connect, including case registration, "
            "needs assessment, referrals, and referral tracking."
        )

# Chatbot endpoint
@app.post("/chat")
def chat(request: ChatRequest):

    session_id = request.session_id
    user_message = request.message.lower()
    page = request.current_page

    # Get previous context
    previous_topic = conversation_memory.get(session_id)

    # Detect what the user wants
    if "referral" in user_message:
        conversation_memory[session_id] = "referral"
        reply = (
            "I can help you create a referral. You will need a youth case, "
            "a completed needs assessment, a receiving organisation, and a priority level."
        )

    elif "case" in user_message:
        conversation_memory[session_id] = "case_registration"
        reply = (
            "To register a youth case, enter the age, gender, location, "
            "presenting problem, immediate needs, and priority level."
        )

    # Follow-up question handling
    elif "what information" in user_message and previous_topic == "referral":
        reply = (
            "For a referral, collect: client information, required service, "
            "receiving organisation, referral priority, case notes, and any supporting attachments."
        )

    elif "what information" in user_message and previous_topic == "case_registration":
        reply = (
            "For case registration, collect: age, gender, location, presenting problem, "
            "immediate needs, and priority level."
        )

    # Page-based fallback
    elif page == "needs_assessment":
        reply = (
            "You are currently completing a needs assessment. Consider whether the youth "
            "requires health services, shelter, legal support, GBV services, education, "
            "vocational training, or psychosocial support."
        )

    else:
        reply = ask_ai(request.message, page)

    return {
        "session_id": session_id,
        "current_page": page,
        "remembered_topic": conversation_memory.get(session_id),
        "user_message": request.message,
        "bot_reply": reply
    }

