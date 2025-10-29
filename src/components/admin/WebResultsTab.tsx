import { useState } from "react";
import { getWebResults, saveWebResults, type WebResult } from "@/lib/storage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { Plus, Trash2, Edit2 } from "lucide-react";

const WebResultsTab = () => {
  const [results, setResults] = useState<WebResult[]>(getWebResults());
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newResult, setNewResult] = useState({
    name: "",
    link: "",
    title: "",
    description: "",
    logoUrl: "",
    isSponsored: false,
    webResultPage: "wr=1"
  });

  const handleAddResult = () => {
    if (!newResult.name.trim() || !newResult.title.trim()) {
      toast.error("Name and title are required");
      return;
    }

    // Auto-generate lid (find highest lid and increment)
    const maxLid = results.length > 0 
      ? Math.max(...results.map(r => r.lid || 0))
      : 0;

    const result: WebResult = {
      id: Date.now().toString(),
      ...newResult,
      lid: maxLid + 1
    };

    const updatedResults = [...results, result];
    setResults(updatedResults);
    saveWebResults(updatedResults);
    
    setNewResult({
      name: "",
      link: "",
      title: "",
      description: "",
      logoUrl: "",
      isSponsored: false,
      webResultPage: "wr=1"
    });
    
    toast.success(`Web result added successfully! Link ID: lid=${result.lid}`);
  };

  const handleDeleteResult = (id: string) => {
    const updatedResults = results.filter(r => r.id !== id);
    setResults(updatedResults);
    saveWebResults(updatedResults);
    toast.success("Web result deleted successfully!");
  };

  const handleUpdateResult = (id: string, updatedData: Partial<WebResult>) => {
    const updatedResults = results.map(r => 
      r.id === id ? { ...r, ...updatedData } : r
    );
    setResults(updatedResults);
    saveWebResults(updatedResults);
    setEditingId(null);
    toast.success("Web result updated successfully!");
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <h2 className="text-2xl font-bold text-foreground mb-6">Manage Web Results</h2>
      
      {/* Add New Result Form */}
      <div className="mb-8 p-6 bg-muted/30 border border-border rounded-lg">
        <h3 className="text-lg font-semibold text-foreground mb-4">Add New Result</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label className="text-foreground">Name</Label>
            <Input
              value={newResult.name}
              onChange={(e) => setNewResult({ ...newResult, name: e.target.value })}
              placeholder="e.g., Example Site"
              className="mt-2 bg-input border-border text-foreground"
            />
          </div>
          <div>
            <Label className="text-foreground">Link</Label>
            <Input
              value={newResult.link}
              onChange={(e) => setNewResult({ ...newResult, link: e.target.value })}
              placeholder="https://example.com"
              className="mt-2 bg-input border-border text-foreground"
            />
          </div>
          <div>
            <Label className="text-foreground">Title</Label>
            <Input
              value={newResult.title}
              onChange={(e) => setNewResult({ ...newResult, title: e.target.value })}
              placeholder="Result title"
              className="mt-2 bg-input border-border text-foreground"
            />
          </div>
          <div>
            <Label className="text-foreground">Logo URL</Label>
            <Input
              value={newResult.logoUrl}
              onChange={(e) => setNewResult({ ...newResult, logoUrl: e.target.value })}
              placeholder="https://example.com/logo.png (optional)"
              className="mt-2 bg-input border-border text-foreground"
            />
          </div>
          <div className="md:col-span-2">
            <Label className="text-foreground">Description</Label>
            <Textarea
              value={newResult.description}
              onChange={(e) => setNewResult({ ...newResult, description: e.target.value })}
              placeholder="Result description"
              className="mt-2 bg-input border-border text-foreground"
            />
          </div>
          <div>
            <Label className="text-foreground">Web Result Page</Label>
            <Select
              value={newResult.webResultPage}
              onValueChange={(value) => setNewResult({ ...newResult, webResultPage: value })}
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
          <div className="flex items-end">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="sponsored"
                checked={newResult.isSponsored}
                onCheckedChange={(checked) => 
                  setNewResult({ ...newResult, isSponsored: checked as boolean })
                }
              />
              <Label htmlFor="sponsored" className="text-foreground cursor-pointer">
                Sponsored
              </Label>
            </div>
          </div>
        </div>
        <Button 
          onClick={handleAddResult}
          className="mt-4 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Result
        </Button>
      </div>

      {/* Existing Results List */}
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-4">Existing Results</h3>
        <div className="space-y-4">
          {results.map((result) => (
            <div key={result.id} className="p-4 bg-muted/20 border border-border rounded-lg">
              {editingId === result.id ? (
                <EditResultForm
                  result={result}
                  onSave={(data) => handleUpdateResult(result.id, data)}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="font-semibold text-foreground">{result.title}</div>
                      {result.isSponsored && (
                        <span className="inline-block px-2 py-0.5 text-xs bg-primary/20 text-primary rounded mt-1">
                          Sponsored
                        </span>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingId(result.id)}
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDeleteResult(result.id)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                    <div>
                      <span className="text-muted-foreground">Name: </span>
                      <span className="text-foreground">{result.name}</span>
                    </div>
                    <div>
                      <span className="text-muted-foreground">Page: </span>
                      <span className="text-primary">{result.webResultPage}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Masked Link: </span>
                      <span className="text-foreground">topuniversityterritian/lid={result.lid}</span>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Actual Link: </span>
                      <a href={result.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                        {result.link}
                      </a>
                    </div>
                    <div className="md:col-span-2">
                      <span className="text-muted-foreground">Description: </span>
                      <span className="text-foreground">{result.description}</span>
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const EditResultForm = ({ result, onSave, onCancel }: any) => {
  const [editData, setEditData] = useState(result);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-foreground">Name</Label>
          <Input
            value={editData.name}
            onChange={(e) => setEditData({ ...editData, name: e.target.value })}
            className="mt-1 bg-input border-border text-foreground"
          />
        </div>
        <div>
          <Label className="text-foreground">Link</Label>
          <Input
            value={editData.link}
            onChange={(e) => setEditData({ ...editData, link: e.target.value })}
            className="mt-1 bg-input border-border text-foreground"
          />
        </div>
        <div>
          <Label className="text-foreground">Title</Label>
          <Input
            value={editData.title}
            onChange={(e) => setEditData({ ...editData, title: e.target.value })}
            className="mt-1 bg-input border-border text-foreground"
          />
        </div>
        <div>
          <Label className="text-foreground">Logo URL</Label>
          <Input
            value={editData.logoUrl}
            onChange={(e) => setEditData({ ...editData, logoUrl: e.target.value })}
            className="mt-1 bg-input border-border text-foreground"
          />
        </div>
        <div className="md:col-span-2">
          <Label className="text-foreground">Description</Label>
          <Textarea
            value={editData.description}
            onChange={(e) => setEditData({ ...editData, description: e.target.value })}
            className="mt-1 bg-input border-border text-foreground"
          />
        </div>
        <div>
          <Label className="text-foreground">Web Result Page</Label>
          <Select
            value={editData.webResultPage}
            onValueChange={(value) => setEditData({ ...editData, webResultPage: value })}
          >
            <SelectTrigger className="mt-1 bg-input border-border text-foreground">
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
        <div className="flex items-end">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="edit-sponsored"
              checked={editData.isSponsored}
              onCheckedChange={(checked) => 
                setEditData({ ...editData, isSponsored: checked as boolean })
              }
            />
            <Label htmlFor="edit-sponsored" className="text-foreground cursor-pointer">
              Sponsored
            </Label>
          </div>
        </div>
      </div>
      <div className="flex gap-2">
        <Button 
          onClick={() => onSave(editData)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          Save Changes
        </Button>
        <Button 
          variant="outline"
          onClick={onCancel}
        >
          Cancel
        </Button>
      </div>
    </div>
  );
};

export default WebResultsTab;
