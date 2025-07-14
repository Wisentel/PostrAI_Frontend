
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Plus, ChevronDown, ChevronRight, Folder, FolderOpen, Loader2, AlertCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { Topic } from "@/pages/Dashboard";

interface DashboardSidebarProps {
  topics: Topic[];
  onToggleTopic: (topicId: string) => void;
  onAddTopic: (topicName: string) => Promise<void>;
  selectedFolder: string;
  onSelectFolder: (folder: string) => void;
  isLoadingTopics?: boolean;
  topicsError?: string | null;
  isAddingTopic?: boolean;
}

export const DashboardSidebar = ({
  topics,
  onToggleTopic,
  onAddTopic,
  selectedFolder,
  onSelectFolder,
  isLoadingTopics = false,
  topicsError = null,
  isAddingTopic = false,
}: DashboardSidebarProps) => {
  const [isTopicsOpen, setIsTopicsOpen] = useState(true);
  const [isFoldersOpen, setIsFoldersOpen] = useState(true);
  const [newTopicName, setNewTopicName] = useState("");
  const [isAddingTopicUI, setIsAddingTopicUI] = useState(false);

  const folders = [
    { id: "myResearch", name: "My Research Papers" },
    { id: "privateCollection", name: "Private Collection" },
    { id: "publicCollection", name: "Public Collection" }
  ];

  const handleAddTopic = async () => {
    if (newTopicName.trim()) {
      await onAddTopic(newTopicName.trim());
      setNewTopicName("");
      setIsAddingTopicUI(false);
    }
  };

  return (
    <div className="w-full h-full bg-white/80 backdrop-blur-sm border-r border-slate-200 flex flex-col">
      <div className="flex-1 overflow-y-auto">
        <div className="p-4">
          {/* Folders Section */}
          <Collapsible open={isFoldersOpen} onOpenChange={setIsFoldersOpen}>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="w-full justify-start p-2 hover:bg-slate-100">
                {isFoldersOpen ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                <span className="font-medium text-slate-700">Folders</span>
              </Button>
            </CollapsibleTrigger>
            
            <CollapsibleContent className="space-y-1 mt-2">
              {folders.map((folder) => (
                <Button
                  key={folder.id}
                  variant={selectedFolder === folder.id ? "secondary" : "ghost"}
                  className="w-full justify-start px-4 py-2"
                  onClick={() => onSelectFolder(folder.id)}
                >
                  {selectedFolder === folder.id ? (
                    <FolderOpen className="w-4 h-4 mr-2 text-blue-600" />
                  ) : (
                    <Folder className="w-4 h-4 mr-2 text-slate-500" />
                  )}
                  <span className="text-sm">{folder.name}</span>
                </Button>
              ))}
            </CollapsibleContent>
          </Collapsible>

          {/* Topics Section */}
          <div className="mt-6">
            <Collapsible open={isTopicsOpen} onOpenChange={setIsTopicsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2 hover:bg-slate-100">
                  {isTopicsOpen ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                  <span className="font-medium text-slate-700">Topics</span>
                  {isLoadingTopics && <Loader2 className="w-4 h-4 ml-auto animate-spin text-blue-600" />}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="space-y-2 mt-2">
                {/* Error State */}
                {topicsError && (
                  <Alert className="mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {topicsError}
                    </AlertDescription>
                  </Alert>
                )}

                {/* Loading State */}
                {isLoadingTopics && !topicsError && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="ml-2 text-sm text-slate-600">Loading your topics...</span>
                  </div>
                )}

                {/* Topics List */}
                {!isLoadingTopics && !topicsError && topics.length > 0 && (
                  <>
                    {topics.map((topic) => (
                      <div key={topic.id} className="flex items-center space-x-2 px-2 py-1">
                        <Checkbox
                          id={topic.id}
                          checked={topic.isSelected}
                          onCheckedChange={() => onToggleTopic(topic.id)}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <label
                          htmlFor={topic.id}
                          className="text-sm text-slate-600 cursor-pointer flex-1"
                        >
                          {topic.name}
                        </label>
                      </div>
                    ))}
                  </>
                )}

                {/* No Topics State */}
                {!isLoadingTopics && !topicsError && topics.length === 0 && (
                  <div className="px-2 py-4 text-center">
                    <p className="text-sm text-slate-500">No topics found</p>
                    <p className="text-xs text-slate-400 mt-1">Add your first topic below</p>
                  </div>
                )}
                
                {/* Add Topic Section */}
                {!isLoadingTopics && (
                  <>
                    {isAddingTopicUI ? (
                      <div className="px-2 py-1 space-y-2">
                        <Input
                          value={newTopicName}
                          onChange={(e) => setNewTopicName(e.target.value)}
                          placeholder="Enter topic name"
                          className="text-sm"
                          onKeyPress={(e) => e.key === "Enter" && handleAddTopic()}
                          autoFocus
                          disabled={isAddingTopic}
                        />
                        <div className="flex space-x-2">
                          <Button 
                            size="sm" 
                            onClick={handleAddTopic} 
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                            disabled={isAddingTopic || !newTopicName.trim()}
                          >
                            {isAddingTopic ? (
                              <>
                                <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                                Adding...
                              </>
                            ) : (
                              'Add'
                            )}
                          </Button>
                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => setIsAddingTopicUI(false)}
                            disabled={isAddingTopic}
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setIsAddingTopicUI(true)}
                        className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                        disabled={isAddingTopic}
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Add topic
                      </Button>
                    )}
                  </>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};
