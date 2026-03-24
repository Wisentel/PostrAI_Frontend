import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { TopNavbar } from "@/components/TopNavbar";
import { PosterSidebar } from "@/components/PosterSidebar";
import { PosterPapersView } from "@/components/PosterPapersView";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Paper } from "./Dashboard";
import { useUser } from "@/contexts/UserContext";
import { apiClient } from "@/lib/api";

// Sample document IDs for demonstration - same as Dashboard
const SAMPLE_DOCUMENT_IDS = [
  "arxiv_2506_20697",
  "arxiv_2506_14861", 
  "arxiv_2504_14361",
  "arxiv_2502_11982",
  "arxiv_2507_07454"
];

const PosterCreation = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, isLoading } = useUser();
  const [selectedFolder, setSelectedFolder] = useState<string>("myFeed");
  const [allPapers, setAllPapers] = useState<Paper[]>([]);
  const [selectedPapers, setSelectedPapers] = useState<string[]>([]);
  const [isLoadingPapers, setIsLoadingPapers] = useState<boolean>(false);
  const [papersError, setPapersError] = useState<string | null>(null);

  // Load user papers from API (similar to Dashboard implementation)
  const fetchUserPapers = async () => {
    if (!user?.user_id) {
      console.log('No user or user_id available, skipping papers fetch');
      return;
    }

    setIsLoadingPapers(true);
    setPapersError(null);

    try {
      console.log('Fetching papers for poster creation for user:', user.user_id);
      
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
      let userDocuments = documentsResponse.documents;
      
      if (userDocuments.length === 0) {
        console.log('No documents returned (likely all already existed), using sample documents...');
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
            if (isFavorite && !folders.includes("private")) folders.push("private");
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

      console.log('All papers loaded for poster creation:', flattenedPapers);
      setAllPapers(flattenedPapers);

    } catch (error) {
      console.error('Error fetching user papers for poster creation:', error);
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

  // Load data when user changes
  useEffect(() => {
    if (user?.user_id) {
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

  const folderNames: Record<string, string> = {
    myFeed: "My Feed",
    myPapers: "My Papers",
    private: "Private",
    public: "Public"
  };

  const currentPapers =
    selectedFolder === "myFeed"
      ? allPapers
      : allPapers.filter((p) => p.folders?.includes(selectedFolder) ?? false);

  const togglePaperSelection = (paperId: string) => {
    setSelectedPapers(prev => 
      prev.includes(paperId) 
        ? prev.filter(id => id !== paperId)
        : [...prev, paperId]
    );
  };

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

  // Don't render if not authenticated (after loading is complete)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50">
      <div className="flex flex-col h-screen">
        <TopNavbar />

        <div className="px-6 pt-4 pb-2">
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
              folder={folderNames[selectedFolder]}
              isLoadingPapers={isLoadingPapers}
              papersError={papersError}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PosterCreation;