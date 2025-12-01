import { 
  ChevronRightIcon, 
  InfoIcon, 
  Loader2, 
  Command, 
  BrainCircuit, 
  Activity, 
  Network, 
  ShieldCheck 
} from "lucide-react";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal, useIsAuthenticated } from "@azure/msal-react";
import { loginRequest } from "../../../../config/authConfig";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";
import { toast } from "../../../../hooks/use-toast";

const features = [
  {
    Icon: BrainCircuit,
    text: "Intelligent Diagnostics",
  },
  {
    Icon: Activity,
    text: "Real-Time System Insights",
  },
  {
    Icon: Network,
    text: "Unified IT Operations",
  },
];

export const SignInSection = (): JSX.Element => {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const isAuthenticated = useIsAuthenticated();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async () => {
    if (!instance) {
      toast({
        title: "Configuration Error",
        description: "Authentication service is not initialized.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Try popup login first
      await instance.loginPopup(loginRequest);
      
      // Check if login was successful
      const account = instance.getActiveAccount();
      if (account) {
        toast({
          title: "Welcome back!",
          description: `Signed in as ${account.name}`,
          variant: "success",
        });
        navigate("/home");
      }
    } catch (error: any) {
      console.error("Popup login failed:", error);
      
      // If popup fails (e.g. blocked), try redirect
      if (error.name === "BrowserAuthError" && (error.message.includes("popup_window_error") || error.message.includes("empty_window_error"))) {
         try {
             await instance.loginRedirect(loginRequest);
             return; // loginRedirect will reload the page
         } catch (redirectError: any) {
             console.error("Redirect login failed:", redirectError);
             toast({
                title: "Sign in failed",
                description: redirectError.message || "Could not sign in. Please check console for details.",
                variant: "destructive",
              });
         }
      } else {
          console.error("Login error:", error);
          
          // Always allow fallback in dev/preview environments if auth fails
          // This ensures you never get stuck
          if (window.location.hostname.includes("webcontainer") || 
              window.location.hostname.includes("localhost") || 
              window.location.hostname.includes("127.0.0.1")) {
             
             toast({
                title: "Preview Mode Access",
                description: "Authentication unavailable in this environment. Entering guest mode.",
                variant: "warning",
              });
              
              // Immediate redirect
              navigate("/home");
              return;
          }

          toast({
            title: "Sign in failed",
            description: error.message || "Could not sign in with Microsoft. Please try again.",
            variant: "destructive",
          });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="relative w-full min-h-screen bg-white">
      <div className="flex w-full min-h-screen items-center justify-center bg-[linear-gradient(135deg,rgba(15,23,43,1)_0%,rgba(28,57,142,1)_50%,rgba(49,44,133,1)_100%)] px-4 py-12">
        <div className="relative w-full max-w-[1024px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative flex flex-col gap-6 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:0ms]">
            <div className="relative">
              <div className="absolute top-[-13px] left-[-38px] w-[156px] h-[156px] flex items-center justify-center opacity-10">
                <Command className="w-full h-full text-white" />
              </div>
            </div>

            <div className="flex flex-col gap-4 pt-[90px] relative z-10">
              <h1 className="[font-family:'Arial-Regular',Helvetica] font-normal text-white text-5xl tracking-[0] leading-[48px]">
                FS Cockpit
              </h1>

              <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#bddaff] text-lg tracking-[0] leading-7">
                Unified Diagnostics Platform for IT Excellence
              </p>
            </div>

            <div className="flex flex-col gap-4 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:200ms]">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center backdrop-blur-sm">
                    <feature.Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#daeafe] text-sm tracking-[0] leading-5">
                    {feature.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Card className="bg-white rounded-2xl shadow-[0px_25px_50px_-12px_#00000040] border-0 translate-y-[-1rem] animate-fade-in opacity-0 [--animation-delay:400ms]">
            <CardContent className="flex flex-col gap-6 p-8">
              <header className="flex flex-col gap-1">
                <h2 className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#0e162b] text-base tracking-[0] leading-6">
                  Welcome Back
                </h2>
                <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#61738d] text-sm tracking-[0] leading-5">
                  Sign in to access your diagnostic workspace
                </p>
              </header>

              <Button 
                onClick={handleSignIn}
                disabled={isLoading}
                className="h-14 bg-[#155dfc] hover:bg-[#1250dc] rounded-lg justify-start gap-3 px-3 transition-colors disabled:opacity-70 w-full"
              >
                {isLoading ? (
                  <div className="w-10 h-10 flex items-center justify-center">
                    <Loader2 className="w-6 h-6 text-white animate-spin" />
                  </div>
                ) : (
                  <div className="w-10 h-10 flex items-center justify-center bg-white/10 rounded-md">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                )}
                <div className="flex flex-col items-start flex-1">
                  <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5">
                    {isLoading ? "Signing in..." : "Sign in with"}
                  </span>
                  <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-white text-xs tracking-[0] leading-4 opacity-90">
                    Microsoft Azure Entra AD
                  </span>
                </div>
                {!isLoading && <ChevronRightIcon className="w-4 h-4 text-white" />}
              </Button>

              <Alert className="bg-[#eff6ff] border-[#bddaff] rounded-[10px]">
                <InfoIcon className="w-5 h-5 text-[#1b388e]" />
                <AlertDescription className="flex flex-col gap-1 ml-2">
                  <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#1b388e] text-sm tracking-[0] leading-5">
                    Secure Enterprise Access
                  </span>
                  <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#1347e5] text-xs tracking-[0] leading-4">
                    Authentication is handled through your organization's
                    Microsoft Azure Entra AD. Your credentials are never
                    stored by FS Cockpit.
                  </span>
                </AlertDescription>
              </Alert>

              <p className="[font-family:'Arial-Regular',Helvetica] font-normal text-[#90a1b8] text-xs text-center tracking-[0] leading-4">
                By signing in, you agree to our Terms of Service and Privacy
                Policy
              </p>
              
              {/* Always show Guest Login in Preview Mode */}
              <div className="pt-4 border-t border-slate-100 w-full">
                <Button 
                  variant="outline"
                  onClick={() => {
                    toast({
                      title: "Guest Access",
                      description: "Entering dashboard in preview mode.",
                      variant: "info",
                    });
                    navigate("/home");
                  }}
                  className="w-full text-xs h-10 border-dashed text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                >
                  Continue as Guest (Skip Login)
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
