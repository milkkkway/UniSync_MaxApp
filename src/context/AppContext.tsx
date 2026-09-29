import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  UserRole,
  StudentProfile,
  EmployerProfile,
  Vacancy,
  Application,
  Project,
  Review,
  Deal,
  ChatMessage,
  StudentTab,
  EmployerTab,
} from '../types';
import { maxBridge } from '../services/maxBridge';

const DB_SCHEMA_VERSION = 'v2_clean_real_db';
if (typeof window !== 'undefined' && localStorage.getItem('max_cases_schema') !== DB_SCHEMA_VERSION) {
  localStorage.removeItem('max_cases_user');
  localStorage.removeItem('max_db_users');
  localStorage.removeItem('max_student_profiles');
  localStorage.removeItem('max_employer_profiles');
  localStorage.removeItem('max_vacancies');
  localStorage.removeItem('max_applications');
  localStorage.removeItem('max_projects');
  localStorage.removeItem('max_reviews');
  localStorage.removeItem('max_deals');
  localStorage.removeItem('max_messages');
  localStorage.setItem('max_cases_schema', DB_SCHEMA_VERSION);
}

const SEED_USERS: User[] = [];
const SEED_STUDENT_PROFILES: Record<string, StudentProfile> = {};
const SEED_EMPLOYER_PROFILES: Record<string, EmployerProfile> = {};
const SEED_VACANCIES: Vacancy[] = [];
const SEED_APPLICATIONS: Application[] = [];
const SEED_PROJECTS: Project[] = [];
const SEED_REVIEWS: Review[] = [];
const SEED_DEALS: Deal[] = [];
const SEED_MESSAGES: ChatMessage[] = [];

interface AppContextType {
  currentUser: User | null;
  currentRole: UserRole | null;
  studentProfile: StudentProfile | null;
  employerProfile: EmployerProfile | null;
  studentTab: StudentTab;
  employerTab: EmployerTab;
  vacancies: Vacancy[];
  applications: Application[];
  projects: Project[];
  reviews: Review[];
  deals: Deal[];
  messages: ChatMessage[];
  activeDealId: string | null;
  previewStudentId: string | null;
  isDeployGuideOpen: boolean;

  setStudentTab: (tab: StudentTab) => void;
  setEmployerTab: (tab: EmployerTab) => void;
  quickLogin: (userId: string) => void;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  registerStudent: (data: { name: string; email: string; pass: string }) => { success: boolean; message?: string };
  registerEmployer: (data: { name: string; companyName: string; email: string; pass: string; inn?: string }) => { success: boolean; message?: string };
  logout: () => void;
  updateStudentProfile: (profile: Partial<StudentProfile>) => void;
  updateEmployerProfile: (profile: Partial<EmployerProfile>) => void;
  createVacancy: (data: Omit<Vacancy, 'id' | 'employerId' | 'companyName' | 'responsesCount' | 'createdAt'>) => void;
  updateVacancyStatus: (vacancyId: string, status: Vacancy['status']) => void;
  duplicateVacancy: (vacancyId: string) => void;
  deleteVacancy: (vacancyId: string) => void;
  applyToVacancy: (vacancyId: string, coverLetter: string, proposedPrice: number, deliveryDays: number) => { success: boolean; message?: string };
  toggleApplication: (vacancyId: string, coverLetter?: string, proposedPrice?: number, deliveryDays?: number) => { status: 'applied' | 'revoked'; message?: string };
  removeApplication: (vacancyId: string) => void;
  openChatForApplication: (app: Application) => void;
  openChatForDeal: (dealId: string) => void;
  closeChat: () => void;
  sendMessage: (dealId: string, text: string, type?: ChatMessage['type'], metadata?: ChatMessage['metadata']) => void;
  agreeDeal: (dealId: string) => void;
  sendRequisites: (dealId: string, requisites: { bankName: string; recipientPhone: string; cardNumber?: string; note?: string }) => void;
  confirmPayment: (dealId: string) => void;
  leaveReview: (dealId: string, rating: number, text: string) => void;
  replyToReview: (reviewId: string, replyText: string) => void;
  addManualProject: (proj: Omit<Project, 'id' | 'studentId' | 'isManual'>) => void;
  changePassword: (oldPass: string, newPass: string) => { success: boolean; message?: string };
  setPreviewStudentId: (id: string | null) => void;
  setIsDeployGuideOpen: (open: boolean) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

  const [users, setUsers] = useState<User[]>(() => {
    const saved = localStorage.getItem('max_db_users');
    return saved ? JSON.parse(saved) : [];
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('max_cases_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [studentTab, setStudentTab] = useState<StudentTab>('profile');
  const [employerTab, setEmployerTab] = useState<EmployerTab>('tasks');

  const [studentProfiles, setStudentProfiles] = useState<Record<string, StudentProfile>>(() => {
    const saved = localStorage.getItem('max_student_profiles');
    return saved ? JSON.parse(saved) : SEED_STUDENT_PROFILES;
  });

  const [employerProfiles, setEmployerProfiles] = useState<Record<string, EmployerProfile>>(() => {
    const saved = localStorage.getItem('max_employer_profiles');
    return saved ? JSON.parse(saved) : SEED_EMPLOYER_PROFILES;
  });

  const [vacancies, setVacancies] = useState<Vacancy[]>(() => {
    const saved = localStorage.getItem('max_vacancies');
    return saved ? JSON.parse(saved) : SEED_VACANCIES;
  });

  const [applications, setApplications] = useState<Application[]>(() => {
    const saved = localStorage.getItem('max_applications');
    return saved ? JSON.parse(saved) : SEED_APPLICATIONS;
  });

  const [projects, setProjects] = useState<Project[]>(() => {
    const saved = localStorage.getItem('max_projects');
    return saved ? JSON.parse(saved) : SEED_PROJECTS;
  });

  const [reviews, setReviews] = useState<Review[]>(() => {
    const saved = localStorage.getItem('max_reviews');
    return saved ? JSON.parse(saved) : SEED_REVIEWS;
  });

  const [deals, setDeals] = useState<Deal[]>(() => {
    const saved = localStorage.getItem('max_deals');
    return saved ? JSON.parse(saved) : SEED_DEALS;
  });

  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    const saved = localStorage.getItem('max_messages');
    return saved ? JSON.parse(saved) : SEED_MESSAGES;
  });

  const [activeDealId, setActiveDealId] = useState<string | null>(null);
  const [previewStudentId, setPreviewStudentId] = useState<string | null>(null);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('max_db_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('max_cases_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('max_cases_user');
    }
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('max_student_profiles', JSON.stringify(studentProfiles));
  }, [studentProfiles]);

  useEffect(() => {
    localStorage.setItem('max_employer_profiles', JSON.stringify(employerProfiles));
  }, [employerProfiles]);

  useEffect(() => {
    localStorage.setItem('max_vacancies', JSON.stringify(vacancies));
  }, [vacancies]);

  useEffect(() => {
    localStorage.setItem('max_applications', JSON.stringify(applications));
  }, [applications]);

  useEffect(() => {
    localStorage.setItem('max_projects', JSON.stringify(projects));
  }, [projects]);

  useEffect(() => {
    localStorage.setItem('max_reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('max_deals', JSON.stringify(deals));
  }, [deals]);

  useEffect(() => {
    localStorage.setItem('max_messages', JSON.stringify(messages));
  }, [messages]);

  const currentRole = currentUser?.role || null;
  const studentProfile = currentUser && currentUser.role === 'student' ? studentProfiles[currentUser.id] || null : null;
  const employerProfile = currentUser && currentUser.role === 'employer' ? employerProfiles[currentUser.id] || null : null;

  const quickLogin = (userId: string) => {
    const user = SEED_USERS.find((u) => u.id === userId);
    if (user) {
      setCurrentUser(user);
      maxBridge.haptic('medium');
      if (user.role === 'student') {
        setStudentTab('vacancies');
      } else {
        setEmployerTab('tasks');
      }
    }
  };

  const login = (email: string, pass: string) => {
    const user = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (!user) {
      return { success: false, message: 'Пользователь с таким email не найден. Пройдите быструю регистрацию.' };
    }
    if (user.passwordHash !== pass) {
      return { success: false, message: 'Неверный пароль.' };
    }
    setCurrentUser(user);
    maxBridge.hapticNotification('success');
    return { success: true };
  };

  const registerStudent = ({ name, email, pass }: { name: string; email: string; pass: string }) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Этот email уже зарегистрирован. Пожалуйста, выполните вход.' };
    }
    const newId = `student-${Date.now()}`;
    const newUser: User = {
      id: newId,
      role: 'student',
      email,
      passwordHash: pass,
      name,
      createdAt: new Date().toISOString(),
    };
    const newProfile: StudentProfile = {
      userId: newId,
      fullName: name,
      age: 20,
      university: '',
      city: 'Москва',
      experience: '',
      sphere: 'IT & Веб-разработка',
      about: '',
      softSkills: [],
      hardSkills: [],
      caseLinks: [],
      certificates: [],
      completedProjectsCount: 0,
      rating: 5.0,
      reviewsCount: 0,
    };
    setUsers((prev) => [...prev, newUser]);
    setStudentProfiles((prev) => ({ ...prev, [newId]: newProfile }));
    setCurrentUser(newUser);
    setStudentTab('profile');
    maxBridge.hapticNotification('success');
    return { success: true };
  };

  const registerEmployer = ({
    name,
    companyName,
    email,
    pass,
    inn,
  }: {
    name: string;
    companyName: string;
    email: string;
    pass: string;
    inn?: string;
  }) => {
    const existing = users.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (existing) {
      return { success: false, message: 'Этот email уже зарегистрирован. Пожалуйста, выполните вход.' };
    }
    const newId = `employer-${Date.now()}`;
    const newUser: User = {
      id: newId,
      role: 'employer',
      email,
      passwordHash: pass,
      name: companyName,
      createdAt: new Date().toISOString(),
    };
    const newProfile: EmployerProfile = {
      userId: newId,
      companyName,
      contactPerson: name,
      sphere: 'IT & Digital разработка',
      city: 'Москва',
      inn: inn || '',
      website: '',
      description: '',
      rating: 5.0,
      reviewsCount: 0,
    };
    setUsers((prev) => [...prev, newUser]);
    setEmployerProfiles((prev) => ({ ...prev, [newId]: newProfile }));
    setCurrentUser(newUser);
    setEmployerTab('company');
    maxBridge.hapticNotification('success');
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
    setActiveDealId(null);
    maxBridge.haptic('light');
  };

  const updateStudentProfile = (data: Partial<StudentProfile>) => {
    if (!currentUser || currentUser.role !== 'student') return;
    setStudentProfiles((prev) => ({
      ...prev,
      [currentUser.id]: {
        ...(prev[currentUser.id] || {}),
        ...data,
      },
    }));
    maxBridge.hapticNotification('success');
  };

  const updateEmployerProfile = (data: Partial<EmployerProfile>) => {
    if (!currentUser || currentUser.role !== 'employer') return;
    setEmployerProfiles((prev) => ({
      ...prev,
      [currentUser.id]: {
        ...(prev[currentUser.id] || {}),
        ...data,
      },
    }));
    maxBridge.hapticNotification('success');
  };

  const createVacancy = (
    data: Omit<Vacancy, 'id' | 'employerId' | 'companyName' | 'responsesCount' | 'createdAt'>
  ) => {
    if (!currentUser || currentUser.role !== 'employer') return;
    const newVac: Vacancy = {
      ...data,
      id: `vac-${Date.now()}`,
      employerId: currentUser.id,
      companyName: employerProfile?.companyName || currentUser.name,
      responsesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setVacancies((prev) => [newVac, ...prev]);
    maxBridge.hapticNotification('success');
  };

  const updateVacancyStatus = (vacancyId: string, status: Vacancy['status']) => {
    setVacancies((prev) =>
      prev.map((v) => (v.id === vacancyId ? { ...v, status } : v))
    );
    maxBridge.haptic('medium');
  };

  const duplicateVacancy = (vacancyId: string) => {
    const original = vacancies.find((v) => v.id === vacancyId);
    if (!original) return;
    const copy: Vacancy = {
      ...original,
      id: `vac-${Date.now()}`,
      title: `${original.title} (Копия)`,
      responsesCount: 0,
      createdAt: new Date().toISOString(),
    };
    setVacancies((prev) => [copy, ...prev]);
    maxBridge.hapticNotification('success');
  };

  const deleteVacancy = (vacancyId: string) => {
    setVacancies((prev) => prev.filter((v) => v.id !== vacancyId));
    maxBridge.haptic('medium');
  };

  const applyToVacancy = (
    vacancyId: string,
    coverLetter: string,
    proposedPrice: number,
    deliveryDays: number
  ) => {
    if (!currentUser || currentUser.role !== 'student') {
      return { success: false, message: 'Откликаться могут только студенты.' };
    }
    const alreadyApplied = applications.some(
      (a) => a.vacancyId === vacancyId && a.studentId === currentUser.id
    );
    if (alreadyApplied) {
      return { success: false, message: 'Вы уже откликнулись на эту вакансию.' };
    }

    const vacancy = vacancies.find((v) => v.id === vacancyId);
    if (!vacancy) return { success: false, message: 'Вакансия не найдена.' };

    const newApp: Application = {
      id: `app-${Date.now()}`,
      vacancyId,
      studentId: currentUser.id,
      studentName: studentProfile?.fullName || currentUser.name,
      studentUniversity: studentProfile?.university || 'Студент',
      studentRating: studentProfile?.rating || 5.0,
      coverLetter,
      proposedPrice: proposedPrice || vacancy.budget,
      deliveryDays: deliveryDays || 7,
      status: 'sent',
      createdAt: new Date().toISOString(),
    };

    setApplications((prev) => [newApp, ...prev]);
    setVacancies((prev) =>
      prev.map((v) =>
        v.id === vacancyId ? { ...v, responsesCount: v.responsesCount + 1 } : v
      )
    );

    const newDealId = `deal-${Date.now()}`;
    const newDeal: Deal = {
      id: newDealId,
      vacancyId,
      vacancyTitle: vacancy.title,
      studentId: currentUser.id,
      studentName: studentProfile?.fullName || currentUser.name,
      employerId: vacancy.employerId,
      employerName: vacancy.companyName,
      stage: 'negotiation',
      agreedAmount: proposedPrice || vacancy.budget,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setDeals((prev) => [newDeal, ...prev]);

    const initialMsgs: ChatMessage[] = [
      {
        id: `msg-${Date.now()}-1`,
        chatId: newDealId,
        senderId: 'system',
        senderRole: 'student',
        text: `🎓 Студент ${currentUser.name} откликнулся на задачу «${vacancy.title}» за ${proposedPrice || vacancy.budget} ₽ (срок: ${deliveryDays} дней).`,
        type: 'system',
        timestamp: 'Только что',
      },
      {
        id: `msg-${Date.now()}-2`,
        chatId: newDealId,
        senderId: currentUser.id,
        senderRole: 'student',
        text: coverLetter || 'Здравствуйте! Готов взяться за выполнение данного проекта.',
        type: 'text',
        timestamp: 'Только что',
      },
    ];
    setMessages((prev) => [...prev, ...initialMsgs]);

    maxBridge.hapticNotification('success');
    return { success: true };
  };

  const removeApplication = (vacancyId: string) => {
    if (!currentUser) return;
    setApplications((prev) =>
      prev.filter((a) => !(a.vacancyId === vacancyId && a.studentId === currentUser.id))
    );
    setVacancies((prev) =>
      prev.map((v) =>
        v.id === vacancyId ? { ...v, responsesCount: Math.max(0, v.responsesCount - 1) } : v
      )
    );
    setDeals((prev) =>
      prev.filter(
        (d) => !(d.vacancyId === vacancyId && d.studentId === currentUser.id && d.stage === 'negotiation')
      )
    );
    maxBridge.hapticNotification('warning');
  };

  const toggleApplication = (
    vacancyId: string,
    coverLetter: string = 'Здравствуйте! Готов взяться за этот кейс.',
    proposedPrice?: number,
    deliveryDays?: number
  ): { status: 'applied' | 'revoked'; message?: string } => {
    if (!currentUser || currentUser.role !== 'student') {
      return { status: 'revoked', message: 'Откликаться могут только студенты' };
    }

    const existing = applications.find(
      (a) => a.vacancyId === vacancyId && a.studentId === currentUser.id
    );

    if (existing) {
      removeApplication(vacancyId);
      return { status: 'revoked', message: 'Отклик отозван' };
    } else {
      const res = applyToVacancy(
        vacancyId,
        coverLetter,
        proposedPrice || 0,
        deliveryDays || 7
      );
      if (res.success) {
        return { status: 'applied', message: 'Отклик отправлен!' };
      }
      return { status: 'revoked', message: res.message };
    }
  };

  const openChatForApplication = (app: Application) => {

    let deal = deals.find(
      (d) => d.vacancyId === app.vacancyId && d.studentId === app.studentId
    );
    if (!deal) {
      const vacancy = vacancies.find((v) => v.id === app.vacancyId);
      const newDealId = `deal-${Date.now()}`;
      deal = {
        id: newDealId,
        vacancyId: app.vacancyId,
        vacancyTitle: vacancy?.title || 'Проект',
        studentId: app.studentId,
        studentName: app.studentName,
        employerId: vacancy?.employerId || currentUser?.id || 'employer-1',
        employerName: vacancy?.companyName || 'Заказчик',
        stage: 'negotiation',
        agreedAmount: app.proposedPrice,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      setDeals((prev) => [deal!, ...prev]);
    }

    setApplications((prev) =>
      prev.map((a) => (a.id === app.id ? { ...a, status: 'in_chat' } : a))
    );
    setActiveDealId(deal.id);
    maxBridge.haptic('light');
  };

  const openChatForDeal = (dealId: string) => {
    setActiveDealId(dealId);
    maxBridge.haptic('light');
  };

  const closeChat = () => {
    setActiveDealId(null);
    maxBridge.haptic('light');
  };

  const sendMessage = (
    dealId: string,
    text: string,
    type: ChatMessage['type'] = 'text',
    metadata?: ChatMessage['metadata']
  ) => {
    if (!currentUser || !text.trim()) return;
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      chatId: dealId,
      senderId: currentUser.id,
      senderRole: currentUser.role,
      text,
      type,
      metadata,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };
    setMessages((prev) => [...prev, newMsg]);
    maxBridge.haptic('light');
  };

  const agreeDeal = (dealId: string) => {
    setDeals((prev) =>
      prev.map((d) => (d.id === dealId ? { ...d, stage: 'in_progress', updatedAt: new Date().toISOString() } : d))
    );

    sendMessage(
      dealId,
      '🤝 Стороны нажали кнопку «Договорились»! Проект переведен в статус «В работе». Студент может приступить к реализации, а затем отправить реквизиты для выплаты.',
      'system'
    );
    maxBridge.hapticNotification('success');
  };

  const sendRequisites = (
    dealId: string,
    requisites: { bankName: string; recipientPhone: string; cardNumber?: string; note?: string }
  ) => {
    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stage: 'waiting_payment',
              requisites,
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );
    const text = `💳 Студент отправил реквизиты для выплаты по СБП:
Банк: ${requisites.bankName}
Телефон СБП: ${requisites.recipientPhone}${requisites.cardNumber ? `\nКарта: ${requisites.cardNumber}` : ''}${requisites.note ? `\nПримечание: ${requisites.note}` : ''}`;
    sendMessage(dealId, text, 'requisites', {
      bankName: requisites.bankName,
      recipientPhone: requisites.recipientPhone,
      cardNumber: requisites.cardNumber,
    });
    maxBridge.hapticNotification('success');
  };

  const confirmPayment = (dealId: string) => {
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              stage: 'completed',
              updatedAt: new Date().toISOString(),
            }
          : d
      )
    );

    const newProj: Project = {
      id: `proj-${Date.now()}`,
      vacancyId: deal.vacancyId,
      title: deal.vacancyTitle,
      clientName: deal.employerName,
      studentId: deal.studentId,
      employerId: deal.employerId,
      amount: deal.agreedAmount,
      completedDate: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
      description: 'Успешно завершенный проект через биржу МАХ Кейсы.',
      isManual: false,
    };
    setProjects((prev) => [newProj, ...prev]);

    setStudentProfiles((prev) => {
      const sp = prev[deal.studentId];
      if (!sp) return prev;
      return {
        ...prev,
        [deal.studentId]: {
          ...sp,
          completedProjectsCount: sp.completedProjectsCount + 1,
        },
      };
    });

    setVacancies((prev) =>
      prev.map((v) => (v.id === deal.vacancyId ? { ...v, status: 'completed' } : v))
    );

    sendMessage(
      dealId,
      '🎉 Работодатель подтвердил перевод вознаграждения по СБП! Кейс перешел в статус «Завершен» и автоматически добавлен в портфолио студента. Обе стороны могут оставить взаимный отзыв.',
      'system'
    );
    maxBridge.hapticNotification('success');
  };

  const leaveReview = (dealId: string, rating: number, text: string) => {
    if (!currentUser) return;
    const deal = deals.find((d) => d.id === dealId);
    if (!deal) return;

    const isStudent = currentUser.role === 'student';
    const newReview: Review = {
      id: `rev-${Date.now()}`,
      authorId: currentUser.id,
      authorName: isStudent ? studentProfile?.fullName || currentUser.name : employerProfile?.companyName || currentUser.name,
      authorRole: currentUser.role,
      targetId: isStudent ? deal.employerId : deal.studentId,
      targetRole: isStudent ? 'employer' : 'student',
      rating,
      text,
      projectName: deal.vacancyTitle,
      date: new Date().toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }),
    };

    setReviews((prev) => [newReview, ...prev]);

    setDeals((prev) =>
      prev.map((d) =>
        d.id === dealId
          ? {
              ...d,
              studentReviewLeft: isStudent ? true : d.studentReviewLeft,
              employerReviewLeft: !isStudent ? true : d.employerReviewLeft,
            }
          : d
      )
    );

    sendMessage(
      dealId,
      `⭐ ${newReview.authorName} оставил(а) отзыв с оценкой ${rating}/5: «${text}»`,
      'system'
    );
    maxBridge.hapticNotification('success');
  };

  const replyToReview = (reviewId: string, replyText: string) => {
    setReviews((prev) =>
      prev.map((r) => (r.id === reviewId ? { ...r, replyText } : r))
    );
    maxBridge.hapticNotification('success');
  };

  const addManualProject = (proj: Omit<Project, 'id' | 'studentId' | 'isManual'>) => {
    if (!currentUser || currentUser.role !== 'student') return;
    const newProj: Project = {
      ...proj,
      id: `proj-${Date.now()}`,
      studentId: currentUser.id,
      isManual: true,
    };
    setProjects((prev) => [newProj, ...prev]);
    maxBridge.hapticNotification('success');
  };

  const changePassword = (oldPass: string, newPass: string) => {
    if (!currentUser) return { success: false, message: 'Не авторизован.' };
    if (currentUser.passwordHash !== oldPass) {
      return { success: false, message: 'Старый пароль введен неверно.' };
    }
    if (newPass.length < 6) {
      return { success: false, message: 'Новый пароль должен быть не короче 6 символов.' };
    }
    currentUser.passwordHash = newPass;
    setCurrentUser({ ...currentUser });
    maxBridge.hapticNotification('success');
    return { success: true };
  };

  return (
    <AppContext.Provider
      value={{
        currentUser,
        currentRole,
        studentProfile,
        employerProfile,
        studentTab,
        employerTab,
        vacancies,
        applications,
        projects,
        reviews,
        deals,
        messages,
        activeDealId,
        previewStudentId,
        isDeployGuideOpen,
        setStudentTab,
        setEmployerTab,
        quickLogin,
        login,
        registerStudent,
        registerEmployer,
        logout,
        updateStudentProfile,
        updateEmployerProfile,
        createVacancy,
        updateVacancyStatus,
        duplicateVacancy,
        deleteVacancy,
        applyToVacancy,
        toggleApplication,
        removeApplication,
        openChatForApplication,
        openChatForDeal,
        closeChat,
        sendMessage,
        agreeDeal,
        sendRequisites,
        confirmPayment,
        leaveReview,
        replyToReview,
        addManualProject,
        changePassword,
        setPreviewStudentId,
        setIsDeployGuideOpen,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
