import { FolderOpen, Folder, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PosterSidebarProps {
  selectedFolder: string;
  onSelectFolder: (folder: string) => void;
}

export const PosterSidebar = ({
  selectedFolder,
  onSelectFolder,
}: PosterSidebarProps) => {
  const folders = [
    { id: "myResearch", name: "My Research Papers" },
    { id: "privateCollection", name: "Private Collection" },
    { id: "publicCollection", name: "Public Collection" }
  ];

  return (
    <div className="w-64 bg-white/80 backdrop-blur-sm border-r border-slate-200 h-full overflow-y-auto">
      <div className="p-4">
        {/* Folders Section */}
        <div className="mb-8">
          <Button variant="ghost" className="w-full justify-start p-2 hover:bg-slate-100 mb-2">
            <ChevronDown className="w-4 h-4 mr-2" />
            <span className="font-medium text-slate-700">Folders</span>
          </Button>

          <div className="space-y-1 mt-2">
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
          </div>
        </div>
      </div>
    </div>
  );
};