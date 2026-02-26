# Sequence Diagrams

Sequence diagrams model interactions between participants over time. Messages flow downward in the order they appear in the source.

## Basic structure

```text
diagram sequence;

client: Rectangle;
server: Rectangle;
database: Rectangle;

client -> server: "POST /login";
server -> database: "SELECT user";
database -> server: "User record";
server -> client: "200 OK";
```

Participants are arranged horizontally. Each has a lifeline extending downward, and messages appear as horizontal arrows between them.

## Participants and types

Participants are declared the same way as components — with an identifier, optional display name, and a type:

```text
diagram sequence;

type Service = Rectangle [fill_color="#e6f3ff", stroke=[color="#336699"]];
type Store = Rectangle [fill_color="#e0f0e0", rounded=8];

client as "Browser": Service;
api as "API Gateway": Service;
db as "Database": Store;

client -> api: "Request";
api -> db: "Query";
```

## Relation types

The same four relation types work in sequence diagrams:

```text
client -> server: "Request";       // forward arrow
client <- server: "Push event";    // backward arrow
client <-> server: "Healthcheck";  // bidirectional
client - server: "Connection pool"; // plain line
```

## Self-messages

A participant can send a message to itself:

```text
api -> api: "Rate limit check";
```

## Activation blocks

Activation marks when a participant is actively processing. Use the block form to group related messages:

```text
diagram sequence;

client: Rectangle;
server: Rectangle;
db: Rectangle;

activate client {
    client -> server: "Request";

    activate server {
        server -> db: "Query";
        db -> server: "Result";
        server -> client: "Response";
    };
};
```

Activation blocks can be nested to any depth. The visual result is stacked rectangles on the lifeline.

### Explicit activate/deactivate

For cases where activation doesn't fit neatly into blocks (e.g., asynchronous flows), use explicit statements:

```text
activate client;
client -> server: "Start export job";
deactivate client;

// Server works independently later
activate server;
server -> db: "SELECT * FROM records";
server -> client: "Export ready";
deactivate server;
```

### Custom activation types

```text
type CriticalActivation = Activate [
    fill_color="rgba(255,180,180,0.4)",
    stroke=[color="red", width=2.0]
];

activate @CriticalActivation server {
    server -> db: "DELETE cascade";
};
```

## Fragments

Fragments group related interactions into labeled sections. Orrery provides sugar keywords for common UML interaction operators.

### alt/else — conditional branching

```text
alt "valid token" {
    client -> server: "Request";
    server -> client: "200 OK";
} else "invalid token" {
    client -> server: "Request";
    server -> client: "401 Unauthorized";
};
```

### opt — optional execution

```text
opt "cache hit" {
    server -> cache: "Lookup";
    cache -> server: "Cached data";
};
```

### loop — iteration

```text
loop "for each page" {
    client -> server: "GET /items?page=N";
    server -> client: "Page data";
};
```

### par — parallel execution

```text
par "fetch user data" {
    server -> db: "SELECT users";
} par "fetch settings" {
    server -> db: "SELECT settings";
};
```

### break — interruption

```text
break "rate limit exceeded" {
    server -> client: "429 Too Many Requests";
};
```

### critical — atomic region

```text
critical "payment transaction" {
    server -> db: "BEGIN";
    server -> db: "UPDATE balance";
    server -> db: "COMMIT";
};
```

### Nesting fragments

Fragments can be nested inside other fragments and combined with activation:

```text
alt "order placed" {
    client -> server: "POST /order";

    activate server {
        critical "inventory reservation" {
            server -> db: "UPDATE stock";
        };

        opt "loyalty member" {
            server -> db: "INSERT reward_points";
        };

        server -> client: "201 Created";
    };
} else "validation failed" {
    server -> client: "422 Unprocessable Entity";
};
```

### Styling fragments

```text
alt [background_color="rgba(255,220,220,0.15)", border_stroke=[color="red"]] "auth check" {
    client -> server: "Authenticated request";
} else "rejected" {
    server -> client: "Forbidden";
};
```

Available fragment attributes: `background_color`, `border_stroke`, `separator_stroke`, `content_padding`, `operation_label_text`, `section_title_text`.

## Notes

Add annotations to specific participants:

```text
note [on=[server]]: "Handles authentication";
note [on=[db], align="right"]: "Read replica";
```

See the [Notes reference](../reference/notes.md) for the full syntax.

## Next steps

- [Type System](type-system.md) — reusable types and composition
- [Styling](styling.md) — colors, strokes, and text formatting
- [Language Specification](../reference/specification.md) — complete reference
