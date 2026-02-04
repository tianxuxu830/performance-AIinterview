
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import InterviewList from './components/InterviewList';
import InterviewForm from './components/InterviewForm';
import InterviewExecution from './components/InterviewExecution';
import InterviewScheduler from './components/InterviewScheduler';
import ScheduleMeetingModal from './components/ScheduleMeetingModal'; 
import TemplateConfigPage from './components/TemplateModal'; // Reusing file but acting as Page
import AssessmentList from './components/AssessmentList';
import NewInterviewModal from './components/NewInterviewModal';
import TaskList from './components/TaskList'; 
import EmployeeTaskTable from './components/EmployeeTaskTable'; 
import EmployeeDashboard from './components/EmployeeDashboard';
import SystemSettings from './components/SystemSettings';
import { InterviewSession, Status, InterviewType } from './types';
import { MOCK_SESSIONS, MOCK_EMPLOYEES } from './constants';

function App() {
  const [userRole, setUserRole] = useState<'HR' | 'Employee'>('Employee'); // Default to Employee based on latest request context
  const [activePage, setActivePage] = useState('dashboard'); 
  
  const [sessions, setSessions] = useState<InterviewSession[]>(MOCK_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  
  // View Modes: list, detail, execution, schedule (legacy full page)
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'execution' | 'schedule'>('list');

  // Removed isTemplateModalOpen state
  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleTargetSession, setScheduleTargetSession] = useState<InterviewSession | null>(null);

  // New Interview Modal State
  const [isNewInterviewModalOpen, setIsNewInterviewModalOpen] = useState(false);
  const [newInterviewDefaultTopic, setNewInterviewDefaultTopic] = useState('绩效面谈');
  const [newInterviewInitialEmployees, setNewInterviewInitialEmployees] = useState<string[]>([]);

  const handleRoleChange = (role: 'HR' | 'Employee') => {
      setUserRole(role);
      // Reset active page to a safe default for that role to avoid dead ends
      if (role === 'HR') {
          setActivePage('assessments');
      } else {
          setActivePage('dashboard');
      }
      setViewMode('list');
      setSelectedSession(null);
  };

  // Handlers
  const handleInitiateInterviewFromAssessment = (employeeIds: string[]) => {
      setNewInterviewInitialEmployees(employeeIds);
      setNewInterviewDefaultTopic('业绩考核5月'); // Default Topic when initiating from Assessment
      setIsNewInterviewModalOpen(true);
  };

  const handleNewInterviewSubmit = (data: any) => {
      const newSessions: InterviewSession[] = [];
      const employeeIds = data.employeeIds || [];
      const targetIds = employeeIds.length > 0 ? employeeIds : [MOCK_EMPLOYEES[0].id];

      // Map role to specific mock manager name for demo purposes
      const managerNameMap = {
          'manager': '张伟 (直属上级)',
          'hrbp': 'Lisa (HRBP)',
          'dept_head': '王总 (部门负责人)',
          'skip_manager': '赵总 (隔级上级)'
      }[data.interviewerRole as string] || '张伟';

      targetIds.forEach((empId: string) => {
          const emp = MOCK_EMPLOYEES.find(e => e.id === empId);
          if (emp) {
              const newSession: InterviewSession = {
                  id: `int_${Date.now()}_${empId}`,
                  employeeId: empId,
                  employeeName: emp.name,
                  managerName: managerNameMap, 
                  date: '', 
                  period: data.topic || '日常面谈', // Use the submitted topic
                  assessmentCycle: data.assessmentCycle,
                  status: Status.NotStarted,
                  type: InterviewType.Regular,
                  templateId: data.templateId,
                  linkedAssessmentId: undefined, // Manual creation usually doesn't link unless specified
                  schedulingStatus: 'pending',
                  deadline: data.deadline,
                  method: 'appointment' // Default to appointment for new tasks
              };
              newSessions.push(newSession);
          }
      });

      setSessions(prev => [...newSessions, ...prev]);
      alert(`已创建 ${newSessions.length} 个待排期面谈任务，已同步至【绩效面谈管理】及【待办】列表。`);
  };

  // Schedule Logic (Option A)
  const handleOpenScheduleModal = (session: InterviewSession) => {
      setScheduleTargetSession(session);
      setScheduleModalOpen(true);
  };

  const handleConfirmSchedule = (data: any) => {
      if (scheduleTargetSession) {
          const updatedSessionData: InterviewSession = { 
              ...scheduleTargetSession, 
              schedulingStatus: 'scheduled' as const, 
              date: data.date + ' ' + data.time,
              period: data.topic,
              status: Status.NotStarted, // Stays NotStarted until meeting actually happens
              method: 'appointment' // Ensure method is set to appointment
          };

          const updatedSessions = sessions.map(s => 
              s.id === scheduleTargetSession.id 
              ? updatedSessionData
              : s
          );
          setSessions(updatedSessions);
          
          // Close modal
          setScheduleModalOpen(false);
          setScheduleTargetSession(null);

          // Auto-navigate to Detail Page
          setSelectedSession(updatedSessionData);
          setViewMode('detail');
          // For Employee view, we stick to the todo page usually, but for demo continuity:
          if (userRole === 'HR') setActivePage('interviews');
          else setActivePage('todo_interviews'); 
      }
  };

  // Direct Feedback Logic (Option B)
  const handleDirectFeedback = (session: InterviewSession) => {
      // 1. Update session status to InProgress immediately
      const updatedSessions = sessions.map(s => 
          s.id === session.id 
          ? { 
              ...s, 
              status: Status.InProgress,
              schedulingStatus: 'scheduled' as const, // Treat as scheduled/active
              date: new Date().toISOString().split('T')[0], // Set today as "date" since we are doing it now
              method: 'direct' as const // Set method to direct
            } 
          : s
      );
      setSessions(updatedSessions);
      
      // 2. Navigate to Interview Form
      const updatedSession = updatedSessions.find(s => s.id === session.id);
      if (updatedSession) {
          setSelectedSession(updatedSession);
          setViewMode('detail');
          if (userRole === 'HR') setActivePage('interviews');
          else setActivePage('todo_interviews');
      }
  };

  // Submit Feedback Logic (Manager submits to Employee)
  const handleSubmitFeedback = () => {
      if (selectedSession) {
          const updatedSessions = sessions.map(s => 
              s.id === selectedSession.id 
              ? { ...s, status: Status.PendingConfirmation } 
              : s
          );
          setSessions(updatedSessions);
          
          alert('已提交给员工确认！');
          
          // Optionally update selected session to reflect status immediately if we stay on page,
          // but usually we go back or refresh. Here we go back to list for clarity.
          setSelectedSession(null);
          setViewMode('list');
      }
  };

  // Employee Task Action Handler
  const handleEmployeeTaskAction = (task: any, actionType?: 'schedule' | 'feedback') => {
      if (activePage === 'todo_interviews') {
          let session = sessions.find(s => s.id === task.id) || sessions.find(s => s.employeeName === task.employee);
          if (!session) session = sessions[0]; // Fallback for mock demo
          
          if (actionType === 'schedule') {
              handleOpenScheduleModal(session);
          } else if (actionType === 'feedback') {
              handleDirectFeedback(session);
          } else {
               setSelectedSession(session);
               setViewMode('detail');
          }
      } else {
          alert('功能开发中...');
      }
  };

  const handleSelectSession = (session: InterviewSession) => {
      setSelectedSession(session);
      setViewMode('detail');
      setActivePage('interviews'); 
  };

  const handleStartInterview = () => {
      setViewMode('execution');
  };

  const handleEndMeeting = () => {
      if (selectedSession) {
          const updatedSessions = sessions.map(s => 
             s.id === selectedSession.id ? { ...s, status: Status.Completed } : s
          );
          setSessions(updatedSessions);
          setSelectedSession(prev => prev ? ({ ...prev, status: Status.Completed }) : null);
      }
      setViewMode('detail'); 
  };

  const handleBackToInterviewList = () => {
      setSelectedSession(null);
      setViewMode('list');
  };

  // Router Logic
  const renderContent = () => {
    // Dashboard Logic
    if (activePage === 'dashboard') {
        if (userRole === 'Employee') {
            return (
                <EmployeeDashboard 
                    sessions={sessions} 
                    onEnterMeeting={(s) => {
                        setSelectedSession(s);
                        handleStartInterview(); 
                    }}
                    onFeedback={(s) => {
                        handleDirectFeedback(s);
                    }}
                />
            );
        }
        // Fallback or HR Dashboard could go here
        return (
            <div className="flex items-center justify-center h-full text-gray-400 bg-white">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">欢迎进入 HR 管理后台</h2>
                    <p className="text-sm">请从左侧菜单选择功能模块进行操作</p>
                </div>
            </div>
        );
    }

    // HR Pages
    if (activePage === 'settings') {
        return <SystemSettings onNavigate={setActivePage} />;
    }

    if (activePage === 'template_config') {
        return <TemplateConfigPage onBack={() => setActivePage('settings')} />;
    }

    if (activePage === 'assessments') {
        return (
            <AssessmentList 
                onInitiateInterview={handleInitiateInterviewFromAssessment} 
                sessions={sessions}
                onScheduleSession={handleOpenScheduleModal}
                onSelectSession={handleSelectSession}
            />
        );
    }

    if (activePage === 'interviews') {
        if (viewMode === 'execution' && selectedSession) {
            return <InterviewExecution session={selectedSession} onEndMeeting={handleEndMeeting} />;
        }
        
        if (viewMode === 'detail' && selectedSession) {
          return (
             <InterviewForm 
                session={selectedSession} 
                onBack={handleBackToInterviewList} 
                onStart={handleStartInterview}
                onSubmitFeedback={handleSubmitFeedback}
                onChangeSession={handleSelectSession} // Allow switching sessions from within detail view
             />
          );
        }

        return (
          <>
            <InterviewList 
                sessions={sessions}
                onSelectSession={handleSelectSession} 
                onCreateNew={() => {
                    setNewInterviewInitialEmployees([]);
                    setNewInterviewDefaultTopic('绩效面谈');
                    setIsNewInterviewModalOpen(true);
                }}
                onOpenTemplates={() => setActivePage('template_config')}
                onScheduleSession={handleOpenScheduleModal}
                onDirectFeedback={handleDirectFeedback}
            />
          </>
        );
    }
    
    // Employee Pages
    if (activePage === 'todo_plans' || activePage === 'todo_interviews' || activePage === 'todo_reviews') {
        // Reuse Detail View for Interviews inside Employee Todo
        if (activePage === 'todo_interviews' && viewMode === 'detail' && selectedSession) {
             return (
                <InterviewForm 
                    session={selectedSession} 
                    onBack={handleBackToInterviewList} 
                    onStart={handleStartInterview}
                    onSubmitFeedback={handleSubmitFeedback}
                    onChangeSession={handleSelectSession}
                />
             );
        }
        if (activePage === 'todo_interviews' && viewMode === 'execution' && selectedSession) {
            return <InterviewExecution session={selectedSession} onEndMeeting={handleEndMeeting} />;
        }

        const type = activePage === 'todo_interviews' ? 'interviews' : activePage === 'todo_plans' ? 'plans' : 'reviews';
        return (
            <EmployeeTaskTable 
                type={type as any} 
                onAction={handleEmployeeTaskAction} 
                sessions={type === 'interviews' ? sessions : undefined} 
            />
        );
    }

    // Default Fallback
    return (
        <div className="flex items-center justify-center h-full text-gray-400 bg-white">
          <div className="text-center">
             <h2 className="text-xl font-semibold mb-2">欢迎使用智慧绩效 SmartPerf</h2>
             <p className="text-sm">当前角色: {userRole === 'HR' ? 'HR 管理员' : '普通员工'}</p>
             <p className="text-xs mt-2 opacity-50">请在左侧菜单选择功能</p>
          </div>
        </div>
    );
  };

  // Helper to check if we are in full screen mode (detail or execution)
  const isFullScreenMode = viewMode === 'execution' || viewMode === 'detail';

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50 text-gray-900 font-sans">
      {!isFullScreenMode && (
          <Sidebar 
            activePage={activePage} 
            setActivePage={(page) => {
              setActivePage(page);
              setViewMode('list'); 
            }} 
            currentRole={userRole}
          />
      )}
      
      <div className="flex-1 flex flex-col min-w-0">
        {!isFullScreenMode && (
            <TopNav 
                currentRole={userRole} 
                onRoleChange={handleRoleChange} 
            />
        )}
        
        <main className="flex-1 overflow-auto relative flex flex-col bg-[#F9FAFB]">
          {renderContent()}
        </main>
      </div>

      <NewInterviewModal 
        isOpen={isNewInterviewModalOpen}
        onClose={() => setIsNewInterviewModalOpen(false)}
        onSubmit={handleNewInterviewSubmit}
        initialEmployeeIds={newInterviewInitialEmployees}
        defaultTopic={newInterviewDefaultTopic}
      />

      <ScheduleMeetingModal
        isOpen={isScheduleModalOpen}
        onClose={() => setScheduleModalOpen(false)}
        onConfirm={handleConfirmSchedule}
        session={scheduleTargetSession}
      />
    </div>
  );
}

export default App;
