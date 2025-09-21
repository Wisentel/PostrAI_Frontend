import { useState, useEffect } from "react";
import { TopNavbar } from "@/components/TopNavbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface Topic {
  id: string;
  name: string;
  isSelected: boolean;
}

const Settings = () => {
  const [topics, setTopics] = useState<Topic[]>([
    { id: "1", name: "Machine Learning", isSelected: true },
    { id: "2", name: "Computer Vision", isSelected: false },
    { id: "3", name: "Natural Language Processing", isSelected: true },
    { id: "4", name: "Robotics", isSelected: false },
    { id: "5", name: "Data Science", isSelected: true },
  ]);
  const [newTopicName, setNewTopicName] = useState("");
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const toggleTopic = (topicId: string) => {
    setTopics(topics.map(topic => 
      topic.id === topicId ? { ...topic, isSelected: !topic.isSelected } : topic
    ));
  };

  const addTopic = (topicName: string) => {
    if (topicName.trim() && !topics.some(topic => topic.name.toLowerCase() === topicName.toLowerCase())) {
      const newTopic: Topic = {
        id: Date.now().toString(),
        name: topicName.trim(),
        isSelected: true
      };
      setTopics([...topics, newTopic]);
      setNewTopicName("");
      setIsPopoverOpen(false);
    }
  };

  const removeTopic = (topicId: string) => {
    setTopics(topics.filter(topic => topic.id !== topicId));
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      addTopic(newTopicName);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex flex-col h-screen">
        <TopNavbar />

        <div className="flex-1 p-6">
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

            {/* Topics Management */}
            <Card className="bg-white/80 backdrop-blur-sm border-slate-200">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-slate-800 flex items-center justify-between">
                  Research Topics
                  <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
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
                          value={newTopicName}
                          onChange={(e) => setNewTopicName(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="bg-slate-50 border-slate-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                        <div className="flex gap-2">
                          <Button 
                            onClick={() => addTopic(newTopicName)}
                            disabled={!newTopicName.trim()}
                            size="sm"
                            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all"
                          >
                            Add
                          </Button>
                          <Button 
                            onClick={() => {
                              setNewTopicName("");
                              setIsPopoverOpen(false);
                            }}
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
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {topics.map((topic) => (
                    <div key={topic.id} className="relative group">
                      <Badge
                        variant={topic.isSelected ? "default" : "outline"}
                        className={`cursor-pointer transition-all text-sm px-3 py-1 pr-8 ${
                          topic.isSelected
                            ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700"
                            : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
                        }`}
                        onClick={() => toggleTopic(topic.id)}
                      >
                        {topic.name}
                      </Badge>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          removeTopic(topic.id);
                        }}
                        className="absolute -top-1 -right-1 bg-red-500 hover:bg-red-600 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
                {topics.length === 0 && (
                  <p className="text-slate-500 text-center py-8">
                    No topics added yet. Click "Add Topic" to get started.
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;