# PostPilot API - Standalone Backend

PostPilot is a professional Reddit scheduling platform designed for productivity. This repository contains the standalone Node.js and Express backend API that handles authentication, post management, media uploads to AWS S3, and automated scheduling.

## 🚀 Key Features

- **Reddit OAuth2 Authentication**: Secure, scoped access using official Reddit API flows.
- **Automated Post Scheduling**: Robust background worker to trigger posts at precise times.
- **AWS S3 Integration**: Secure, pre-signed URL uploads for high-resolution images and videos.
- **Strict Spam Protection**: Built-in logic to enforce a 10-minute gap between posts for security and compliance with Reddit's policies.
- **MongoDB Backend**: Reliable storage for post drafts, schedules, and user metadata.

## 🛠 Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Scheduling**: Node-Cron
- **Storage**: AWS S3 (SDK v3)
- **Authentication**: JWT & OAuth2

## 📦 API Architecture

- `/auth`: Handles user registration and Reddit account connection.
- `/posts`: CRUD operations for drafts and scheduled posts.
- `/upload`: Manages secure media uploads to S3.

## 🔒 Security

This API utilizes industry-standard JWT for session management and never stores Reddit passwords. All credentials are encrypted and stored in environment variables, which are excluded from source control.

---
Built by [hellokarmio](https://github.com/hellokarmio)
    
