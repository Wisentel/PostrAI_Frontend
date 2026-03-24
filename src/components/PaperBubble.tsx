import { Calendar, User, Tag, BookMarked, Lock, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Paper } from "@/pages/Dashboard";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface PaperBubbleProps {
  paper: Paper;
  onSelect: (paper: Paper) => void;
  onTogglePaperFolder: (paperId: string, folderId: string) => void;
  isSelected: boolean;
}

const FOLDER_ICONS = [
  { id: "myPapers", label: "My Papers", Icon: BookMarked, activeColor: "text-blue-600", activeFill: "fill-blue-100" },
  { id: "private", label: "Private", Icon: Lock, activeColor: "text-purple-600", activeFill: "fill-purple-100" },
  { id: "public", label: "Public", Icon: Globe, activeColor: "text-emerald-600", activeFill: "fill-emerald-100" },
];

export const PaperBubble = ({ paper, onSelect, onTogglePaperFolder, isSelected }: PaperBubbleProps) => {
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
      onClick={() => onSelect(paper)}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          {/* Title and top-right controls */}
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-slate-800 truncate pr-2">
              {paper.title}
            </h3>
            <div className="flex items-center gap-1 shrink-0">
              <TooltipProvider>
                {FOLDER_ICONS.map(({ id, label, Icon, activeColor, activeFill }) => {
                  const active = paper.folders?.includes(id) ?? false;
                  return (
                    <Tooltip key={id}>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 hover:bg-slate-100"
                          onClick={(e) => {
                            e.stopPropagation();
                            onTogglePaperFolder(paper.id, id);
                          }}
                        >
                          <Icon
                            className={`w-4 h-4 transition-colors ${
                              active ? `${activeColor} ${activeFill}` : "text-slate-300 hover:text-slate-400"
                            }`}
                          />
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent side="top">
                        <p className="text-xs">{active ? `Remove from ${label}` : `Add to ${label}`}</p>
                      </TooltipContent>
                    </Tooltip>
                  );
                })}
              </TooltipProvider>
              <div className="flex items-center text-sm text-slate-500 ml-1">
                <Calendar className="w-4 h-4 mr-1" />
                {paper.date}
              </div>
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
    </div>
  );
};
