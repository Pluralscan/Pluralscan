# Pluralscan - Coding Style & Recommended Practices

## Domain Driven Design (DDD)

Domain Driven Design is a software development approach for build complexe software in accordance with the domain.
When a developer adhere to this approach, he needs to understand that's he/she is here to resolve business issue's; and thus coding is just a tool to solve the problem.

## Introduction to clean architecture

- The Clean Architecture by Robert C. (Uncle Bob): https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html

## References

- Representing a **collection** as a Value Object: https://enterprisecraftsmanship.com/posts/representing-collection-as-value-object
- Integrity of Collections in Domain-Driven Design: https://ankitvijay.net/2020/05/10/integrity-of-collections-in-domain-driven-design/
- DDD: entity's collection and repositories: https://localcoder.org/ddd-entitys-collection-and-repositories
- When and where to **determine the ID of an entity**: https://matthiasnoback.nl/2018/05/when-and-where-to-determine-the-id-of-an-entity/

## Architecture Layers

DDD is compatible with most N-Tier *(Layered)* Architecture and can be very powerfull into microservices.

**Common layers with multi-module/monolith:**

- **Domain**: domain services *(validation, factories, providers...)*, entities, value objects, aggregates and domain events
- **Business Logic**: surrounded by the UI/Application layer and Infrastructure layer
- **UI/Application Layer**: Front-End like console, GUI, API, Website...
- **Infrastructure**: external implentations for specific technology likes persistence, file system, network, mail, logging...

## Entities

- Live longer than the application, should endure restarts, and are persisted and read from data sources (DB, file system, network, etc.)
- Have an id (preferably a GUID rather than a DB generated int because business transactions do not rely on persistence, can be persisted after other operations carried out in model's behavior)
- Have entity semantics (equality and GetHashCode() defined by class name + id)
- Behavior in an entity mostly orchestrates value objects for a use case
- Entity class should not have public property setters, setting a property should be a behavior method
- Entities should not have bidirectional relations (depending on the bounded context, either an egg can have a chicken or a chicken can have eggs, but not both)
- Entity relations should not reflect the complete set of DB foreign key relationships, should be bare down to the minimum for performing the behavior inside the bounded context
- Entity relations should **not hold a reference to another entity class**, it can only keep the id of another entity
- If a business transaction needs a reference to other entities in relation, aggregates should be used instead (aggregates can hold a reference to other aggregate roots, which are entity classes by definition)