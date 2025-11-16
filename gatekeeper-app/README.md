# Code Academy Gatekeeper App

A simple authentication system for Code Academy's learning portal that allows only registered students to enter.

## Features

- User registration (Sign Up)
- User authentication (Log In)
- Secure password hashing using bcrypt
- Persistent user data storage in JSON format
- Command-line interface with a user-friendly menu

## Prerequisites

- Node.js (v14 or higher)
- npm (comes with Node.js)

## Installation

1. Clone the repository or download the source code
2. Navigate to the project directory:
   ```
   cd gatekeeper-app
   ```
3. Install the dependencies:
   ```
   npm install
   ```

## Usage

1. Start the application:
   ```
   npm start
   ```

2. Follow the on-screen instructions to:
   - Sign up (create a new account)
   - Log in (if you already have an account)
   - Exit the application

## How It Works

- User data is stored in `users.json`
- Passwords are hashed using bcrypt before being stored
- The application provides a simple command-line interface
- Users must be registered before they can log in

## Security Notes

- Passwords are never stored in plain text
- The application includes basic input validation
- User data is stored locally in a JSON file

## License

This project is open source and available under the [MIT License](LICENSE).
