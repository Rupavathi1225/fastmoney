import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import LandingContentTab from "@/components/admin/LandingContentTab";
import SearchButtonsTab from "@/components/admin/SearchButtonsTab";
import WebResultsTab from "@/components/admin/WebResultsTab";
import { ExternalLink, LogOut } from "lucide-react";

const Admin = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("landing");

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold text-foreground">Admin Panel</h1>
            <div className="flex gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/landing')}
                className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
              >
                <ExternalLink className="w-4 h-4 mr-2" />
                View Site
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate('/')}
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-6xl">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8 bg-card border border-border">
            <TabsTrigger 
              value="landing"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Landing Content
            </TabsTrigger>
            <TabsTrigger 
              value="buttons"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Search Buttons
            </TabsTrigger>
            <TabsTrigger 
              value="results"
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
            >
              Web Results
            </TabsTrigger>
          </TabsList>

          <TabsContent value="landing">
            <LandingContentTab />
          </TabsContent>

          <TabsContent value="buttons">
            <SearchButtonsTab />
          </TabsContent>

          <TabsContent value="results">
            <WebResultsTab />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Admin;
