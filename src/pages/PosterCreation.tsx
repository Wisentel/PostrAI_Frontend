import { useState, useEffect } from "react";
import { TopNavbar } from "@/components/TopNavbar";
import { PosterSidebar } from "@/components/PosterSidebar";
import { PosterPapersView } from "@/components/PosterPapersView";
import papersData from "@/data/papers.json";
import { Paper } from "./Dashboard";

const PosterCreation = () => {
  const [selectedFolder, setSelectedFolder] = useState<string>("myResearch");
  const [allPapers, setAllPapers] = useState<Record<string, Paper[]>>({});
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);

  useEffect(() => {
    // Load papers from JSON data
    setAllPapers(papersData);
  }, []);

  const currentPapers = allPapers[selectedFolder] || [];

  const folderNames: Record<string, string> = {
    myResearch: "My Research Papers",
    privateCollection: "Private Collection",
    publicCollection: "Public Collection"
  };

  const togglePaperSelection = (paperId: string) => {
    setSelectedPapers(prev => 
      prev.includes(paperId) 
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId]
    );
  };

  const togglePaperStar = (paperId: string) => {
    setAllPapers(prev => {
      const updated = { ...prev };
      Object.keys(updated).forEach(folderKey => {
        updated[folderKey] = updated[folderKey].map(paper =>
          paper.id === paperId ? { ...paper, isStarred: !paper.isStarred } : paper
        );
      });
      return updated;
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex flex-col h-screen">
        <TopNavbar />

        <div className="flex flex-1">
          <PosterSidebar
            selectedFolder={selectedFolder}
            onSelectFolder={setSelectedFolder}
          />

          <div className="flex-1">
            <PosterPapersView
              papers={currentPapers}
              selectedPapers={selectedPapers}
              onToggleSelection={togglePaperSelection}
              onToggleStar={togglePaperStar}
              folder={folderNames[selectedFolder]}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCreation;