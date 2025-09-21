import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopNavbar } from "@/components/TopNavbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Check, FileText, Zap, Sparkles } from "lucide-react";
import templateAcademic from "@/assets/template-academic.jpg";
import templateCreative from "@/assets/template-creative.jpg";
import templateMinimal from "@/assets/template-minimal.jpg";
import templateScientific from "@/assets/template-scientific.jpg";
import templateBusiness from "@/assets/template-business.jpg";
import templateEducational from "@/assets/template-educational.jpg";

const TemplateSelection = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const templates = [
  {
    id: "academic",
    name: "Academic Research",
    image: templateAcademic,
    description: "Clean and professional layout perfect for academic presentations"
  },
  {
    id: "creative",
    name: "Creative Conference",
    image: templateCreative,
    description: "Vibrant and modern design for creative and artistic presentations"
  },
  {
    id: "minimal",
    name: "Minimalist",
    image: templateMinimal,
    description: "Simple and elegant design with focus on content"
  },
  {
    id: "scientific",
    name: "Scientific Research",
    image: templateScientific,
    description: "Data-focused template ideal for scientific and medical research"
  },
  {
    id: "business",
    name: "Business Professional",
    image: templateBusiness,
    description: "Corporate design perfect for business presentations"
  },
  {
    id: "educational",
    name: "Educational",
    image: templateEducational,
    description: "Engaging and colorful design for educational content"
  }
];

  const handleBack = () => {
    navigate("/poster-creation");
  };

  const handleTemplateSelect = (templateId: string) => {
    if (selectedTemplate === templateId) {
      setSelectedTemplate(null);
    } else {
      setSelectedTemplate(templateId);
    }
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      setIsGenerating(true);
      // Show generation animation for 8 seconds
      setTimeout(() => {
        navigate("/poster-viewer");
      }, 8000);
    }
  };

  // Generation Animation Component
  const GenerationAnimation = () => (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-900/95 via-purple-900/95 to-pink-900/95 backdrop-blur-sm z-50 flex items-center justify-center">
      <div className="text-center space-y-8 animate-fade-in">
        {/* Main animation area */}
        <div className="relative">
          {/* Spinning outer ring */}
          <div className="w-32 h-32 mx-auto border-4 border-white/20 rounded-full animate-spin">
            <div className="w-full h-full border-t-4 border-blue-400 rounded-full animate-pulse"></div>
          </div>

          {/* Center icon with pulsing effect */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-6 rounded-full animate-pulse">
              <FileText className="w-12 h-12 text-white" />
            </div>
          </div>

          {/* Floating particles */}
          <div className="absolute -top-4 -left-4 w-3 h-3 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0s' }}></div>
          <div className="absolute -top-2 -right-6 w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0.5s' }}></div>
          <div className="absolute -bottom-4 -right-4 w-4 h-4 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '1s' }}></div>
          <div className="absolute -bottom-2 -left-6 w-2 h-2 bg-blue-300 rounded-full animate-bounce" style={{ animationDelay: '1.5s' }}></div>
        </div>

        {/* Text content */}
        <div className="space-y-4">
          <h2 className="text-3xl font-bold text-white">Generating Your Poster</h2>
          <div className="flex items-center justify-center space-x-6 text-white/80">
            <div className="flex items-center space-x-2 animate-fade-in" style={{ animationDelay: '1s' }}>
              <Zap className="w-5 h-5 text-yellow-400" />
              <span>Processing content</span>
            </div>
            <div className="flex items-center space-x-2 animate-fade-in" style={{ animationDelay: '2s' }}>
              <Sparkles className="w-5 h-5 text-purple-400" />
              <span>Applying design</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-64 mx-auto bg-white/20 rounded-full h-2 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-[slide-in-right_8s_ease-out_forwards] transform -translate-x-full"></div>
          </div>

          <p className="text-white/60 text-lg">This may take a few moments...</p>
        </div>
      </div>
    </div>
  );

  if (isGenerating) {
    return <GenerationAnimation />;
  }

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
                <h1 className="text-3xl font-bold text-slate-800">Select a Template</h1>
              </div>
              <Button
                onClick={handleContinue}
                disabled={!selectedTemplate}
                className={`bg-gradient-to-r text-white transition-all ${
                  selectedTemplate
                    ? "from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    : "from-gray-400 to-gray-500 cursor-not-allowed"
                }`}
              >
                Generate Poster
              </Button>
            </div>
            <p className="text-slate-600 text-lg">Choose a template that best fits your research presentation</p>
          </div>

          {/* Templates Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {templates.map((template) => (
              <Card
                key={template.id}
                className={`group cursor-pointer transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : "hover:shadow-lg"
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <CardContent className="p-0">
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={template.image}
                      alt={template.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-slate-800 mb-2">
                      {template.name}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed">
                      {template.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;