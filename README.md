# 📣 Notification & Marketing Service – NestJS + CQRS + DDD

This project is a **high-performance notification and marketing service** built with **NestJS**, leveraging **CQRS**, **Domain-Driven Design (DDD)**, and **Clean Code** principles.

It enables scalable **mass messaging** across multiple channels like **Email**, **SMS**, and **WhatsApp**, making it a powerful tool for modern communication strategies.

👨‍💻 Author Esteban Restrepo

---

## 🚀 Features

- ✅ Built with **NestJS** – a progressive Node.js framework
- 🧠 Applies **CQRS (Command Query Responsibility Segregation)** for clear separation of concerns
- 🧩 Structured using **DDD (Domain-Driven Design)** to keep business logic clean and modular
- 📬 Supports multi-channel messaging:
  - 📧 Email
  - 📱 SMS
  - 🟢 WhatsApp
- 🧼 Follows **Clean Code** and **SOLID principles**
- 🗂️ Implements **Repository Pattern** for persistence abstraction and domain separation

---

## 🏗️ Architecture Overview

Each module represents a domain context and contains all the business logic, keeping things modular and isolated.

---

### 💡 Use Cases
🔔 Trigger transactional notifications (e.g., order confirmations, password resets)

📣 Launch marketing campaigns via multiple messaging channels

👥 Target user segments with personalized content

📊 Collect delivery and read statistics (via integration-ready providers)

### 🔧 Tech Stack
NestJS – Node.js framework

- TypeScript

- CQRS – via NestJS CQRS module

- DDD – for modeling rich domain logic

- Repository Pattern – for abstracting persistence logic

- Third-party APIs – Email, SMS, and WhatsApp providers



