import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Save, Upload, Eye, Monitor, Smartphone } from "lucide-react";

interface PageBuilderSettings {
  logoUrl: string;
  logoPosition: "top-left" | "top-center" | "top-right";
  logoSize: string;
  mainImageUrl: string;
  imageRatio: "16:9" | "4:3" | "1:1" | "21:9";
  headline: string;
  headlineFontSize: string;
  headlineColor: string;
  headlineAlign: "left" | "center" | "right";
  description: string;
  descriptionFontSize: string;
  descriptionColor: string;
  ctaButtonText: string;
  ctaButtonColor: string;
  backgroundColor: string;
  backgroundImageUrl: string;
}

const defaultSettings: PageBuilderSettings = {
  logoUrl: "",
  logoPosition: "top-center",
  logoSize: "120",
  mainImageUrl: "",
  imageRatio: "16:9",
  headline: "Welcome to Our Platform",
  headlineFontSize: "48",
  headlineColor: "#000000",
  headlineAlign: "center",
  description: "Join thousands of users already benefiting from our service.",
  descriptionFontSize: "18",
  descriptionColor: "#666666",
  ctaButtonText: "Get Started Now",
  ctaButtonColor: "#6366f1",
  backgroundColor: "#ffffff",
  backgroundImageUrl: "",
};

const PageBuilderTab = () => {
  const [settings, setSettings] = useState<PageBuilderSettings>(defaultSettings);
  const [email, setEmail] = useState("");
  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">("desktop");

  const handleImageUpload = (field: "logoUrl" | "mainImageUrl" | "backgroundImageUrl", event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSettings({ ...settings, [field]: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = () => {
    localStorage.setItem("pageBuilderSettings", JSON.stringify(settings));
    toast.success("Page settings saved successfully!");
  };

  const getImageAspectRatio = () => {
    const ratios = {
      "16:9": "aspect-video",
      "4:3": "aspect-[4/3]",
      "1:1": "aspect-square",
      "21:9": "aspect-[21/9]",
    };
    return ratios[settings.imageRatio];
  };

  const getLogoPosition = () => {
    const positions = {
      "top-left": "justify-start",
      "top-center": "justify-center",
      "top-right": "justify-end",
    };
    return positions[settings.logoPosition];
  };

  const getTextAlign = () => {
    const aligns = {
      left: "text-left",
      center: "text-center",
      right: "text-right",
    };
    return aligns[settings.headlineAlign];
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Editor Panel */}
      <div className="space-y-6">
        <Card className="p-6 bg-card border-border">
          <h2 className="text-2xl font-bold text-foreground mb-6">Pre-Landing Page Builder</h2>
          
          {/* Logo Settings */}
          <div className="space-y-4 mb-6 pb-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Logo Settings</h3>
            <div>
              <Label htmlFor="logo" className="text-foreground">Upload Logo</Label>
              <Input
                id="logo"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload("logoUrl", e)}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="logoPosition" className="text-foreground">Position</Label>
                <Select
                  value={settings.logoPosition}
                  onValueChange={(value: any) => setSettings({ ...settings, logoPosition: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="top-left">Top Left</SelectItem>
                    <SelectItem value="top-center">Top Center</SelectItem>
                    <SelectItem value="top-right">Top Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="logoSize" className="text-foreground">Size (px)</Label>
                <Input
                  id="logoSize"
                  type="number"
                  value={settings.logoSize}
                  onChange={(e) => setSettings({ ...settings, logoSize: e.target.value })}
                  className="mt-2"
                  min="50"
                  max="300"
                />
              </div>
            </div>
          </div>

          {/* Main Image Settings */}
          <div className="space-y-4 mb-6 pb-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Main Image</h3>
            <div>
              <Label htmlFor="mainImage" className="text-foreground">Upload Main Image</Label>
              <Input
                id="mainImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload("mainImageUrl", e)}
                className="mt-2"
              />
            </div>
            <div>
              <Label htmlFor="imageRatio" className="text-foreground">Aspect Ratio</Label>
              <Select
                value={settings.imageRatio}
                onValueChange={(value: any) => setSettings({ ...settings, imageRatio: value })}
              >
                <SelectTrigger className="mt-2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="16:9">16:9 (Landscape)</SelectItem>
                  <SelectItem value="4:3">4:3 (Standard)</SelectItem>
                  <SelectItem value="1:1">1:1 (Square)</SelectItem>
                  <SelectItem value="21:9">21:9 (Ultrawide)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Headline Settings */}
          <div className="space-y-4 mb-6 pb-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Headline</h3>
            <div>
              <Label htmlFor="headline" className="text-foreground">Headline Text</Label>
              <Input
                id="headline"
                value={settings.headline}
                onChange={(e) => setSettings({ ...settings, headline: e.target.value })}
                className="mt-2"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label htmlFor="headlineFontSize" className="text-foreground">Font Size (px)</Label>
                <Input
                  id="headlineFontSize"
                  type="number"
                  value={settings.headlineFontSize}
                  onChange={(e) => setSettings({ ...settings, headlineFontSize: e.target.value })}
                  className="mt-2"
                  min="20"
                  max="80"
                />
              </div>
              <div>
                <Label htmlFor="headlineColor" className="text-foreground">Color</Label>
                <Input
                  id="headlineColor"
                  type="color"
                  value={settings.headlineColor}
                  onChange={(e) => setSettings({ ...settings, headlineColor: e.target.value })}
                  className="mt-2 h-10"
                />
              </div>
              <div>
                <Label htmlFor="headlineAlign" className="text-foreground">Alignment</Label>
                <Select
                  value={settings.headlineAlign}
                  onValueChange={(value: any) => setSettings({ ...settings, headlineAlign: value })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="center">Center</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Description Settings */}
          <div className="space-y-4 mb-6 pb-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Description</h3>
            <div>
              <Label htmlFor="description" className="text-foreground">Description Text</Label>
              <Textarea
                id="description"
                value={settings.description}
                onChange={(e) => setSettings({ ...settings, description: e.target.value })}
                className="mt-2 min-h-[80px]"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="descriptionFontSize" className="text-foreground">Font Size (px)</Label>
                <Input
                  id="descriptionFontSize"
                  type="number"
                  value={settings.descriptionFontSize}
                  onChange={(e) => setSettings({ ...settings, descriptionFontSize: e.target.value })}
                  className="mt-2"
                  min="12"
                  max="32"
                />
              </div>
              <div>
                <Label htmlFor="descriptionColor" className="text-foreground">Color</Label>
                <Input
                  id="descriptionColor"
                  type="color"
                  value={settings.descriptionColor}
                  onChange={(e) => setSettings({ ...settings, descriptionColor: e.target.value })}
                  className="mt-2 h-10"
                />
              </div>
            </div>
          </div>

          {/* CTA Button Settings */}
          <div className="space-y-4 mb-6 pb-6 border-b border-border">
            <h3 className="text-lg font-semibold text-foreground">Call-to-Action Button</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="ctaButtonText" className="text-foreground">Button Text</Label>
                <Input
                  id="ctaButtonText"
                  value={settings.ctaButtonText}
                  onChange={(e) => setSettings({ ...settings, ctaButtonText: e.target.value })}
                  className="mt-2"
                />
              </div>
              <div>
                <Label htmlFor="ctaButtonColor" className="text-foreground">Button Color</Label>
                <Input
                  id="ctaButtonColor"
                  type="color"
                  value={settings.ctaButtonColor}
                  onChange={(e) => setSettings({ ...settings, ctaButtonColor: e.target.value })}
                  className="mt-2 h-10"
                />
              </div>
            </div>
          </div>

          {/* Background Settings */}
          <div className="space-y-4 mb-6">
            <h3 className="text-lg font-semibold text-foreground">Background</h3>
            <div>
              <Label htmlFor="backgroundColor" className="text-foreground">Background Color</Label>
              <Input
                id="backgroundColor"
                type="color"
                value={settings.backgroundColor}
                onChange={(e) => setSettings({ ...settings, backgroundColor: e.target.value })}
                className="mt-2 h-10"
              />
            </div>
            <div>
              <Label htmlFor="backgroundImage" className="text-foreground">Background Image (Optional)</Label>
              <Input
                id="backgroundImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleImageUpload("backgroundImageUrl", e)}
                className="mt-2"
              />
            </div>
          </div>

          <Button 
            onClick={handleSave}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            <Save className="w-4 h-4 mr-2" />
            Save Page Settings
          </Button>
        </Card>
      </div>

      {/* Preview Panel */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">Preview</h3>
          <div className="flex gap-2">
            <Button
              variant={previewMode === "desktop" ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode("desktop")}
            >
              <Monitor className="w-4 h-4" />
            </Button>
            <Button
              variant={previewMode === "mobile" ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode("mobile")}
            >
              <Smartphone className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Card className={`overflow-hidden ${previewMode === "mobile" ? "max-w-[375px] mx-auto" : ""}`}>
          <div 
            className="min-h-[600px] p-8"
            style={{ 
              backgroundColor: settings.backgroundColor,
              backgroundImage: settings.backgroundImageUrl ? `url(${settings.backgroundImageUrl})` : "none",
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            {/* Logo */}
            {settings.logoUrl && (
              <div className={`flex ${getLogoPosition()} mb-8`}>
                <img 
                  src={settings.logoUrl} 
                  alt="Logo" 
                  style={{ width: `${settings.logoSize}px`, height: "auto" }}
                />
              </div>
            )}

            {/* Main Content */}
            <div className="max-w-2xl mx-auto space-y-6">
              {/* Main Image */}
              {settings.mainImageUrl && (
                <div className={`w-full ${getImageAspectRatio()} bg-muted rounded-lg overflow-hidden mb-8`}>
                  <img 
                    src={settings.mainImageUrl} 
                    alt="Main" 
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {/* Headline */}
              <h1 
                className={`font-bold ${getTextAlign()}`}
                style={{ 
                  fontSize: `${settings.headlineFontSize}px`,
                  color: settings.headlineColor,
                  lineHeight: "1.2"
                }}
              >
                {settings.headline}
              </h1>

              {/* Description */}
              <p 
                className={getTextAlign()}
                style={{ 
                  fontSize: `${settings.descriptionFontSize}px`,
                  color: settings.descriptionColor,
                  lineHeight: "1.6"
                }}
              >
                {settings.description}
              </p>

              {/* Email Form */}
              <div className={`flex flex-col sm:flex-row gap-3 mt-8 ${settings.headlineAlign === "center" ? "justify-center" : ""}`}>
                <Input
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 max-w-md bg-white"
                />
                <Button 
                  style={{ backgroundColor: settings.ctaButtonColor }}
                  className="text-white hover:opacity-90"
                >
                  {settings.ctaButtonText}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default PageBuilderTab;
