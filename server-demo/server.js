import {
  OPCUAServer,
  Variant,
  DataType,
  StatusCodes,
} from "node-opcua";

const server = new OPCUAServer({
  port: 4840,
  resourcePath: "/UA/IndustrialViewer",
  buildInfo: {
    productName: "IndustrialViewerDemoServer",
    buildNumber: "1",
    buildDate: new Date(),
  },
});

async function main() {
  await server.initialize();

  const addressSpace = server.engine.addressSpace;
  const namespace = addressSpace.getOwnNamespace();
  const objectsFolder = addressSpace.rootFolder.objects;

  const plant = namespace.addObject({
    organizedBy: objectsFolder,
    browseName: "Plant",
  });

  const line1 = namespace.addObject({
    organizedBy: plant,
    browseName: "Line1",
  });

  const boilerA = namespace.addObject({
    organizedBy: line1,
    browseName: "BoilerA",
  });

  let temperature = 72.4;
  let pressure = 4.7;
  let status = "Heating";

  namespace.addVariable({
    componentOf: boilerA,
    browseName: "Temperature",
    dataType: "Double",
    value: {
      get: () => new Variant({ dataType: DataType.Double, value: temperature }),
    },
  });

  namespace.addVariable({
    componentOf: boilerA,
    browseName: "Pressure",
    dataType: "Double",
    value: {
      get: () => new Variant({ dataType: DataType.Double, value: pressure }),
    },
  });

  namespace.addVariable({
    componentOf: boilerA,
    browseName: "Status",
    dataType: "String",
    value: {
      get: () => new Variant({ dataType: DataType.String, value: status }),
    },
  });

  namespace.addMethod(boilerA, {
    browseName: "Start",
    inputArguments: [
      {
        name: "RampTargetTemp",
        description: { text: "Requested target temperature" },
        dataType: DataType.Double,
      },
    ],
    outputArguments: [],
  }).bindMethod((inputArguments, _context, callback) => {
    const target = inputArguments[0]?.value ?? 80;
    status = "Starting";
    temperature = Number(target);
    callback(null, {
      statusCode: StatusCodes.Good,
      outputArguments: [],
    });
  });

  namespace.addMethod(boilerA, {
    browseName: "Stop",
    inputArguments: [
      {
        name: "StopMode",
        description: { text: "Requested stop mode" },
        dataType: DataType.String,
      },
    ],
    outputArguments: [],
  }).bindMethod((_inputArguments, _context, callback) => {
    status = "Stopped";
    pressure = 0.3;
    callback(null, {
      statusCode: StatusCodes.Good,
      outputArguments: [],
    });
  });

  setInterval(() => {
    if (status === "Heating" || status === "Starting") {
      temperature = Math.min(95, temperature + Math.random() * 0.4);
      pressure = Math.min(8, pressure + Math.random() * 0.1);
      status = "Heating";
    } else if (status === "Stopped") {
      temperature = Math.max(24, temperature - Math.random() * 0.5);
      pressure = Math.max(0.3, pressure - Math.random() * 0.1);
    }
  }, 1500);

  await server.start();
  console.log("OPC UA demo server listening on", server.getEndpointUrl());
}

main().catch((error) => {
  console.error("Failed to start OPC UA demo server", error);
  process.exit(1);
});
