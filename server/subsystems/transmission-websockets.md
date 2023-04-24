# Transmission Subsystem (WebSocket)

This is the fallback implementation of Transmission Subsystem, using WebSockets. The data is transferred to and from the server using a lightweight array-based MessagePack-RPC serialization.

The information about the server itself (like Server IP Address, Port, other information) is advertised across the local network using the [Service Discovery Subsystem](./service-discovery.md).

#### Default Values

```
Kind: WebSocket (Secure)
IP Address: <IPv4 local address of the server>
Port = 3969
Protocol: wss
```
