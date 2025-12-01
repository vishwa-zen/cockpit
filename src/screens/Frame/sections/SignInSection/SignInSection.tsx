import { useMsal } from "@azure/msal-react";
import { ChevronRightIcon, InfoIcon } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../../../config/msalConfig";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

const features = [
  {
    icon: "https://c.animaapp.com/micwvcetKEVWir/img/container-6.svg",
    text: "Intelligent Diagnostics",
  },
  {
    icon: "https://c.animaapp.com/micwvcetKEVWir/img/container-8.svg",
    text: "Real-Time System Insights",
  },
  {
    icon: "https://c.animaapp.com/micwvcetKEVWir/img/container-13.svg",
    text: "Unified IT Operations",
  },
];

export const SignInSection = (): JSX.Element => {
  const navigate = useNavigate();
  const { instance } = useMsal();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSignIn = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Check if MSAL is configured properly
      if (!import.meta.env.VITE_AZURE_CLIENT_ID || import.meta.env.VITE_AZURE_CLIENT_ID === 'your-client-id-here') {
        console.warn("Azure AD not configured, using demo mode");
        // Demo mode - skip actual authentication
        sessionStorage.setItem("demo.user", JSON.stringify({
          username: "john.doe@company.com",
          name: "John Doe"
        }));
        navigate("/home");
        return;
      }

      const response = await instance.loginPopup(loginRequest);
      
      // Store token
      if (response.accessToken) {
        sessionStorage.setItem("msal.token", response.accessToken);
        sessionStorage.setItem("msal.account", JSON.stringify(response.account));
      }
      
      navigate("/home");
    } catch (err: any) {
      console.error("Login failed:", err);
      setError(err.message || "Authentication failed. Please try again.");
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
              <img
                className="absolute top-[-13px] left-[-38px] w-[156px] h-[156px]"
                alt="Container"
                src="https://c.animaapp.com/micwvcetKEVWir/img/container.svg"
              />
            </div>

            <div className="flex flex-col gap-4 pt-[90px]">
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
                  <img
                    className="w-10 h-10"
                    alt="Feature icon"
                    src={feature.icon}
                  />
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

              {error && (
                <Alert className="bg-red-50 border-red-200 mb-4">
                  <AlertDescription className="text-red-800">
                    {error}
                  </AlertDescription>
                </Alert>
              )}

              <Button 
                onClick={handleSignIn}
                disabled={isLoading}
                className="h-14 bg-[#155dfc] hover:bg-[#1250dc] rounded-lg justify-start gap-3 px-3 transition-colors disabled:opacity-50"
              >
                <img
                  className="w-10 h-10"
                  alt="Login screen"
                  src="https://c.animaapp.com/micwvcetKEVWir/img/loginscreen.svg"
                />
                <div className="flex flex-col items-start flex-1">
                <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-white text-sm tracking-[0] leading-5">
                  {isLoading ? "Signing in..." : "Sign in with"}
                </span>
                  <span className="[font-family:'Arial-Regular',Helvetica] font-normal text-white text-xs tracking-[0] leading-4 opacity-90">
                    Microsoft Azure Entra AD
                  </span>
                </div>
                <ChevronRightIcon className="w-4 h-4 text-white" />
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
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
