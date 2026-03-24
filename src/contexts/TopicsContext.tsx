import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface SubTopic {
  id: string;
  name: string;
  isSelected: boolean;
}

export interface TopicCategory {
  id: string;
  name: string;
  isSelected: boolean;
  subTopics: SubTopic[];
}

interface TopicsContextType {
  categories: TopicCategory[];
  toggleCategory: (categoryId: string) => void;
  toggleSubTopic: (categoryId: string, subTopicId: string) => void;
  addCategory: (name: string) => void;
  removeCategory: (categoryId: string) => void;
  addSubTopic: (categoryId: string, name: string) => void;
  removeSubTopic: (categoryId: string, subTopicId: string) => void;
}

const STORAGE_KEY = 'wisentel_topic_categories';

const DEFAULT_CATEGORIES: TopicCategory[] = [
  {
    id: "cs",
    name: "Computer Science",
    isSelected: true,
    subTopics: [
      { id: "cs-oops", name: "OOPS", isSelected: true },
      { id: "cs-cn", name: "Computer Networks", isSelected: true },
      { id: "cs-db", name: "Databases", isSelected: true },
    ],
  },
  {
    id: "ai",
    name: "AI",
    isSelected: true,
    subTopics: [
      { id: "ai-nlp", name: "NLP", isSelected: true },
      { id: "ai-cv", name: "CV", isSelected: true },
      { id: "ai-dl", name: "DL", isSelected: true },
    ],
  },
];

const TopicsContext = createContext<TopicsContextType | undefined>(undefined);

export const useTopics = () => {
  const context = useContext(TopicsContext);
  if (context === undefined) {
    throw new Error('useTopics must be used within a TopicsProvider');
  }
  return context;
};

interface TopicsProviderProps {
  children: ReactNode;
}

export const TopicsProvider: React.FC<TopicsProviderProps> = ({ children }) => {
  const [categories, setCategories] = useState<TopicCategory[]>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return DEFAULT_CATEGORIES;
      }
    }
    return DEFAULT_CATEGORIES;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(categories));
  }, [categories]);

  const toggleCategory = (categoryId: string) => {
    setCategories(prev =>
      prev.map(cat =>
        cat.id === categoryId ? { ...cat, isSelected: !cat.isSelected } : cat
      )
    );
  };

  const toggleSubTopic = (categoryId: string, subTopicId: string) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== categoryId || !cat.isSelected) return cat;
        return {
          ...cat,
          subTopics: cat.subTopics.map(sub =>
            sub.id === subTopicId ? { ...sub, isSelected: !sub.isSelected } : sub
          ),
        };
      })
    );
  };

  const addCategory = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (categories.some(c => c.name.toLowerCase() === trimmed.toLowerCase())) return;
    const id = `cat-${Date.now()}`;
    setCategories(prev => [...prev, { id, name: trimmed, isSelected: true, subTopics: [] }]);
  };

  const removeCategory = (categoryId: string) => {
    setCategories(prev => prev.filter(cat => cat.id !== categoryId));
  };

  const addSubTopic = (categoryId: string, name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        if (cat.subTopics.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) return cat;
        const id = `${categoryId}-${Date.now()}`;
        return { ...cat, subTopics: [...cat.subTopics, { id, name: trimmed, isSelected: true }] };
      })
    );
  };

  const removeSubTopic = (categoryId: string, subTopicId: string) => {
    setCategories(prev =>
      prev.map(cat => {
        if (cat.id !== categoryId) return cat;
        return { ...cat, subTopics: cat.subTopics.filter(s => s.id !== subTopicId) };
      })
    );
  };

  return (
    <TopicsContext.Provider
      value={{
        categories,
        toggleCategory,
        toggleSubTopic,
        addCategory,
        removeCategory,
        addSubTopic,
        removeSubTopic,
      }}
    >
      {children}
    </TopicsContext.Provider>
  );
};
