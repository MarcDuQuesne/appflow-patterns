# API Reference <a name="API Reference" id="api-reference"></a>

## Constructs <a name="Constructs" id="Constructs"></a>

### Sharepoint2S3Flow <a name="Sharepoint2S3Flow" id="appflow-patterns.Sharepoint2S3Flow"></a>

#### Initializers <a name="Initializers" id="appflow-patterns.Sharepoint2S3Flow.Initializer"></a>

```typescript
import { Sharepoint2S3Flow } from 'appflow-patterns'

new Sharepoint2S3Flow(scope: Construct, id: string, props: Sharepoint2S3FlowProps)
```

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#appflow-patterns.Sharepoint2S3Flow.Initializer.parameter.scope">scope</a></code> | <code>constructs.Construct</code> | *No description.* |
| <code><a href="#appflow-patterns.Sharepoint2S3Flow.Initializer.parameter.id">id</a></code> | <code>string</code> | *No description.* |
| <code><a href="#appflow-patterns.Sharepoint2S3Flow.Initializer.parameter.props">props</a></code> | <code><a href="#appflow-patterns.Sharepoint2S3FlowProps">Sharepoint2S3FlowProps</a></code> | *No description.* |

---

##### `scope`<sup>Required</sup> <a name="scope" id="appflow-patterns.Sharepoint2S3Flow.Initializer.parameter.scope"></a>

- *Type:* constructs.Construct

---

##### `id`<sup>Required</sup> <a name="id" id="appflow-patterns.Sharepoint2S3Flow.Initializer.parameter.id"></a>

- *Type:* string

---

##### `props`<sup>Required</sup> <a name="props" id="appflow-patterns.Sharepoint2S3Flow.Initializer.parameter.props"></a>

- *Type:* <a href="#appflow-patterns.Sharepoint2S3FlowProps">Sharepoint2S3FlowProps</a>

---

#### Methods <a name="Methods" id="Methods"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#appflow-patterns.Sharepoint2S3Flow.toString">toString</a></code> | Returns a string representation of this construct. |

---

##### `toString` <a name="toString" id="appflow-patterns.Sharepoint2S3Flow.toString"></a>

```typescript
public toString(): string
```

Returns a string representation of this construct.

#### Static Functions <a name="Static Functions" id="Static Functions"></a>

| **Name** | **Description** |
| --- | --- |
| <code><a href="#appflow-patterns.Sharepoint2S3Flow.isConstruct">isConstruct</a></code> | Checks if `x` is a construct. |

---

##### ~~`isConstruct`~~ <a name="isConstruct" id="appflow-patterns.Sharepoint2S3Flow.isConstruct"></a>

```typescript
import { Sharepoint2S3Flow } from 'appflow-patterns'

Sharepoint2S3Flow.isConstruct(x: any)
```

Checks if `x` is a construct.

###### `x`<sup>Required</sup> <a name="x" id="appflow-patterns.Sharepoint2S3Flow.isConstruct.parameter.x"></a>

- *Type:* any

Any object.

---

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#appflow-patterns.Sharepoint2S3Flow.property.node">node</a></code> | <code>constructs.Node</code> | The tree node. |

---

##### `node`<sup>Required</sup> <a name="node" id="appflow-patterns.Sharepoint2S3Flow.property.node"></a>

```typescript
public readonly node: Node;
```

- *Type:* constructs.Node

The tree node.

---


## Structs <a name="Structs" id="Structs"></a>

### Sharepoint2S3FlowProps <a name="Sharepoint2S3FlowProps" id="appflow-patterns.Sharepoint2S3FlowProps"></a>

#### Initializer <a name="Initializer" id="appflow-patterns.Sharepoint2S3FlowProps.Initializer"></a>

```typescript
import { Sharepoint2S3FlowProps } from 'appflow-patterns'

const sharepoint2S3FlowProps: Sharepoint2S3FlowProps = { ... }
```

#### Properties <a name="Properties" id="Properties"></a>

| **Name** | **Type** | **Description** |
| --- | --- | --- |
| <code><a href="#appflow-patterns.Sharepoint2S3FlowProps.property.bucketName">bucketName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#appflow-patterns.Sharepoint2S3FlowProps.property.entities">entities</a></code> | <code>string[]</code> | *No description.* |
| <code><a href="#appflow-patterns.Sharepoint2S3FlowProps.property.secretName">secretName</a></code> | <code>string</code> | *No description.* |
| <code><a href="#appflow-patterns.Sharepoint2S3FlowProps.property.site">site</a></code> | <code>string</code> | *No description.* |
| <code><a href="#appflow-patterns.Sharepoint2S3FlowProps.property.prefix">prefix</a></code> | <code>string</code> | *No description.* |
| <code><a href="#appflow-patterns.Sharepoint2S3FlowProps.property.scheduleExpression">scheduleExpression</a></code> | <code>string</code> | *No description.* |

---

##### `bucketName`<sup>Required</sup> <a name="bucketName" id="appflow-patterns.Sharepoint2S3FlowProps.property.bucketName"></a>

```typescript
public readonly bucketName: string;
```

- *Type:* string

---

##### `entities`<sup>Required</sup> <a name="entities" id="appflow-patterns.Sharepoint2S3FlowProps.property.entities"></a>

```typescript
public readonly entities: string[];
```

- *Type:* string[]

---

##### `secretName`<sup>Required</sup> <a name="secretName" id="appflow-patterns.Sharepoint2S3FlowProps.property.secretName"></a>

```typescript
public readonly secretName: string;
```

- *Type:* string

---

##### `site`<sup>Required</sup> <a name="site" id="appflow-patterns.Sharepoint2S3FlowProps.property.site"></a>

```typescript
public readonly site: string;
```

- *Type:* string

---

##### `prefix`<sup>Optional</sup> <a name="prefix" id="appflow-patterns.Sharepoint2S3FlowProps.property.prefix"></a>

```typescript
public readonly prefix: string;
```

- *Type:* string

---

##### `scheduleExpression`<sup>Optional</sup> <a name="scheduleExpression" id="appflow-patterns.Sharepoint2S3FlowProps.property.scheduleExpression"></a>

```typescript
public readonly scheduleExpression: string;
```

- *Type:* string

---



