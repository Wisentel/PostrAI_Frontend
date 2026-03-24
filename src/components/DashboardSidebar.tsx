import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronDown, ChevronRight, Folder, FolderOpen, Loader2, AlertCircle } from "lucide-react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTopics } from "@/contexts/TopicsContext";

interface DashboardSidebarProps {
  selectedFolder: string;
  onSelectFolder: (folder: string) => void;
  isLoadingTopics?: boolean;
  topicsError?: string | null;
}

export const DashboardSidebar = ({
  selectedFolder,
  onSelectFolder,
  isLoadingTopics = false,
  topicsError = null,
}: DashboardSidebarProps) => {
  const { categories, toggleCategory, toggleSubTopic } = useTopics();
  const [isTopicsOpen, setIsTopicsOpen] = useState(true);
  const [isFoldersOpen, setIsFoldersOpen] = useState(true);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categories.map(c => [c.id, true]))
  );

  const folders = [
    { id: "myFeed", name: "My Feed" },
    { id: "myPapers", name: "My Papers" },
    { id: "private", name: "Private" },
    { id: "public", name: "Public" }
  ];

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
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

          {/* Topics Section - Hierarchical */}
          <div className="mt-6">
            <Collapsible open={isTopicsOpen} onOpenChange={setIsTopicsOpen}>
              <CollapsibleTrigger asChild>
                <Button variant="ghost" className="w-full justify-start p-2 hover:bg-slate-100">
                  {isTopicsOpen ? <ChevronDown className="w-4 h-4 mr-2" /> : <ChevronRight className="w-4 h-4 mr-2" />}
                  <span className="font-medium text-slate-700">Topics</span>
                  {isLoadingTopics && <Loader2 className="w-4 h-4 ml-auto animate-spin text-blue-600" />}
                </Button>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="mt-2">
                {topicsError && (
                  <Alert className="mb-2">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription className="text-sm">
                      {topicsError}
                    </AlertDescription>
                  </Alert>
                )}

                {isLoadingTopics && !topicsError && (
                  <div className="flex items-center justify-center py-4">
                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                    <span className="ml-2 text-sm text-slate-600">Loading your topics...</span>
                  </div>
                )}

                {!isLoadingTopics && !topicsError && categories.length > 0 && (
                  <div className="space-y-1">
                    {categories.map((category) => (
                      <div key={category.id}>
                        <Collapsible
                          open={expandedCategories[category.id] ?? true}
                          onOpenChange={() => toggleExpanded(category.id)}
                        >
                          {/* Category row */}
                          <div className="flex items-center px-2 py-1.5 rounded-md hover:bg-slate-50 transition-colors">
                            <CollapsibleTrigger asChild>
                              <button className="p-0.5 mr-1 hover:bg-slate-200 rounded transition-colors">
                                {expandedCategories[category.id] ? (
                                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                                ) : (
                                  <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                                )}
                              </button>
                            </CollapsibleTrigger>
                            <Checkbox
                              id={`dash-cat-${category.id}`}
                              checked={category.isSelected}
                              onCheckedChange={() => toggleCategory(category.id)}
                              className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                            />
                            <label
                              htmlFor={`dash-cat-${category.id}`}
                              className="ml-2 text-sm font-medium text-slate-700 cursor-pointer flex-1 truncate"
                            >
                              {category.name}
                            </label>
                          </div>

                          {/* Subtopics */}
                          <CollapsibleContent>
                            {category.subTopics.length > 0 && (
                              <div className="ml-8 pl-3 border-l border-slate-200 space-y-0.5 py-1 my-0.5">
                                {category.subTopics.map((sub) => (
                                  <div
                                    key={sub.id}
                                    className={`flex items-center px-2 py-1.5 rounded-md transition-colors ${
                                      !category.isSelected
                                        ? "opacity-50 cursor-not-allowed"
                                        : "hover:bg-slate-50"
                                    }`}
                                  >
                                    <Checkbox
                                      id={`dash-sub-${sub.id}`}
                                      checked={sub.isSelected}
                                      disabled={!category.isSelected}
                                      onCheckedChange={() => toggleSubTopic(category.id, sub.id)}
                                      className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                    />
                                    <label
                                      htmlFor={`dash-sub-${sub.id}`}
                                      className={`ml-2 text-sm cursor-pointer flex-1 truncate ${
                                        !category.isSelected ? "text-slate-400" : "text-slate-600"
                                      }`}
                                    >
                                      {sub.name}
                                    </label>
                                  </div>
                                ))}
                              </div>
                            )}
                          </CollapsibleContent>
                        </Collapsible>
                      </div>
                    ))}
                  </div>
                )}

                {!isLoadingTopics && !topicsError && categories.length === 0 && (
                  <div className="px-2 py-4 text-center">
                    <p className="text-sm text-slate-500">No topics found</p>
                    <p className="text-xs text-slate-400 mt-1">Add topics in Settings</p>
                  </div>
                )}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </div>
      </div>
    </div>
  );
};
