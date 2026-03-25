# Industrial Viewer

Industrial Viewer is a standalone OPC UA learning and exploration app. It ships with:

- a polished address-space browser UI
- a built-in demo namespace for learning OPC UA concepts
- a containerized frontend
- a companion demo OPC UA server container

## Stack

- React + Vite + TypeScript
- Tailwind CSS with shadcn-style UI primitives
- Docker + Docker Compose
- `node-opcua` for the demo server

## Run With Docker

```bash
docker compose up --build
```

Then open:

- Viewer: `http://localhost:8080`
- OPC UA demo endpoint: `opc.tcp://localhost:4840/UA/IndustrialViewer`

## Current Scope

- Demo mode is implemented in the frontend
- A real OPC UA live connection workflow is not wired yet
- The included demo OPC UA server runs separately so the future live mode has a local target

## Next Step

Add a small backend bridge that connects to an OPC UA endpoint, browses nodes, and feeds the React UI with live data.
