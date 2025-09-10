import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { 
  FolderKanban, 
  Crown,
  Plus,
  Calendar,
  BarChart3,
  Users,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  DollarSign,
  FileText,
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import ProjectDashboard from './ProjectDashboard';
import ProjectsList from './ProjectsList';
import ProjectKanban from './ProjectKanban';
import ProjectCalendar from './ProjectCalendar';
import ProjectReports from './ProjectReports';
import AddProjectModal from './AddProjectModal';
import EditProjectModal from './EditProjectModal';
import ProjectDetailView from './ProjectDetailView';

export default function ProjectManagement() {
  const { user } = useAuth();
  const { projects, tasks, clients, employees } = useData();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<string | null>(null);
  const [viewingProject, setViewingProject] = useState<string | null>(null);

  // Vérifier l'accès PRO
  const isProActive = user?.company.subscription === 'pro' && user?.company.expiryDate && 
    new Date(user.company.expiryDate) > new Date();

  if (!isProActive) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
            <Crown className="w-10 h-10 text-white" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            🔒 Fonctionnalité PRO
          </h2>
          <p className="text-gray-600 mb-6">
            La Gestion de Projet est réservée aux abonnés PRO. 
            Passez à la version PRO pour accéder à cette fonctionnalité avancée.
          </p>
          <button className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 py-3 rounded-lg font-semibold transition-all duration-200">
            <span className="flex items-center justify-center space-x-2">
              <Crown className="w-5 h-5" />
              <span>Passer à PRO - 299 MAD/mois</span>
            </span>
          </button>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Tableau de Bord', icon: BarChart3 },
    { id: 'projects', label: 'Projets', icon: FolderKanban },
    { id: 'kanban', label: 'Kanban', icon: Target },
    { id: 'calendar', label: 'Calendrier', icon: Calendar },
    { id: 'reports', label: 'Rapports', icon: FileText }
  ];

  // Si on visualise un projet, afficher la vue détaillée
  if (viewingProject) {
    const project = projects.find(p => p.id === viewingProject);
    if (project) {
      return (
        <ProjectDetailView 
          project={project}
          onBack={() => setViewingProject(null)}
        />
      );
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
            <FolderKanban className="w-8 h-8 text-purple-600" />
            <span>Gestion de Projet</span>
            <Crown className="w-6 h-6 text-yellow-500" />
          </h1>
          <p className="text-gray-600 mt-2">
            Gérez vos projets, tâches et équipes avec des outils collaboratifs avancés. 
            Fonctionnalité PRO avec Kanban, calendrier et rapports.
          </p>
        </div>
        <button
          onClick={() => setIsAddProjectModalOpen(true)}
          className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-4 py-2 rounded-lg transition-all duration-200"
        >
          <Plus className="w-4 h-4" />
          <span>Nouveau Projet</span>
        </button>
      </div>

      {/* Navigation par onglets */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Contenu des onglets */}
      {activeTab === 'dashboard' && (
        <ProjectDashboard 
          onViewProject={setViewingProject}
        />
      )}

      {activeTab === 'projects' && (
        <ProjectsList 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          onEditProject={setEditingProject}
          onViewProject={setViewingProject}
        />
      )}

      {activeTab === 'kanban' && (
        <ProjectKanban />
      )}

      {activeTab === 'calendar' && (
        <ProjectCalendar />
      )}

      {activeTab === 'reports' && (
        <ProjectReports />
      )}

      {/* Modals */}
      <AddProjectModal 
        isOpen={isAddProjectModalOpen} 
        onClose={() => setIsAddProjectModalOpen(false)} 
      />

      {editingProject && (
        <EditProjectModal
          isOpen={!!editingProject}
          onClose={() => setEditingProject(null)}
          project={projects.find(p => p.id === editingProject)!}
        />
      )}
    </div>
  );
}