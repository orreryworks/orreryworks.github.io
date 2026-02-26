# Sequence Diagram Examples

These examples demonstrate progressively more complex sequence diagrams. Each shows the source `.orr` code. You can render any example locally with:

```bash
orrery example.orr -o output.svg
```

All source files are available in the [examples directory on GitHub](https://github.com/orreryworks/orrery/tree/main/examples).

## Basic Messages and Types

Custom participant types, arrow types, self-messages, and all four relation directions.

```text
diagram sequence;

type Participant = Rectangle[fill_color="#e6f3ff", stroke=[color="#336699"]];
type Store = Rectangle[fill_color="#e0f0e0", stroke=[color="#339966"], rounded=8];
type AsyncArrow = Arrow[stroke=[color="#888888", style="dashed"]];
type ErrorArrow = Arrow[stroke=[color="#cc3333", width=2.0]];

client as "Browser": Participant;
api as "API Gateway": Participant;
auth as "Auth Service": Participant;
db as "Database": Store;

client -> api: "POST /login";
api -> [stroke=[color="blue"]] auth: "Validate credentials";
auth -> [text=[color="darkgreen"]] db: "SELECT user WHERE email = ?";
db -> auth: "User row";
auth -> [stroke=[color="green"], text=[color="green"]] api: "JWT token";
api -> client: "200 OK";

client <- @AsyncArrow api: "SSE push event";
api <-> [stroke=[color="purple"]] auth: "Healthcheck";
auth - [stroke=[style="dotted", color="gray"]] db: "Connection pool";
api -> [stroke=[color="orange"]] api: "Rate limit check";

client -> @ErrorArrow api: "Malformed request";
api -> @ErrorArrow client: "400 Bad Request";
```

*Source: [sequence_basic.orr](https://github.com/orreryworks/orrery/blob/main/examples/sequence_basic.orr)*

## Activation Blocks

Block-form activation, nested activation, stacked activation, explicit activate/deactivate statements, and custom activation types.

```text
diagram sequence;

type Participant = Rectangle[fill_color="#e6f3ff", stroke=[color="#336699"]];
type Store = Rectangle[fill_color="#e0f0e0", stroke=[color="#339966"], rounded=8];
type RequestArrow = Arrow[stroke=[color="steelblue", width=1.5]];
type ResponseArrow = Arrow[stroke=[color="seagreen", style="dashed"]];
type CriticalActivation = Activate[fill_color="rgba(255,180,180,0.4)", stroke=[color="red", width=2.0]];

client as "Browser": Participant;
api as "API Gateway": Participant;
auth as "Auth Service": Participant;
db as "Database": Store;

// Deep nesting
activate client {
    client -> @RequestArrow api: "POST /checkout";
    activate api {
        api -> @RequestArrow auth: "Verify session";
        activate auth {
            auth -> @RequestArrow db: "SELECT session";
            activate db {
                db -> db: "Validate TTL";
                db -> @ResponseArrow auth: "Session valid";
            };
            auth -> @ResponseArrow api: "Token refreshed";
        };
        api -> @RequestArrow db: "INSERT order";
        db -> @ResponseArrow api: "Order ID";
        api -> @ResponseArrow client: "201 Created";
    };
};

// Explicit statements for async flow
activate client;
client -> @RequestArrow api: "Start export job";
deactivate client;

activate api;
api -> @RequestArrow db: "SELECT * FROM records";
activate db;
db -> db: "Stream rows";
db -> @ResponseArrow api: "Result set";
deactivate db;
api -> @ResponseArrow client: "Export ready";
deactivate api;

// Custom activation type
activate @CriticalActivation api {
    api -> @RequestArrow auth: "Revoke tokens";
    auth -> @ResponseArrow api: "Revoked";
};
```

*Source: [sequence_activation.orr](https://github.com/orreryworks/orrery/blob/main/examples/sequence_activation.orr) (trimmed)*

## Fragments

All fragment keywords (alt/else, opt, loop, par, break, critical), nested fragments with activation, and custom fragment styling.

```text
diagram sequence;

type Participant = Rectangle[fill_color="#e6f3ff", stroke=[color="#336699"]];
type Store = Rectangle[fill_color="#e0f0e0", stroke=[color="#339966"], rounded=8];
type RequestArrow = Arrow[stroke=[color="steelblue", width=1.5]];
type ResponseArrow = Arrow[stroke=[color="seagreen", style="dashed"]];
type ErrorArrow = Arrow[stroke=[color="#cc3333", width=2.0]];
type SecurityFragment = Fragment[background_color="rgba(255,220,220,0.15)", border_stroke=[color="red", width=2.0]];

client as "Browser": Participant;
server as "API Server": Participant;
db as "Database": Store;
cache as "Cache": Store;

// alt/else with custom fragment type
alt @SecurityFragment "valid session" {
    client -> @RequestArrow server: "Request with JWT";
    server -> @ResponseArrow client: "Protected resource";
} else "expired session" {
    client -> @RequestArrow server: "Request with stale JWT";
    server -> @ErrorArrow client: "401 Unauthorized";
};

// loop with styled border
loop [border_stroke=[color="purple"]] "for each page 1..N" {
    client -> @RequestArrow server: "GET /items?page=N";
    server -> @RequestArrow db: "SELECT LIMIT 50 OFFSET N";
    db -> @ResponseArrow server: "Page rows";
    server -> @ResponseArrow client: "JSON page";
};

// par - parallel execution
par "fetch user profile" {
    server -> @RequestArrow db: "SELECT user";
    db -> @ResponseArrow server: "User row";
} par "fetch preferences" {
    server -> @RequestArrow cache: "GET prefs";
    cache -> @ResponseArrow server: "Preferences";
};

// critical with custom styling
critical [background_color="rgba(255,255,200,0.2)", border_stroke=[color="goldenrod", width=2.0]] "payment transaction" {
    server -> @RequestArrow db: "BEGIN";
    server -> @RequestArrow db: "UPDATE balance";
    server -> @RequestArrow db: "INSERT ledger_entry";
    server -> @RequestArrow db: "COMMIT";
};

// Nested fragments with activation
alt "order placed" {
    client -> @RequestArrow server: "POST /order";
    activate server {
        critical "inventory reservation" {
            server -> @RequestArrow db: "UPDATE stock SET qty = qty - 1";
            db -> @ResponseArrow server: "Row updated";
        };
        opt "loyalty member" {
            server -> @RequestArrow db: "INSERT reward_points";
        };
        server -> @ResponseArrow client: "201 Created";
    };
} else "validation failed" {
    client -> @RequestArrow server: "POST /order (invalid)";
    server -> @ErrorArrow client: "422 Unprocessable Entity";
};
```

*Source: [sequence_fragments.orr](https://github.com/orreryworks/orrery/blob/main/examples/sequence_fragments.orr)*
