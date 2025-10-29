import { useState } from "react";
import { getSearchButtons, saveSearchButtons, type SearchButton } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2 } from "lucide-react";

const SearchButtonsTab = () => {
  const [buttons, setButtons] = useState<SearchButton[]>(getSearchButtons());
  const [newButton, setNewButton] = useState({
    title: "",
    link: "",
    webResultPage: "wr=1",
    serialNumber: buttons.length + 1
  });

  const handleAddButton = () => {
    if (!newButton.title.trim()) {
      toast.error("Button title is required");
      return;
    }

    const button: SearchButton = {
      id: Date.now().toString(),
      ...newButton
    };

    const updatedButtons = [...buttons, button];
    setButtons(updatedButtons);
    saveSearchButtons(updatedButtons);
    
    setNewButton({
      title: "",
      link: "",
      webResultPage: "wr=1",
      serialNumber: updatedButtons.length + 1
    });
    
    toast.success("Search button added successfully!");
  };

  const handleDeleteButton = (id: string) => {
    const updatedButtons = buttons.filter(b => b.id !== id);
    setButtons(updatedButtons);
    saveSearchButtons(updatedButtons);
    toast.success("Search button deleted successfully!");
  };

  const handleUpdateButton = (id: string, field: string, value: any) => {
    const updatedButtons = buttons.map(b => 
      b.id === id ? { ...b, [field]: value } : b
    );
    setButtons(updatedButtons);
    saveSearchButtons(updatedButtons);
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Manage Search Buttons</h2>
      
      {/* Add New Button Form */}
      <div className="mb-8 p-6 bg-muted/30 border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Add New Button</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground">Button title</Label>
            <Input
              value={newButton.title}
              onChange={(e) => setNewButton({ ...newButton, title: e.target.value })}
              placeholder="Enter button title"
              className="mt-2 bg-input border-border text-foreground"
            />
          </div>
          <div>
            <Label className="text-foreground">Link (optional)</Label>
            <Input
              value={newButton.link}
              onChange={(e) => setNewButton({ ...newButton, link: e.target.value })}
              placeholder="https://example.com or leave empty for /webresult"
              className="mt-2 bg-input border-border text-foreground"
            />
          </div>
          <div>
            <Label className="text-foreground">Web Result Page</Label>
            <Select
              value={newButton.webResultPage}
              onValueChange={(value) => setNewButton({ ...newButton, webResultPage: value })}
            >
              <SelectTrigger className="mt-2 bg-input border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="wr=1">wr=1</SelectItem>
                <SelectItem value="wr=2">wr=2</SelectItem>
                <SelectItem value="wr=3">wr=3</SelectItem>
                <SelectItem value="wr=4">wr=4</SelectItem>
                <SelectItem value="wr=5">wr=5</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-foreground">Serial Number (Position)</Label>
            <Input
              type="number"
              value={newButton.serialNumber}
              onChange={(e) => setNewButton({ ...newButton, serialNumber: parseInt(e.target.value) || 1 })}
              className="mt-2 bg-input border-border text-foreground"
            />
          </div>
        </div>
        <Button 
          onClick={handleAddButton}
          className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Button
        </Button>
      </div>

      {/* Existing Buttons List */}
      <div className="space-y-4">
        {buttons.sort((a, b) => a.serialNumber - b.serialNumber).map((button) => (
          <div key={button.id} className="p-4 bg-muted/20 border border-border rounded-lg">
            <div className="flex items-center justify-between mb-3">
              <div className="font-semibold text-foreground">{button.title}</div>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => handleDeleteButton(button.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
              <div>
                <span className="text-muted-foreground">Link: </span>
                <span className="text-primary">{button.link || '/webresult'}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Page: </span>
                <Select
                  value={button.webResultPage}
                  onValueChange={(value) => handleUpdateButton(button.id, 'webResultPage', value)}
                >
                  <SelectTrigger className="inline-flex w-auto h-7 bg-input border-border text-foreground text-sm">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="wr=1">wr=1</SelectItem>
                    <SelectItem value="wr=2">wr=2</SelectItem>
                    <SelectItem value="wr=3">wr=3</SelectItem>
                    <SelectItem value="wr=4">wr=4</SelectItem>
                    <SelectItem value="wr=5">wr=5</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <span className="text-muted-foreground">Position: </span>
                <Input
                  type="number"
                  value={button.serialNumber}
                  onChange={(e) => handleUpdateButton(button.id, 'serialNumber', parseInt(e.target.value) || 1)}
                  className="inline-flex w-20 h-7 bg-input border-border text-foreground text-sm"
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchButtonsTab;
