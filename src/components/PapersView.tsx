
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Paper } from "@/pages/Dashboard";
import { PaperBubble } from "./PaperBubble";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Loader2, AlertCircle, Filter, ChevronDown, ChevronRight } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useTopics } from "@/contexts/TopicsContext";

interface PapersViewProps {
  papers: Paper[];
  selectedPaper: Paper | null;
  onSelectPaper: (paper: Paper) => void;
  onTogglePaperFolder: (paperId: string, folderId: string) => void;
  folder: string;
  isLoadingPapers?: boolean;
  papersError?: string | null;
}

export const PapersView = ({
  papers,
  selectedPaper,
  onSelectPaper,
  onTogglePaperFolder,
  folder,
  isLoadingPapers = false,
  papersError = null,
}: PapersViewProps) => {
  const navigate = useNavigate();
  const { categories, toggleCategory, toggleSubTopic } = useTopics();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [expandedFilterCategories, setExpandedFilterCategories] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categories.map(c => [c.id, true]))
  );

  const handleCreatePoster = () => {
    navigate("/poster-creation");
  };

  const toggleFilterExpanded = (categoryId: string) => {
    setExpandedFilterCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const selectedCount = categories.reduce(
    (acc, cat) => acc + (cat.isSelected ? cat.subTopics.filter(s => s.isSelected).length : 0),
    0
  );

  return (
    <div className="w-full h-full bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 backdrop-blur-sm flex flex-col">
      {/* Header - Fixed */}
      <div className="flex-shrink-0 p-6 pb-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold text-slate-800">{folder}</h2>
          <div className="flex items-center gap-2">
            {isLoadingPapers && (
              <div className="flex items-center text-blue-600 mr-2">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Loading papers...</span>
              </div>
            )}

            {/* Filter Dropdown */}
            <Popover open={isFilterOpen} onOpenChange={setIsFilterOpen}>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="relative border-slate-200 text-slate-600 hover:text-slate-800 hover:bg-slate-50"
                >
                  <Filter className="w-4 h-4 mr-1.5" />
                  Filter
                  {selectedCount > 0 && (
                    <span className="ml-1.5 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {selectedCount}
                    </span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-72 p-0" align="end">
                <div className="px-3 py-2.5 border-b border-slate-100">
                  <h4 className="text-sm font-medium text-slate-700">Filter by Topics</h4>
                </div>
                <div className="max-h-80 overflow-y-auto py-1">
                  {categories.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">No topics configured</p>
                  )}
                  {categories.map((category) => (
                    <div key={category.id}>
                      {/* Category row */}
                      <div className="flex items-center px-3 py-1.5 hover:bg-slate-50 transition-colors">
                        <button
                          className="p-0.5 mr-1 hover:bg-slate-200 rounded transition-colors"
                          onClick={() => toggleFilterExpanded(category.id)}
                        >
                          {expandedFilterCategories[category.id] ? (
                            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                          ) : (
                            <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
                          )}
                        </button>
                        <Checkbox
                          id={`filter-cat-${category.id}`}
                          checked={category.isSelected}
                          onCheckedChange={() => toggleCategory(category.id)}
                          className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                        />
                        <label
                          htmlFor={`filter-cat-${category.id}`}
                          className="ml-2 text-sm font-medium text-slate-700 cursor-pointer flex-1"
                        >
                          {category.name}
                        </label>
                      </div>

                      {/* Subtopics */}
                      {expandedFilterCategories[category.id] && category.subTopics.length > 0 && (
                        <div className="ml-8 pl-3 border-l border-slate-200 space-y-0.5 py-0.5 my-0.5 mr-3">
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
                                id={`filter-sub-${sub.id}`}
                                checked={sub.isSelected}
                                disabled={!category.isSelected}
                                onCheckedChange={() => toggleSubTopic(category.id, sub.id)}
                                className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                              />
                              <label
                                htmlFor={`filter-sub-${sub.id}`}
                                className={`ml-2 text-sm cursor-pointer flex-1 ${
                                  !category.isSelected ? "text-slate-400" : "text-slate-600"
                                }`}
                              >
                                {sub.name}
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </PopoverContent>
            </Popover>

            <Button 
              onClick={handleCreatePoster}
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            >
              Create Poster
            </Button>
          </div>
        </div>
      </div>
      
      {/* Content - Scrollable */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        {/* Error State */}
        {papersError && (
          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {papersError}
            </AlertDescription>
          </Alert>
        )}

        {/* Loading State */}
        {isLoadingPapers && !papersError && (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600 mx-auto mb-4" />
              <p className="text-slate-600">Loading your research papers...</p>
            </div>
          </div>
        )}

        {/* Papers List */}
        {!isLoadingPapers && !papersError && (
          <div className="space-y-2">
            {papers.map((paper) => (
              <PaperBubble
                key={paper.id}
                paper={paper}
                onSelect={onSelectPaper}
                onTogglePaperFolder={onTogglePaperFolder}
                isSelected={selectedPaper?.id === paper.id}
              />
            ))}
          </div>
        )}
        
        {/* Empty State */}
        {!isLoadingPapers && !papersError && papers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No papers found in this collection.</p>
            <p className="text-slate-400 text-sm mt-2">Papers will appear here once they are added to your collection.</p>
          </div>
        )}
      </div>
    </div>
  );
};
