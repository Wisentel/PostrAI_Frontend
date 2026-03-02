import { useState, useEffect } from "react";
import { TopNavbar } from "@/components/TopNavbar";
import { DashboardSidebar } from "@/components/DashboardSidebar";
import { PapersView } from "@/components/PapersView";
import { PaperDetails } from "@/components/PaperDetails";
import { useUser } from "@/contexts/UserContext";
import { apiClient } from "@/lib/api";

export interface Paper {
  id: string;
  title: string;
  authors: string[];
  date: string;
  labels: string[];
  abstract: string;
  summary: string;
  folders: string[]; // which folders this paper belongs to: "myPapers", "favorites", "public"
  folder: string;
}

export interface Topic {
  id: string;
  name: string;
  isSelected: boolean;
}

const FOLDER_DEFS = [
  { id: "myFeed", name: "My Feed" },
  { id: "myPapers", name: "My Papers" },
  { id: "favorites", name: "Favorites" },
  { id: "public", name: "Public" },
];

// Sample document IDs for demonstration - in a real app, these would come from user data or be configurable
const SAMPLE_DOCUMENT_IDS = [
  "arxiv_2506_20697",
  "arxiv_2506_14861", 
  "arxiv_2504_14361",
  "arxiv_2502_11982",
  "arxiv_2507_07454"
];

const Dashboard = () => {
  const { user, isAuthenticated, isLoading } = useUser();
  const [selectedFolder, setSelectedFolder] = useState<string>("myFeed");
  const [selectedPaper, setSelectedPaper] = useState<Paper | null>(null);
  const [allPapers, setAllPapers] = useState<Paper[]>([]);
  const [topics, setTopics] = useState<Topic[]>([]);
  const [isLoadingTopics, setIsLoadingTopics] = useState<boolean>(false);
  const [isLoadingPapers, setIsLoadingPapers] = useState<boolean>(false);
  const [topicsError, setTopicsError] = useState<string | null>(null);
  const [papersError, setPapersError] = useState<string | null>(null);
  const [isAddingTopic, setIsAddingTopic] = useState<boolean>(false);

  // Load user papers from API
  const fetchUserPapers = async () => {
    if (!user?.user_id) {
      console.log('No user or user_id available, skipping papers fetch');
      return;
    }

    setIsLoadingPapers(true);
    setPapersError(null);

    try {
      console.log('Fetching papers for user:', user.user_id);
      
      // Step 1: Add user documents to get folder information
      const documentsResponse = await apiClient.addUserDocuments({
        user_id: user.user_id,
        document_ids: SAMPLE_DOCUMENT_IDS
      });

      if (!documentsResponse.success) {
        throw new Error(documentsResponse.message || 'Failed to add user documents');
      }

      console.log('User documents added/retrieved:', documentsResponse);

      // Handle the case where documents array is empty (all documents already existed)
      // In this case, we need to get all user documents to display them
      let userDocuments = documentsResponse.documents;
      
      if (userDocuments.length === 0) {
        console.log('No documents returned (likely all already existed), fetching all user documents...');
        // For now, we'll proceed with fetching metadata for all SAMPLE_DOCUMENT_IDS
        // assuming they belong to the user. In a real app, you'd have a separate endpoint
        // to get all user documents.
        
        // Create mock document objects for the sample documents
        userDocuments = SAMPLE_DOCUMENT_IDS.map(docId => ({
          id: `mock_${docId}`,
          user_id: user.user_id,
          document_id: docId,
          folder: 'my_papers', // Default folder
          is_favorite: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }));
        
        console.log('Using mock user documents:', userDocuments);
      }

      // Step 2: Group documents by folder
      const documentsByFolder: Record<string, string[]> = {};
      userDocuments.forEach(doc => {
        if (!documentsByFolder[doc.folder]) {
          documentsByFolder[doc.folder] = [];
        }
        documentsByFolder[doc.folder].push(doc.document_id);
      });

      console.log('Documents grouped by folder:', documentsByFolder);

      // Step 3: Fetch metadata for each folder separately, then flatten to Paper[]
      const flattenedPapers: Paper[] = [];
      
      for (const [folder, documentIds] of Object.entries(documentsByFolder)) {
        console.log(`Fetching metadata for folder: ${folder}, documents:`, documentIds);
        
        const metadataResponse = await apiClient.getResearchPapersMetadata({
          document_ids: documentIds
        });

        if (metadataResponse.success) {
          const folderKey = mapFolderNameToKey(folder);
          
          // Convert API response to Paper interface with folders array
          const papers: Paper[] = metadataResponse.papers.map(paper => {
            const userDoc = userDocuments.find(doc => doc.document_id === paper.document_id);
            const isFavorite = userDoc?.is_favorite || false;
            const folders: string[] = [folderKey];
            if (isFavorite && !folders.includes("favorites")) folders.push("favorites");
            return {
              id: paper.document_id,
              title: paper.title,
              authors: paper.authors,
              date: paper.published_date,
              labels: paper.labels,
              abstract: paper.abstract,
              summary: paper.summary,
              folders,
              folder: folderKey
            };
          });

          flattenedPapers.push(...papers);
          console.log(`Papers loaded for folder ${folder} (${folderKey}):`, papers);
        } else {
          console.error(`Failed to fetch metadata for folder ${folder}:`, metadataResponse);
        }
      }

      console.log('All papers loaded:', flattenedPapers);
      setAllPapers(flattenedPapers);

    } catch (error) {
      console.error('Error fetching user papers:', error);
      setPapersError(error instanceof Error ? error.message : 'Failed to load your papers');
    } finally {
      setIsLoadingPapers(false);
    }
  };

  // Map API folder names to frontend folder keys
  const mapFolderNameToKey = (folderName: string): string => {
    switch (folderName) {
      case 'my_papers':
        return 'myPapers';
      case 'private_collection':
        return 'myPapers';
      case 'public_collection':
        return 'public';
      default:
        return 'myPapers';
    }
  };

  // Load user topics from API
  const fetchUserTopics = async () => {
    if (!user?.user_id) {
      console.log('No user or user_id available, skipping topics fetch');
      return;
    }

    setIsLoadingTopics(true);
    setTopicsError(null);

    try {
      console.log('Fetching topics for user:', user.user_id);
      const response = await apiClient.getUserTopics({ user_id: user.user_id });
      
      if (response.success) {
        // Convert API topics to Topic interface format
        const userTopics: Topic[] = response.topics.map((topicName, index) => ({
          id: (index + 1).toString(),
          name: topicName,
          isSelected: true, // Default to selected
        }));
        
        console.log('User topics loaded:', userTopics);
        setTopics(userTopics);
      } else {
        console.error('Failed to fetch user topics:', response);
        setTopicsError('Failed to load your topics');
      }
    } catch (error) {
      console.error('Error fetching user topics:', error);
      setTopicsError(error instanceof Error ? error.message : 'Failed to load your topics');
    } finally {
      setIsLoadingTopics(false);
    }
  };

  // Load data when user changes
  useEffect(() => {
    if (user?.user_id) {
      fetchUserTopics();
      fetchUserPapers();
    }
  }, [user?.user_id]);

  // Redirect to login if not authenticated (but only after loading is complete)
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('User not authenticated, redirecting to login');
      window.location.href = '/login';
    }
  }, [isAuthenticated, isLoading]);

  // Show loading state while user context is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Don't render dashboard if not authenticated (after loading is complete)
  if (!isAuthenticated) {
    return null;
  }

  const currentPapers =
    selectedFolder === "myFeed"
      ? allPapers
      : allPapers.filter((p) => p.folders?.includes(selectedFolder) ?? false);

  const folderName = FOLDER_DEFS.find((f) => f.id === selectedFolder)?.name ?? selectedFolder;

  const toggleTopic = (topicId: string) => {
    setTopics(topics.map((topic) => 
      topic.id === topicId ? { ...topic, isSelected: !topic.isSelected } : topic
    ));
  };

  const addTopic = async (topicName: string) => {
    if (!user?.user_id) {
      console.error('No user_id available for adding topic');
      return;
    }

    setIsAddingTopic(true);
    setTopicsError(null);

    try {
      console.log('Adding topic:', topicName, 'for user:', user.user_id);
      
      const response = await apiClient.addUserTopics({
        user_id: user.user_id,
        topics: [topicName]
      });

      if (response.success) {
        console.log('Topic added successfully:', response);
        // Refresh the topics list to get the latest data
        await fetchUserTopics();
      } else {
        console.error('Failed to add topic:', response);
        setTopicsError('Failed to add topic');
      }
    } catch (error) {
      console.error('Error adding topic:', error);
      setTopicsError(error instanceof Error ? error.message : 'Failed to add topic');
    } finally {
      setIsAddingTopic(false);
    }
  };

  // Toggle a paper's membership in a given sub-folder
  const togglePaperFolder = (paperId: string, folderId: string) => {
    setAllPapers((prev) =>
      prev.map((paper) => {
        if (paper.id !== paperId) return paper;
        const inFolder = paper.folders.includes(folderId);
        const newFolders = inFolder
          ? paper.folders.filter((f) => f !== folderId)
          : [...paper.folders, folderId];
        return { ...paper, folders: newFolders };
      })
    );
    if (selectedPaper?.id === paperId) {
      setSelectedPaper((prev) => {
        if (!prev) return null;
        const inFolder = prev.folders.includes(folderId);
        const newFolders = inFolder
          ? prev.folders.filter((f) => f !== folderId)
          : [...prev.folders, folderId];
        return { ...prev, folders: newFolders };
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex flex-col h-screen">
        <TopNavbar />
        
        <div className="flex flex-1 overflow-hidden">
          {/* Left Sidebar - Fixed width, independent scroll */}
          <div className="w-64 flex-shrink-0">
            <DashboardSidebar
              topics={topics}
              onToggleTopic={toggleTopic}
              onAddTopic={addTopic}
              selectedFolder={selectedFolder}
              onSelectFolder={setSelectedFolder}
              isLoadingTopics={isLoadingTopics}
              topicsError={topicsError}
              isAddingTopic={isAddingTopic}
            />
          </div>
          
          {/* Main Content Area - Flexible container for papers and details */}
          <div className="flex flex-1 overflow-hidden">
            {/* Papers View - Responsive width based on whether details pane is open */}
            <div className={`transition-all duration-300 overflow-hidden ${
              selectedPaper 
                ? 'w-[60%] min-w-[400px] max-w-[65%]' 
                : 'w-full'
            }`}>
              <PapersView
                papers={currentPapers}
                selectedPaper={selectedPaper}
                onSelectPaper={setSelectedPaper}
                onTogglePaperFolder={togglePaperFolder}
                folder={folderName}
                isLoadingPapers={isLoadingPapers}
                papersError={papersError}
              />
            </div>
            
            {/* Paper Details - Responsive width, slides in from right */}
            {selectedPaper && (
              <div className={`transition-all duration-300 overflow-hidden ${
                selectedPaper 
                  ? 'w-[40%] min-w-[400px] max-w-[45%] opacity-100 translate-x-0' 
                  : 'w-0 opacity-0 translate-x-full'
              }`}>
                <PaperDetails
                  paper={selectedPaper}
                  onClose={() => setSelectedPaper(null)}
                  onTogglePaperFolder={togglePaperFolder}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
