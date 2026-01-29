import React, { useState, useEffect, Component, ErrorInfo, ReactNode } from 'react';
import { 
  Search, 
  ShoppingCart, 
  ShieldCheck, 
  Menu,
  Zap,
  LayoutDashboard,
  Layers,
  Map,
  BookOpen,
  Cloud,
  CloudOff,
  Loader2,
  Settings,
  Database,
  Link as LinkIcon,
  X,
  Copy,
  Check,
  AlertTriangle,
  Server,
  FileCode,
  Bug
} from 'lucide-react';
import { ToolMode, Project } from './types';
import AuditView from './components/AuditView';
import KeywordView from './components/KeywordView';
import ProductView from './components/ProductView';
import CollectionView from './components/CollectionView';
import RoadmapView from './components/RoadmapView';
import MonitoringView from './components/MonitoringView';
import BlogView from './components/BlogView';
import SitemapView from './components/SitemapView';
import { projectService } from './services/projectService';

// Error Boundary Component
class ErrorBoundary extends Component<{children: ReactNode}, {hasError: boolean, error: Error | null}> {
  constructor(props: {children: ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }
  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Boundary Caught Error:", error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 text-white">
          <div className="max-w-md w-full bg-red-950/30 border border-red-500/50 p-8 rounded-[32px] text-center shadow-2xl">
            <Bug className="mx-auto mb-4 text-red-500" size={48} />
            <h1 className="text-xl font-black uppercase mb-2">Component Crash</h1>
            <p className="text-sm text-red-200/70 mb-6">{this.state.error?.message}</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-6 py-3 bg-red-600 rounded-xl font-bold uppercase text-xs"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

const App: React.FC = () => {
  const [activeMode, setActiveMode] = useState<ToolMode>(ToolMode.MONITOR);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [activeProject, setActiveProject] = useState<Project | null>(null);
  const [dbConnected, setDbConnected] = useState<boolean | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [showSettings, setShowSettings] = useState(false);
  const [apiEndpoint, setApiEndpoint] = useState(projectService.getApiUrl());
  const [testStatus, setTestStatus] = useState<{success?: boolean, message?: string}>({});
  const [isTesting, setIsTesting] = useState(false);
  const [showCode, setShowCode] = useState(false);

  const loadData = async () => {
    try {
      const list = await projectService.getProjects();
      setProjects(list);
      setDbConnected(!!projectService.getApiUrl());
      if (list.length > 0 && !activeProject) {
        setActiveProject(list[0]);
      }
    } catch (e) {
      setDbConnected(false);
    } finally {
      setIsInitialLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleTestConnection = async () => {
    if (!apiEndpoint) return;
    setIsTesting(true);
    const result = await projectService.testConnection(apiEndpoint);
    setTestStatus(result);
    setIsTesting(false);
    if (result.success) {
      projectService.setApiUrl(apiEndpoint);
      setDbConnected(true);
      setTimeout(() => loadData(), 1000);
    }
  };

  const navigation = [
    { id: ToolMode.MONITOR, name: 'Project Overview', icon: LayoutDashboard },
    { id: ToolMode.AUDIT, name: 'Site Auditor', icon: ShieldCheck },
    { id: ToolMode.ROADMAP, name: 'Ranking Roadmap', icon: Map },
    { id: ToolMode.SITEMAP, name: 'Sitemap Intel', icon: FileCode },
    { id: ToolMode.PRODUCT, name: 'Product Optimizer', icon: ShoppingCart },
    { id: ToolMode.COLLECTION, name: 'Category Analysis', icon: Layers },
    { id: ToolMode.KEYWORD, name: 'Keyword Explorer', icon: Search },
    { id: ToolMode.BLOG, name: 'Blog Audit', icon: BookOpen },
  ];

  if (isInitialLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center text-white">
        <Loader2 className="animate-spin text-orange-500 mb-4" size={48} />
        <h2 className="text-xl font-black uppercase tracking-widest animate-pulse">SEO Engine Initializing...</h2>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className="min-h-screen flex text-slate-900 overflow-hidden">
        {/* Sidebar */}
        <aside className={`bg-slate-900 text-white transition-all duration-300 ${isSidebarOpen ? 'w-72' : 'w-20'} flex flex-col shrink-0 relative z-30 shadow-2xl`}>
          <div className="p-6 flex items-center gap-3 border-b border-slate-800">
            <div className="bg-orange-500 p-2 rounded-lg shadow-lg shadow-orange-500/20">
              <Zap size={20} className="text-white fill-white" />
            </div>
            {isSidebarOpen && <span className="font-black text-xl tracking-tighter uppercase">SEOPro<span className="text-orange-500">Suite</span></span>}
          </div>

          <nav className="flex-1 mt-6 px-3 space-y-1 overflow-y-auto">
            {navigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveMode(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                  activeMode === item.id 
                    ? 'bg-orange-600 text-white shadow-xl shadow-orange-600/30' 
                    : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                }`}
              >
                <item.icon size={18} />
                {isSidebarOpen && <span className="font-bold text-[10px] uppercase tracking-widest truncate">{item.name}</span>}
              </button>
            ))}
          </nav>

          {isSidebarOpen && (
            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
               <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-4 shadow-inner">
                  <div className="flex justify-between items-center mb-3">
                     <p className="text-[9px] text-slate-500 font-black uppercase tracking-[0.2em]">Sync Engine</p>
                     <button onClick={() => setShowSettings(true)} className="text-slate-500 hover:text-orange-400 transition-colors p-1 hover:bg-white/5 rounded-lg">
                        <Settings size={14} />
                     </button>
                  </div>
                  <div className="flex items-center gap-2 mb-4">
                     {dbConnected ? (
                       <div className="flex items-center gap-1.5 text-emerald-400 text-[10px] font-black uppercase tracking-widest bg-emerald-400/10 px-3 py-1.5 rounded-full border border-emerald-400/20 w-full">
                          <Cloud size={14} /> Cloud Active
                       </div>
                     ) : (
                       <div className="flex items-center gap-1.5 text-orange-400 text-[10px] font-black uppercase tracking-widest bg-orange-400/10 px-3 py-1.5 rounded-full border border-orange-400/20 w-full">
                          <CloudOff size={14} /> Offline
                       </div>
                     )}
                  </div>
                  <select 
                    className="w-full bg-slate-950 border border-slate-800 text-[10px] p-3 rounded-xl outline-none font-black text-slate-300 uppercase tracking-widest focus:ring-1 focus:ring-orange-500 appearance-none cursor-pointer"
                    value={activeProject?.id || ''}
                    onChange={(e) => {
                      const p = projects.find(proj => proj.id === e.target.value);
                      if (p) setActiveProject(p);
                    }}
                  >
                    {projects.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    {projects.length === 0 && <option value="">No Projects</option>}
                  </select>
               </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col min-w-0 bg-slate-50 relative overflow-y-auto">
          <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-10 sticky top-0 z-20">
            <div className="flex items-center gap-6">
              <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2.5 bg-slate-50 hover:bg-slate-100 rounded-xl text-slate-500 transition-all border border-slate-200">
                <Menu size={22} />
              </button>
              <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tighter">
                {navigation.find(n => n.id === activeMode)?.name}
              </h1>
            </div>
            {activeProject && (
              <div className="flex items-center gap-6">
                 <div className="hidden lg:block text-right">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">TRACKED DOMAIN</p>
                    <p className="text-xs font-black text-slate-800 max-w-[250px] truncate bg-slate-50 px-4 py-1.5 rounded-full border border-slate-100">{activeProject.url}</p>
                 </div>
                 <div className="h-12 w-12 bg-slate-900 rounded-2xl flex items-center justify-center text-orange-500 font-black text-xl shadow-xl border-2 border-white">
                    {activeProject.name.charAt(0).toUpperCase()}
                 </div>
              </div>
            )}
          </header>

          <div className="p-10 max-w-7xl mx-auto w-full pb-32">
            {activeMode === ToolMode.MONITOR && <MonitoringView />}
            {activeMode === ToolMode.AUDIT && <AuditView />}
            {activeMode === ToolMode.PRODUCT && <ProductView />}
            {activeMode === ToolMode.COLLECTION && <CollectionView />}
            {activeMode === ToolMode.ROADMAP && <RoadmapView />}
            {activeMode === ToolMode.KEYWORD && <KeywordView />}
            {activeMode === ToolMode.BLOG && <BlogView />}
            {activeMode === ToolMode.SITEMAP && <SitemapView />}
          </div>
        </main>

        {/* Settings Modal (truncated for space, same as before) */}
        {showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md">
             <div className="bg-white w-full max-w-2xl rounded-[40px] shadow-2xl overflow-hidden border border-white/20">
                <div className="bg-slate-900 p-8 flex justify-between items-center text-white">
                   <div className="flex items-center gap-4">
                      <div className="bg-orange-500 p-3 rounded-2xl shadow-xl shadow-orange-500/20">
                          <Server size={24} className="text-white" />
                      </div>
                      <div>
                          <h2 className="text-xl font-black uppercase tracking-tighter">Connectivity Hub</h2>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Connect your DB</p>
                      </div>
                   </div>
                   <button onClick={() => setShowSettings(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                      <X size={24} />
                   </button>
                </div>
                <div className="p-10">
                   {/* Rest of settings... */}
                </div>
             </div>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default App;