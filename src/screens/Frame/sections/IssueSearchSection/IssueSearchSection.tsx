import {
  ChevronDown,
  ChevronRight,
  LogOut,
  Search,
  Clock,
  Monitor,
  Sparkles,
  Info,
  Layers,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const tickets = [
  {
    id: "INC0012345",
    status: "open",
    statusColor: "bg-[#ffedd4] text-[#c93400] border-transparent",
    title: "Outlook not responding on LAPTOP-8X7D2K",
    time: "2 hours ago",
    device: "LAPTOP-8X7D2K",
    priority: "high",
    priorityColor: "bg-[#ffe2e2] text-[#c10007] border-[#ffc9c9]",
  },
];

const systemStatuses = [
  { name: "ServiceNow", status: "online", color: "bg-[#00c950]" },
  { name: "Tachyon", status: "online", color: "bg-[#00c950]" },
  { name: "Nexthink", status: "warning", color: "bg-[#f0b100]" },
  { name: "Intune / SCCM", status: "online", color: "bg-[#00c950]" },
];

export const IssueSearchSection = (): JSX.Element => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("INC0012");
  const [filteredTickets, setFilteredTickets] = useState(tickets);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchType, setSearchType] = useState<"User" | "Device" | "Ticket">("Ticket");
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const [activeTab, setActiveTab] = useState("search");

  const handleTicketClick = (ticketId: string) => {
    navigate(`/issue/${ticketId}`);
  };

  const handleSearch = () => {
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      const filtered = tickets.filter(
        (ticket) =>
          ticket.id.toLowerCase().includes(query) ||
          ticket.title.toLowerCase().includes(query) ||
          ticket.device.toLowerCase().includes(query)
      );
      setFilteredTickets(filtered);
      
      if (filtered.length > 0) {
        navigate(`/issue/${filtered[0].id}`);
      }
    } else {
      setFilteredTickets(tickets);
    }
  };

  const handleLogout = () => {
    navigate("/login");
  };

  return (
    <section className="relative w-full h-screen flex flex-col bg-[linear-gradient(135deg,rgba(248,250,252,1)_0%,rgba(239,246,255,0.3)_50%,rgba(241,245,249,1)_100%),linear-gradient(0deg,rgba(255,255,255,1)_0%,rgba(255,255,255,1)_100%)]">
      <header className="flex flex-col items-start pt-4 pb-[0.67px] px-8 bg-[#ffffffcc] border-b-[0.67px] border-[#e1e8f0] flex-shrink-0">
        <div className="flex h-10 items-center justify-between w-full">
          <div className="flex items-center gap-3">
            <img
              className="w-16 h-16 mt-[-2.00px] mb-[-22.00px] ml-[-12.00px]"
              alt="Container"
              src="https://c.animaapp.com/micwvcetKEVWir/img/container-9.svg"
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
            <button
              onClick={() => setShowUserMenu(!showUserMenu)}
              className="relative"
            >
              <Avatar className="w-8 h-8 bg-[linear-gradient(135deg,rgba(43,127,255,1)_0%,rgba(173,70,255,1)_100%)] cursor-pointer hover:opacity-80 transition-opacity">
                <AvatarFallback className="bg-transparent text-white text-xs [font-family:'Arial-Regular',Helvetica]">
                  J
                </AvatarFallback>
              </Avatar>
            </button>
            
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
                  <LogOut className="w-4 h-4 text-[#61738d]" />
                  <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-sm">
                    Sign Out
                  </span>
                </button>
              </div>
            )}
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
                <Search className="w-4 h-4" />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-sm leading-5">
                  Unified Search
                </span>
              </TabsTrigger>
              <TabsTrigger
                value="copilot"
                className="flex-1 h-full rounded-none gap-3.5 px-[82px] py-3"
              >
                <Sparkles className="w-4 h-4" />
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-sm leading-5">
                  Copilot
                </span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="m-0 flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 overflow-y-auto">
                <div className="flex flex-col gap-4 p-4">
                <div className="flex flex-col gap-1">
                  <h2 className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-base leading-6">
                    Filtered Results
                  </h2>
                  <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-sm leading-5">
                    Active and recent tickets requiring attention
                  </p>
                </div>

                <div className="flex flex-col gap-3">
                  {filteredTickets.length === 0 ? (
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
                      className="border-[0.67px] border-[#0000001a] rounded-[14px] translate-y-[-1rem] animate-fade-in opacity-0 cursor-pointer hover:shadow-lg transition-shadow"
                      style={
                        {
                          "--animation-delay": `${index * 100}ms`,
                        } as React.CSSProperties
                      }
                    >
                      <CardContent className="p-4">
                        <div className="flex flex-col gap-2">
                          <div className="flex items-start justify-between">
                            <div className="flex flex-col gap-1 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="[font-family:'Consolas-Regular',Helvetica] font-normal text-[#155cfb] text-sm leading-5">
                                  {ticket.id}
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
                            <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                          </div>

                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-[#61738d]" />
                              <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-xs leading-4">
                                {ticket.time}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Monitor className="w-3 h-3 text-[#61738d]" />
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
                    <Sparkles className="w-10 h-10 text-blue-600" />
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
                    <ChevronDown className="w-4 h-4 ml-2" />
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
            <div
              className="flex flex-col items-center gap-8 translate-y-[-1rem] animate-fade-in opacity-0"
              style={{ "--animation-delay": "200ms" } as React.CSSProperties}
            >
              <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                <Layers className="w-12 h-12 text-white" />
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
            <span className="font-sans font-normal text-[#61738d] text-xs leading-4">
              Details
            </span>
            <Info className="w-4 h-4 text-[#61738d]" />
          </button>
      </footer>
    </section>
  );
};
