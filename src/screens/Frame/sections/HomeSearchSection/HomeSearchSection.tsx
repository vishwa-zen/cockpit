import {
  ChevronDownIcon,
  ClockIcon,
  InfoIcon,
  LogOutIcon,
  MonitorIcon,
  SearchIcon,
  TicketIcon,
  Bot,
  Command,
  LayoutDashboard,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../../../../components/ui/card";
import { Input } from "../../../../components/ui/input";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { ScrollArea } from "../../../../components/ui/scroll-area";
import { MockDataToggle } from "../../../../components/ui/mock-data-toggle";
import { TicketDetailsPanel } from "../../../../components/TicketDetailsPanel";
import { serviceNowService, type Ticket } from "../../../../services/serviceNowService";

const systemStatusData = [
  { name: "ServiceNow", status: "operational", color: "bg-[#00c950]" },
  { name: "Tachyon", status: "operational", color: "bg-[#00c950]" },
  { name: "Nexthink", status: "degraded", color: "bg-[#f0b100]" },
  { name: "Intune / SCCM", status: "operational", color: "bg-[#00c950]" },
];

export const HomeSearchSection = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchType, setSearchType] = useState<"User" | "Device" | "Ticket">("Ticket");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("unified-search");

  // Load tickets on mount
  useEffect(() => {
    loadTickets();
  }, []);

  // Load tickets from API
  const loadTickets = async () => {
    setLoading(true);
    try {
      const data = await serviceNowService.getMyIncidents();
      setTickets(data);
      setFilteredTickets(data);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setLoading(true);
      try {
        const results = await serviceNowService.searchIncidents(searchQuery);
        setFilteredTickets(results);
        
        if (results.length > 0) {
          navigate(`/issue/${results[0].id}`);
        }
      } catch (error) {
        console.error("Search failed:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setFilteredTickets(tickets);
    }
  };

  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);

  const handleTicketClick = async (ticketId: string) => {
    setSelectedTicketId(ticketId);
    const ticket = tickets.find(t => t.id === ticketId);
    setSelectedTicket(ticket || null);
  };

  const handleLogout = async () => {
    try {
      // Clear local storage tokens first
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      
      // Trigger MSAL logout
      await instance.logoutPopup({
        postLogoutRedirectUri: window.location.origin,
        mainWindowRedirectUri: window.location.origin
      });
      
      // Force navigation to login if redirect doesn't happen automatically
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Fallback: force reload to clear state
      window.location.href = "/login";
    }
  };

  return (
    <section className="relative w-full h-screen flex flex-col bg-[linear-gradient(135deg,rgba(248,250,252,1)_0%,rgba(239,246,255,0.3)_50%,rgba(241,245,249,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)]">
      <MockDataToggle />
      <header className="flex items-center justify-between px-8 py-4 bg-[#ffffffcc] border-b-[0.67px] border-[#e1e8f0] flex-shrink-0">
        <div className="flex items-center gap-3 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
            <Command className="w-6 h-6 text-white" />
          </div>
          <div className="flex flex-col">
            <h1 className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-base leading-6">
              FS Cockpit
            </h1>
            <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">
              Diagnostics Platform
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms] relative">
          <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#45556c] text-xs leading-4">
            john.doe@company.com
          </span>
              <Button
                size="icon"
                onClick={handleSearch}
                className="w-12 h-12 rounded-lg bg-[#155cfb] hover:bg-[#1250dc]"
              >
                <SearchIcon className="w-5 h-5 text-white" />
              </Button>
          
          {showUserMenu && (
            <div className="absolute top-12 right-0 w-48 bg-white rounded-lg shadow-lg border border-[#e1e8f0] py-2 z-50">
              <div className="px-4 py-2 border-b border-[#e1e8f0]">
                <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-sm">
                  John Doe
                </p>
                <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs">
                  john.doe@company.com
                </p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                <LogOutIcon className="w-4 h-4 text-[#61738d]" />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-sm">
                  Sign Out
                </span>
              </button>
            </div>
          )}
        </div>
      </header>

      <div className="flex flex-1 bg-slate-50 overflow-hidden">
        <aside className="w-[480px] bg-white border-r-[0.67px] border-[#e1e8f0] flex flex-col">
          <Tabs defaultValue="unified-search" onValueChange={setActiveTab} className="w-full flex flex-col flex-1 overflow-hidden">
            <TabsList className="w-full h-[47px] rounded-none bg-white border-b-[0.67px] border-[#e1e8f0] p-0 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
              <TabsTrigger
                value="unified-search"
                className="flex-1 h-full rounded-none data-[state=active]:bg-[#eff6ff] data-[state=active]:border-2 data-[state=active]:border-[#155cfb] data-[state=active]:text-[#1347e5] gap-3.5 transition-colors"
              >
                <SearchIcon className="w-4 h-4" />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-sm leading-5">
                  Unified Search
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="copilot"
                className="flex-1 h-full rounded-none data-[state=active]:bg-[#eff6ff] data-[state=active]:border-2 data-[state=active]:border-[#155cfb] data-[state=active]:text-[#1347e5] gap-3.5 transition-colors"
              >
                <Bot className="w-4 h-4" />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-neutral-950 text-sm leading-5">
                  Copilot
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="unified-search" className="mt-0 p-0 flex-1 overflow-y-auto">
                <div className="p-4 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:600ms]">
                  <Card className="border-[0.67px] border-[#e1e8f0] shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a] rounded-[14px]">
                    <CardContent className="pt-3 pb-[0.67px] px-4 border-b-[0.67px] border-[#e1e8f0] bg-[linear-gradient(90deg,rgba(248,250,252,1)_0%,rgba(239,246,255,1)_100%)]">
                      <div className="flex items-center gap-2 mb-2">
                        <TicketIcon className="w-4 h-4" />
                        <h2 className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-sm leading-5">
                          My Tickets
                        </h2>
                      </div>
                      <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4 pb-3">
                        Quick access to tickets assigned to you.
                      </p>
                    </CardContent>
                    <CardContent className="p-4 space-y-3">
                    {loading ? (
                      <div className="text-center py-8">
                        <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-sm">
                          Loading tickets...
                        </p>
                      </div>
                    ) : filteredTickets.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-sm">
                          No tickets found matching your search
                        </p>
                      </div>
                    ) : (
                      filteredTickets.map((ticket, index) => (
                      <article
                        key={ticket.id}
                        onClick={() => handleTicketClick(ticket.id)}
                        className={`flex items-start justify-between cursor-pointer p-3 -mx-1 rounded-lg transition-colors border ${
                          selectedTicketId === ticket.id
                            ? "bg-blue-50 border-[#60a5fa]"
                            : "border-transparent hover:border-[#e1e8f0] hover:bg-slate-50"
                        }`}
                      >
                        <div className="flex flex-col gap-1.5 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="[font-family:'Consolas-Regular',Helvetica] font-normal text-[#155cfb] text-sm leading-normal">
                              {ticket.incidentNumber}
                            </span>
                            <Badge
                              className={`h-[21.33px] px-2 py-0.5 rounded-lg border-[0.67px] ${ticket.statusColor} [font-family:'Arial-Regular',Helvetica] font-normal text-xs leading-4`}
                            >
                              {ticket.status}
                            </Badge>
                          </div>
                          <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-sm leading-5">
                            {ticket.title}
                          </p>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <MonitorIcon className="w-3 h-3 text-[#61738d]" />
                              <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">
                                {ticket.device}
                              </span>
                            </div>
                            <Badge
                              className={`h-[21.33px] px-2 py-0.5 rounded-lg border-[0.67px] ${ticket.priorityColor} [font-family:'Arial-Regular',Helvetica] font-normal text-xs leading-4`}
                            >
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                          <ClockIcon className="w-3 h-3 text-[#61738d]" />
                          <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">
                            {ticket.timeAgo}
                          </span>
                        </div>
                      </article>
                    ))
                    )}
                    </CardContent>
                  </Card>
                </div>
            </TabsContent>

            <TabsContent value="copilot" className="mt-0 p-0 flex-1 overflow-y-auto">
              <div className="h-full flex flex-col items-center justify-center gap-6 p-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <Bot className="w-10 h-10 text-blue-600" />
                  </div>
                  <div className="flex flex-col items-center gap-2">
                    <h3 className="[font-family:'Arial-Bold',Helvetica] font-bold text-[#314157] text-lg leading-6">
                      AI Copilot
                    </h3>
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-sm text-center leading-5 max-w-[320px]">
                      Your intelligent assistant for diagnostics and troubleshooting
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
                  <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#1347e5] text-sm">
                    Coming Soon
                  </span>
                </div>
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex-shrink-0 pt-4 px-4 pb-4 bg-white border-t-[0.67px] border-[#e1e8f0]">
                <div className="flex items-center gap-3 w-full">
                  <div className="flex-1 flex items-center gap-3 px-3 py-2.5 bg-white rounded-lg border-[0.67px] border-[#e1e8f0] shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a]">
                    <Input
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                      placeholder={`Enter ${searchType.toLowerCase()} name or number...`}
                      className="border-0 shadow-none p-0 h-auto [font-family:'Arial-Regular',Helvetica] font-normal text-[#717182] text-xs placeholder:text-[#717182] focus-visible:ring-0"
                    />
                    <div className="relative">
                      <Button 
                        onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                        className="h-auto px-4 py-2 rounded-[10px] shadow-[0px_6px_18px_#1f6feb1f] bg-[linear-gradient(0deg,rgba(31,111,235,1)_0%,rgba(74,163,255,1)_100%)] hover:opacity-90 transition-opacity"
                      >
                        <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-white text-[13.3px] leading-normal">
                          {searchType}
                        </span>
                        <ChevronDownIcon className="w-4 h-4 ml-2" />
                      </Button>
                      
                      {showSearchDropdown && (
                        <div className="absolute bottom-full right-0 mb-2 w-32 bg-white rounded-lg shadow-lg border border-[#e1e8f0] py-1 z-50">
                          {(["User", "Device", "Ticket"] as const).map((type) => (
                            <button
                              key={type}
                              onClick={() => {
                                setSearchType(type);
                                setShowSearchDropdown(false);
                              }}
                              className={`w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors ${
                                searchType === type ? "bg-blue-50 text-[#1347e5]" : ""
                              }`}
                            >
                              <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-sm">
                                {type}
                              </span>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  <Button
                    size="icon"
                    onClick={handleSearch}
                    className="w-12 h-12 rounded-lg bg-transparent hover:bg-slate-100 transition-colors p-0"
                  >
                    <img
                      className="w-12 h-12"
                      alt="SearchIcon Button"
                      src="https://c.animaapp.com/micwvcetKEVWir/img/button.svg"
                    />
                  </Button>
                </div>
              </div>
        </aside>

        <main className="flex-1 bg-slate-50 overflow-y-auto">
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
                <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-[#314157] text-lg text-center leading-6">
                  AI Copilot
                </h2>
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
          ) : selectedTicket ? (
            <TicketDetailsPanel ticket={selectedTicket} />
          ) : (
            <div className="h-full flex flex-col items-center justify-center gap-8 p-6">
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center">
                <LayoutDashboard className="w-12 h-12 text-slate-400" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <h2 className="[font-family:'Arial-Bold',Helvetica] font-bold text-[#314157] text-base text-center leading-6">
                  FS Cockpit
                </h2>
                <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-sm text-center leading-5 max-w-[448px]">
                  Click on any ticket from "My Tickets" to view details and diagnostics here.
                </p>
              </div>
            </div>
          )}
        </main>
      </div>

      <footer className="flex-shrink-0 flex items-center justify-between px-8 py-2 bg-[#fffffff2] border-t-[0.67px] border-[#e1e8f0] shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a] h-[41px]">
          <div className="flex items-center gap-6">
            <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">
              System Status:
            </span>
            <div className="flex items-center gap-6">
              {systemStatusData.map((system, index) => (
                <div
                  key={`system-${index}`}
                  className="flex items-center gap-2 px-2 py-0 rounded"
                >
                  <div
                    className={`w-2 h-2 ${system.color} rounded-full opacity-[0.98]`}
                  />
                  <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#314157] text-xs leading-4">
                    {system.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <button className="flex items-center gap-1 transition-opacity hover:opacity-70">
            <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">
              Details
            </span>
            <InfoIcon className="w-4 h-4 text-[#61738d]" />
          </button>
      </footer>
    </section>
  );
};
