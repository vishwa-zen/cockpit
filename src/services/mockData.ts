import type { ServiceNowIncident } from "./serviceNowService";

/**
 * Mock ServiceNow Incidents Data
 * Used as fallback when API is unavailable
 */
export const MOCK_INCIDENTS: ServiceNowIncident[] = [
  {
    sysId: "2c472869935e06507ec2f6aa7bba1045",
    incidentNumber: "INC0010148",
    shortDescription: "Printer Issue at Fountains Hills Safeway Branch",
    priority: "1 - Critical",
    impact: 1,
    status: "In Progress",
    active: false,
    assignedTo: "FS Cockpit Integration",
    deviceName: "",
    createdBy: "koreapitest",
    callerId: "",
    openedAt: "2024-05-21 01:01:21",
    lastUpdatedAt: "2025-12-01 11:08:13",
  },
  {
    sysId: "34c68289f0252300964feeefe80ff026",
    incidentNumber: "INC0002012",
    shortDescription: "Cannot access SAP Sales app",
    priority: "1 - Critical",
    impact: 1,
    status: "In Progress",
    active: false,
    assignedTo: "FS Cockpit Integration",
    deviceName: "SAP Sales and Distribution",
    createdBy: "admin",
    callerId: "Carol Coughlin",
    openedAt: "2018-11-02 02:03:03",
    lastUpdatedAt: "2025-12-01 11:08:13",
  },
  {
    sysId: "88c1dc5a9301a6d01f88b3ad1dba10b8",
    incidentNumber: "INC0024934",
    shortDescription: "Error installing software update",
    priority: "1 - Critical",
    impact: 1,
    status: "In Progress",
    active: false,
    assignedTo: "FS Cockpit Integration",
    deviceName: "",
    createdBy: "Nisarga",
    callerId: "Jitin",
    openedAt: "2025-04-23 20:26:40",
    lastUpdatedAt: "2025-12-01 11:08:13",
  },
  {
    sysId: "90e058d69301a6d01f88b3ad1dba102d",
    incidentNumber: "INC0024933",
    shortDescription: "Unable to print documents",
    priority: "1 - Critical",
    impact: 1,
    status: "In Progress",
    active: false,
    assignedTo: "FS Cockpit Integration",
    deviceName: "",
    createdBy: "Nisarga",
    callerId: "Jitin",
    openedAt: "2025-04-23 20:22:51",
    lastUpdatedAt: "2025-12-01 11:08:13",
  },
  {
    sysId: "967c3f06934d66d01f88b3ad1dba1026",
    incidentNumber: "INC0024910",
    shortDescription: "Can't able to connect to VPN",
    priority: "1 - Critical",
    impact: 1,
    status: "In Progress",
    active: false,
    assignedTo: "FS Cockpit Integration",
    deviceName: "",
    createdBy: "Nisarga",
    callerId: "Jitin",
    openedAt: "2025-04-23 18:53:42",
    lastUpdatedAt: "2025-12-01 11:08:13",
  },
  {
    sysId: "9f1bb342934d66d01f88b3ad1dba107c",
    incidentNumber: "INC0024908",
    shortDescription: "Unable to connect to VPN",
    priority: "1 - Critical",
    impact: 1,
    status: "In Progress",
    active: false,
    assignedTo: "FS Cockpit Integration",
    deviceName: "",
    createdBy: "Nisarga",
    callerId: "Jitin",
    openedAt: "2025-04-23 18:47:46",
    lastUpdatedAt: "2025-12-01 11:08:13",
  },
  {
    sysId: "a39d8e3cf0212300964feeefe80ff0ed",
    incidentNumber: "INC0002020",
    shortDescription: "SAP Sales app is not accessible. I cannot log in.",
    priority: "1 - Critical",
    impact: 1,
    status: "In Progress",
    active: false,
    assignedTo: "FS Cockpit Integration",
    deviceName: "SAP Sales and Distribution",
    createdBy: "admin",
    callerId: "Carol Coughlin",
    openedAt: "2018-11-01 07:54:31",
    lastUpdatedAt: "2025-12-01 11:08:13",
  },
  {
    sysId: "b4c8e9d7f0312400975gffgfg91gg137",
    incidentNumber: "INC0025001",
    shortDescription: "Outlook not responding on LAPTOP-5K8P3R",
    priority: "2 - High",
    impact: 2,
    status: "New",
    active: true,
    assignedTo: "FS Cockpit Integration",
    deviceName: "LAPTOP-5K8P3R",
    createdBy: "john.doe",
    callerId: "John Doe",
    openedAt: "2025-11-30 10:15:22",
    lastUpdatedAt: "2025-12-01 03:38:13",
  },
  {
    sysId: "c5d9f0e8g1423511086hgghgh02hh248",
    incidentNumber: "INC0025002",
    shortDescription: "Slow network connection in Building A",
    priority: "3 - Medium",
    impact: 2,
    status: "On Hold",
    active: true,
    assignedTo: "FS Cockpit Integration",
    deviceName: "DESKTOP-9M4N7P",
    createdBy: "jane.smith",
    callerId: "Jane Smith",
    openedAt: "2025-11-29 14:30:45",
    lastUpdatedAt: "2025-12-01 03:38:13",
  },
  {
    sysId: "d6e0g1f9h2534622197ihhhih13ii359",
    incidentNumber: "INC0025003",
    shortDescription: "Cannot access shared drive",
    priority: "4 - Low",
    impact: 3,
    status: "Resolved",
    active: false,
    assignedTo: "FS Cockpit Integration",
    deviceName: "LAPTOP-1P6Q8S",
    createdBy: "mike.johnson",
    callerId: "Mike Johnson",
    openedAt: "2025-11-28 09:45:12",
    lastUpdatedAt: "2025-11-30 16:20:33",
  },
];

/**
 * Check if mock data should be used
 */
export const shouldUseMockData = (): boolean => {
  // Check localStorage flag
  const useMock = localStorage.getItem("use_mock_data");
  return useMock === "true";
};

/**
 * Enable mock data mode
 */
export const enableMockData = (): void => {
  localStorage.setItem("use_mock_data", "true");
  console.log("🎭 Mock data mode enabled");
};

/**
 * Disable mock data mode
 */
export const disableMockData = (): void => {
  localStorage.removeItem("use_mock_data");
  console.log("🌐 Live API mode enabled");
};

/**
 * Toggle mock data mode
 */
export const toggleMockData = (): boolean => {
  const current = shouldUseMockData();
  if (current) {
    disableMockData();
  } else {
    enableMockData();
  }
  return !current;
};
