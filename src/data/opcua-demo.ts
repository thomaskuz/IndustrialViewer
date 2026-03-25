export type OpcNodeClass = "Object" | "Variable" | "Method" | "ObjectType" | "Folder";

export type OpcAttribute = {
  label: string;
  value: string;
};

export type OpcNode = {
  id: string;
  browseName: string;
  displayName: string;
  description: string;
  nodeClass: OpcNodeClass;
  dataType?: string;
  value?: string;
  accessLevel?: string;
  references: string[];
  tags: string[];
  learn: string;
  attributes: OpcAttribute[];
};

export const opcNodes: OpcNode[] = [
  {
    id: "ns=0;i=84",
    browseName: "Root",
    displayName: "Root",
    description: "The entry point of the OPC UA address space.",
    nodeClass: "Folder",
    references: ["ns=0;i=85", "ns=0;i=61"],
    tags: ["foundation", "entry"],
    learn:
      "Every OPC UA server exposes an address space. Root is the top-level node from which standard folders such as Objects and Types branch out.",
    attributes: [
      { label: "NodeId", value: "ns=0;i=84" },
      { label: "BrowseName", value: "Root" },
      { label: "ReferenceType", value: "Organizes" },
    ],
  },
  {
    id: "ns=0;i=85",
    browseName: "Objects",
    displayName: "Objects",
    description: "Holds live objects from the system.",
    nodeClass: "Folder",
    references: ["ns=2;s=Plant", "ns=2;s=Historian"],
    tags: ["runtime"],
    learn:
      "The Objects folder usually contains the dynamic, live parts of the server: assets, sensors, machines, and application-specific structures.",
    attributes: [
      { label: "NodeId", value: "ns=0;i=85" },
      { label: "Contains", value: "Plant model, devices, and services" },
    ],
  },
  {
    id: "ns=0;i=61",
    browseName: "Types",
    displayName: "Types",
    description: "Defines reusable node templates and datatypes.",
    nodeClass: "Folder",
    references: ["ns=2;s=BoilerType"],
    tags: ["modeling"],
    learn:
      "Types let you define reusable templates. A custom ObjectType can be instantiated many times in Objects, keeping industrial models consistent.",
    attributes: [
      { label: "NodeId", value: "ns=0;i=61" },
      { label: "Contains", value: "ObjectTypes, VariableTypes, DataTypes" },
    ],
  },
  {
    id: "ns=2;s=Plant",
    browseName: "2:Plant",
    displayName: "Plant",
    description: "Top-level facility model.",
    nodeClass: "Object",
    references: ["ns=2;s=Line1", "ns=2;s=Utilities"],
    tags: ["facility", "overview"],
    learn:
      "Objects represent real or logical things. A plant object can group production lines, utilities, alarms, and KPIs into one navigable model.",
    attributes: [
      { label: "TypeDefinition", value: "BaseObjectType" },
      { label: "EventNotifier", value: "SubscribeToEvents" },
    ],
  },
  {
    id: "ns=2;s=Line1",
    browseName: "2:Line1",
    displayName: "Line 1",
    description: "Primary packaging line with one simulated boiler skid.",
    nodeClass: "Object",
    references: ["ns=2;s=BoilerA", "ns=2;s=OEE"],
    tags: ["production"],
    learn:
      "Objects can nest to reflect plant hierarchy. This makes clients intuitive to browse and allows role-based filtering per area or machine.",
    attributes: [
      { label: "TypeDefinition", value: "BaseObjectType" },
      { label: "BrowsePath", value: "/Objects/Plant/Line1" },
    ],
  },
  {
    id: "ns=2;s=Utilities",
    browseName: "2:Utilities",
    displayName: "Utilities",
    description: "Shared services such as air, steam, and power.",
    nodeClass: "Object",
    references: ["ns=2;s=SteamHeaderPressure"],
    tags: ["support"],
    learn:
      "Utility subsystems are often modeled separately because multiple production assets depend on them. OPC UA makes these dependencies visible and queryable.",
    attributes: [
      { label: "TypeDefinition", value: "BaseObjectType" },
      { label: "BrowsePath", value: "/Objects/Plant/Utilities" },
    ],
  },
  {
    id: "ns=2;s=BoilerType",
    browseName: "2:BoilerType",
    displayName: "BoilerType",
    description: "Template used by boiler instances in the plant.",
    nodeClass: "ObjectType",
    references: ["ns=2;s=BoilerA"],
    tags: ["type", "reusable"],
    learn:
      "An ObjectType defines the expected components of a machine, such as status variables or callable methods. Instances inherit that structure.",
    attributes: [
      { label: "SubtypeOf", value: "BaseObjectType" },
      { label: "ModelingRule", value: "Mandatory children" },
    ],
  },
  {
    id: "ns=2;s=BoilerA",
    browseName: "2:BoilerA",
    displayName: "Boiler A",
    description: "Example machine instance with telemetry and commands.",
    nodeClass: "Object",
    references: [
      "ns=2;s=BoilerA.Temperature",
      "ns=2;s=BoilerA.Pressure",
      "ns=2;s=BoilerA.Status",
      "ns=2;s=BoilerA.Start",
      "ns=2;s=BoilerA.Stop",
    ],
    tags: ["machine", "demo"],
    learn:
      "This object instance is where runtime values live. Methods, variables, and metadata attached to it show how control and monitoring coexist in OPC UA.",
    attributes: [
      { label: "TypeDefinition", value: "BoilerType" },
      { label: "Manufacturer", value: "Demo Systems NV" },
      { label: "Serial", value: "B-A-2048" },
    ],
  },
  {
    id: "ns=2;s=BoilerA.Temperature",
    browseName: "2:Temperature",
    displayName: "Temperature",
    description: "Process temperature of the boiler vessel.",
    nodeClass: "Variable",
    dataType: "Double",
    value: "72.4 °C",
    accessLevel: "CurrentRead",
    references: [],
    tags: ["telemetry", "analog"],
    learn:
      "Variables hold values and metadata such as datatype, engineering units, and access level. Clients read them for monitoring or write them if permitted.",
    attributes: [
      { label: "NodeId", value: "ns=2;s=BoilerA.Temperature" },
      { label: "DataType", value: "Double" },
      { label: "EngineeringUnits", value: "degree Celsius" },
      { label: "Historizing", value: "true" },
    ],
  },
  {
    id: "ns=2;s=BoilerA.Pressure",
    browseName: "2:Pressure",
    displayName: "Pressure",
    description: "Internal pressure in the boiler chamber.",
    nodeClass: "Variable",
    dataType: "Float",
    value: "4.7 bar",
    accessLevel: "CurrentRead",
    references: [],
    tags: ["telemetry", "critical"],
    learn:
      "Variables can be organized under a machine object to group telemetry. Pressure is a classic example of a variable that clients may monitor for alarm logic.",
    attributes: [
      { label: "NodeId", value: "ns=2;s=BoilerA.Pressure" },
      { label: "DataType", value: "Float" },
      { label: "EURange", value: "0..10 bar" },
      { label: "SamplingInterval", value: "1000 ms" },
    ],
  },
  {
    id: "ns=2;s=BoilerA.Status",
    browseName: "2:Status",
    displayName: "Status",
    description: "Discrete running state of the machine.",
    nodeClass: "Variable",
    dataType: "String",
    value: "Heating",
    accessLevel: "CurrentRead",
    references: [],
    tags: ["state"],
    learn:
      "Not all variables are numeric. State strings or enumerations are common for machine modes, production phases, and maintenance conditions.",
    attributes: [
      { label: "NodeId", value: "ns=2;s=BoilerA.Status" },
      { label: "DataType", value: "String" },
      { label: "CurrentValue", value: "Heating" },
    ],
  },
  {
    id: "ns=2;s=BoilerA.Start",
    browseName: "2:Start",
    displayName: "Start",
    description: "Example callable method to start the machine.",
    nodeClass: "Method",
    references: [],
    tags: ["command"],
    learn:
      "Methods represent callable operations. A client can invoke them with input arguments to trigger behavior, unlike variables which primarily expose state.",
    attributes: [
      { label: "Executable", value: "true" },
      { label: "UserExecutable", value: "true" },
      { label: "InputArguments", value: "RampTargetTemp: Double" },
    ],
  },
  {
    id: "ns=2;s=BoilerA.Stop",
    browseName: "2:Stop",
    displayName: "Stop",
    description: "Example callable method to stop the machine.",
    nodeClass: "Method",
    references: [],
    tags: ["command", "safety"],
    learn:
      "Methods are often used for actions that must be acknowledged or validated server-side. This is safer than exposing everything as writable variables.",
    attributes: [
      { label: "Executable", value: "true" },
      { label: "UserExecutable", value: "true" },
      { label: "InputArguments", value: "StopMode: String" },
    ],
  },
  {
    id: "ns=2;s=SteamHeaderPressure",
    browseName: "2:SteamHeaderPressure",
    displayName: "Steam Header Pressure",
    description: "Plant utility pressure feeding multiple consumers.",
    nodeClass: "Variable",
    dataType: "Float",
    value: "5.2 bar",
    accessLevel: "CurrentRead",
    references: [],
    tags: ["utility"],
    learn:
      "Shared utility measurements are useful examples of cross-cutting data. In real models, multiple equipment nodes may reference or depend on these values.",
    attributes: [
      { label: "DataType", value: "Float" },
      { label: "BrowsePath", value: "/Objects/Plant/Utilities/SteamHeaderPressure" },
    ],
  },
  {
    id: "ns=2;s=OEE",
    browseName: "2:OEE",
    displayName: "Line OEE",
    description: "High-level KPI exposed as a runtime variable.",
    nodeClass: "Variable",
    dataType: "Double",
    value: "91.8 %",
    accessLevel: "CurrentRead",
    references: [],
    tags: ["kpi"],
    learn:
      "OPC UA can expose both low-level signals and higher-level business metrics. This is why it is useful beyond PLC tags alone.",
    attributes: [
      { label: "DataType", value: "Double" },
      { label: "Source", value: "MES aggregation" },
    ],
  },
  {
    id: "ns=2;s=Historian",
    browseName: "2:Historian",
    displayName: "Historian",
    description: "Example service branch for archived values.",
    nodeClass: "Object",
    references: [],
    tags: ["service"],
    learn:
      "Servers may expose service-like objects too. A historian object can represent archived datasets, aggregation capabilities, or custom API entry points.",
    attributes: [
      { label: "TypeDefinition", value: "BaseObjectType" },
      { label: "ServiceRole", value: "HistoricalAccess" },
    ],
  },
];

export const rootNodeId = "ns=0;i=84";
