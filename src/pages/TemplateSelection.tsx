import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopNavbar } from "@/components/TopNavbar";
import { Button } from "@/components/ui/button";
import templateAcademic from "@/assets/template-academic.jpg";
import templateCreative from "@/assets/template-creative.jpg";
import templateMinimal from "@/assets/template-minimal.jpg";
import templateScientific from "@/assets/template-scientific.jpg";
import templateBusiness from "@/assets/template-business.jpg";
import templateEducational from "@/assets/template-educational.jpg";

interface Template {
  id: string;
  name: string;
  image: string;
  description: string;
}

const templates: Template[] = [
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

const TemplateSelection = () => {
  const navigate = useNavigate();
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(selectedTemplate === templateId ? null : templateId);
  };

  const handleContinue = () => {
    if (selectedTemplate) {
      navigate("/poster-viewer");
    }
  };

  const handleBack = () => {
    navigate("/poster-creation");
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
              <div
                key={template.id}
                className={`group cursor-pointer transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? "ring-2 ring-blue-500 ring-offset-2"
                    : "hover:shadow-lg"
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden">
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
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

export default TemplateSelection;