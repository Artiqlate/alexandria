# Service Discovery Subsystem

This is the subsystem which enables the server to advertise it's location over the local network for clients to automatically disocver and connect to it, and also provide information relevant to connect to the server (connection port, secure status).

The Service Discovery Module is built using **Zeroconf** (Zero Configuration Networking), to advertise the server across the local network, for the client to discover.

When a client starts, it will start to search service candidates across the network. It will then connect to the one or more servers that are found by the client using Zeroconf, and then connects to them.

```yaml
Service Name: .cyprus.tcp
```