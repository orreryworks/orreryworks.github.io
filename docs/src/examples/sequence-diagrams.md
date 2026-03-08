# Sequence Diagram Examples

All source files are available in the [examples directory on GitHub](https://github.com/orreryworks/orrery/tree/main/examples).

## Basic Messages and Types

Custom participant types, arrow types, self-messages, and all four relation directions.

```orrery
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
client -> @AsyncArrow api: "WebSocket upgrade";
```

*Source: [sequence_basic.orr](https://github.com/orreryworks/orrery/blob/main/examples/sequence_basic.orr)*

## Activation Blocks

Block-form activation, nested activation, stacked activation, explicit activate/deactivate statements, and custom activation types.

```orrery
diagram sequence;

type Participant = Rectangle[fill_color="#e6f3ff", stroke=[color="#336699"]];
type Store = Rectangle[fill_color="#e0f0e0", stroke=[color="#339966"], rounded=8];
type RequestArrow = Arrow[stroke=[color="steelblue", width=1.5]];
type ResponseArrow = Arrow[stroke=[color="seagreen", style="dashed"]];
type CriticalActivation = Activate[fill_color="rgba(255,180,180,0.4)", stroke=[color="red", width=2.0]];
type HighlightActivation = Activate[fill_color="rgba(180,200,255,0.3)"];

client as "Browser": Participant;
api as "API Gateway": Participant;
auth as "Auth Service": Participant;
db as "Database": Store;

// Block form with deep nesting
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
    activate db {
        db -> @ResponseArrow api: "Order ID";
    };

    api -> @ResponseArrow client: "201 Created";
};

// Stacked activation (same participant)
client -> @RequestArrow api: "POST /payment";
activate api {
    api -> @RequestArrow db: "Check balance";
    db -> @ResponseArrow api: "Balance OK";

    api -> @RequestArrow auth: "Fraud check";
    activate api {
        auth -> @ResponseArrow api: "Cleared";

        api -> @RequestArrow db: "INSERT transaction";
        activate api {
            db -> @ResponseArrow api: "Transaction ID";
        };
    };

    api -> @ResponseArrow client: "Payment confirmed";
};

// Explicit statements
client -> @RequestArrow api: "Start export job";

activate api;
api -> @RequestArrow db: "SELECT * FROM records";
activate db;
db -> db: "Stream rows";
db -> @ResponseArrow api: "Result set";
deactivate db;
api -> @ResponseArrow client: "Export ready";
deactivate api;

// Mixed: explicit outer + block inner
client -> @RequestArrow api: "DELETE /account";
activate client;

activate @CriticalActivation api {
    api -> @RequestArrow auth: "Revoke tokens";
    auth -> @ResponseArrow api: "Revoked";

    api -> @RequestArrow db: "DELETE cascade";
    activate @CriticalActivation db {
        db -> @ResponseArrow api: "Purged";
    };

    api -> @ResponseArrow client: "Account deleted";
};

deactivate client;

// Custom activation types
api -> @RequestArrow db: "ANALYZE tables";
activate @HighlightActivation db {
    db -> @ResponseArrow api: "Statistics updated";
};

// Anonymous TypeSpec
auth -> @RequestArrow db: "Rotate encryption keys";
activate @Activate[fill_color="rgba(255,240,200,0.4)", stroke=[color="orange"]] db {
    db -> @ResponseArrow auth: "Keys rotated";
};
```

*Source: [sequence_activation.orr](https://github.com/orreryworks/orrery/blob/main/examples/sequence_activation.orr)*

## Fragments

All fragment keywords (alt/else, opt, loop, par, break, critical), nested fragments with activation, and custom fragment styling.

```orrery
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

// Base fragment syntax
fragment "Request Handling" {
    section "cache hit" {
        client -> @RequestArrow server: "GET /products";
        server -> @RequestArrow cache: "Lookup key";
        cache -> @ResponseArrow server: "Cached response";
        server -> @ResponseArrow client: "200 OK";
    };
    section "cache miss" {
        server -> @RequestArrow db: "SELECT products";
        db -> @ResponseArrow server: "Result set";
        server -> @RequestArrow cache: "SET key";
        server -> @ResponseArrow client: "200 OK";
    };
};

// alt/else with custom fragment type
alt @SecurityFragment "valid session" {
    client -> @RequestArrow server: "Request with JWT";
    server -> @ResponseArrow client: "Protected resource";
} else "expired session" {
    client -> @RequestArrow server: "Request with stale JWT";
    server -> @ErrorArrow client: "401 Unauthorized";
};

// opt
opt [background_color="rgba(220,240,255,0.15)"] "cache warm" {
    server -> @RequestArrow cache: "GET session";
    cache -> @ResponseArrow server: "Session data";
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

// break
break [border_stroke=[color="red", style="dashed"]] "rate limit exceeded" {
    server -> @ErrorArrow client: "429 Too Many Requests";
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

## Notes

Attached notes, spanning notes, margin notes, alignment, custom note types, and notes inside activation blocks and fragments.

```orrery
diagram sequence;

type Participant = Rectangle[fill_color="#e6f3ff", stroke=[color="#336699"]];
type Store = Rectangle[fill_color="#e0f0e0", stroke=[color="#339966"], rounded=8];
type WarningNote = Note[background_color="#fff3cd", stroke=[color="orange", width=2.0], text=[color="#856404"]];
type ErrorNote = Note[background_color="#f8d7da", stroke=[color="red", width=2.0], text=[color="#721c24"]];
type InfoNote = Note[background_color="#d1ecf1", stroke=[color="#0c5460"], text=[color="#0c5460", font_size=12]];
type RequestArrow = Arrow[stroke=[color="steelblue", width=1.5]];
type ResponseArrow = Arrow[stroke=[color="seagreen", style="dashed"]];

client as "Browser": Participant;
api as "API Gateway": Participant;
auth as "Auth Service": Participant;
db as "Database": Store;

// Attached notes with alignment
note [on=[client], align="right"]: "SPA client with local token cache";
note [on=[db], align="left"]: "PostgreSQL 16 cluster";

client -> @RequestArrow api: "POST /login";
note [on=[api]]: "Validating request schema";

// Spanning notes
api -> @RequestArrow auth: "Verify credentials";
note [on=[api, auth, db]]: "Authentication boundary";

auth -> @RequestArrow db: "SELECT user WHERE email = ?";
db -> @ResponseArrow auth: "User row";

// Margin notes
note [align="left"]: "Left margin: audit trail";
note [align="right"]: "Right margin: latency budget 250ms";

// Over all participants
note: "System-wide maintenance window 02:00\u{2013}04:00 UTC";

auth -> @ResponseArrow api: "JWT issued";

// Custom note types
note @WarningNote [on=[api]]: "Token cache nearing capacity";
note @ErrorNote [on=[db]]: "Replication lag > 5s";
note @InfoNote [on=[auth, db]]: "mTLS connection established";

api -> @ResponseArrow client: "200 OK + token";

// Notes inside activation and fragments
client -> @RequestArrow api: "GET /dashboard";
activate api {
    note @InfoNote [on=[api]]: "Rate limiter: 42/100 requests used";

    alt "cache hit" {
        api -> @ResponseArrow client: "Cached dashboard";
    } else "cache miss" {
        api -> @RequestArrow db: "SELECT dashboard_data";
        note @WarningNote [on=[db]]: "Slow query: full table scan";
        db -> @ResponseArrow api: "Result set";
        api -> @ResponseArrow client: "Fresh dashboard";
    };
};
```

*Source: [sequence_notes.orr](https://github.com/orreryworks/orrery/blob/main/examples/sequence_notes.orr)*
