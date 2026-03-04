# Cross-Cutting Examples

All source files are available in the [examples directory on GitHub](https://github.com/orreryworks/orrery/tree/main/examples).

## Type System

Type declarations, attribute group types (Stroke, Text), type extension, named and anonymous invocations, and syntactic sugar.

```orrery
diagram sequence;

// Attribute group types
type ThinDashed = Stroke[color="slategray", width=1.0, style="dashed"];
type ThickSolid = Stroke[color="steelblue", width=2.5];
type BoldText = Text[font_size=16, color="darkblue", font_family="Arial"];
type SmallText = Text[font_size=11, color="gray"];

// Component types using attribute groups
type Service = Rectangle[fill_color="#e6f3ff", stroke=ThickSolid, text=BoldText];
type Store = Rectangle[fill_color="#e0f0e0", stroke=[color="#339966"], rounded=8, text=[color="#2d6a2d"]];

// Type extension — later attributes override earlier ones
type CriticalService = Service[fill_color="#ffe0e0", stroke=[color="red", width=3.0]];
type ReadReplica = Store[fill_color="#f0f0e0", stroke=ThinDashed];

// Arrow types and extension
type RequestArrow = Arrow[stroke=ThickSolid];
type ResponseArrow = Arrow[stroke=ThinDashed];
type UrgentRequest = RequestArrow[stroke=[color="red"]];

// Construct types
type WarningNote = Note[background_color="#fff3cd", stroke=[color="orange", width=2.0], text=[color="#856404"]];
type CriticalActivation = Activate[fill_color="rgba(255,180,180,0.3)", stroke=[color="red", width=2.0]];
type HighlightFragment = Fragment[background_color="rgba(200,220,255,0.15)", border_stroke=[color="blue", width=2.0]];

// Declarations (`:`) define participants
client as "Browser": Service;
api as "API Gateway": CriticalService;
auth as "Auth Service": Service;
primary_db as "Primary DB": Store;
replica_db as "Read Replica": ReadReplica;

// Sugar syntax — omitting @TypeSpec defaults to @Arrow, @Note, etc.
client -> api: "GET /dashboard";
note [on=[api]]: "Default @Note styling";

// Named invocations (`@`)
api -> @RequestArrow auth: "Validate session";
auth -> @ResponseArrow api: "Session valid";
note @WarningNote [on=[auth]]: "Token expires in 60s";

// Anonymous invocations — one-off types inline
api -> @Arrow[stroke=[color="purple", width=2.0]] primary_db: "SELECT dashboard";

// Named + instance overrides
primary_db -> @ResponseArrow[stroke=[color="green"]] api: "Result set";

// Custom activation and fragment types
activate @CriticalActivation api {
    api -> @UrgentRequest primary_db: "UPDATE session.last_active";
    primary_db -> @ResponseArrow api: "Ack";
};

alt @HighlightFragment "replica available" {
    api -> @RequestArrow replica_db: "SELECT analytics (read replica)";
    replica_db -> @ResponseArrow api: "Analytics data";
} else "replica down" {
    api -> @RequestArrow primary_db: "SELECT analytics (fallback)";
    primary_db -> @ResponseArrow api: "Analytics data";
};

api -> @ResponseArrow client: "Dashboard payload";
```

*Source: [type_system.orr](https://github.com/orreryworks/orrery/blob/main/examples/type_system.orr)*

## Styling

Stroke attributes (color, width, style, dash patterns, line cap/join), text attributes (font size, font family, color, background, padding), color formats (named, hex, rgb, rgba), and styling on components, relations, notes, activations, and fragments.

```orrery
diagram sequence;

// Stroke types
type SolidStroke = Stroke[color="navy", width=2.0, style="solid"];
type DashedStroke = Stroke[color="crimson", width=1.5, style="dashed"];
type DottedStroke = Stroke[color="gray", width=1.0, style="dotted"];
type CustomDashStroke = Stroke[color="purple", width=2.0, style="5,3,2,3"];
type RoundCapStroke = Stroke[color="teal", width=3.0, cap="round", join="round"];

// Text types
type HeaderText = Text[font_size=18, font_family="Arial", color="darkblue"];
type MonoText = Text[font_size=12, font_family="Courier New", color="#333333"];
type HighlightText = Text[font_size=14, color="darkred", background_color="lightyellow", padding=4.0];

// Component types using stroke and text groups
type Primary = Rectangle[fill_color="#e6f3ff", stroke=SolidStroke, text=HeaderText];
type Secondary = Rectangle[fill_color="#f0f0f0", stroke=DashedStroke, text=MonoText];
type Accent = Rectangle[fill_color="#fff0f5", stroke=RoundCapStroke, text=HighlightText];

// Arrow types
type SolidArrow = Arrow[stroke=SolidStroke];
type DashedArrow = Arrow[stroke=DashedStroke];
type DottedArrow = Arrow[stroke=DottedStroke];
type PatternArrow = Arrow[stroke=CustomDashStroke];

// Color format arrows: named, hex, rgb, rgba
type NamedColor = Arrow[stroke=[color="coral", width=2.0]];
type HexColor = Arrow[stroke=[color="#2e8b57", width=2.0]];
type RgbColor = Arrow[stroke=[color="rgb(100, 149, 237)", width=2.0]];
type RgbaColor = Arrow[stroke=[color="rgba(148, 0, 211, 0.6)", width=2.0]];

client: Primary;
server: Secondary;
store: Accent;

// Styled relations
client -> @SolidArrow server: "Solid stroke";
server -> @DashedArrow store: "Dashed stroke";
store -> @DottedArrow server: "Dotted stroke";
server -> @PatternArrow client: "Custom dash pattern (5,3,2,3)";

// Inline stroke + text on relations
client -> [stroke=[color="darkorange", width=2.5], text=[color="darkorange", font_size=14, font_family="Arial"]] server: "Inline stroke + text";

server -> [stroke=[color="rgb(100, 149, 237)", width=2.0, style="dashed"], text=[color="#4169e1", background_color="white", padding=3.0]] store: "RGB stroke, highlighted label";

// Color formats
client -> @NamedColor server: "Named: coral";
server -> @HexColor store: "Hex: #2e8b57";
store -> @RgbColor server: "RGB: cornflower";
server -> @RgbaColor client: "RGBA: semi-transparent violet";

// Styled note
note @Note[on=[server], background_color="rgba(255, 255, 200, 0.8)", stroke=[color="goldenrod", width=2.0, style="dashed"], text=[font_size=13, color="darkgoldenrod"]]: "Fully styled note: bg, stroke, text";

// Styled activation
activate @Activate[fill_color="rgba(70, 130, 180, 0.15)", stroke=[color="steelblue", width=2.0]] server {
    server -> [stroke=RoundCapStroke, text=HighlightText] store: "Round cap + join, highlighted text";
    store -> @DashedArrow server: "Response";
};

// Styled fragment
opt @Fragment[background_color="rgba(144, 238, 144, 0.1)", border_stroke=[color="seagreen", width=2.0], separator_stroke=[color="gray", style="dotted"], operation_label_text=[font_size=14, color="seagreen"], section_title_text=[font_size=12, color="gray"]] "cache available" {
    server -> [stroke=[color="seagreen"]] store: "Cache lookup";
    store -> @DashedArrow server: "Cache hit";
};
```

*Source: [styling.orr](https://github.com/orreryworks/orrery/blob/main/examples/styling.orr)*

## Embedded Diagrams

Sequence diagrams inside component nodes, component diagrams inside component nodes (with different layout engines), and embedded diagrams inside sequence diagram participants.

```orrery
diagram component;

type Service = Rectangle[fill_color="#e6f3ff", stroke=[color="#336699"], rounded=5];
type Store = Rectangle[fill_color="#e0f0e0", stroke=[color="#339966"], rounded=8];

// Sequence diagram embedded in a component node
auth_service as "Auth Service": Service embed diagram sequence {
    client: Rectangle[fill_color="#fff0e0"];
    validator: Rectangle[fill_color="#e6f3ff"];
    token_store: Rectangle[fill_color="#e0f0e0"];

    client -> [stroke=[color="steelblue"]] validator: "Credentials";

    activate validator {
        validator -> [stroke=[color="steelblue"]] token_store: "Lookup user";
        token_store -> [stroke=[color="seagreen", style="dashed"]] validator: "User record";
        validator -> validator: "Verify hash";
    };

    alt [border_stroke=[color="green"]] "valid" {
        validator -> [stroke=[color="green"]] token_store: "Create session";
        token_store -> [stroke=[color="seagreen", style="dashed"]] validator: "Session ID";
        validator -> [stroke=[color="green"]] client: "JWT token";
    } else "invalid" {
        validator -> [stroke=[color="#cc3333"]] client: "401 Unauthorized";
    };
};

// Component diagram embedded with basic layout
order_service as "Order Service": Service embed diagram component [layout_engine="basic", background_color="#fafafa"] {
    api as "API Layer": Rectangle[fill_color="#e6f3ff", rounded=3];
    validation as "Validation": Rectangle[fill_color="#fff3cd", rounded=3];
    persistence as "Persistence": Rectangle[fill_color="#e0f0e0", rounded=3];
    cache as "Cache": Rectangle[fill_color="#f0e6ff", rounded=3];

    api -> validation: "Validate";
    validation -> persistence: "Store";
    persistence -> cache: "Invalidate";
    api -> cache: "Read-through";
};

// Component diagram embedded with sugiyama layout
analytics as "Analytics Pipeline": Service embed diagram component [layout_engine="sugiyama", background_color="#fafafa"] {
    ingress as "Ingress": Rectangle[fill_color="#fff0e0"];
    parser as "Parser": Rectangle[fill_color="#e6f3ff"];
    enricher as "Enricher": Rectangle[fill_color="#e6f3ff"];
    aggregator as "Aggregator": Rectangle[fill_color="#e0f0e0"];
    sink as "Sink": Rectangle[fill_color="#f0e6ff"];

    ingress -> parser;
    ingress -> enricher;
    parser -> aggregator;
    enricher -> aggregator;
    aggregator -> sink;
};

gateway as "API Gateway": Service;
db as "Primary DB": Store;

gateway -> auth_service: "Authenticate";
gateway -> order_service: "Place order";
gateway -> analytics: "Stream events";
auth_service -> db: "Sessions";
order_service -> db: "Orders";
order_service -> analytics: "Order events";

// Sequence diagram whose participants contain embedded diagrams
outer as "Outer System": Service embed diagram sequence {

    // Participant with an embedded component diagram
    api_node as "API Server": Rectangle embed diagram component [layout_engine="basic", background_color="#f8f8ff"] {
        router as "Router": Rectangle[fill_color="#e6f3ff", rounded=3];
        middleware as "Middleware": Rectangle[fill_color="#fff3cd", rounded=3];
        handler as "Handler": Rectangle[fill_color="#e0f0e0", rounded=3];

        router -> middleware: "Pre-process";
        middleware -> handler: "Dispatch";
    };

    // Participant with an embedded sequence diagram
    payment_node as "Payment Gateway": Rectangle embed diagram sequence {
        charge_svc: Rectangle[fill_color="#fff0e0"];
        fraud_check: Rectangle[fill_color="#fce4ec"];
        ledger: Rectangle[fill_color="#e0f0e0"];

        charge_svc -> [stroke=[color="steelblue"]] fraud_check: "Evaluate risk";
        fraud_check -> [stroke=[color="seagreen", style="dashed"]] charge_svc: "Score";

        activate charge_svc {
            charge_svc -> [stroke=[color="steelblue"]] ledger: "Debit";
            ledger -> [stroke=[color="seagreen", style="dashed"]] charge_svc: "Confirmation";
        };
    };

    user: Rectangle[fill_color="#fff0e0"];

    user -> [stroke=[color="steelblue"]] api_node: "POST /checkout";

    activate api_node {
        api_node -> [stroke=[color="steelblue"]] payment_node: "Charge $42.00";

        activate payment_node {
            payment_node -> [stroke=[color="seagreen", style="dashed"]] api_node: "tx_id=abc123";
        };

        api_node -> [stroke=[color="seagreen", style="dashed"]] user: "201 Created";
    };
};

gateway -> outer: "Delegate";
```

*Source: [embedded_diagrams.orr](https://github.com/orreryworks/orrery/blob/main/examples/embedded_diagrams.orr)*
