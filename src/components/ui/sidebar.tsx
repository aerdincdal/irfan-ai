import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode,
} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

type SidebarState = "expanded" | "collapsed";

type SidebarContextType = {
  state: SidebarState;
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SIDEBAR_STORAGE_KEY = "sidebar_state";

const SidebarContext = createContext<SidebarContextType | null>(null);

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) {
    throw new Error("useSidebar must be used within SidebarProvider");
  }
  return context;
}

export const SidebarProvider = ({
  children,
  defaultOpen = true,
}: {
  children: ReactNode;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState<boolean>(defaultOpen);
  const [openMobile, setOpenMobile] = useState<boolean>(false);

  // Mobil uygulamada hep true
  const isMobile = true;

  const toggleSidebar = useCallback(() => {
    if (isMobile) {
      setOpenMobile((prev) => !prev);
    } else {
      setOpen((prev) => {
        AsyncStorage.setItem(SIDEBAR_STORAGE_KEY, JSON.stringify(!prev));
        return !prev;
      });
    }
  }, [isMobile]);

  useEffect(() => {
    const fetchSidebarState = async () => {
      try {
        const saved = await AsyncStorage.getItem(SIDEBAR_STORAGE_KEY);
        if (saved !== null) {
          setOpen(JSON.parse(saved));
        }
      } catch (error) {
        // Hata varsa görmezden gel
      }
    };
    fetchSidebarState();
  }, []);

  const state: SidebarState = open ? "expanded" : "collapsed";

  return (
    <SidebarContext.Provider
      value={{
        state,
        open,
        setOpen,
        openMobile,
        setOpenMobile,
        isMobile,
        toggleSidebar,
      }}
    >
      {children}
    </SidebarContext.Provider>
  );
};
