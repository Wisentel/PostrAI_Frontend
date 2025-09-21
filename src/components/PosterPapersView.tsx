import { useNavigate } from "react-router-dom";
import { Paper } from "@/pages/Dashboard";
import { PosterPaperBubble } from "./PosterPaperBubble";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface PosterPapersViewProps {
  papers: Paper[];
  selectedPapers: string[];
  onToggleSelection: (paperId: string) => void;
  onToggleStar: (paperId: string) => void;
  folder: string;
  isLoadingPapers?: boolean;
  papersError?: string | null;
}

export const PosterPapersView = ({
  papers,
  selectedPapers,
  onToggleSelection,
  onToggleStar,
  folder,
  isLoadingPapers = false,
  papersError = null,
}: PosterPapersViewProps) => {
  const navigate = useNavigate();
  const hasSelectedPapers = selectedPapers.length > 0;

  const handleSelectTemplate = () => {
    if (hasSelectedPapers) {
      navigate("/template-selection");
    }
  };

  return (
    <div className="flex-1 bg-gradient-to-br from-blue-50/50 via-purple-50/50 to-pink-50/50 backdrop-blur-sm h-full overflow-y-auto">
      {/* Header */}
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-slate-800">{folder}</h2>
          <div className="flex items-center gap-4">
            {isLoadingPapers && (
              <div className="flex items-center text-blue-600">
                <Loader2 className="w-5 h-5 animate-spin mr-2" />
                <span className="text-sm">Loading papers...</span>
              </div>
            )}
            <Button 
              onClick={handleSelectTemplate}
              className={`bg-gradient-to-r text-white transition-all ${
                hasSelectedPapers 
                  ? "from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" 
                  : "from-gray-400 to-gray-500 cursor-not-allowed"
              }`}
              disabled={!hasSelectedPapers}
            >
              Select Template
            </Button>
          </div>
        </div>

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
              <PosterPaperBubble
                key={paper.id}
                paper={paper}
                isSelected={selectedPapers.includes(paper.id)}
                onToggleSelection={onToggleSelection}
                onToggleStar={onToggleStar}
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