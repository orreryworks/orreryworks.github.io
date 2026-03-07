# Diagrams

Every Orrery file defines a single diagram. The diagram declaration is the first statement and determines what kind of diagram you are creating.

## Declaration

```orrery-norender
diagram <kind> [attributes];
```

The `kind` is either `component` or `sequence`.

```orrery
diagram component;

frontend: Rectangle;
backend: Rectangle;
frontend -> backend;
```

## Diagram kinds

### Component diagrams

Component diagrams show the structural parts of a system and how they connect.

```orrery
diagram component;

type Service = Rectangle [fill_color="#e6f3ff", rounded=5];
type Database = Rectangle [fill_color="#e0f0e0", rounded=10];

api as "API Gateway": Service;
auth as "Auth Service": Service;
db as "Users DB": Database;

api -> auth: "Validate";
auth -> db: "Query";
```

Component diagrams support:
- All [shape types](components.md) (Rectangle, Oval, Component, Actor, Entity, Control, Interface, Boundary)
- [Nesting](components.md#nesting) components inside other components
- [Embedded diagrams](#embedded-diagrams) inside components
- Layout engines: `basic` (default) and `sugiyama`

### Sequence diagrams

Sequence diagrams show interactions between participants over time. Time flows downward.

```orrery
diagram sequence;

client: Rectangle;
server: Rectangle;
database: Rectangle;

client -> server: "POST /login";
server -> database: "SELECT user";
database -> server: "User row";
server -> client: "200 OK";
```

Sequence diagrams support:
- [Activation](activation.md) blocks on lifelines
- [Fragments](fragments.md) for conditional and looping flows (alt, opt, loop, par, break, critical)
- [Notes](notes.md) attached to participants or placed in margins

## Diagram attributes

Attributes are specified in square brackets after the kind:

```orrery
diagram component [background_color="#f5f5f5", layout_engine="sugiyama"];

api: Rectangle [fill_color="#e6f3ff"];
db: Rectangle [fill_color="#e0f0e0"];
api -> db;
```

| Attribute | Type | Description | Applies to |
|-----------|------|-------------|------------|
| `background_color` | [`color`](styling.md#colors) | Background color of the diagram | Both |
| `layout_engine` | string | Layout algorithm: `"basic"` or `"sugiyama"` | Both (sugiyama only for component) |

These can also be set in the [configuration file](../cli/configuration.md) as defaults.

## Layout engines

Orrery supports two layout engines for positioning elements:

- **`basic`** — Simple deterministic positioning. Available for both component and sequence diagrams. This is the default.
- **`sugiyama`** — Hierarchical layered layout that arranges nodes in layers to minimize edge crossings. Available for component diagrams only.

```orrery
diagram component [background_color="#f5f5f5"];

type Service = Rectangle [fill_color="#e6f3ff", rounded=5];
type Database = Rectangle [fill_color="#e0f0e0", rounded=10];

basic_view as "Basic Layout": Rectangle embed diagram component [layout_engine="basic", background_color="#ffffff"] {
    gw as "Gateway": Service;
    auth as "Auth": Service;
    users as "Users": Service;
    db as "DB": Database;

    gw -> auth;
    gw -> users;
    auth -> db;
    users -> db;
};

sugiyama_view as "Sugiyama Layout": Rectangle embed diagram component [layout_engine="sugiyama", background_color="#ffffff"] {
    gw as "Gateway": Service;
    auth as "Auth": Service;
    users as "Users": Service;
    db as "DB": Database;

    gw -> auth;
    gw -> users;
    auth -> db;
    users -> db;
};

basic_view -> sugiyama_view: "Compare";
```

## Embedded diagrams

A component can contain an entire diagram inside it using the `embed` keyword. This lets you show the internal behavior or structure of a component. Only [content-supporting shapes](components.md#content-supporting-shapes) support embedding.

```orrery-norender
name [as "Label"]: Type [attributes] embed diagram <kind> [diagram_attributes] {
    // diagram contents
};
```

Embedded diagrams follow the syntax and layout rules of their declared kind and can have their own `background_color` and `layout_engine` attributes.

### Sequence diagram inside a component

Show the internal message flow of a service:

```orrery
diagram component;

type Service = Rectangle [fill_color="#e6f3ff", rounded=5];

auth_service as "Auth Service": Service embed diagram sequence {
    client: Rectangle [fill_color="#fff0e0"];
    validator: Rectangle [fill_color="#e6f3ff"];
    token_store: Rectangle [fill_color="#e0f0e0"];

    client -> validator: "Credentials";
    activate validator {
        validator -> token_store: "Lookup user";
        token_store -> validator: "User record";
        validator -> client: "JWT token";
    };
};

gateway as "API Gateway": Service;
gateway -> auth_service: "Authenticate";
```

### Component diagram inside a component

Show the internal architecture of a service:

```orrery
diagram component;

type Service = Rectangle [fill_color="#e6f3ff", rounded=5];

order_service as "Order Service": Service embed diagram component [layout_engine="basic", background_color="#fafafa"] {
    api as "API Layer": Component [fill_color="#e6f3ff"];
    validation as "Validation": Component [fill_color="#fff3cd"];
    persistence as "Persistence": Component [fill_color="#e0f0e0"];

    api -> validation: "Validate";
    validation -> persistence: "Store";
};

gateway as "API Gateway": Service;
gateway -> order_service: "Place order";
```

### Embedded diagrams in sequence participants

Sequence diagram participants can also embed diagrams:

```orrery
diagram sequence;

api_node as "API Server": Rectangle embed diagram component [layout_engine="basic", background_color="#f8f8ff"] {
    router as "Router": Rectangle [fill_color="#e6f3ff", rounded=3];
    handler as "Handler": Rectangle [fill_color="#e0f0e0", rounded=3];
    router -> handler: "Dispatch";
};

db as "Database": Rectangle [fill_color="#e0f0e0"];

api_node -> db: "Query";
db -> api_node: "Results";
```


## Comments

Orrery supports line comments with `//`:

```orrery-norender
// This is a comment
diagram component; // inline comment
```

## Document structure

A complete Orrery document follows this order:

1. Diagram declaration
2. Type definitions (optional)
3. Elements (components, relations, fragments, notes, etc.)

```orrery
diagram component [background_color="#f8f8f8"];

// Type definitions
type Service = Rectangle [fill_color="#e6f3ff", rounded=5];
type Database = Rectangle [fill_color="#e0f0e0", rounded=10];

// Elements
api as "API": Service;
db as "DB": Database;
api -> db: "SQL";
```
