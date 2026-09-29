import React from 'react';
import { useApp } from '../../context/AppContext';
import { maxBridge } from '../../services/maxBridge';
import { User, Briefcase, FolderGit2, Star, Building, ListTodo, Users, MessageSquare } from 'lucide-react';
import { StudentTab, EmployerTab } from '../../types';

export const BottomNavBar: React.FC = () => {
  const { currentRole, studentTab, setStudentTab, employerTab, setEmployerTab, deals } = useApp();

  if (!currentRole) return null;

  const handleStudentTab = (tab: StudentTab) => {
    maxBridge.haptic('light');
    setStudentTab(tab);
  };

  const handleEmployerTab = (tab: EmployerTab) => {
    maxBridge.haptic('light');
    setEmployerTab(tab);
  };

  const activeChatsCount = deals.filter(d => d.stage !== 'completed').length;

  return (
    <div className="absolute bottom-2.5 inset-x-0 z-30 flex justify-center items-center pointer-events-auto px-3 select-none">
      <div className="bg-[#141517] text-white px-2 py-1.5 rounded-full flex items-center gap-1 shadow-2xl border border-white/10 backdrop-blur-lg max-w-[340px] w-full justify-around">
        {currentRole === 'student' ? (
          <>
            <button
              type="button"
              onClick={() => handleStudentTab('profile')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all active:scale-95 ${
                studentTab === 'profile'
                  ? 'bg-[#BAEA55] text-black font-extrabold shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <User className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-bold">Анкета</span>
            </button>

            <button
              type="button"
              onClick={() => handleStudentTab('vacancies')}
              className={`flex flex-col items-center justify-center py-1 px-3 rounded-full transition-all active:scale-95 ${
                studentTab === 'vacancies'
                  ? 'bg-[#BAEA55] text-black font-extrabold shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Briefcase className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-bold">Вакансии</span>
            </button>

            <button
              type="button"
              onClick={() => handleStudentTab('portfolio')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all active:scale-95 ${
                studentTab === 'portfolio'
                  ? 'bg-[#BAEA55] text-black font-extrabold shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-bold">Портфолио</span>
            </button>

            <button
              type="button"
              onClick={() => handleStudentTab('reviews')}
              className={`flex flex-col items-center justify-center py-1 px-2.5 rounded-full transition-all active:scale-95 ${
                studentTab === 'reviews'
                  ? 'bg-[#BAEA55] text-black font-extrabold shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4" />
              <span className="text-[10px] tracking-tight mt-0.5 font-bold">Отзывы</span>
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              onClick={() => handleEmployerTab('company')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all active:scale-95 ${
                employerTab === 'company'
                  ? 'bg-[#BAEA55] text-black font-extrabold shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Building className="w-4 h-4" />
              <span className="text-[9.5px] tracking-tight mt-0.5 font-bold">Компания</span>
            </button>

            <button
              type="button"
              onClick={() => handleEmployerTab('tasks')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all active:scale-95 ${
                employerTab === 'tasks'
                  ? 'bg-[#BAEA55] text-black font-extrabold shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <ListTodo className="w-4 h-4" />
              <span className="text-[9.5px] tracking-tight mt-0.5 font-bold">Задачи</span>
            </button>

            <button
              type="button"
              onClick={() => handleEmployerTab('responses')}
              className={`relative flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all active:scale-95 ${
                employerTab === 'responses'
                  ? 'bg-[#BAEA55] text-black font-extrabold shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Users className="w-4 h-4" />
              <span className="text-[9.5px] tracking-tight mt-0.5 font-bold">Отклики</span>
              {activeChatsCount > 0 && (
                <span className="absolute top-0 right-1 w-2 h-2 rounded-full bg-rose-500" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleEmployerTab('portfolio')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all active:scale-95 ${
                employerTab === 'portfolio'
                  ? 'bg-[#BAEA55] text-black font-extrabold shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <FolderGit2 className="w-4 h-4" />
              <span className="text-[9.5px] tracking-tight mt-0.5 font-bold">Кейсы</span>
            </button>

            <button
              type="button"
              onClick={() => handleEmployerTab('reviews')}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-full transition-all active:scale-95 ${
                employerTab === 'reviews'
                  ? 'bg-[#BAEA55] text-black font-extrabold shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              <Star className="w-4 h-4" />
              <span className="text-[9.5px] tracking-tight mt-0.5 font-bold">Отзывы</span>
            </button>
          </>
        )}
      </div>
    </div>
  );
};
