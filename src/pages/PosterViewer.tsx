import { useNavigate } from "react-router-dom";
import { TopNavbar } from "@/components/TopNavbar";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

const PosterViewer = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/template-selection");
  };

  const handleDownload = () => {
    // In a real implementation, this would download the generated PDF
    console.log("Downloading poster PDF...");
    // For now, we'll create a simple download action
    const link = document.createElement('a');
    link.href = '/placeholder.svg'; // Using placeholder for demo
    link.download = 'generated-poster.pdf';
    link.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex flex-col h-screen">
        <TopNavbar />

        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={handleBack}
                  className="bg-white/80 hover:bg-white"
                >
                  ← Back
                </Button>
                <h1 className="text-3xl font-bold text-slate-800">Generated Poster</h1>
              </div>
              <Button
                onClick={handleDownload}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all"
              >
                <Download className="w-4 h-4 mr-2" />
                Download PDF
              </Button>
            </div>
            <p className="text-slate-600 text-lg">Your poster has been generated successfully</p>
          </div>

          {/* PDF Viewer */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="aspect-[3/4] w-full">
              <iframe
                src="/placeholder.svg"
                className="w-full h-full border-0"
                title="Generated Poster PDF"
              >
                <p>Your browser does not support PDFs. 
                   <a href="/placeholder.svg">Download the PDF</a> instead.
                </p>
              </iframe>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterViewer;