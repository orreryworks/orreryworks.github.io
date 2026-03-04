# Activation

Activation represents periods when a participant is actively processing — the "focus of control" in sequence diagrams. Visually, it appears as a rectangle on the participant's lifeline.

Activation is only available in sequence diagrams.

## Syntax

Block form:

```orrery-norender
activate [@TypeSpec] [attributes] component_name {
    // interactions
};
```

Explicit form:

```orrery-norender
activate [@TypeSpec] [attributes] component_name;
deactivate component_name;
```

## Block form

The block form groups related interactions within curly braces. This is the recommended form when activations nest cleanly (each one fully contains or is fully contained by another):

```orrery
diagram sequence;

client: Rectangle;
server: Rectangle;
db: Rectangle;

activate client {
    client -> server: "POST /checkout";

    activate server {
        server -> db: "INSERT order";
        db -> server: "Order ID";
        server -> client: "201 Created";
    };
};
```

## Explicit form

The explicit form uses separate `activate` and `deactivate` statements:

```orrery
diagram sequence;

type AsyncArrow = Arrow [stroke=[color="#888888", style="dashed"]];

client: Rectangle;
server: Rectangle;
worker: Rectangle;

client -> server: "POST /export";
activate server;
server -> @AsyncArrow worker: "Start export job";
activate worker;
worker -> worker: "Process rows";
server -> client: "202 Accepted";
deactivate server;
worker -> @AsyncArrow client: "Export ready";
deactivate worker;
```

Use the explicit form when activations overlap without one containing the other. In the example above, `server` and `worker` are both active concurrently, but neither activation fully contains the other — this cannot be expressed with nested block form.

The two forms are interchangeable. Internally, block form is desugared into explicit statements.

## Nested activation

Activation can be nested across different participants:

```orrery
diagram sequence;

type Participant = Rectangle [fill_color="#e6f3ff", stroke=[color="#336699"]];
type Store = Rectangle [fill_color="#e0f0e0", stroke=[color="#339966"], rounded=8];

client as "Browser": Participant;
api as "API Gateway": Participant;
auth as "Auth Service": Participant;
db as "Database": Store;

activate client {
    client -> api: "POST /checkout";

    activate api {
        api -> auth: "Verify session";

        activate auth {
            auth -> db: "SELECT session";

            activate db {
                db -> db: "Validate TTL";
                db -> auth: "Session valid";
            };

            auth -> api: "Token refreshed";
        };

        api -> db: "INSERT order";
        db -> api: "Order ID";
        api -> client: "201 Created";
    };
};
```

## Stacked activation

The same participant can have multiple activation levels stacked:

```orrery
diagram sequence;

type RequestArrow = Arrow [stroke=[color="steelblue", width=1.5]];
type ResponseArrow = Arrow [stroke=[color="seagreen", style="dashed"]];

client: Rectangle;
api: Rectangle;
auth: Rectangle;
db: Rectangle;

activate api {
    client -> @RequestArrow api: "POST /payment";
    api -> @RequestArrow db: "Check balance";
    db -> @ResponseArrow api: "Balance OK";

    activate api {
        api -> @RequestArrow auth: "Fraud check";
        auth -> @ResponseArrow api: "Cleared";

        activate api {
            api -> @RequestArrow db: "INSERT transaction";
            db -> @ResponseArrow api: "Transaction ID";
        };
    };

    api -> @ResponseArrow client: "Payment confirmed";
};
```

Each nested `activate` on the same participant adds another layer to the activation box.

## Styling

Customize activation appearance with `fill_color` and `stroke`:

```orrery
diagram sequence;

type CriticalActivation = Activate [fill_color="rgba(255,180,180,0.4)", stroke=[color="red", width=2.0]];
type HighlightActivation = Activate [fill_color="rgba(180,200,255,0.3)"];

api: Rectangle;
db: Rectangle;

activate @CriticalActivation api {
    api -> db: "DELETE cascade";
    db -> api: "Purged";
};

activate @HighlightActivation api {
    api -> db: "ANALYZE tables";
    db -> api: "Statistics updated";
};
```

### Activation attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `fill_color` | [`color`](styling.md#colors) | Background color of the activation box |
| `stroke` | [`Stroke`](styling.md#stroke) | Border styling |

## Typed activations

Define reusable activation types with `type`, then apply them with `@`:

```orrery
diagram sequence;

type CriticalActivation = Activate [fill_color="rgba(255,180,180,0.4)", stroke=[color="red", width=2.0]];

client: Rectangle;
api: Rectangle;
db: Rectangle;

// Named type
activate @CriticalActivation api {
    api -> db: "DELETE cascade";
    db -> api: "Purged";
};

// Anonymous type (inline)
activate @Activate[fill_color="rgba(255,240,200,0.4)", stroke=[color="orange"]] api {
    api -> db: "Rotate encryption keys";
    db -> api: "Keys rotated";
};
```

When `@TypeSpec` is omitted, it defaults to `@Activate`:

```orrery-norender
activate server { };                          // same as: activate @Activate server { };
activate [fill_color="red"] server { };       // same as: activate @Activate[fill_color="red"] server { };
```

## Scoping behavior

Activation blocks do **not** create component namespaces. Unlike [nesting](components.md#nesting) in component diagrams, identifiers remain flat:

```orrery-norender
// Correct — flat naming
activate server {
    client -> server: "Request";
};

// Incorrect — no namespace scoping in activation blocks
// server::client  ← this does not work
```

## Combining with fragments and notes

Activation blocks can contain [fragments](fragments.md) and [notes](notes.md):

```orrery
diagram sequence;

type InfoNote = Note [background_color="#d1ecf1", stroke=[color="#0c5460"], text=[color="#0c5460", font_size=12]];
type WarningNote = Note [background_color="#fff3cd", stroke=[color="orange", width=2.0], text=[color="#856404"]];

client: Rectangle;
api: Rectangle;
db: Rectangle;

client -> api: "GET /dashboard";

activate api {
    note @InfoNote [on=[api]]: "Rate limiter: 42/100 requests used";

    alt "cache hit" {
        api -> client: "Cached dashboard";
    } else "cache miss" {
        api -> db: "SELECT dashboard_data";
        note @WarningNote [on=[db]]: "Slow query: full table scan";
        db -> api: "Result set";
        api -> client: "Fresh dashboard";
    };
};
```
