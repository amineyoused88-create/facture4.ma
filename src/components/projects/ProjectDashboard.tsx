import React from 'react';
import { useData } from '../../contexts/DataContext';
import { 
  FolderKanban, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  DollarSign,
  Users,
  Calendar,
  Target,
  Activity
} from 'lucide-react';

interface ProjectDashboardProps {
  onViewProject: (projectId: string) => void;
}

export default function ProjectDashboard({ onViewProject }: ProjectDashboardProps) {
  const { projects, tasks, clients, employees } = useData();

  // Calculs des statistiques
  const totalProjects = projects.length;
  const activeProjects = projects.filter(p => p.status === 'in_progress').length;
  const completedProjects = projects.filter(p => p.status === 'completed').length;
  const overdueProjects = projects.filter(p => {
    const endDate = new Date(p.endDate);
    return p.status !== 'completed' && endDate < new Date();
  }).length;

  const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0);
  const averageProgress = projects.length > 0 ? 
    projects.reduce((sum, p) => sum + p.progress, 0) / projects.length : 0;

  // Projets urgents (deadline dans les 7 prochains jours)
  const urgentProjects = projects.filter(project => {
    const endDate = new Date(project.endDate);
    const today = new Date();
    const diffTime = endDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays <= 7 && diffDays > 0 && project.status !== 'completed';
  }).slice(0, 5);

  // Projets récents
  const recentProjects = projects
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            En attente
          </span>
        );
      case 'in_progress':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
            En cours
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Terminé
          </span>
        );
      case 'overdue':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            En retard
          </span>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case 'high':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Haute
          </span>
        );
      case 'medium':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Moyenne
          </span>
        );
      case 'low':
        return (
          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Faible
          </span>
        );
      default:
        return null;
    }
  };

  const stats = [
    {
      title: 'Total Projets',
      value: totalProjects.toString(),
      subtitle: 'Projets créés',
      icon: FolderKanban,
      color: 'from-purple-500 to-indigo-600',
    },
    {
      title: 'Projets Actifs',
      value: activeProjects.toString(),
      subtitle: 'En cours',
      icon: Activity,
      color: 'from-blue-500 to-cyan-600',
    },
    {
      title: 'Projets Terminés',
      value: completedProjects.toString(),
      subtitle: 'Complétés',
      icon: CheckCircle,
      color: 'from-green-500 to-emerald-600',
    },
    {
      title: 'Projets en Retard',
      value: overdueProjects.toString(),
      subtitle: 'Deadline dépassée',
      icon: AlertTriangle,
      color: 'from-red-500 to-pink-600',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-600 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-2xl font-bold text-gray-900 mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-gray-500">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Métriques supplémentaires */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Progression Moyenne</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-emerald-600 mb-2">
              {averageProgress.toFixed(1)}%
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="bg-gradient-to-r from-emerald-400 to-teal-500 h-3 rounded-full transition-all duration-700"
                style={{ width: `${averageProgress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Budget Total</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {totalBudget.toLocaleString()} MAD
            </div>
            <div className="text-sm text-gray-500">
              Tous projets confondus
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-orange-600 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Équipe Active</h3>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-amber-600 mb-2">
              {employees.length}
            </div>
            <div className="text-sm text-gray-500">
              Employés disponibles
            </div>
          </div>
        </div>
      </div>

      {/* Projets urgents */}
      {urgentProjects.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-white" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Projets Urgents</h3>
            <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded-full">
              {urgentProjects.length}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {urgentProjects.map((project) => {
              const endDate = new Date(project.endDate);
              const today = new Date();
              const diffTime = endDate.getTime() - today.getTime();
              const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

              return (
                <div 
                  key={project.id} 
                  className="bg-red-50 border border-red-200 rounded-lg p-4 hover:shadow-md transition-all duration-200 cursor-pointer"
                  onClick={() => onViewProject(project.id)}
                >
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-semibold text-gray-900 truncate">{project.name}</h4>
                    {getPriorityBadge(project.priority)}
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Client:</span>
                      <span className="font-medium">{project.client.name}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Deadline:</span>
                      <span className="font-medium text-red-600">
                        {daysLeft} jour{daysLeft > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Progression:</span>
                      <span className="font-medium">{project.progress}%</span>
                    </div>
                  </div>

                  <div className="mt-3">
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-gradient-to-r from-red-400 to-pink-500 h-2 rounded-full transition-all duration-700"
                        style={{ width: `${project.progress}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Projets récents */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Projets Récents</h3>
          <button
            onClick={() => setActiveTab('projects')}
            className="text-purple-600 hover:text-purple-700 font-medium text-sm"
          >
            Voir tous les projets →
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Budget
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Progression
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentProjects.map((project) => (
                <tr 
                  key={project.id} 
                  className="hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => onViewProject(project.id)}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{project.name}</div>
                      <div className="text-xs text-gray-500">
                        {new Date(project.startDate).toLocaleDateString('fr-FR')} - {new Date(project.endDate).toLocaleDateString('fr-FR')}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {project.client.name}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {project.budget.toLocaleString()} MAD
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-indigo-500 h-2 rounded-full transition-all duration-700"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-900">{project.progress}%</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {getStatusBadge(project.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {recentProjects.length === 0 && (
          <div className="text-center py-12">
            <FolderKanban className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">Aucun projet créé</p>
            <p className="text-sm text-gray-400 mt-1">Créez votre premier projet pour commencer</p>
          </div>
        )}
      </div>

      {/* Alertes et notifications */}
      {overdueProjects > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <h3 className="text-lg font-semibold text-red-900">⚠️ Projets en Retard</h3>
          </div>
          <p className="text-red-800">
            Vous avez <strong>{overdueProjects} projet{overdueProjects > 1 ? 's' : ''}</strong> en retard. 
            Vérifiez les deadlines et réajustez les plannings.
          </p>
        </div>
      )}

      {urgentProjects.length > 0 && overdueProjects === 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <Clock className="w-8 h-8 text-orange-600" />
            <h3 className="text-lg font-semibold text-orange-900">🔔 Projets Urgents</h3>
          </div>
          <p className="text-orange-800">
            {urgentProjects.length} projet{urgentProjects.length > 1 ? 's' : ''} arrive{urgentProjects.length === 1 ? '' : 'nt'} à échéance dans les 7 prochains jours.
          </p>
        </div>
      )}

      {totalProjects > 0 && overdueProjects === 0 && urgentProjects.length === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-6">
          <div className="flex items-center space-x-3 mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
            <h3 className="text-lg font-semibold text-green-900">✅ Tous les Projets à Jour</h3>
          </div>
          <p className="text-green-800">
            Excellent ! Tous vos projets respectent leurs délais. Continuez ainsi !
          </p>
        </div>
      )}
    </div>
  );
}