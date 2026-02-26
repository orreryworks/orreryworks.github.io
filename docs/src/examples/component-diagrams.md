# Component Diagram Examples

These examples demonstrate progressively more complex component diagrams. Each shows the source `.orr` code. You can render any example locally with:

```bash
orrery example.orr -o output.svg
```

All source files are available in the [examples directory on GitHub](https://github.com/orreryworks/orrery/tree/main/examples).

## Basic Components and Relations

Custom types, display names, and all four relation types.

```orrery
diagram component [background_color="#f8f8f8"];

type Service = Rectangle [fill_color="#e6f3ff", rounded=5];
type Database = Rectangle [fill_color="#e0f0e0", rounded=10];
type Client = Oval [fill_color="#fff0e0"];

web_app as "Web Application": Client;
api as "API Gateway": Service;
auth as "Auth Service": Service;
users_db as "Users DB": Database;
orders_db as "Orders DB": Database;
cache: Service;

web_app -> api: "HTTP request";
web_app <- api: "Push notification";
api <-> auth: "Verify / Result";
users_db - orders_db: "Shared cluster";
auth -> users_db;
api -> orders_db;
api -> cache;
```

*Source: [component_basic.orr](https://github.com/orreryworks/orrery/blob/main/examples/component_basic.orr)*

## All Shape Types

Content-supporting shapes (Rectangle, Oval, Component) and content-free shapes (Actor, Entity, Control, Interface, Boundary).

```orrery
diagram component;

// Content-supporting shapes
rect as "Rectangle": Rectangle [fill_color="#e3f2fd", rounded=5];
oval as "Oval": Oval [fill_color="#fce4ec"];
comp as "UML Component": Component [fill_color="#e8f5e9"];

container as "Service Container": Rectangle [fill_color="#f5f5f5"] {
    inner_api: Rectangle [fill_color="#fff9c4"];
    inner_db: Rectangle [fill_color="#c8e6c9", rounded=8];
    inner_api -> inner_db;
};

// Content-free shapes
customer as "Customer": Actor;
account as "Account": Entity;
auth_logic as "Auth Logic": Control;
rest_api as "REST API": Interface;
external as "External System": Boundary;

customer -> rest_api: "Request";
rest_api -> auth_logic: "Authenticate";
auth_logic -> account: "Validate";
account -> external: "Sync";
rect -> container;
oval -> comp;
```

*Source: [component_shapes.orr](https://github.com/orreryworks/orrery/blob/main/examples/component_shapes.orr)*

## Nesting and Cross-Level Relations

Multi-level hierarchy with `::` syntax for cross-level references.

```orrery
diagram component;

type Service = Rectangle [fill_color="#e6f3ff", rounded=5];
type Database = Rectangle [fill_color="#e0f0e0", rounded=10];

backend: Rectangle [fill_color="#f5f5f5"] {
    api: Service;
    auth: Service;
    api -> auth;
};

platform: Rectangle [fill_color="#fafafa"] {
    gateway: Service;

    services: Rectangle [fill_color="#f0f0f0"] {
        users: Service;
        orders: Service;
        users -> orders;
    };

    data: Rectangle [fill_color="#f0f0f0"] {
        primary_db: Database;
        replica_db: Database;
        primary_db -> replica_db: "Replication";
    };

    gateway -> services;
    services -> data;
};

monitoring: Service;
monitoring -> platform::gateway;
monitoring -> platform::data::primary_db;
platform::services::orders -> monitoring: "Metrics";
backend -> platform;
```

*Source: [component_nesting.orr](https://github.com/orreryworks/orrery/blob/main/examples/component_nesting.orr)*
