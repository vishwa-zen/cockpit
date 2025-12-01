import {
  ChevronDownIcon,
  ChevronRightIcon,
  LogOutIcon,
  Bot,
  SearchIcon,
  ClockIcon,
  MonitorIcon,
  Command,
  TicketIcon,
  InfoIcon,
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { Avatar, AvatarFallback } from "../../../../components/ui/avatar";
import { Badge } from "../../../../components/ui/badge";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../../../components/ui/tabs";
import { MockDataToggle } from "../../../../components/ui/mock-data-toggle";
import { serviceNowService, type Ticket } from "../../../../services/serviceNowService";

const systemStatuses = [
  { name: "ServiceNow", status: "online", color: "bg-[#00c950]" },
  { name: "Tachyon", status: "online", color: "bg-[#00c950]" },
  { name: "Nexthink", status: "warning", color: "bg-[#f0b100]" },
  { name: "Intune / SCCM", status: "online", color: "bg-[#00c950]" },
];

export const IssueSearchSection = (): JSX.Element => {
  const navigate = useNavigate();
  const { instance, accounts } = useMsal();
  const [searchQuery, setSearchQuery] = useState("INC0012");
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [filteredTickets, setFilteredTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchType, setSearchType] = useState<"User" | "Device" | "Ticket">("Ticket");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("search");

  const activeAccount = accounts[0];
  const userName = activeAccount?.name || "User";
  const userEmail = activeAccount?.username || "user@company.com";
  const userInitials = activeAccount?.name 
    ? activeAccount.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
    : "U";

  useEffect(() => {
    loadAndSearchTickets();
  }, []);

  const loadAndSearchTickets = async () => {
    setLoading(true);
    try {
      const results = await serviceNowService.searchIncidents(searchQuery);
      setTickets(results);
      setFilteredTickets(results);
    } catch (error) {
      console.error("Failed to load tickets:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleTicketClick = (ticketId: string) => {
    navigate(`/issue/${ticketId}`);
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

  const handleLogout = async () => {
    try {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("refresh_token");
      
      await instance.logoutPopup({
        postLogoutRedirectUri: window.location.origin,
        mainWindowRedirectUri: window.location.origin
      });
      
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      window.location.href = "/login";
    }
  };

  return (
    <section className="relative w-full h-screen flex flex-col bg-[linear-gradient(135deg,rgba(248,250,252,1)_0%,rgba(239,246,255,0.3)_50%,rgba(241,245,249,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)]">
      <MockDataToggle />
      <header className="flex flex-col items-start pt-4 pb-[0.67px] px-8 bg-[#ffffffcc] border-b-[0.67px] border-[#e1e8f0] flex-shrink-0">
        <div className="flex h-10 items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center shadow-md">
              <Command className="w-6 h-6 text-white" />
            </div>
            <div className="flex flex-col">
              <div className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-base leading-6">
                FS Cockpit
              </div>
              <div className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">
                Diagnostics Platform
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 relative z-50">
            <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#45556c] text-xs leading-4 select-none">
              {userEmail}
            </span>
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="relative focus:outline-none block"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2b7fff] to-[#ad46ff] flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity">
                  <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-white text-xs">
                    {userInitials}
                  </span>
                </div>
              </button>
              
              {showUserMenu && (
                <div className="absolute top-10 right-0 w-48 bg-white rounded-lg shadow-[0px_4px_12px_rgba(0,0,0,0.1)] border border-[#e1e8f0] py-2 mt-2 z-50">
                  <div className="px-4 py-2 border-b border-[#e1e8f0]">
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-sm truncate">
                      {userName}
                    </p>
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs truncate">
                      {userEmail}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full px-4 py-2 text-left hover:bg-slate-50 transition-colors flex items-center gap-2 text-[#0e162b]"
                  >
                    <LogOutIcon className="w-4 h-4 text-[#61738d]" />
                    <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-sm">
                      Sign Out
                    </span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 bg-slate-50 overflow-hidden">
        <aside className="w-[480px] bg-white border-r-[0.67px] border-[#e1e8f0] flex flex-col">
          <Tabs defaultValue="search" onValueChange={setActiveTab} className="w-full flex flex-col flex-1 overflow-hidden">
            <TabsList className="w-full h-[47px] bg-white rounded-none border-b-[0.67px] border-[#e1e8f0] p-0">
              <TabsTrigger
                value="search"
                className="flex-1 h-full rounded-none data-[state=active]:bg-[#eff6ff] data-[state=active]:border-[#155cfb] data-[state=active]:border data-[state=active]:text-[#1347e5] gap-3.5 px-[35px] py-[11px]"
              >
                <SearchIcon className="w-4 h-4" />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-sm leading-5">
                  Unified Search
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="copilot"
                className="flex-1 h-full rounded-none gap-3.5 px-[82px] py-3"
              >
                <Bot className="w-4 h-4" />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-sm leading-5">
                  Copilot
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="m-0 flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-4 p-4">
                <Card className="border-[0.67px] border-[#e1e8f0] shadow-[0px_4px_6px_-4px_#0000001a,0px_10px_15px_-3px_#0000001a] rounded-[14px]">
                  <CardContent className="pt-3 pb-[0.67px] px-4 border-b-[0.67px] border-[#e1e8f0] bg-[linear-gradient(90deg,rgba(248,250,252,1)_0%,rgba(239,246,255,1)_100%)]">
                    <div className="flex items-center gap-2 mb-2">
                      <TicketIcon className="w-4 h-4 text-[#0e162b]" />
                      <h2 className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-sm leading-5">
                        Filtered Results
                      </h2>
                    </div>
                    <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4 pb-3">
                      Active and recent tickets requiring attention
                    </p>
                  </CardContent>
                </Card>

                <div className="flex flex-col gap-3">
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
                    <Card
                      key={ticket.id}
                      onClick={() => handleTicketClick(ticket.id)}
                      className="border-[0.67px] border-[#0000001a] rounded-[14px] cursor-pointer hover:shadow-lg transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1.5 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="[font-family:'Consolas-Regular',Helvetica] font-normal text-[#155cfb] text-sm leading-5">
                                  {ticket.incidentNumber}
                                </span>
                                <Badge
                                  className={`${ticket.statusColor} h-auto px-2 py-0.5 text-xs [font-family:'Arial-Regular',Helvetica] font-normal leading-4 border-[0.67px]`}
                                >
                                  {ticket.status}
                                </Badge>
                              </div>
                              <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-sm leading-5">
                                {ticket.title}
                              </p>
                            </div>
                            <ChevronRightIcon className="w-5 h-5 text-gray-400 flex-shrink-0 ml-2" />
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <ClockIcon className="w-3 h-3 text-[#61738d]" />
                              <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">
                                {ticket.timeAgo}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MonitorIcon className="w-3 h-3 text-[#61738d]" />
                              <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">
                                {ticket.device}
                              </span>
                            </div>
                            <Badge
                              className={`${ticket.priorityColor} h-auto px-2 py-0.5 text-xs [font-family:'Arial-Regular',Helvetica] font-normal leading-4 border-[0.67px]`}
                            >
                              {ticket.priority}
                            </Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                  )}
                </div>
                </div>
              </div>

            </TabsContent>

            <TabsContent value="copilot" className="m-0 flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto flex flex-col items-center justify-center gap-6 p-8">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                    <img
                      className="w-10 h-10"
                      alt="Copilot Icon"
                      src="https://c.animaapp.com/micwvcetKEVWir/img/icon-20.svg"
                    />
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

          {/* SEARCH BAR - FIXED AT BOTTOM */}
          <div className="flex-shrink-0 pt-4 px-4 pb-4 bg-white border-t-[0.67px] border-[#e1e8f0]">
            <div className="flex items-center gap-3 w-full">
              <div className="flex-1 flex items-center gap-3 px-3 py-2.5 bg-white rounded-lg border-[0.67px] border-[#e1e8f0] shadow-[0px_1px_2px_-1px_#0000001a,0px_1px_3px_#0000001a]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                  placeholder={`Enter ${searchType.toLowerCase()} name or number...`}
                  className="flex-1 bg-transparent border-0 outline-none [font-family:'Arial-Regular',Helvetica] font-normal text-gray-700 text-sm leading-5"
                />
                <div className="relative">
                  <Button 
                    onClick={() => setShowSearchDropdown(!showSearchDropdown)}
                    className="h-auto px-4 py-2 rounded-[10px] shadow-[0px_6px_18px_#1f6feb1f] bg-[linear-gradient(0deg,rgba(31,111,235,1)_0%,rgba(74,163,255,1)_100%)] hover:opacity-90"
                  >
                    <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-white text-[13.3px]">
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
              <button
                onClick={handleSearch}
                className="w-12 h-12 flex items-center justify-center hover:opacity-80 transition-opacity"
              >
                <img
                  className="w-12 h-12"
                  alt="Button"
                  src="https://c.animaapp.com/micwvcetKEVWir/img/button.svg"
                />
              </button>
            </div>
          </div>
        </aside>

        <main className="flex-1 flex flex-col items-center justify-center pt-[180px] pb-0 px-[175px] bg-slate-50 min-h-[552px]">
          {activeTab === "copilot" ? (
            <div
              className="flex flex-col items-center gap-8 translate-y-[-1rem] animate-fade-in opacity-0"
              style={{ "--animation-delay": "200ms" } as React.CSSProperties}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center">
                <Bot className="w-12 h-12 text-blue-600" />
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
            <div
              className="flex flex-col items-center gap-8 translate-y-[-1rem] animate-fade-in opacity-0"
              style={{ "--animation-delay": "200ms" } as React.CSSProperties}
            >
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <SearchIcon className="w-12 h-12 text-white" />
              </div>
              <div className="flex flex-col items-center gap-2">
                <h3 className="[font-family:'Arial-Bold',Helvetica] font-bold text-[#314157] text-base text-center leading-6">
                  FS Cockpit
                </h3>
                <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-sm text-center leading-5 max-w-[448px]">
                  Click on any ticket to view full details and diagnostics here.
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
            <div className="flex items-center gap-4">
              {systemStatuses.map((system) => (
                <div
                  key={system.name}
                  className="flex items-center gap-2 px-2 rounded"
                >
                  <div
                    className={`w-2 h-2 ${system.color} rounded-full opacity-[0.67]`}
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
