import { Star, Calendar, User, Tag } from "lucide-react";
import { Paper } from "@/pages/Dashboard";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";

interface PosterPaperBubbleProps {
  paper: Paper;
  isSelected: boolean;
  onToggleSelection: (paperId: string) => void;
  onToggleStar: (paperId: string) => void;
}

export const PosterPaperBubble = ({
  paper,
  isSelected,
  onToggleSelection,
  onToggleStar,
}: PosterPaperBubbleProps) => {
  return (
    <div
      className={`
        w-full p-4 rounded-lg border transition-all duration-300 cursor-pointer
        ${isSelected 
          ? "bg-blue-50 border-blue-200 shadow-md transform scale-[1.02]" 
          : "bg-white/70 border-slate-200 hover:bg-white hover:shadow-sm hover:border-slate-300"
        }
        animate-fade-in
      `}
      onClick={() => onToggleSelection(paper.id)}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-3 flex-1">
          <Checkbox 
            checked={isSelected}
            onCheckedChange={() => onToggleSelection(paper.id)}
            className="mt-1 data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
          />

          <div className="flex-1 min-w-0">
            {/* Title and Date Row */}
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-lg font-semibold text-slate-800 truncate pr-2">
                {paper.title}
              </h3>
              <div className="flex items-center text-sm text-slate-500 shrink-0">
                <Calendar className="w-4 h-4 mr-1" />
                {paper.date}
              </div>
            </div>

            {/* Authors Row */}
            <div className="flex items-center mb-3">
              <User className="w-4 h-4 mr-1 text-slate-400" />
              <p className="text-sm text-slate-600 truncate">
                {paper.authors.join(", ")}
              </p>
            </div>

            {/* Labels Row */}
            <div className="flex items-center gap-2 mb-3">
              <Tag className="w-4 h-4 text-slate-400 shrink-0" />
              <div className="flex flex-wrap gap-1">
                {paper.labels.slice(0, 3).map((label, index) => (
                  <span
                    key={index}
                    className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                  >
                    {label}
                  </span>
                ))}
                {paper.labels.length > 3 && (
                  <span className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-full">
                    +{paper.labels.length - 3}
                  </span>
                )}
              </div>
            </div>

            {/* Abstract Preview */}
            <p className="text-sm text-slate-600 line-clamp-2 leading-relaxed">
              {paper.abstract}
            </p>
          </div>
        </div>

        {/* Star Button */}
        <div className="ml-4 shrink-0">
          <Button
            variant="ghost"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onToggleStar(paper.id);
            }}
            className="h-8 w-8 p-0 hover:bg-yellow-50"
          >
            <Star
              className={`w-4 h-4 transition-colors ${
                paper.isStarred ? "fill-yellow-500 text-yellow-500" : "text-slate-400 hover:text-yellow-400"
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
};