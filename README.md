# 📬 Notification API

A simple Node.js-based notification microservice that sends notifications via **email**, **SMS**, or displays them on a **dashboard**. Messages are queued using RabbitMQ and sent asynchronously.

---

## 🚀 Features

- Send notifications via:
  - ✉️ Email
  - 📱 SMS
  - 🖥 Dashboard (stored in DB for frontend use)
- Queue handling using **RabbitMQ**
- MongoDB for storing notifications
- API documentation powered by Swagger
- Written using **Hapi.js**

---

## 🧰 Requirements

- **Node.js** v22.5.1 or higher
- **MongoDB** running locally or via URI
- **RabbitMQ** instance (local or cloud)

---

## 📦 Setup

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/notification-api.git
   cd notification-api
