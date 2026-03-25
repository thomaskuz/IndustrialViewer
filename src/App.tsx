import { useMemo, useState } from "react";
import {
  Activity,
  BookOpen,
  Boxes,
  ChevronRight,
  FolderTree,
  Search,
  ServerCog,
  Sparkles,
  Waypoints,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { opcNodes, rootNodeId, type OpcNode } from "@/data/opcua-demo";
import { cn } from "@/lib/utils";

type ViewerMode = "demo" | "connect";

const nodeMap = new Map(opcNodes.map((node) => [node.id, node]));

function App() {
  const [mode, setMode] = useState<ViewerMode>("demo");
  const [selectedId, setSelectedId] = useState(rootNodeId);
  const [query, setQuery] = useState("");
  const [expandedIds, setExpandedIds] = useState<Set<string>>(
    () => new Set([rootNodeId, "ns=0;i=85", "ns=2;s=Plant", "ns=2;s=Line1"]),
  );

  const filteredIds = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      return new Set(opcNodes.map((node) => node.id));
    }

    const matched = opcNodes
      .filter((node) => {
        const haystack = [
          node.displayName,
          node.browseName,
          node.description,
          node.nodeClass,
          node.dataType,
          node.value,
          ...node.tags,
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();
        return haystack.includes(normalized);
      })
      .map((node) => node.id);

    const withAncestors = new Set<string>(matched);
    matched.forEach((id) => {
      getPathToNode(id).forEach((ancestor) => withAncestors.add(ancestor.id));
    });
    return withAncestors;
  }, [query]);

  const selectedNode = nodeMap.get(selectedId) ?? opcNodes[0];
  const path = getPathToNode(selectedNode.id);

  const stats = useMemo(() => {
    const counts = opcNodes.reduce<Record<string, number>>((acc, node) => {
      acc[node.nodeClass] = (acc[node.nodeClass] ?? 0) + 1;
      return acc;
    }, {});
    return [
      { label: "Nodes", value: String(opcNodes.length), icon: FolderTree },
      { label: "Variables", value: String(counts.Variable ?? 0), icon: Activity },
      { label: "Methods", value: String(counts.Method ?? 0), icon: Waypoints },
      { label: "ObjectTypes", value: String(counts.ObjectType ?? 0), icon: Boxes },
    ];
  }, []);

  function toggleExpanded(id: string) {
    setExpandedIds((current) => {
      const next = new Set(current);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,rgba(58,122,254,0.24),transparent_25%),radial-gradient(circle_at_top_right,rgba(21,214,168,0.18),transparent_22%),linear-gradient(180deg,#08111f_0%,#050913_100%)]" />
      <div className="fixed inset-0 -z-10 bg-grid bg-[size:48px_48px] opacity-[0.08]" />

      <main className="mx-auto flex min-h-screen max-w-[1600px] flex-col gap-6 px-4 py-6 md:px-8">
        <section className="grid gap-6 xl:grid-cols-[1.35fr_0.9fr]">
          <Card className="overflow-hidden">
            <CardHeader className="relative gap-4 pb-4">
              <div className="absolute inset-x-0 top-0 h-32 bg-[radial-gradient(circle_at_top,rgba(58,122,254,0.2),transparent_70%)]" />
              <div className="relative flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div className="max-w-2xl space-y-4">
                  <Badge variant="info" className="w-fit">
                    Industrial OPC UA Explorer
                  </Badge>
                  <div>
                    <h1 className="font-display text-4xl font-semibold tracking-tight md:text-6xl">
                      Learn the address space like an engineer, not a tourist.
                    </h1>
                    <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
                      Browse nodes, inspect references, and study a realistic demo
                      namespace before you connect to a live server.
                    </p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <Button
                    variant={mode === "demo" ? "default" : "secondary"}
                    size="lg"
                    onClick={() => setMode("demo")}
                  >
                    <Sparkles className="size-4" />
                    Demo Mode
                  </Button>
                  <Button
                    variant={mode === "connect" ? "default" : "secondary"}
                    size="lg"
                    onClick={() => setMode("connect")}
                  >
                    <ServerCog className="size-4" />
                    Live Mode
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
              {stats.map((item) => (
                <div
                  key={item.label}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{item.label}</span>
                    <item.icon className="size-4 text-primary" />
                  </div>
                  <div className="mt-4 font-display text-3xl font-semibold">
                    {item.value}
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Deployment-Ready Shape</CardTitle>
              <CardDescription>
                Built as a separate app with an internal teaching dataset and a
                future live OPC UA connection mode.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Feature
                icon={BookOpen}
                title="Learn Mode"
                body="Each node includes an explanation of why it exists in OPC UA and how objects, variables, methods, and types differ."
              />
              <Feature
                icon={FolderTree}
                title="Address Space Browser"
                body="Tree exploration, path breadcrumbs, search filtering, and a deep detail panel mirror how production clients inspect servers."
              />
              <Feature
                icon={ServerCog}
                title="Container Path"
                body="The app is prepared for Docker and can sit next to an OPC UA server container later in a compose stack."
              />
            </CardContent>
          </Card>
        </section>

        <section className="grid gap-6 xl:grid-cols-[420px_minmax(0,1fr)_360px]">
          <Card className="min-h-[720px]">
            <CardHeader>
              <CardTitle>Namespace Explorer</CardTitle>
              <CardDescription>
                Demo mode is interactive now. Live mode UI is staged for a real
                connector next.
              </CardDescription>
              <div className="relative">
                <Search className="pointer-events-none absolute left-4 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search nodes, tags, datatypes..."
                  className="pl-10"
                />
              </div>
            </CardHeader>
            <CardContent className="h-[600px]">
              <ScrollArea className="h-full pr-4">
                <div className="space-y-2">
                  {mode === "demo" ? (
                    <TreeNode
                      nodeId={rootNodeId}
                      depth={0}
                      expandedIds={expandedIds}
                      filteredIds={filteredIds}
                      selectedId={selectedId}
                      onSelect={setSelectedId}
                      onToggle={toggleExpanded}
                    />
                  ) : (
                    <EmptyLiveMode />
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>

          <Card className="min-h-[720px]">
            <CardHeader>
              <div className="flex flex-wrap gap-2">
                <Badge>{selectedNode.nodeClass}</Badge>
                {selectedNode.dataType ? <Badge variant="info">{selectedNode.dataType}</Badge> : null}
                {selectedNode.accessLevel ? (
                  <Badge variant="success">{selectedNode.accessLevel}</Badge>
                ) : null}
              </div>
              <CardTitle className="text-3xl">{selectedNode.displayName}</CardTitle>
              <CardDescription>{selectedNode.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
                {path.map((node, index) => (
                  <span key={node.id} className="inline-flex items-center gap-2">
                    <button
                      className="transition hover:text-foreground"
                      onClick={() => setSelectedId(node.id)}
                    >
                      {node.displayName}
                    </button>
                    {index < path.length - 1 ? <ChevronRight className="size-4" /> : null}
                  </span>
                ))}
              </div>

              <div className="rounded-[28px] border border-sky-300/15 bg-sky-400/10 p-5">
                <div className="mb-2 flex items-center gap-2 font-medium text-sky-100">
                  <BookOpen className="size-4" />
                  Learn What This Node Means
                </div>
                <p className="text-sm leading-7 text-sky-50/90">{selectedNode.learn}</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <InfoTile label="BrowseName" value={selectedNode.browseName} />
                <InfoTile label="NodeId" value={selectedNode.id} />
                <InfoTile label="Value" value={selectedNode.value ?? "N/A"} />
                <InfoTile label="Tags" value={selectedNode.tags.join(", ")} />
              </div>

              <Separator />

              <div>
                <h2 className="font-display text-xl">Attributes</h2>
                <div className="mt-4 grid gap-3">
                  {selectedNode.attributes.map((attribute) => (
                    <div
                      key={attribute.label}
                      className="flex items-start justify-between gap-4 rounded-[22px] border border-white/10 bg-white/[0.03] px-4 py-3"
                    >
                      <span className="text-sm text-muted-foreground">{attribute.label}</span>
                      <span className="text-right text-sm font-medium">
                        {attribute.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="min-h-[720px]">
            <CardHeader>
              <CardTitle>Related Nodes</CardTitle>
              <CardDescription>
                References help explain how the address space is connected.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="mb-3 flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Waypoints className="size-4" />
                  Forward References
                </div>
                <div className="space-y-3">
                  {selectedNode.references.length ? (
                    selectedNode.references.map((referenceId) => {
                      const node = nodeMap.get(referenceId);
                      if (!node) return null;
                      return (
                        <button
                          key={node.id}
                          onClick={() => setSelectedId(node.id)}
                          className="w-full rounded-[22px] border border-white/10 bg-white/[0.04] p-4 text-left transition hover:bg-white/[0.08]"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <span className="font-medium">{node.displayName}</span>
                            <Badge>{node.nodeClass}</Badge>
                          </div>
                          <div className="mt-2 text-sm text-muted-foreground">
                            {node.description}
                          </div>
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-[22px] border border-dashed border-white/10 p-4 text-sm text-muted-foreground">
                      This node has no forward references in the demo model.
                    </div>
                  )}
                </div>
              </div>

              <Separator />

              <div className="rounded-[28px] border border-white/10 bg-white/[0.03] p-5">
                <div className="mb-3 flex items-center gap-2 font-medium">
                  <ServerCog className="size-4 text-primary" />
                  Live Connection Plan
                </div>
                <p className="text-sm leading-7 text-muted-foreground">
                  The next iteration can add endpoint discovery, security policy
                  selection, and browse/read calls against a real OPC UA server.
                  The layout is already split so demo and live sources can share
                  the same UI.
                </p>
              </div>
            </CardContent>
          </Card>
        </section>
      </main>
    </div>
  );
}

function TreeNode(props: {
  nodeId: string;
  depth: number;
  expandedIds: Set<string>;
  filteredIds: Set<string>;
  selectedId: string;
  onSelect: (id: string) => void;
  onToggle: (id: string) => void;
}) {
  const { nodeId, depth, expandedIds, filteredIds, selectedId, onSelect, onToggle } =
    props;
  const node = nodeMap.get(nodeId);
  if (!node || !filteredIds.has(node.id)) {
    return null;
  }

  const children = node.references
    .map((referenceId) => nodeMap.get(referenceId))
    .filter((child): child is OpcNode => Boolean(child))
    .filter((child) => filteredIds.has(child.id));

  const isExpanded = expandedIds.has(node.id);
  const hasChildren = children.length > 0;

  return (
    <div>
      <div
        className={cn(
          "group flex items-center gap-2 rounded-[18px] border border-transparent px-3 py-2.5 transition hover:border-white/10 hover:bg-white/[0.05]",
          selectedId === node.id && "border-sky-300/20 bg-sky-400/10",
        )}
        style={{ marginLeft: depth * 12 }}
      >
        <button
          className="flex size-6 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-muted-foreground transition hover:text-foreground"
          onClick={() => hasChildren && onToggle(node.id)}
        >
          <ChevronRight
            className={cn("size-4 transition", isExpanded && "rotate-90")}
          />
        </button>
        <button className="min-w-0 flex-1 text-left" onClick={() => onSelect(node.id)}>
          <div className="truncate text-sm font-medium">{node.displayName}</div>
          <div className="truncate text-xs text-muted-foreground">{node.id}</div>
        </button>
        <Badge className="hidden md:inline-flex">{node.nodeClass}</Badge>
      </div>

      {hasChildren && isExpanded ? (
        <div className="mt-1 space-y-1">
          {children.map((child) => (
            <TreeNode
              key={child.id}
              nodeId={child.id}
              depth={depth + 1}
              expandedIds={expandedIds}
              filteredIds={filteredIds}
              selectedId={selectedId}
              onSelect={onSelect}
              onToggle={onToggle}
            />
          ))}
        </div>
      ) : null}
    </div>
  );
}

function Feature(props: { icon: typeof Sparkles; title: string; body: string }) {
  const { icon: Icon, title, body } = props;
  return (
    <div className="rounded-[24px] border border-white/10 bg-white/[0.03] p-4">
      <div className="flex items-center gap-3">
        <div className="rounded-2xl bg-primary/15 p-2 text-primary">
          <Icon className="size-4" />
        </div>
        <div className="font-medium">{title}</div>
      </div>
      <p className="mt-3 text-sm leading-7 text-muted-foreground">{body}</p>
    </div>
  );
}

function InfoTile(props: { label: string; value: string }) {
  return (
    <div className="rounded-[22px] border border-white/10 bg-white/[0.04] p-4">
      <div className="text-sm text-muted-foreground">{props.label}</div>
      <div className="mt-2 font-medium">{props.value}</div>
    </div>
  );
}

function EmptyLiveMode() {
  return (
    <div className="rounded-[24px] border border-dashed border-white/10 bg-white/[0.03] p-5 text-sm text-muted-foreground">
      <div className="mb-2 flex items-center gap-2 font-medium text-foreground">
        <ServerCog className="size-4 text-primary" />
        Live OPC UA Mode
      </div>
      <p className="leading-7">
        This UI is intentionally separated from the data source. In the next step,
        we can add an endpoint form and a backend bridge that browses a real OPC UA
        server and feeds this same explorer layout.
      </p>
    </div>
  );
}

function getPathToNode(targetId: string) {
  const path: OpcNode[] = [];

  function walk(currentId: string): boolean {
    const current = nodeMap.get(currentId);
    if (!current) return false;

    path.push(current);
    if (current.id === targetId) {
      return true;
    }

    for (const referenceId of current.references) {
      if (walk(referenceId)) {
        return true;
      }
    }

    path.pop();
    return false;
  }

  walk(rootNodeId);
  return path;
}

export default App;
