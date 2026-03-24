import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TopNavbar } from "@/components/TopNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, X, ArrowLeft, ChevronDown, ChevronRight } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Checkbox } from "@/components/ui/checkbox";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useTopics } from "@/contexts/TopicsContext";

const Settings = () => {
  const navigate = useNavigate();
  const {
    categories,
    toggleCategory,
    toggleSubTopic,
    addCategory,
    removeCategory,
    addSubTopic,
    removeSubTopic,
  } = useTopics();

  const [newCategoryName, setNewCategoryName] = useState("");
  const [isCategoryPopoverOpen, setIsCategoryPopoverOpen] = useState(false);
  const [newSubTopicName, setNewSubTopicName] = useState("");
  const [subTopicPopoverCategoryId, setSubTopicPopoverCategoryId] = useState<string | null>(null);
  const [expandedCategories, setExpandedCategories] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(categories.map(c => [c.id, true]))
  );

  const toggleExpanded = (categoryId: string) => {
    setExpandedCategories(prev => ({ ...prev, [categoryId]: !prev[categoryId] }));
  };

  const handleAddCategory = () => {
    if (newCategoryName.trim()) {
      addCategory(newCategoryName.trim());
      setNewCategoryName("");
      setIsCategoryPopoverOpen(false);
    }
  };

  const handleAddSubTopic = (categoryId: string) => {
    if (newSubTopicName.trim()) {
      addSubTopic(categoryId, newSubTopicName.trim());
      setNewSubTopicName("");
      setSubTopicPopoverCategoryId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex flex-col h-screen">
        <TopNavbar />

        <div className="flex-1 p-6 overflow-y-auto">
          {/* Back button */}
          <div className="mb-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(-1)}
              className="text-slate-600 hover:text-slate-800 hover:bg-slate-100 -ml-2"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              Back
            </Button>
          </div>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Settings</h1>
            <p className="text-slate-600 text-lg">Manage your profile and preferences</p>
          </div>

          <div className="space-y-8 max-w-2xl mx-auto">
            {/* Profile Information */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800">Profile Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-slate-700 font-medium">First Name</Label>
                    <Input
                      id="firstName"
                      placeholder="Enter your first name"
                      className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-slate-700 font-medium">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Enter your last name"
                      className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 font-medium">Email ID</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="Enter your email address"
                    className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 font-medium">Phone Number <span className="text-slate-400">(optional)</span></Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dob" className="text-slate-700 font-medium">Date of Birth <span className="text-slate-400">(optional)</span></Label>
                  <Input
                    id="dob"
                    type="date"
                    className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender" className="text-slate-700 font-medium">Gender <span className="text-slate-400">(optional)</span></Label>
                  <select
                    id="gender"
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-md focus:border-blue-500 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all">
                  Save Profile
                </Button>
              </CardContent>
            </Card>

            {/* Topics Management - Hierarchical */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center justify-between">
                  Research Topics
                  <Popover open={isCategoryPopoverOpen} onOpenChange={setIsCategoryPopoverOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all"
                      >
                        <Plus className="w-4 h-4 mr-1" />
                        Add Topic
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-80" align="end">
                      <div className="space-y-3">
                        <h4 className="font-medium text-slate-800">Add New Topic</h4>
                        <Input
                          placeholder="Enter topic name..."
                          value={newCategoryName}
                          onChange={(e) => setNewCategoryName(e.target.value)}
                          onKeyDown={(e) => e.key === "Enter" && handleAddCategory()}
                          className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                          <Button
                            onClick={handleAddCategory}
                            disabled={!newCategoryName.trim()}
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all"
                          >
                            Add
                          </Button>
                          <Button
                            onClick={() => { setNewCategoryName(""); setIsCategoryPopoverOpen(false); }}
                            variant="outline"
                            size="sm"
                            className="bg-white/80 hover:bg-white"
                          >
                            Cancel
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {categories.length === 0 && (
                  <p className="text-slate-500 text-center py-8">
                    No topics added yet. Click "Add Topic" to get started.
                  </p>
                )}

                {categories.map((category) => (
                  <div key={category.id} className="border border-slate-200 rounded-lg overflow-hidden">
                    <Collapsible
                      open={expandedCategories[category.id] ?? true}
                      onOpenChange={() => toggleExpanded(category.id)}
                    >
                      {/* Category header */}
                      <div className="flex items-center justify-between px-3 py-2.5 bg-slate-50/80">
                        <div className="flex items-center gap-2 flex-1">
                          <CollapsibleTrigger asChild>
                            <button className="p-0.5 hover:bg-slate-200 rounded transition-colors">
                              {expandedCategories[category.id] ? (
                                <ChevronDown className="w-4 h-4 text-slate-500" />
                              ) : (
                                <ChevronRight className="w-4 h-4 text-slate-500" />
                              )}
                            </button>
                          </CollapsibleTrigger>
                          <Checkbox
                            id={`settings-cat-${category.id}`}
                            checked={category.isSelected}
                            onCheckedChange={() => toggleCategory(category.id)}
                            className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                          />
                          <label
                            htmlFor={`settings-cat-${category.id}`}
                            className="text-sm font-medium text-slate-700 cursor-pointer flex-1"
                          >
                            {category.name}
                          </label>
                        </div>
                        <div className="flex items-center gap-1">
                          <Popover
                            open={subTopicPopoverCategoryId === category.id}
                            onOpenChange={(open) => {
                              setSubTopicPopoverCategoryId(open ? category.id : null);
                              if (!open) setNewSubTopicName("");
                            }}
                          >
                            <PopoverTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-7 w-7 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                <Plus className="w-3.5 h-3.5" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-72" align="end">
                              <div className="space-y-3">
                                <h4 className="font-medium text-slate-800 text-sm">Add Sub Topic to {category.name}</h4>
                                <Input
                                  placeholder="Enter sub topic name..."
                                  value={newSubTopicName}
                                  onChange={(e) => setNewSubTopicName(e.target.value)}
                                  onKeyDown={(e) => e.key === "Enter" && handleAddSubTopic(category.id)}
                                  className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500 text-sm"
                                  autoFocus
                                />
                                <div className="flex gap-2">
                                  <Button
                                    onClick={() => handleAddSubTopic(category.id)}
                                    disabled={!newSubTopicName.trim()}
                                    size="sm"
                                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all"
                                  >
                                    Add
                                  </Button>
                                  <Button
                                    onClick={() => { setNewSubTopicName(""); setSubTopicPopoverCategoryId(null); }}
                                    variant="outline"
                                    size="sm"
                                    className="bg-white/80 hover:bg-white"
                                  >
                                    Cancel
                                  </Button>
                                </div>
                              </div>
                            </PopoverContent>
                          </Popover>
                          <button
                            onClick={() => removeCategory(category.id)}
                            className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {/* Subtopics */}
                      <CollapsibleContent>
                        {category.subTopics.length > 0 ? (
                          <div className="ml-6 mr-3 my-2 pl-3 border-l border-slate-200 space-y-1.5">
                            {category.subTopics.map((sub) => (
                              <div
                                key={sub.id}
                                className={`group/sub flex items-center justify-between pl-2 pr-1 py-1.5 rounded transition-colors ${
                                  !category.isSelected ? "opacity-50" : "hover:bg-slate-50"
                                }`}
                              >
                                <div className="flex items-center gap-2 flex-1">
                                  <Checkbox
                                    id={`settings-sub-${sub.id}`}
                                    checked={sub.isSelected}
                                    disabled={!category.isSelected}
                                    onCheckedChange={() => toggleSubTopic(category.id, sub.id)}
                                    className="data-[state=checked]:bg-blue-600 data-[state=checked]:border-blue-600"
                                  />
                                  <label
                                    htmlFor={`settings-sub-${sub.id}`}
                                    className={`text-sm cursor-pointer flex-1 ${
                                      !category.isSelected ? "text-slate-400" : "text-slate-600"
                                    }`}
                                  >
                                    {sub.name}
                                  </label>
                                </div>
                                <button
                                  onClick={() => removeSubTopic(category.id, sub.id)}
                                  className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded transition-all opacity-0 group-hover/sub:opacity-100"
                                >
                                  <X className="w-3 h-3" />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="ml-6 mr-3 my-2 pl-3 border-l border-slate-200 py-2">
                            <p className="text-xs text-slate-400 pl-2">No sub topics yet</p>
                          </div>
                        )}
                      </CollapsibleContent>
                    </Collapsible>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;