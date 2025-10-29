import { useState } from "react";
import { getLandingContent, saveLandingContent, type LandingContent } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Save } from "lucide-react";

const LandingContentTab = () => {
  const [content, setContent] = useState<LandingContent>(getLandingContent());

  const handleSave = () => {
    saveLandingContent(content);
    toast.success("Landing page content updated successfully!");
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Edit Landing Page Content</h2>
      
      <div className="space-y-6">
        <div>
          <Label htmlFor="title" className="text-foreground">Title</Label>
          <Input
            id="title"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="mt-2 bg-input border-border text-foreground"
            placeholder="Enter page title"
          />
        </div>

        <div>
          <Label htmlFor="description" className="text-foreground">Description</Label>
          <Textarea
            id="description"
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            className="mt-2 bg-input border-border text-foreground min-h-[120px]"
            placeholder="Enter page description"
          />
        </div>

        <Button 
          onClick={handleSave}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Save className="w-4 h-4 mr-2" />
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default LandingContentTab;
