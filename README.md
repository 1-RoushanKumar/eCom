# Product Inventory & E-Commerce System

A secure, scalable Full Stack application built for the Backend Developer Intern Assignment. This project demonstrates a RESTful API architecture with Spring Boot and a responsive React frontend, featuring Role-Based Access Control (RBAC), Inventory Management, and E-Commerce functionalities like Cart and Order History.

## 📸 Application Screenshots

### Landing Page
<img width="1900" height="866" alt="Screenshot 2026-01-11 204107" src="https://github.com/user-attachments/assets/90d05a50-77b3-4043-87c8-aa5b8872212f" />

*Browse our product catalog with advanced search and filtering*

### Shopping Cart
<img width="1894" height="870" alt="Screenshot 2026-01-11 204504" src="https://github.com/user-attachments/assets/b6bae4f3-561b-4a46-805d-4440ab73598b" />

*Manage your items before checkout*
<img width="1900" height="865" alt="Screenshot 2026-01-11 204616" src="https://github.com/user-attachments/assets/2ac9433b-f19d-42d9-afec-9d45249db653" />

### Order History

*Track all your past purchases*

### Admin Dashboard
<img width="1896" height="811" alt="Screenshot 2026-01-11 210742" src="https://github.com/user-attachments/assets/014dbe57-cb1e-45e1-a01b-9b3d635e0b14" />

*Comprehensive inventory management for administrators*

### API Documentation (Swagger UI)

*Complete REST API documentation with interactive testing*
<img width="1893" height="870" alt="Screenshot 2026-01-11 210158" src="https://github.com/user-attachments/assets/d4cbd5b0-50f4-49db-95b6-d55faaa689a1" />

<img width="1900" height="872" alt="Screenshot 2026-01-11 210215" src="https://github.com/user-attachments/assets/555e0250-7494-4d88-9035-4302d2cb5291" />

*Detailed endpoint specifications with request/response schemas*

---

## 🚀 Features

### Core Backend Features
* **Secure Authentication:** JWT-based Login & Registration with BCrypt password hashing
* **RBAC (Role-Based Access Control):** Distinct access levels for **Admin** (Inventory Management) and **User** (Shopping)
* **Inventory Management:** Complete CRUD operations for products (Admin only)
* **Advanced Data Handling:** Optimized Search and Pagination APIs to handle large datasets
* **Scalability:** Designed with clean architecture to support future microservices migration

### Frontend & UI Features
* **Responsive Dashboard:** Built with React + Tailwind CSS
* **Product Catalog:** Searchable grid layout with product images
* **Shopping Cart:** Users can add items to a persistent cart
* **Order History:** Users can view their past purchase history
* **Admin Panel:** Exclusive controls for Admins to Add, Edit, or Delete products

---

## 🛠️ Tech Stack

### Backend
* **Framework:** Spring Boot 3
* **Language:** Java 21
* **Security:** Spring Security, JWT (JSON Web Tokens)
* **Database:** PostgreSQL / MySQL (JPA/Hibernate)
* **Documentation:** Swagger UI / OpenAPI

### Frontend
* **Library:** React.js (Vite)
* **Styling:** Tailwind CSS
* **State Management:** React Context API
* **HTTP Client:** Axios

---

## 📊 Scalability & System Design

### Current Architecture
The application is built as a **Monolithic REST API** using **Spring Boot** with a relational database. It implements **Stateless Authentication (JWT)**, enabling horizontal scaling without session affinity requirements.

**Current Workflow:**
* **Client:** React SPA (Single Page Application)
* **Server:** Spring Boot with embedded Tomcat
* **Database:** Single RDBMS instance (MySQL/PostgreSQL)

### Scaling Strategy for High Traffic (100k+ Concurrent Users)

#### Phase 1: Database Optimization
E-commerce workloads are typically **90% Read** and **10% Write**, making the database the primary bottleneck.

* **Read Replicas:** Implement Master-Slave architecture
  * Master DB: Handles all writes (INSERT/UPDATE)
  * Slave DBs: Handle reads (SELECT) for product browsing
* **Indexing:** Strategic indexes on search fields (`product_name`, `category`) and foreign keys (`user_id` in orders) for O(log n) query performance

#### Phase 2: Caching Strategy (Redis)
Introduce **Redis** as an in-memory cache to reduce database load:

* **Product Catalog:** Cache `GET /products` responses, invalidating only on admin updates (~95% reduction in DB hits)
* **Session/Cart Management:** Store temporary cart data in Redis for faster read/write operations

#### Phase 3: Horizontal Scaling
* **Containerization:** Docker containers for consistent deployment
* **Load Balancing:** NGINX or AWS ALB with Round-Robin/Least Connections algorithms
* **Multiple Instances:** Deploy multiple backend instances behind the load balancer

#### Phase 4: Microservices Architecture
Decouple the monolith into domain-specific services for independent scaling:

1. **Identity Service:** Authentication and JWT issuance
2. **Inventory Service:** Product CRUD and stock management
3. **Order Service:** Cart processing and order placement

**Inter-Service Communication:**
* **Synchronous:** REST/Feign Clients for direct queries
* **Asynchronous:** RabbitMQ/Kafka for event-driven processing
  * Example: `OrderPlacedEvent` triggers inventory updates without blocking user responses

### Security at Scale
* **Rate Limiting:** API throttling using Bucket4j or Redis to prevent DDoS attacks
* **Secrets Management:** HashiCorp Vault or AWS Secrets Manager for sensitive credentials
* **JWT Token Rotation:** Refresh token mechanism for enhanced security

For detailed scalability documentation, see [Scalability.md](./Scalability.md)

---

## 🚀 Getting Started

### Prerequisites
* Java 17+
* Node.js 18+
* Maven 3.8+
* PostgreSQL/MySQL database

### Backend Setup
```bash
# Navigate to backend directory
cd backend

# Configure database in application.properties
spring.datasource.url=jdbc:postgresql://localhost:5432/ecommerce
spring.datasource.username=your_username
spring.datasource.password=your_password

# Build and run
mvn clean install
mvn spring-boot:run
```

### Frontend Setup
```bash
# Navigate to frontend directory
cd ecom_frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The application will be available at:
* Frontend: `http://localhost:5173`
* Backend API: `http://localhost:8080`
* Swagger UI: `http://localhost:8080/swagger-ui.html`

---

## 📝 API Documentation

Once the application is running, access the interactive API documentation at:
```
http://localhost:8080/swagger-ui.html
```

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👤 Author

**Roushan Kumar**

* GitHub: [@1-RoushanKumar](https://github.com/1-RoushanKumar)

---

## 🙏 Acknowledgments

* Built as part of the Backend Developer Intern Assignment
* Inspired by modern e-commerce platforms and scalable system design principles
* Thanks to the Spring Boot and React communities for excellent documentation
