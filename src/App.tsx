import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { MaxHeader } from './components/max/MaxHeader';
import { BottomNavBar } from './components/max/BottomNavBar';
import { ScreenAuth } from './components/auth/ScreenAuth';
import { ScreenStudentProfile } from './components/student/ScreenStudentProfile';
import { ScreenStudentVacancies } from './components/student/ScreenStudentVacancies';
import { ScreenStudentPortfolio } from './components/student/ScreenStudentPortfolio';
import { ScreenStudentReviews } from './components/student/ScreenStudentReviews';
import { ScreenEmployerCompany } from './components/employer/ScreenEmployerCompany';
import { ScreenEmployerTasks } from './components/employer/ScreenEmployerTasks';
import { ScreenEmployerResponses } from './components/employer/ScreenEmployerResponses';
import { ScreenEmployerPortfolio } from './components/employer/ScreenEmployerPortfolio';
import { ScreenEmployerReviews } from './components/employer/ScreenEmployerReviews';
import { ChatModal } from './components/modals/ChatModal';
import { StudentProfilePreviewModal } from './components/modals/StudentProfilePreviewModal';
import { ApplyModal } from './components/modals/ApplyModal';
import { CreateTaskModal } from './components/modals/CreateTaskModal';
import { AddProjectModal } from './components/modals/AddProjectModal';
import { ChangePasswordModal } from './components/modals/ChangePasswordModal';
import { DeployGuideModal } from './components/modals/DeployGuideModal';
import { VacancyDetailsModal } from './components/modals/VacancyDetailsModal';
import { Vacancy } from './types';

function AppContent() {
  const {
    currentUser,
    currentRole,
    studentTab,
    employerTab,
    activeDealId,
    previewStudentId,
    isDeployGuideOpen,
    openChatForApplication,
    openChatForDeal,
    closeChat,
    setPreviewStudentId,
    setIsDeployGuideOpen,
    setEmployerTab,
  } = useApp();

  const [applyVacancy, setApplyVacancy] = useState<Vacancy | null>(null);
  const [selectedVacancyDetail, setSelectedVacancyDetail] = useState<Vacancy | null>(null);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  const [isAddProjectOpen, setIsAddProjectOpen] = useState(false);
  const [isChangePassOpen, setIsChangePassOpen] = useState(false);
  const [selectedTaskForResponses, setSelectedTaskForResponses] = useState<string | null>(null);

  const handleOpenResponsesForTask = (taskId: string) => {
    setSelectedTaskForResponses(taskId);
    setEmployerTab('responses');
  };

  return (
    <div className="min-h-screen bg-[#DDE3EA] flex flex-col justify-center items-center p-0 sm:p-2 select-none overflow-x-hidden font-sans text-[#121316]">
      <div className="w-full h-screen max-w-md bg-[#EEF6E1] text-[#121316] flex flex-col relative shadow-xl mx-auto sm:border-x sm:border-slate-300 overflow-hidden sm:h-[844px] sm:rounded-3xl">
        <MaxHeader
          showBack={selectedVacancyDetail !== null}
          onBack={() => setSelectedVacancyDetail(null)}
        />

        <main className="flex-1 min-h-0 flex flex-col overflow-hidden relative">
          {!currentUser ? (

            <ScreenAuth />
          ) : currentRole === 'student' ? (

            <>
              {studentTab === 'profile' && (
                <ScreenStudentProfile
                  onOpenPreview={(id) => setPreviewStudentId(id)}
                  onOpenChangePass={() => setIsChangePassOpen(true)}
                />
              )}

              {studentTab === 'vacancies' && (
                <ScreenStudentVacancies
                  onSelectVacancy={(vac) => setSelectedVacancyDetail(vac)}
                  onApplyVacancy={(vac) => setSelectedVacancyDetail(vac)}
                  onOpenChatForDealId={(dealId) => openChatForDeal(dealId)}
                />
              )}

              {studentTab === 'portfolio' && (
                <ScreenStudentPortfolio
                  onAddManualProject={() => setIsAddProjectOpen(true)}
                  onOpenChatForDealId={(dealId) => openChatForDeal(dealId)}
                />
              )}

              {studentTab === 'reviews' && <ScreenStudentReviews />}
            </>
          ) : (

            <>
              {employerTab === 'company' && <ScreenEmployerCompany />}

              {employerTab === 'tasks' && (
                <ScreenEmployerTasks
                  onOpenCreateTask={() => setIsCreateTaskOpen(true)}
                  onOpenResponsesForTask={handleOpenResponsesForTask}
                />
              )}

              {employerTab === 'responses' && (
                <ScreenEmployerResponses
                  initialVacancyId={selectedTaskForResponses}
                  onPreviewStudent={(id) => setPreviewStudentId(id)}
                  onOpenChat={(app) => openChatForApplication(app)}
                />
              )}

              {employerTab === 'portfolio' && (
                <ScreenEmployerPortfolio
                  onOpenChatForDealId={(dealId) => openChatForDeal(dealId)}
                />
              )}

              {employerTab === 'reviews' && <ScreenEmployerReviews />}
            </>
          )}

          {selectedVacancyDetail && (
            <VacancyDetailsModal
              vacancy={selectedVacancyDetail}
              onClose={() => setSelectedVacancyDetail(null)}
              onOpenChat={(dealId) => {
                setSelectedVacancyDetail(null);
                openChatForDeal(dealId);
              }}
            />
          )}

          {activeDealId && <ChatModal dealId={activeDealId} onClose={closeChat} />}

          {applyVacancy && (
            <ApplyModal
              vacancy={applyVacancy}
              onClose={() => setApplyVacancy(null)}
              onSuccess={() => setApplyVacancy(null)}
            />
          )}

          {previewStudentId && (
            <StudentProfilePreviewModal
              studentId={previewStudentId}
              onClose={() => setPreviewStudentId(null)}
              onStartChat={() => {}}
            />
          )}

          {isCreateTaskOpen && <CreateTaskModal onClose={() => setIsCreateTaskOpen(false)} />}

          {isAddProjectOpen && <AddProjectModal onClose={() => setIsAddProjectOpen(false)} />}

          {isChangePassOpen && <ChangePasswordModal onClose={() => setIsChangePassOpen(false)} />}
        </main>

        {currentUser && <BottomNavBar />}
      </div>

      {isDeployGuideOpen && <DeployGuideModal onClose={() => setIsDeployGuideOpen(false)} />}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
