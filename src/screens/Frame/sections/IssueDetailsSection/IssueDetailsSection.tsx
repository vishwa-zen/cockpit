import React from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Card, CardContent } from "../../../../components/ui/card";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Progress } from "../../../../components/ui/progress";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../../../components/ui/tabs";
import { ClockIcon, CalendarIcon, RefreshCwIcon, UserIcon, LightbulbIcon, ZapIcon, ChevronDownIcon, ChevronRightIcon, LogOutIcon } from "lucide-react";

const ticketData = [
  {
    id: "INC0012345",
    status: "open",
    statusColor: "bg-[#ffedd4] text-[#c93400] border-transparent",
    title: "Outlook not responding on LAPTOP-8X7D2K",
    timeAgo: "2 hours ago",
    device: "LAPTOP-8X7D2K",
    priority: "high",
    priorityColor: "bg-[#ffe2e2] text-[#c10007] border-[#ffc9c9]",
    highlighted: true,
  },
];

const rootCauseData = [
  {
    title: "Battery degradation affecting system performance",
    confidence: "85%",
    description: "Battery health at 67%, charging limited to 60%, and thermal issues suggest battery degradation impacting overall system performance",
    progress: 85,
  },
  {
    title: "Thermal throttling due to dust buildup",
    confidence: "78%",
    description: "User reports device getting hot. Combined with performance issues, suggests CPU throttling due to cooling system obstruction",
    progress: 78,
  },
  {
    title: "Memory leak in background processes",
    confidence: "72%",
    description: "Slowness when running multiple applications indicates possible memory management issues",
    progress: 72,
  },
  {
    title: "Outdated drivers or firmware",
    confidence: "65%",
    description: "System scans show some drivers are 6 months old, could contribute to performance issues",
    progress: 65,
  },
];

const actionsData = [
  {
    title: "Run Hardware Diagnostics",
    priority: "High",
    priorityColor: "bg-[#ffe2e2] text-[#c10007] border-[#ffc9c9]",
    description: "Comprehensive hardware test including battery, thermal, and memory diagnostics",
    duration: "15 mins",
    confidence: "95% confidence",
  },
  {
    title: "Check Battery Health & Calibrate",
    priority: "High",
    priorityColor: "bg-[#ffe2e2] text-[#c10007] border-[#ffc9c9]",
    description: "Assess battery degradation and recalibrate charging cycles",
    duration: "10 mins",
    confidence: "88% confidence",
  },
  {
    title: "Clean Cooling System",
    priority: "Medium",
    priorityColor: "bg-[#fef9c2] text-[#a65f00] border-[#feef85]",
    description: "Schedule cleaning of fans and heatsink to resolve thermal issues",
    duration: "30 mins",
    confidence: "82% confidence",
  },
];

const systemStatusData = [
  { name: "ServiceNow", status: "online", color: "bg-[#00c950]" },
  { name: "Tachyon", status: "online", color: "bg-[#00c950]" },
  { name: "Nexthink", status: "warning", color: "bg-[#f0b100]" },
  { name: "Intune / SCCM", status: "online", color: "bg-[#00c950]" },
];

export const IssueDetailsSection = (): JSX.Element => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const [searchQuery, setSearchQuery] = React.useState(id || "INC0012");
  const [filteredTickets, setFilteredTickets] = React.useState(ticketData);
  const [showUserMenu, setShowUserMenu] = React.useState(false);
  const [searchType, setSearchType] = React.useState<"User" | "Device" | "Ticket">("Ticket");
  const [showSearchDropdown, setShowSearchDropdown] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState("search");

  const handleTicketClick = (ticketId: string) => {
    navigate(`/issue/${ticketId}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filteredT = ticketData.filter(
        (ticket) =>
          ticket.id.toLowerCase().includes(query) ||
          ticket.title.toLowerCase().includes(query) ||
          ticket.device.toLowerCase().includes(query)
      );
      setFilteredTickets(filteredT);
      if (filteredT.length > 0) {
        navigate(`/issue/${filteredT[0].id}`);
      }
    } else {
      setFilteredTickets(ticketData);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <div className="relative w-full h-screen flex flex-col bg-[linear-gradient(135deg,rgba(248,250,252,1)_0%,rgba(239,246,255,0.3)_50%,rgba(241,245,249,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)]">
      {/* HEADER - FIXED */}
      <header className="flex items-center justify-between px-8 py-4 bg-[#ffffffcc] border-b-[0.67px] border-[#e1e8f0] flex-shrink-0">
        <div className="flex items-center gap-3">
          <img
            className="w-16 h-16 -ml-3 -mt-0.5 -mb-5"
            alt="Container"
            src="https://c.animaapp.com/micwvcetKEVWir/img/container-12.svg"
          />
          <div className="flex flex-col">
            <div className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-base leading-6">
              FS Cockpit
            </div>
            <div className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">
              Diagnostics Platform
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3 relative">
          <div className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#45556c] text-xs leading-4">
            john.doe@company.com
          </div>
          <button onClick={() => setShowUserMenu(!showUserMenu)} className="relative">
            <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[linear-gradient(135deg,rgba(43,127,255,1)_0%,rgba(173,70,255,1)_100%)] cursor-pointer hover:opacity-80 transition-opacity">
              <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-white text-xs">J</span>
            </div>
          </button>
          {showUserMenu && (
            <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-lg border border-[#e1e8f0] py-2 z-50">
              <div className="px-4 py-2 border-b border-[#e1e8f0]">
                <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-sm">John Doe</p>
                <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs">john.doe@company.com</p>
              </div>
              <button onClick={handleLogout} className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2">
                <LogOutIcon className="w-4 h-4 text-[#61738d]" />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-sm">Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </header>

      {/* MAIN CONTENT AREA - FLEXIBLE */}
      <div className="flex flex-1 overflow-hidden">
        {/* LEFT SIDEBAR - 480px */}
        <aside className="w-[480px] bg-white border-r-[0.67px] border-[#e1e8f0] flex flex-col">
          {/* TABS - TAKES REMAINING SPACE */}
          <Tabs defaultValue="search" onValueChange={setActiveTab} className="flex flex-col flex-1 overflow-hidden">
            <TabsList className="w-full h-[47px] rounded-none bg-transparent p-0 border-b-[0.67px] border-[#e1e8f0] flex-shrink-0">
              <TabsTrigger value="search" className="flex-1 h-full rounded-none data-[state=active]:bg-[#eff6ff] data-[state=active]:border-b-2 data-[state=active]:border-[#155cfb] data-[state=active]:text-[#1347e5] gap-3.5 px-[35px]">
                <img className="w-4 h-4" alt="Icon" src="https://c.animaapp.com/micwvcetKEVWir/img/icon-28.svg" />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-sm">Unified Search</span>
              </TabsTrigger>
              <TabsTrigger value="copilot" className="flex-1 h-full rounded-none gap-3.5 px-[82px]">
                <img className="w-4 h-4" alt="Icon" src="https://c.animaapp.com/micwvcetKEVWir/img/icon-20.svg" />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-neutral-950 text-sm">Copilot</span>
              </TabsTrigger>
            </TabsList>

            {/* TAB CONTENT - SCROLLABLE */}
            <TabsContent value="search" className="flex-1 m-0 overflow-y-auto">
              <div className="flex flex-col gap-6 p-4">
                <div>
                  <div className="mb-4">
                    <h2 className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-base leading-6 mb-1">My Tickets</h2>
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-sm leading-5">Active and recent tickets requiring attention</p>
                  </div>
                  <div className="flex flex-col gap-3">
                    {filteredTickets.map((ticket, index) => (
                      <Card key={ticket.id} onClick={() => handleTicketClick(ticket.id)} className={`p-4 rounded-[14px] border-[0.67px] cursor-pointer hover:shadow-lg transition-shadow ${ticket.highlighted ? "bg-blue-50 border-[#60a5fa]" : "bg-white border-[#0000001a]"}`}>
                        <CardContent className="p-0">
                          <div className="flex flex-col gap-2">
                            <div className="flex items-start justify-between">
                              <div className="flex flex-col gap-1 flex-1">
                                <div className="flex items-center gap-2">
                                  <span className="[font-family:'Consolas-Regular',Helvetica] font-normal text-[#155cfb] text-sm leading-5">{ticket.id}</span>
                                  <Badge className={`h-auto px-2 py-0.5 rounded-lg text-xs ${ticket.statusColor}`}>{ticket.status}</Badge>
                                </div>
                                <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-sm leading-5">{ticket.title}</p>
                              </div>
                              <img className="w-5 h-5" alt="Icon" src="https://c.animaapp.com/micwvcetKEVWir/img/icon.svg" />
                            </div>
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-1">
                                <img className="w-3 h-3" alt="Icon" src="https://c.animaapp.com/micwvcetKEVWir/img/icon-5.svg" />
                                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">{ticket.timeAgo}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <img className="w-3 h-3" alt="Icon" src="https://c.animaapp.com/micwvcetKEVWir/img/icon-2.svg" />
                                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">{ticket.device}</span>
                              </div>
                              <Badge className={`h-auto px-2 py-0.5 rounded-lg text-xs border-[0.67px] ${ticket.priorityColor}`}>{ticket.priority}</Badge>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="copilot" className="flex-1 m-0 overflow-y-auto">
              <div className="h-full flex flex-col items-center justify-center gap-6 p-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <img className="w-10 h-10" alt="Copilot Icon" src="https://c.animaapp.com/micwvcetKEVWir/img/icon-20.svg" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <h3 className="[font-family:'Arial-Bold',Helvetica] font-bold text-[#314157] text-lg leading-6">AI Copilot</h3>
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-sm text-center leading-5 max-w-[320px]">Your intelligent assistant for diagnostics and troubleshooting</p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#1347e5] text-sm">Coming Soon</span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          {/* SEARCH BAR - FIXED AT BOTTOM */}
          <div className="flex-shrink-0 pt-4 px-4 pb-4 bg-white border-t-[0.67px] border-[#e1e8f0]">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 flex items-center gap-3 px-3 py-2.5 bg-white rounded-lg border-[0.67px] border-[#e1e8f0] shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a]">
                <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleSearch()} placeholder={`Enter ${searchType.toLowerCase()} name or number...`} className="flex-1 bg-transparent border-0 outline-none [font-family:'Arial-Regular',Helvetica] font-normal text-gray-700 text-sm leading-5" />
                <div className="relative">
                  <Button onClick={() => setShowSearchDropdown(!showSearchDropdown)} className="h-auto px-4 py-2 rounded-[10px] shadow-[0px_6px_18px_#1f6feb1f] bg-[linear-gradient(0deg,rgba(31,111,235,1)_0%,rgba(74,163,255,1)_100%)] gap-2">
                    <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-white text-[13.3px]">{searchType}</span>
                    <ChevronDownIcon className="w-4 h-4" />
                  </Button>
                  {showSearchDropdown && (
                    <div className="absolute bottom-full right-0 mb-2 w-32 bg-white rounded-lg shadow-lg border border-[#e1e8f0] py-1 z-50">
                      {(["User", "Device", "Ticket"] as const).map((type) => (
                        <button key={type} onClick={() => { setSearchType(type); setShowSearchDropdown(false); }} className={`w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors ${searchType === type ? "bg-blue-50 text-[#1347e5]" : ""}`}>
                          <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-sm">{type}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <button onClick={handleSearch} className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity">
                <img className="w-12 h-12" alt="Button" src="https://c.animaapp.com/micwvcetKEVWir/img/button.svg" />
              </button>
            </div>
          </div>
        </aside>

        {/* RIGHT PANEL - SCROLLABLE */}
        <main className="flex-1 bg-[#f8fafc] overflow-y-auto">
          {activeTab === "copilot" ? (
            <div className="h-full flex flex-col items-center justify-center gap-8 p-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <img
                  className="w-12 h-12"
                  alt="Copilot Icon"
                  src="https://c.animaapp.com/micwvcetKEVWir/img/icon-20.svg"
                />
              </div>
              <div className="flex flex-col items-center gap-2">
                <h3 className="[font-family:'Arial-Bold',Helvetica] font-bold text-[#314157] text-lg text-center leading-6">
                  AI Copilot
                </h3>
                <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-sm text-center leading-5 max-w-[448px]">
                  Your intelligent assistant for diagnostics and troubleshooting
                </p>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#1347e5] text-sm">
                  Coming Soon
                </span>
              </div>
            </div>
          ) : (
          <div className="flex flex-col gap-6 p-6">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-4">
                <img className="w-[72px] h-[72px] -ml-3 -mt-3.5 -mb-3.5" alt="Container" src="https://c.animaapp.com/micwvcetKEVWir/img/container-1.svg" />
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <h1 className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#070f26] text-2xl leading-9">INC0012345</h1>
                    <Badge className="h-auto px-2 py-0.5 rounded-lg text-xs bg-[#ffe2e2] text-[#c10007] border-[0.67px] border-[#ffc9c9]">High Priority</Badge>
                    <Badge className="h-auto px-2 py-0.5 rounded-lg text-xs bg-blue-100 text-[#1347e5] border-0">In Progress</Badge>
                  </div>
                  <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#5876ab] text-sm leading-6">Laptop running extremely slow - unable to work</p>
                </div>
              </div>
              <div className="flex gap-3">
                <Card className="p-4 rounded-[10px] border-[0.67px] border-[#e1e8f0] bg-white shadow-sm">
                  <CardContent className="p-0 flex flex-col gap-2">
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">Time in Progress</p>
                    <p className="[font-family:'Arial-Bold',Helvetica] font-bold text-[#0e162b] text-xl leading-6">2d 5h</p>
                  </CardContent>
                </Card>
                <Card className="p-4 rounded-[10px] border-[0.67px] border-[#e1e8f0] bg-white shadow-sm">
                  <CardContent className="p-0 flex flex-col gap-2">
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">Similar Cases</p>
                    <p className="[font-family:'Arial-Bold',Helvetica] font-bold text-[#0e162b] text-xl leading-6">12</p>
                  </CardContent>
                </Card>
                <Card className="p-4 rounded-[10px] border-[0.67px] border-[#e1e8f0] bg-white shadow-sm">
                  <CardContent className="p-0 flex flex-col gap-2">
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">Resolution Rate</p>
                    <p className="[font-family:'Arial-Bold',Helvetica] font-bold text-[#00a63e] text-xl leading-6">94%</p>
                  </CardContent>
                </Card>
              </div>
            </div>

            <div className="flex gap-4">
              <Card className="w-[280px] p-6 rounded-[14px] border-[0.67px] border-[#e1e8f0] bg-white shadow-sm">
                <CardContent className="p-0 flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-5 h-5" />
                    <h3 className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#070f26] text-base leading-6">Ticket Details</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="flex gap-3 pb-3 border-b-[0.67px] border-[#e1e8f0]">
                      <img className="w-4 h-4 mt-1" alt="Icon" src="https://c.animaapp.com/micwvcetKEVWir/img/icon-7.svg" />
                      <div className="flex flex-col">
                        <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#5876ab] text-xs leading-4">Reporter</span>
                        <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#070f26] text-sm leading-5">John Doe</span>
                        <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#5876ab] text-xs leading-4">john.doe@company.com</span>
                      </div>
                    </div>
                    <div className="flex gap-3 pb-3 border-b-[0.67px] border-[#e1e8f0]">
                      <CalendarIcon className="w-4 h-4 mt-1" />
                      <div className="flex flex-col">
                        <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#5876ab] text-xs leading-4">Created</span>
                        <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#070f26] text-sm leading-5">2025-11-13 09:23 AM</span>
                      </div>
                    </div>
                    <div className="flex gap-3 pb-3 border-b-[0.67px] border-[#e1e8f0]">
                      <RefreshCwIcon className="w-4 h-4 mt-1" />
                      <div className="flex flex-col">
                        <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#5876ab] text-xs leading-4">Last Updated</span>
                        <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#070f26] text-sm leading-5">2025-11-15 02:45 PM</span>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <ClockIcon className="w-4 h-4 mt-1" />
                      <div className="flex flex-col">
                        <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#5876ab] text-xs leading-4">SLA Status</span>
                        <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#070f26] text-sm leading-5">Within SLA (18 hours remaining)</span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="flex-1 p-6 rounded-[14px] border-[0.67px] border-[#e1e8f0] bg-white shadow-sm">
                <CardContent className="p-0 flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <LightbulbIcon className="w-5 h-5" />
                    <h3 className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#070f26] text-base leading-6">Knowledge</h3>
                  </div>
                  <div className="flex flex-col gap-4">
                    {rootCauseData.map((cause, index) => (
                      <div key={index} className="flex flex-col gap-2 pb-4 border-b-[0.67px] border-[#e1e8f0] last:border-0 last:pb-0">
                        <div className="flex items-start justify-between">
                          <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#070f26] text-sm leading-5 flex-1">{cause.title}</p>
                          <Badge className="h-auto px-2 py-0.5 rounded-lg text-xs bg-blue-100 text-[#1347e5] border-0">{cause.confidence}</Badge>
                        </div>
                        <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#5876ab] text-xs leading-4">{cause.description}</p>
                        <Progress value={cause.progress} className="h-1.5 bg-slate-200" />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="w-[280px] p-6 rounded-[14px] border-[0.67px] border-[#e1e8f0] bg-white shadow-sm">
                <CardContent className="p-0 flex flex-col gap-6">
                  <div className="flex items-center gap-2">
                    <ZapIcon className="w-5 h-5" />
                    <h3 className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#070f26] text-base leading-6">Actions</h3>
                  </div>
                  <div className="flex flex-col gap-3">
                    {actionsData.map((action, index) => (
                      <div key={index} className="flex flex-col gap-3 p-4 bg-[#f8fafc] rounded-lg border-[0.67px] border-[#e1e8f0]">
                        <div className="flex items-start justify-between gap-2">
                          <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-sm leading-5 flex-1">{action.title}</p>
                          <Badge className={`h-auto px-2 py-0.5 rounded-lg text-xs border-[0.67px] ${action.priorityColor} flex-shrink-0`}>{action.priority}</Badge>
                        </div>
                        <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#5876ab] text-xs leading-4">{action.description}</p>
                        <div className="flex flex-col gap-1">
                          <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#90a1b8] text-xs leading-4">{action.duration}</span>
                          <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#90a1b8] text-xs leading-4">{action.confidence}</span>
                        </div>
                        <Button className="w-full h-auto px-4 py-2 rounded-lg bg-[#155cfb] hover:bg-[#1250dc] gap-2">
                          <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-white text-sm">Execute</span>
                          <ChevronRightIcon className="w-4 h-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          )}
        </main>
      </div>

      {/* FOOTER - FIXED AT BOTTOM */}
      <footer className="flex-shrink-0 flex items-center justify-between px-8 py-2 bg-[#fffffff2] border-t-[0.67px] border-[#e1e8f0] shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a] h-[41px]">
        <div className="flex items-center gap-6">
          <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">System Status:</span>
          <div className="flex items-center gap-6">
            {systemStatusData.map((system) => (
              <div key={system.name} className="flex items-center gap-2 px-2 rounded">
                <div className={`w-2 h-2 ${system.color} rounded-full opacity-[0.98]`} />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#314157] text-xs leading-4">{system.name}</span>
              </div>
            ))}
          </div>
        </div>
        <button className="flex items-center gap-1 transition-opacity hover:opacity-70">
          <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">Details</span>
          <img className="w-4 h-4" alt="Arrow icon" src="https://c.animaapp.com/micwvcetKEVWir/img/icon-29.svg" />
        </button>
      </footer>
    </div>
  );
};
