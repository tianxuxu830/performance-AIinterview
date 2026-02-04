
import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import InterviewList from './components/InterviewList';
import InterviewForm from './components/InterviewForm';
import InterviewExecution from './components/InterviewExecution';
import InterviewScheduler from './components/InterviewScheduler';
import ScheduleMeetingModal from './components/ScheduleMeetingModal'; 
import TemplateConfigPage from './components/TemplateModal'; 
import AssessmentList from './components/AssessmentList';
import NewInterviewModal from './components/NewInterviewModal';
import TaskList from './components/TaskList'; 
import EmployeeTaskTable from './components/EmployeeTaskTable'; 
import EmployeeDashboard from './components/EmployeeDashboard';
import SystemSettings from './components/SystemSettings';
import PerformanceArchives from './components/PerformanceArchives';
import { InterviewSession, Status, InterviewType, Notification } from './types';
import { MOCK_SESSIONS, MOCK_EMPLOYEES } from './constants';

function App() {
  const [userRole, setUserRole] = useState<'HR' | 'Employee'>('Employee'); 
  const [activePage, setActivePage] = useState('dashboard'); 
  
  const [sessions, setSessions] = useState<InterviewSession[]>(MOCK_SESSIONS);
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  
  // Notification State
  const [notifications, setNotifications] = useState<Notification[]>([
      { id: 'n1', targetRole: 'Employee', type: 'system', title: '系统通知', content: '欢迎使用智慧绩效面谈模块', time: '1小时前', read: false },
      { id: 'n2', targetRole: 'HR', type: 'task', title: '待办提醒', content: '您有 3 个面谈任务即将截止', time: '2小时前', read: false }
  ]);
  
  // View Modes: list, detail, execution, schedule
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'execution' | 'schedule'>('list');

  const [isScheduleModalOpen, setScheduleModalOpen] = useState(false);
  const [scheduleTargetSession, setScheduleTargetSession] = useState<InterviewSession | null>(null);

  // New Interview Modal State
  const [isNewInterviewModalOpen, setIsNewInterviewModalOpen] = useState(false);
  const [newInterviewDefaultTopic, setNewInterviewDefaultTopic] = useState('绩效面谈');
  const [newInterviewInitialEmployees, setNewInterviewInitialEmployees] = useState<string[]>([]);

  const handleRoleChange = (role: 'HR' | 'Employee') => {
      setUserRole(role);
      if (role === 'HR') {
          setActivePage('assessments');
      } else {
          setActivePage('dashboard');
      }
      setViewMode('list');
      setSelectedSession(null);
  };

  const handleMarkNotificationRead = (id: string) => {
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const handleNotificationClick = (notification: Notification) => {
      // 1. Mark as read
      handleMarkNotificationRead(notification.id);

      // 2. Navigate based on target Role and Context
      if (notification.targetRole === 'Employee') {
          setUserRole('Employee');
          // Navigate to "Employee Side - To Do - Performance Interview"
          setActivePage('todo_interviews');
          setViewMode('list');
      } else {
          setUserRole('HR');
          // For Manager/HR notifications about Interviews, go to the Interview Management List
          if (notification.title.includes('面谈') || notification.content.includes('面谈')) {
              setActivePage('interviews');
          } else {
              setActivePage('dashboard');
          }
          setViewMode('list');
      }
  };

  // Handlers
  const handleInitiateInterviewFromAssessment = (employeeIds: string[]) => {
      setNewInterviewInitialEmployees(employeeIds);
      setNewInterviewDefaultTopic('业绩考核5月'); 
      setIsNewInterviewModalOpen(true);
  };

  const handleNewInterviewSubmit = (data: any) => {
      const newSessions: InterviewSession[] = [];
      const employeeIds = data.employeeIds || [];
      const targetIds = employeeIds.length > 0 ? employeeIds : [MOCK_EMPLOYEES[0].id];

      const managerNameMap = {
          'manager': '张伟 (直属上级)',
          'hrbp': 'Lisa (HRBP)',
          'dept_head': '王总 (部门负责人)',
          'skip_manager': '赵总 (隔级上级)'
      }[data.interviewerRole as string] || '张伟';

      const extractedPeriod = data.assessmentTask ? data.assessmentTask.split(' ')[0] + ' ' + data.assessmentTask.split(' ')[1] : '2025 Q4';

      // 1. Create Sessions
      targetIds.forEach((empId: string) => {
          const emp = MOCK_EMPLOYEES.find(e => e.id === empId);
          if (emp) {
              const newSession: InterviewSession = {
                  id: `int_${Date.now()}_${empId}`,
                  employeeId: empId,
                  employeeName: emp.name,
                  managerName: managerNameMap, 
                  date: '', 
                  period: data.topic || '日常面谈', 
                  assessmentCycle: extractedPeriod, 
                  status: Status.NotStarted,
                  type: InterviewType.Regular,
                  templateId: data.templateId,
                  linkedAssessmentId: undefined, 
                  schedulingStatus: 'pending',
                  deadline: data.deadline,
                  method: 'appointment', 
                  requireConfirmation: data.requireConfirmation,
                  signatureType: data.signatureType
              };
              newSessions.push(newSession);
          }
      });

      setSessions(prev => [...newSessions, ...prev]);

      // 2. Create Notifications
      const newNotificationsList: Notification[] = [];
      
      // Notify Employees (Target) - Inform them about the process
      newNotificationsList.push({
          id: `notif_${Date.now()}_emp`,
          targetRole: 'Employee',
          type: 'task',
          title: '绩效面谈已启动',
          content: `您的【${data.topic}】任务已下发。系统已通知面谈官 ${managerNameMap} 在截止日期 ${data.deadline} 前为您安排面谈时间并完成反馈，请留意后续待办通知。`,
          time: '刚刚',
          read: false
      });

      // Notify Manager (Initiator) - Explicit instruction to schedule and feedback
      newNotificationsList.push({
          id: `notif_${Date.now()}_mgr`,
          targetRole: 'HR', // Visible to HR/Manager
          type: 'alert', // Use alert to highlight urgency
          title: '面谈安排任务提醒',
          content: `请注意：您需要在截止日期 ${data.deadline} 前，尽快为 ${targetIds.length} 位员工预约【${data.topic}】面谈时间，并完成面谈反馈填写。`,
          time: '刚刚',
          read: false
      });

      setNotifications(prev => [...newNotificationsList, ...prev]);

      alert(`已创建 ${newSessions.length} 个待排期面谈任务。已向相关员工及面谈官发送通知。`);
  };

  // Schedule Logic
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
              status: Status.NotStarted, 
              method: 'appointment' 
          };

          const updatedSessions = sessions.map(s => 
              s.id === scheduleTargetSession.id 
              ? updatedSessionData
              : s
          );
          setSessions(updatedSessions);
          
          setScheduleModalOpen(false);
          setScheduleTargetSession(null);

          setSelectedSession(updatedSessionData);
          setViewMode('detail');
          if (userRole === 'HR') setActivePage('interviews');
          else setActivePage('todo_interviews'); 
      }
  };

  const handleDirectFeedback = (session: InterviewSession) => {
      const updatedSessions = sessions.map(s => 
          s.id === session.id 
          ? { 
              ...s, 
              status: Status.InProgress,
              schedulingStatus: 'scheduled' as const, 
              date: new Date().toISOString().split('T')[0], 
              method: 'direct' as const 
            } 
          : s
      );
      setSessions(updatedSessions);
      
      const updatedSession = updatedSessions.find(s => s.id === session.id);
      if (updatedSession) {
          setSelectedSession(updatedSession);
          setViewMode('detail');
          if (userRole === 'HR') setActivePage('interviews');
          else setActivePage('todo_interviews');
      }
  };

  const handleSubmitFeedback = () => {
      if (selectedSession) {
          const updatedSessions = sessions.map(s => 
              s.id === selectedSession.id 
              ? { ...s, status: Status.PendingConfirmation } 
              : s
          );
          setSessions(updatedSessions);
          
          alert('已提交给员工确认！');
          setSelectedSession(null);
          setViewMode('list');
      }
  };

  const handleEmployeeTaskAction = (task: any, actionType?: 'schedule' | 'feedback') => {
      if (activePage === 'todo_interviews') {
          let session = sessions.find(s => s.id === task.id) || sessions.find(s => s.employeeName === task.employee);
          if (!session) session = sessions[0]; 
          
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

  const handleCancelSession = (sessionId: string) => {
      setSessions(prev => prev.filter(s => s.id !== sessionId));
  };

  const renderContent = () => {
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
        return (
            <div className="flex items-center justify-center h-full text-gray-400 bg-white">
                <div className="text-center">
                    <h2 className="text-xl font-semibold mb-2">欢迎进入 HR 管理后台</h2>
                    <p className="text-sm">请从左侧菜单选择功能模块进行操作</p>
                </div>
            </div>
        );
    }

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

    if (activePage === 'archives') {
        return <PerformanceArchives />;
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
                onChangeSession={handleSelectSession} 
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
                onCancelSession={handleCancelSession}
            />
          </>
        );
    }
    
    if (activePage === 'todo_plans' || activePage === 'todo_interviews' || activePage === 'todo_reviews') {
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
                notifications={notifications}
                onMarkRead={handleMarkNotificationRead}
                onNotificationClick={handleNotificationClick}
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
