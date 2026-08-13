# Social Worker Connect – Chatbot Service

## What this is

This is an independent chatbot API for the **Social Worker Connect** web application.

The chatbot helps social workers:

* Navigate the platform
* Register youth cases
* Complete needs assessments
* Create referrals
* Understand referral statuses
* Track referral progress

---

## Run locally

### Activate the virtual environment

```powershell
venv\Scripts\activate
```

### Start the server

```powershell
uvicorn main:app --reload
```

---

## API Documentation

Open:

```text
http://127.0.0.1:8000/docs
```

---

## Example Request

### POST `/chat`

```json
{
  "session_id": "demo1",
  "message": "How do I create a referral?",
  "current_page": "create_referral"
}
```

### Example Response

```json
{
  "session_id": "demo1",
  "bot_reply": "To create a referral, make sure you have a youth case, a completed needs assessment, a receiving organisation, and a referral priority level."
}
```

---

## Integration Contract

### Frontend sends

* `session_id`
* `message`
* `current_page`

### Chatbot returns

* `session_id`
* `bot_reply`

The frontend can display `bot_reply` inside the chat window.

---

## Current Supported Pages

* `dashboard`
* `register_case`
* `needs_assessment`
* `service_directory`
* `create_referral`
* `referral_tracking`

---

## Future Improvements

* OpenAI natural language responses
* Database-backed conversation memory
* Multilingual support
* Escalation rules for urgent safeguarding situations
* Analytics dashboard for chatbot usage
