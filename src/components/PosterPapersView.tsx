import { useNavigate } from "react-router-dom";
import { Paper } from "@/pages/Dashboard";
import { PosterPaperBubble } from "./PosterPaperBubble";
import { Button } from "@/components/ui/button";

interface PosterPapersViewProps {
  papers: Paper[];
  selectedPapers: string[];
  onToggleSelection: (paperId: string) => void;
  onToggleStar: (paperId: string) => void;
  folder: string;
}

export const PosterPapersView = ({
  papers,
  selectedPapers,
  onToggleSelection,
  onToggleStar,
  folder,
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

        {/* Papers List */}
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

        {papers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-slate-500 text-lg">No papers found in this collection.</p>
          </div>
        )}
      </div>
    </div>
  );
};