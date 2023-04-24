---
outline: deep
---

# Server Specification (`cyprus`)

If you haven't perused the system design for the server, you can do it [here](system-design.md). The current reference implementation for the server is [`cyprus`](https://github.com/CrosineEnterprises/cyprus), written in Go.

## Server API

The Server provides a real-time bidirectional API which allows data transfer with small payloads. Most parts of server is picked for performance and low latency.

The Server transmits data predominantly through WebSockets (secured by default). Data is passed to and from the server, seralized using a simple **[MessagePack](https://msgpack.org/)-RPC** ([Remote Procedure Call](https://en.wikipedia.org/wiki/Remote_procedure_call)) structure, where **schema fields are serialized as array elements**, instead of key-value pairs.

## RPC Schema

A schema is the defined outline of a structured data (represented as C `struct`), where *nullable fields and child schemas might be written as a pointer (`*field`)*. 

All schemas are serialized as an array of values corresponding to the order of the fields from top to bottom.

While deserialization, one has to unpack the array and set the fields in order from top to bottom, one-by-one for each field.

> **Note: As MessagePack is not easily human-readable, we'll be using a yaml-like syntax to represent the seralized structure.**

## RPC Message Payload

All RPC Payloads have the same base structure with the following schema:

```c{3,6}
struct RPCMessage {
    // This field is a string, which in C we'll represent as char[]
    char[] method;
    // This field is `void*` which means it can represent anything,
    // including null values.
    void* args;
};
```

In this, we have the following arguments:

1. `method` (`string`): This is the RPC method call to be run (server and client). This is a string value, which will have a reserved name.

Examples: `init`, `mp:play`, `mp:linux:seeked`.

2. `args` (`any`): These are the arguments to the RPC call, which is structured as an array in the schema fields order. The argument schema is determined by the kind of method being called.

This gets serialized into the following format:

```yaml{4,8}
[
    # 0. `method`
    # This is a string, which describes which remote procedure to run.
    "method",
    # 1. `args`
    # This a nullable schema field (packed as array), which describes the
    # arguments for the remote procedure to run.
    [...]
]
```

### RPC Schema Example

Here is the schema (of `args`) for the [`mp:linux:mu`](../server/subsystems/media-player.md#mp-linux-mu-metadata-update) method ([**Metadata Update**](../server/subsystems/media-player.md#mp-linux-mu-metadata-update) signal for **Media Player Subsystem** in **Linux**):

```c
struct MetadataChanged {
    // 1. `playerIdx`
    // A 32-bit integer describing the media player index.
    int playerIdx;
    // 2. `playerName`
    // A string that describes the media player name.
    char[] playerName;
    // 3. `metadata`
    // List of fields that describe updated metadata.
    struct Metadata metadata;
};
```
 
The `args` field after serialization is represented by:

```yaml
# `...` represents the child field (also an array), ignored for now
# [int, char[], [metadata...]]
[1, "com.mpris.Player.spotify", [...]]
```

With the whole RPC payload represented by the following:

```yaml{4,9,12,15}
[
    # 1. method: Method/Remote Procedure to be called.
    # "mp:linux:mu" stands for "Media Player (Linux) Metadata Update"
    "mp:linux:mu",
    # 2. `args`: Here the schema is `MetadataChanged` structure, structured
    # as an array.
    [
        # 1. `playerIdx` is 1, the second value in player list.
        1,
        # 2. `playerName` is "com.mpris.Player.spotify", describing that the
        # player name is spotify, implementing MPRIS Player specification.
        "com.mpris.Player.spotify",
        # 3. `metadata` is a field, which also has another schema, 
        # structured as an array (ignored here).
        [...]
    ]
]
```
