# Scalability & System Design Strategy

## 1. Current Architecture
The current application is designed as a **Monolithic REST API** using **Spring Boot** and a relational database (**MySQL/PostgreSQL**). It utilizes **Stateless Authentication (JWT)**, which is the foundational step for horizontal scaling as it removes the need for sticky sessions on the server.

### Current Workflow:
* **Client:** React SPA (Single Page Application).
* **Server:** Spring Boot Tomcat container handling business logic.
* **Database:** Single RDBMS instance for persistence.

---

## 2. Roadmap for High-Traffic Scaling
To scale this system to handle 100k+ concurrent users, I would implement the following phases:

### Phase 1: Database Optimization (The Bottleneck)
Since E-commerce workloads are typically **90% Read** (browsing products) and **10% Write** (placing orders), the database is the first bottleneck.
* **Read Replicas:** Implement a **Master-Slave** architecture. The Master DB handles writes (INSERT/UPDATE), while multiple Slave DBs handle reads (SELECT). This offloads the heavy traffic of product browsing from the transactional master.
* **Indexing:** Ensure all search fields (e.g., `product_name`, `category`) and foreign keys (`user_id` in orders) are indexed to maintain $O(log n)$ query performance.

### Phase 2: Caching Strategy (Redis)
To further reduce database load, I would introduce **Redis** as an in-memory cache.
* **Product Catalog:** Cache the `GET /products` response. Invalidate/Update the cache only when an Admin updates a product. This reduces database hits for the most common request by ~95%.
* **Session/Cart Management:** Store temporary shopping cart data in Redis instead of the primary database. This allows for faster write/read speeds for the cart, which changes frequently.

### Phase 3: Horizontal Scaling & Load Balancing
* **Containerization:** Dockerize the Spring Boot application to ensure consistent environments.
* **Load Balancer (NGINX / AWS ALB):** Deploy multiple instances of the backend application behind a Load Balancer. Using a **Round-Robin** or **Least Connections** algorithm, traffic is distributed across instances, allowing the application to handle higher concurrency.

### Phase 4: Transition to Microservices
As the domain grows, the Monolith would be decoupled into domain-specific services to allow independent scaling:

1.  **Identity Service:** Handles Registration, Login, and JWT issuance.
2.  **Inventory Service:** Handles Product CRUD and Stock management.
3.  **Order Service:** Handles Cart processing and Order placement.

**Inter-Service Communication:**
* **Synchronous:** REST/Feign Clients for direct data retrieval.
* **Asynchronous:** **RabbitMQ** or **Kafka** for event-driven actions.
    * *Example:* When an order is placed (`OrderService`), an event `OrderPlacedEvent` is published. The `InventoryService` consumes this to decrement stock, ensuring eventual consistency without blocking the user response.

---

## 3. Security Considerations at Scale
* **Rate Limiting:** Implement API Rate Limiting (using Bucket4j or Redis) to prevent DDoS attacks and abuse.
* **Secrets Management:** Move sensitive keys (Database passwords, JWT secrets) to a dedicated vault (e.g., HashiCorp Vault or AWS Secrets Manager) rather than application properties.