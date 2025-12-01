import { useMsal } from "@azure/msal-react";
import { ChevronRight, Info, Sparkles, Activity, Layers } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginRequest } from "../../../../config/msalConfig";
import { Alert, AlertDescription } from "../../../../components/ui/alert";
import { Button } from "../../../../components/ui/button";
import { Card, CardContent } from "../../../../components/ui/card";

const features = [
  {
    icon: Sparkles,
    text: "Intelligent Diagnostics",
  },
  {
    icon: Activity,
    text: "Real-Time System Insights",
  },
  {
    icon: Layers,
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
      const response = await instance.loginPopup(loginRequest);
      
      // Store token
      if (response.accessToken) {
        localStorage.setItem("msal.token", response.accessToken);
        localStorage.setItem("msal.account", JSON.stringify(response.account));
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
      <div className="flex w-full min-h-screen items-center justify-center bg-gradient-to-br from-[#0f172b] via-[#1c398e] to-[#312c85] px-4 py-12">
        <div className="relative w-full max-w-[1024px] grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div className="relative flex flex-col gap-6">
            <div className="flex flex-col gap-4">
              <h1 className="font-sans font-normal text-white text-5xl tracking-[0] leading-[48px]">
                FS Cockpit
              </h1>

              <p className="font-sans font-normal text-[#bddaff] text-lg tracking-[0] leading-7">
                Unified Diagnostics Platform for IT Excellence
              </p>
            </div>

            <div className="flex flex-col gap-4">
              {features.map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center">
                      <IconComponent className="w-5 h-5 text-white" />
                    </div>
                    <span className="font-sans font-normal text-[#daeafe] text-sm tracking-[0] leading-5">
                      {feature.text}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <Card className="bg-white rounded-2xl shadow-[0px_25px_50px_-12px_#00000040] border-0">
            <CardContent className="flex flex-col gap-6 p-8">
              <header className="flex flex-col gap-1">
                <h2 className="font-sans font-normal text-[#0e162b] text-base tracking-[0] leading-6">
                  Welcome Back
                </h2>
                <p className="font-sans font-normal text-[#61738d] text-sm tracking-[0] leading-5">
                  Sign in to access your diagnostic workspace
                </p>
              </header>

              {error && (
                <Alert className="bg-red-50 border-red-200">
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
                <div className="w-10 h-10 rounded-lg bg-white/20 flex items-center justify-center">
                  <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none">
                    <path d="M11.4 24H0V12.6H11.4V24Z" fill="#F25022"/>
                    <path d="M24 24H12.6V12.6H24V24Z" fill="#00A4EF"/>
                    <path d="M11.4 11.4H0V0H11.4V11.4Z" fill="#7FBA00"/>
                    <path d="M24 11.4H12.6V0H24V11.4Z" fill="#FFB900"/>
                  </svg>
                </div>
                <div className="flex flex-col items-start flex-1">
                  <span className="font-sans font-normal text-white text-sm tracking-[0] leading-5">
                    {isLoading ? "Signing in..." : "Sign in with"}
                  </span>
                  <span className="font-sans font-normal text-white text-xs tracking-[0] leading-4 opacity-90">
                    Microsoft Azure AD B2C
                  </span>
                </div>
                <ChevronRight className="w-4 h-4 text-white" />
              </Button>

              <Alert className="bg-[#eff6ff] border-[#bddaff] rounded-[10px]">
                <Info className="w-5 h-5 text-[#1b388e]" />
                <AlertDescription className="flex flex-col gap-1 ml-2">
                  <span className="font-sans font-normal text-[#1b388e] text-sm tracking-[0] leading-5">
                    Secure Enterprise Access
                  </span>
                  <span className="font-sans font-normal text-[#1347e5] text-xs tracking-[0] leading-4">
                    Authentication is handled through your organization's
                    Microsoft Azure AD B2C. Your credentials are never
                    stored by FS Cockpit.
                  </span>
                </AlertDescription>
              </Alert>

              <p className="font-sans font-normal text-[#90a1b8] text-xs text-center tracking-[0] leading-4">
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
