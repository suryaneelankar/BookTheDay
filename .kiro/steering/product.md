# BookTheDay – Product Overview

BookTheDay is a React Native mobile marketplace app (Android-first) that connects customers with local event service vendors.

## Core User Roles

- **User (Customer)** – browses and books event services, manages bookings and payments
- **Vendor** – lists and manages services, accepts/rejects booking requests, tracks earnings
- **Admin** – dashboard for platform oversight

## Key Service Categories

- **Function Halls** – venue booking with date selection and capacity options
- **Food Catering** – catering services with menu selection
- **Clothing & Jewellery** – rental items for events

## Core Flows

- OTP-based phone authentication (MSG91 SendOTP)
- Location-aware service discovery (nearby events, caterings)
- Cart → booking → Razorpay payment → confirmation
- Vendor KYC (Aadhaar upload) and bank details onboarding
- Firebase push notifications for booking updates
- Separate tab navigations for User and Vendor roles
