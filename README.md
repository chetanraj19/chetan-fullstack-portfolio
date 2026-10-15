# Chetan Full-Stack Portfolio

A personal developer portfolio built with **Java, Spring Boot, HTML, CSS, JavaScript, and MySQL configuration**. The project brings the portfolio frontend and Spring Boot backend together in one application.

## Overview

The portfolio is intended to present profile information, skills, projects, and contact details through a web interface. A separate admin page is included in the project for managing portfolio content.

> **Project status:** This README describes the project based on the project details currently available. Verify the application and database configuration locally before claiming that every feature is production-ready.

## Tech Stack

- **Backend:** Java, Spring Boot
- **Build tool:** Maven
- **Frontend:** HTML, CSS, JavaScript
- **Persistence:** Spring Data JPA
- **Database configuration:** MySQL
- **Validation:** Spring Boot Validation
- **API style:** REST

## Features

- Portfolio website for displaying developer profile information
- Sections for projects and technical skills
- Contact form and backend API integration
- Admin page for managing portfolio information
- Spring Boot REST API backend
- Database integration configured through Spring Data JPA
- Environment-variable support for database connection settings

Feature availability depends on the current application configuration and should be tested locally.

## Project Structure

The project follows a standard Maven/Spring Boot layout. Folder names may differ depending on the files in your local project.

```text
chetan-fullstack-portfolio/
├── src/
│   └── main/
│       ├── java/                 # Spring Boot application and backend code
│       └── resources/
│           ├── static/           # Frontend files and assets (if stored here)
│           └── application.properties
├── pom.xml                       # Maven dependencies and build configuration
└── README.md
```

## Prerequisites

- Java Development Kit (JDK)
- Maven, or the Maven wrapper if included in the project
- MySQL Server if using the MySQL configuration

## Configuration

The application is configured to read database settings from environment variables, with local defaults defined in `application.properties`.

For a local PowerShell session, set your database credentials before starting the application:

```powershell
$env:DB_USERNAME = "your_mysql_username"
$env:DB_PASSWORD = "your_mysql_password"
```

If the application uses admin credentials from environment variables, configure those locally as well.

**Never commit real passwords, tokens, private keys, or `.env` files to GitHub.** Keep secrets out of tracked source files.

## Run Locally

1. Clone the repository:

   ```powershell
   git clone https://github.com/chetanraj19/chetan-fullstack-portfolio.git
   cd chetan-fullstack-portfolio
   ```

2. Configure the database and environment variables for your local machine.

3. Start the Spring Boot application from the project root:

   ```powershell
   mvn spring-boot:run
   ```

4. Open the application at:

   ```text
   http://localhost:8080
   ```

The exact pages and API routes depend on the current source code. Confirm them in the project before documenting specific endpoint URLs.

## Build

```powershell
mvn clean package
```

## Security Notes

- Never publish database or admin passwords.
- Do not commit local environment files, generated build output, IDE settings, or private keys.
- Use strong, unique credentials for any deployed instance.
- Review the repository for secrets before making it public.

## Future Improvements

- Document verified API endpoints
- Add screenshots of the portfolio and admin page
- Provide an example environment file without secrets
- Document deployment steps after hosting is configured

## Author

**Chetan Raj Gour**

- GitHub: [@chetanraj19](https://github.com/chetanraj19)

---

If you find an issue or have a suggestion, open an issue in this repository.
