# Fragments

Fragments group related interactions in sequence diagrams into labeled sections. They represent conditional logic, loops, parallel execution, and other structured flows.

Fragments are only available in sequence diagrams.

## Syntax

Sugar form (recommended):

```orrery-norender
keyword [@TypeSpec] [attributes] "guard" {
    // interactions
};
```

Base form with explicit sections:

```orrery-norender
fragment [@TypeSpec] [attributes] "operation" {
    section "title" {
        // interactions
    };
};
```

## Sugar keywords

Orrery provides dedicated keywords for common UML interaction patterns. These are the recommended way to write fragments.

### alt/else — Alternatives

Conditional branching with mutually exclusive paths:

```orrery
diagram sequence;

client: Rectangle;
server: Rectangle;

alt "valid session" {
    client -> server: "Request with JWT";
    server -> client: "Protected resource";
} else "expired session" {
    client -> server: "Request with stale JWT";
    server -> client: "401 Unauthorized";
};
```

You can have multiple `else` branches:

```orrery
diagram sequence;

client: Rectangle;
server: Rectangle;

alt "200 OK" {
    server -> client: "Data";
} else "404 Not Found" {
    server -> client: "Resource not found";
} else "500 Error" {
    server -> client: "Internal server error";
};
```

### opt — Optional

A single conditional path that may or may not execute:

```orrery
diagram sequence;

server: Rectangle;
cache: Rectangle;

opt "cache warm" {
    server -> cache: "GET session";
    cache -> server: "Session data";
};
```

### loop — Iteration

Repeated execution with a guard condition:

```orrery
diagram sequence;

client: Rectangle;
server: Rectangle;
db: Rectangle;

loop "for each page 1..N" {
    client -> server: "GET /items?page=N";
    server -> db: "SELECT LIMIT 50 OFFSET N";
    db -> server: "Page rows";
    server -> client: "JSON page";
};
```

### par — Parallel

Concurrent execution of multiple paths:

```orrery
diagram sequence;

server: Rectangle;
db: Rectangle;
cache: Rectangle;

par "fetch user profile" {
    server -> db: "SELECT user";
    db -> server: "User row";
} par "fetch preferences" {
    server -> cache: "GET prefs";
    cache -> server: "Preferences";
};
```

### break — Interruption

Breaking out of an enclosing fragment:

```orrery
diagram sequence;

server: Rectangle;
client: Rectangle;

break "rate limit exceeded" {
    server -> client: "429 Too Many Requests";
};
```

### critical — Critical region

An atomic execution region that must not be interleaved:

```orrery
diagram sequence;

server: Rectangle;
db: Rectangle;

critical "payment transaction" {
    server -> db: "BEGIN";
    server -> db: "UPDATE balance";
    server -> db: "INSERT ledger_entry";
    server -> db: "COMMIT";
};
```

## Base fragment syntax

For custom operations or when you need explicit control, use the base `fragment` syntax with sections. Section titles are optional:

```orrery
diagram sequence;

client: Rectangle;
server: Rectangle;
cache: Rectangle;
db: Rectangle;

fragment "Request Handling" {
    section "cache hit" {
        client -> server: "GET /products";
        server -> cache: "Lookup key";
        cache -> server: "Cached response";
        server -> client: "200 OK";
    };
    section "cache miss" {
        server -> db: "SELECT products";
        db -> server: "Result set";
        server -> cache: "SET key";
        server -> client: "200 OK";
    };
};
```

The sugar keywords desugar to this base syntax. For example, `alt "cond1" { } else "cond2" { }` becomes `fragment "alt" { section "cond1" { }; section "cond2" { }; }`.

## Nesting

Fragments can be nested inside other fragments and [activation](activation.md) blocks:

```orrery
diagram sequence;

type RequestArrow = Arrow [stroke=[color="steelblue", width=1.5]];
type ResponseArrow = Arrow [stroke=[color="seagreen", style="dashed"]];
type ErrorArrow = Arrow [stroke=[color="#cc3333", width=2.0]];

client: Rectangle;
server: Rectangle;
db: Rectangle;

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

## Styling

Fragment appearance can be customized with attributes:

```orrery
diagram sequence;

server: Rectangle;
db: Rectangle;

critical [background_color="rgba(255,255,200,0.2)", border_stroke=[color="goldenrod", width=2.0]] "payment transaction" {
    server -> db: "BEGIN";
    server -> db: "UPDATE balance";
    server -> db: "COMMIT";
};
```

### Fragment attributes

| Attribute | Type | Description |
|-----------|------|-------------|
| `border_stroke` | [`Stroke`](styling.md#stroke) | Outer border styling |
| `separator_stroke` | [`Stroke`](styling.md#stroke) | Section divider line styling |
| `background_color` | [`color`](styling.md#colors) | Background color of the fragment |
| `content_padding` | float | Padding around fragment content |
| `operation_label_text` | [`Text`](styling.md#text) | Text styling for the operation label (e.g. "alt", "loop") |
| `section_title_text` | [`Text`](styling.md#text) | Text styling for section titles |

## Typed fragments

Define reusable fragment types with `type`, then apply them with `@`:

```orrery
diagram sequence;

type SecurityFragment = Fragment [background_color="rgba(255,220,220,0.15)", border_stroke=[color="red", width=2.0]];

client: Rectangle;
server: Rectangle;

alt @SecurityFragment "valid session" {
    client -> server: "Request with JWT";
    server -> client: "Protected resource";
} else "expired session" {
    client -> server: "Request with stale JWT";
    server -> client: "401 Unauthorized";
};
```

When `@TypeSpec` is omitted, it defaults to `@Fragment`. You can also use anonymous types inline:

```orrery-norender
opt @Fragment[background_color="rgba(220,240,255,0.15)"] "cache warm" { ... };
```

## Keyword reference

| Keyword | Sections | Description |
|---------|----------|-------------|
| `alt`/`else` | One `alt` + zero or more `else` | Conditional branching |
| `opt` | Single | Optional execution |
| `loop` | Single | Repeated execution |
| `par` | One or more `par` | Parallel execution |
| `break` | Single | Interruption / break out of enclosing fragment |
| `critical` | Single | Atomic execution region |
| `fragment` | One or more `section` | Generic fragment with explicit sections |
