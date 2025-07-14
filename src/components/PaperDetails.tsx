
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { X, Star, Share, Download, Folder, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { Paper } from "@/pages/Dashboard";

interface PaperDetailsProps {
  paper: Paper;
  onClose: () => void;
  onToggleStar: (paperId: string) => void;
  onMovePaper: (paperId: string, newFolder: string) => void;
}

const folderOptions = [
  { id: "myResearch", name: "My Research Papers" },
  { id: "privateCollection", name: "Private Collection" },
  { id: "publicCollection", name: "Public Collection" }
];

export const PaperDetails = ({ paper, onClose, onToggleStar, onMovePaper }: PaperDetailsProps) => {
  const [isMoving, setIsMoving] = useState(false);

  const handleFolderChange = async (newFolder: string) => {
    if (newFolder === paper.folder) return;
    
    setIsMoving(true);
    // Add a small delay for animation effect
    setTimeout(() => {
      onMovePaper(paper.id, newFolder);
      setIsMoving(false);
      onClose();
    }, 300);
  };

  const currentFolderName = folderOptions.find(f => f.id === paper.folder)?.name;

  return (
    <div className={`w-full h-full bg-white border-l border-slate-200 flex flex-col transition-all duration-300 ${isMoving ? 'opacity-75 scale-95' : 'opacity-100 scale-100'}`}>
      {/* Header */}
      <div className="border-b border-slate-200 p-3 sm:p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-slate-800">Paper Details</h3>
          
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Folder Dropdown */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-8 px-2 sm:px-3 py-1">
                  <Folder className="w-4 h-4 mr-1 sm:mr-2" />
                  <span className="text-xs sm:text-sm hidden sm:inline">{currentFolderName}</span>
                  <span className="text-xs sm:hidden">Folder</span>
                  <ChevronDown className="w-4 h-4 ml-1 sm:ml-2" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {folderOptions.map((folder) => (
                  <DropdownMenuItem
                    key={folder.id}
                    onClick={() => handleFolderChange(folder.id)}
                    className={`text-sm cursor-pointer ${
                      folder.id === paper.folder 
                        ? "bg-blue-50 text-blue-700 font-medium" 
                        : "hover:bg-slate-50"
                    }`}
                  >
                    <Folder className="w-4 h-4 mr-2" />
                    {folder.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Close Button */}
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-3 sm:p-4 space-y-4 sm:space-y-6">
          {/* Title */}
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-slate-800 mb-2 sm:mb-3 leading-tight">{paper.title}</h1>
            
            {/* Date and Authors */}
            <p className="text-xs sm:text-sm text-slate-600 mb-3 sm:mb-4">
              {paper.date} • {paper.authors.join(", ")}
            </p>
            
            {/* Labels */}
            <div className="flex flex-wrap gap-1 sm:gap-2 mb-4 sm:mb-6">
              {paper.labels.map((label, index) => (
                <span
                  key={index}
                  className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 text-xs sm:text-sm rounded-full"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>

          {/* Abstract */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-2 sm:mb-3 text-sm sm:text-base">Abstract</h4>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              {paper.abstract}
            </p>
          </div>

          {/* Summary */}
          <div>
            <h4 className="font-semibold text-slate-800 mb-2 sm:mb-3 text-sm sm:text-base">Summary</h4>
            <div className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {paper.summary}
            </div>
          </div>
        </div>
      </div>

      {/* Fixed Bottom Bar */}
      <div className="border-t border-slate-200 p-3 sm:p-4 bg-slate-50 flex-shrink-0">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onToggleStar(paper.id)}
            className="flex-1 text-xs sm:text-sm"
          >
            <Star className={`w-4 h-4 mr-1 sm:mr-2 ${paper.isStarred ? "fill-yellow-500 text-yellow-500" : ""}`} />
            <span className="hidden sm:inline">{paper.isStarred ? "Remove from Favorites" : "Add to Favorites"}</span>
            <span className="sm:hidden">{paper.isStarred ? "Unfavorite" : "Favorite"}</span>
          </Button>
          
          <div className="flex space-x-2 sm:flex-shrink-0">
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
              <Share className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Share</span>
            </Button>
            
            <Button variant="outline" size="sm" className="flex-1 sm:flex-none text-xs sm:text-sm">
              <Download className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Download</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
