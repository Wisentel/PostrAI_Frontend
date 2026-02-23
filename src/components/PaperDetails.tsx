
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { X, Star, Share, Download, Folder, ChevronDown, SendHorizontal, MoreVertical, Check } from "lucide-react";
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
  const [noteText, setNoteText] = useState("");
  const [notes, setNotes] = useState<{ text: string; date: string }[]>([]);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [editText, setEditText] = useState("");
  const [openMenuIndex, setOpenMenuIndex] = useState<number | null>(null);

  const handleAddNote = () => {
    if (!noteText.trim()) return;
    setNotes(prev => [...prev, { text: noteText.trim(), date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) }]);
    setNoteText("");
  };

  const handleDeleteNote = (index: number) => {
    setNotes(prev => prev.filter((_, i) => i !== index));
    setOpenMenuIndex(null);
  };

  const handleStartEdit = (index: number) => {
    setEditingIndex(index);
    setEditText(notes[index].text);
    setOpenMenuIndex(null);
  };

  const handleSaveEdit = (index: number) => {
    if (!editText.trim()) return;
    setNotes(prev => prev.map((n, i) => i === index ? { ...n, text: editText.trim() } : n));
    setEditingIndex(null);
    setEditText("");
  };

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
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => onToggleStar(paper.id)}>
              <Star className={`w-4 h-4 ${paper.isStarred ? "fill-yellow-500 text-yellow-500" : "text-slate-500"}`} />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Share className="w-4 h-4 text-slate-500" />
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <Download className="w-4 h-4 text-slate-500" />
            </Button>

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
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={onClose}>
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

          {/* Notes */}
          {notes.length > 0 && (
            <div>
              <h4 className="font-semibold text-slate-800 mb-3">Notes</h4>
              <div className="space-y-2">
                {notes.map((note, index) => (
                  <div key={index} className="text-sm text-slate-700 bg-slate-50 rounded-md p-3 border border-slate-200">
                    {editingIndex === index ? (
                      <div>
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          className="w-full text-sm text-slate-700 bg-white border border-slate-300 rounded-md p-2 resize-none focus:outline-none focus:ring-2 focus:ring-ring"
                          rows={3}
                          autoFocus
                        />
                        <div className="flex justify-end mt-2">
                          <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => handleSaveEdit(index)}>
                            <Check className="w-4 h-4 text-green-600" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-xs text-slate-400">{note.date}</span>
                          <div className="relative">
                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => setOpenMenuIndex(openMenuIndex === index ? null : index)}>
                              <MoreVertical className="w-3.5 h-3.5 text-slate-400" />
                            </Button>
                            {openMenuIndex === index && (
                              <div className="absolute right-0 top-7 z-10 bg-white border border-slate-200 rounded-md shadow-md py-1 w-24">
                                <button className="w-full text-left px-3 py-1.5 text-xs hover:bg-slate-50" onClick={() => handleStartEdit(index)}>Edit</button>
                                <button className="w-full text-left px-3 py-1.5 text-xs text-red-600 hover:bg-slate-50" onClick={() => handleDeleteNote(index)}>Delete</button>
                              </div>
                            )}
                          </div>
                        </div>
                        <p>{note.text}</p>
                      </>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Fixed Bottom Bar - Add Note  */}
      <div className="border-t border-slate-200 p-3 sm:p-4 bg-slate-50 flex-shrink-0">
        <div className="relative">
          <Input
            placeholder="Add note..."
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAddNote()}
            className="pr-10"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={handleAddNote}
          >
            <SendHorizontal className="w-4 h-4 text-slate-500" />
            </Button>
          </div>
        </div>
      </div>
  );
};
