# Type System

Orrery's type system lets you define reusable styles and apply them consistently across a diagram. Types compose — you build complex types from simpler ones.

## Declarations vs. invocations

The type system has two core operations:

- **Declarations** (`:`) — create named instances that can be referenced later
- **Invocations** (`@`) — apply a type to an action (arrows, notes, fragments)

```text
// Declaration: creates a named component
api: Service;

// Invocation: applies a type to an arrow
client -> @DashedArrow server: "Request";
```

## Defining types

Use `type` to bind a name to a base type with attributes:

```text
type Service = Rectangle [fill_color="#e6f3ff", rounded=5];
type Database = Rectangle [fill_color="#e0f0e0", rounded=10];
type DashedArrow = Arrow [stroke=[style="dashed", color="gray"]];
```

Type names must be CamelCase and start with an uppercase letter.

## Type extension

Types can extend other user-defined types. Later attributes override earlier ones:

```text
type Service = Rectangle [fill_color="#e6f3ff", rounded=5];
type CriticalService = Service [fill_color="#ffe0e0", stroke=[color="red", width=2.0]];
```

`CriticalService` inherits `rounded=5` from `Service`, overrides `fill_color`, and adds a red stroke.

The chain can go multiple levels:

```text
type Arrow = Arrow [];                          // built-in
type RequestArrow = Arrow [stroke=[color="steelblue", width=1.5]];
type UrgentRequest = RequestArrow [stroke=[color="red"]];
// UrgentRequest: width=1.5 from RequestArrow, color=red from override
```

## Attribute group types

`Stroke` and `Text` are special types for grouping related attributes. They can be defined once and reused across multiple component or arrow types:

```text
type ThinDashed = Stroke [color="slategray", width=1.0, style="dashed"];
type BoldText = Text [font_size=16, color="darkblue", font_family="Arial"];

// Use in component types
type Service = Rectangle [fill_color="#e6f3ff", stroke=ThinDashed, text=BoldText];

// Use in arrow types
type RequestArrow = Arrow [stroke=ThinDashed];
```

This keeps styling DRY — change `ThinDashed` once and all types using it update.

## Named vs. anonymous type specifiers

A **named** TypeSpec references a previously defined type:

```text
api: Service;                         // named
client -> @DashedArrow server;        // named
```

An **anonymous** TypeSpec creates a one-off type inline:

```text
api: Rectangle [fill_color="red"];    // anonymous
client -> @Arrow [color="blue"] server; // anonymous
```

Anonymous types extending a named type:

```text
api: Service [rounded=0];             // Service but with no rounding
client -> @DashedArrow [color="red"] server; // DashedArrow but red
```

## Instance attribute overrides

When declaring a component, you can override type attributes with instance-specific values:

```text
type BlueService = Rectangle [fill_color="blue", rounded=5];

normal: BlueService;                           // blue, rounded=5
special: BlueService [fill_color="red"];       // red, rounded=5
```

The instance `[...]` block overrides the type's attributes for that specific instance.

## Syntactic sugar

For common constructs, `@TypeSpec` can be omitted. The language fills in a default:

| Construct | Default when omitted |
|-----------|---------------------|
| Relations | `@Arrow` |
| Notes | `@Note` |
| Activations | `@Activate` |
| Fragments | `@Fragment` |

```text
// These are equivalent:
client -> server: "Request";
client -> @Arrow server: "Request";

// With instance attributes on the default type:
client -> [stroke=[color="red"]] server: "Error";
// Equivalent to:
client -> @Arrow [stroke=[color="red"]] server: "Error";
```

Sugar and explicit syntax can be mixed freely in the same diagram.

## Built-in base types

### Component types

| Type | Description |
|------|-------------|
| `Rectangle` | Rectangular box (accepts children) |
| `Oval` | Elliptical shape (accepts children) |
| `Component` | UML component icon (accepts children) |
| `Actor` | Stick figure (content-free) |
| `Entity` | Circle (content-free) |
| `Control` | Circle with arrow (content-free) |
| `Interface` | Small circle (content-free) |
| `Boundary` | Circle with line (content-free) |

### Other types

| Type | Description |
|------|-------------|
| `Arrow` | Relations |
| `Note` | Annotations |
| `Activate` | Activation blocks |
| `Fragment` | Fragment blocks |
| `Stroke` | Stroke attribute group |
| `Text` | Text attribute group |

## Next steps

- [Styling](styling.md) — colors, strokes, and text formatting
- [Type System Reference](../reference/type-system.md) — complete specification
