
import React, { useState } from 'react';
import { 
    Search, ChevronDown, CheckCircle2, Clock, MoreHorizontal, 
    User, MessageSquarePlus, Calendar, AlertCircle, Video, 
    FileText, Trash2, Download, Archive, Edit3,
    TrendingUp, TrendingDown, Minus, PieChart, Users, Bell
} from 'lucide-react';
import { MOCK_ASSESSMENTS, MOCK_PERFORMANCE_TRENDS, MOCK_EMPLOYEES } from '../constants';
import { InterviewSession, Status } from '../types';

interface AssessmentListProps {
  onInitiateInterview: (employeeIds: string[]) => void;
  sessions: InterviewSession[];
  onScheduleSession: (session: InterviewSession) => void;
  onSelectSession: (session: InterviewSession) => void;
}

const AssessmentList: React.FC<AssessmentListProps> = ({ onInitiateInterview, sessions, onScheduleSession, onSelectSession }) => {
  const [activeTab, setActiveTab] = useState<'assessment' | 'interview'>('assessment');
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [interviewSelectedIds, setInterviewSelectedIds] = useState<Set<string>>(new Set());
  const [openActionId, setOpenActionId] = useState<string | null>(null);

  // Filter sessions specifically for this Assessment Cycle ("业绩考核5月")
  // This ensures the list is empty initially until new interviews are created with this topic.
  const contextSessions = sessions.filter(s => s.period === '业绩考核5月');

  // Statistics for the Interview Tab
  const stats = {
      total: contextSessions.length,
      completed: contextSessions.filter(s => s.status === Status.Completed).length,
      inProgress: contextSessions.filter(s => s.status === Status.InProgress || s.status === Status.PendingConfirmation).length,
      notStarted: contextSessions.filter(s => s.status === Status.NotStarted).length,
  };

  const steps = [
    { label: '开始', status: 'completed' },
    { label: '目标设定', status: 'completed' },
    { label: '上级审批', status: 'completed' },
    { label: '自评', status: 'current', pending: 3 },
    { label: '上级评估', status: 'pending', pending: 6 },
    { label: '结果校准', status: 'pending', pending: 337 },
    { label: '员工确认', status: 'pending' },
    { label: '结束', status: 'pending' },
  ];

  // Assessment Table Selection Logic
  const handleCheckboxChange = (id: string) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(new Set(MOCK_ASSESSMENTS.map(item => item.id)));
    } else {
      setSelectedIds(new Set());
    }
  };

  // Interview Table Selection Logic
  const handleInterviewCheckboxChange = (id: string) => {
      const newSet = new Set(interviewSelectedIds);
      if (newSet.has(id)) newSet.delete(id);
      else newSet.add(id);
      setInterviewSelectedIds(newSet);
  };

  const handleInterviewSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.checked) {
          setInterviewSelectedIds(new Set(contextSessions.map(s => s.id)));
      } else {
          setInterviewSelectedIds(new Set());
      }
  };

  const handleInitiateClick = (specificId?: string) => {
    if (specificId) {
       const assessment = MOCK_ASSESSMENTS.find(a => a.id === specificId);
       if(assessment) onInitiateInterview([assessment.employeeId]);
    } else if (selectedIds.size > 0) {
      const selectedAssessmentItems = MOCK_ASSESSMENTS.filter(a => selectedIds.has(a.id));
      const employeeIds = selectedAssessmentItems.map(a => a.employeeId);
      const uniqueEmployeeIds = Array.from(new Set(employeeIds));
      onInitiateInterview(uniqueEmployeeIds);
    }
  };

  const handleRemind = (e: React.MouseEvent, session: InterviewSession) => {
      e.stopPropagation();
      if (window.confirm(`确定要向 ${session.employeeName} 发送催办提醒吗？`)) {
          alert(`已成功发送催办提醒给 ${session.employeeName}`);
      }
  };

  const handleBatchRemind = () => {
      if (interviewSelectedIds.size === 0) return;
      if (window.confirm(`确定要对选中的 ${interviewSelectedIds.size} 个任务进行批量催办吗？`)) {
          alert(`已成功发送 ${interviewSelectedIds.size} 条催办提醒`);
          setInterviewSelectedIds(new Set());
      }
  };

  // Helper to render Liquid Glass Grade Badge
  const renderLiquidGrade = (grade: string, employeeId: string) => {
      // Determine style based on grade
      let bgGradient = 'from-gray-100 to-gray-200';
      let textColor = 'text-gray-600';
      let shadowColor = 'shadow-gray-200';

      if (['S', 'A', 'A+'].includes(grade)) {
          bgGradient = 'from-green-100 to-emerald-200';
          textColor = 'text-emerald-700';
          shadowColor = 'shadow-emerald-200';
      } else if (['B+', 'B'].includes(grade)) {
          bgGradient = 'from-blue-100 to-indigo-200';
          textColor = 'text-blue-700';
          shadowColor = 'shadow-blue-200';
      } else if (['C', 'D'].includes(grade)) {
          bgGradient = 'from-orange-100 to-red-200';
          textColor = 'text-red-700';
          shadowColor = 'shadow-red-200';
      }

      // Mock Trend Logic
      const trendData = MOCK_PERFORMANCE_TRENDS[employeeId] || MOCK_PERFORMANCE_TRENDS['default'];
      const lastScore = trendData[trendData.length - 1]?.score || 0;
      const prevScore = trendData[trendData.length - 2]?.score || 0;
      let TrendIcon = Minus;
      let trendColor = 'text-gray-400';
      
      if (lastScore > prevScore) {
          TrendIcon = TrendingUp;
          trendColor = 'text-emerald-500'; 
      } else if (lastScore < prevScore) {
          TrendIcon = TrendingDown;
          trendColor = 'text-orange-500';
      }

      return (
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => handleInitiateClick(employeeId)}> {/* Clicking could show detail modal */}
              <div className={`
                  relative w-10 h-10 rounded-xl flex items-center justify-center font-black text-lg shadow-inner
                  bg-gradient-to-br ${bgGradient} ${textColor}
                  border border-white/60 backdrop-blur-sm
                  group-hover:scale-110 transition-transform duration-300
              `}>
                  {/* Glossy Reflection */}
                  <div className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-b from-white/60 to-transparent rounded-t-xl pointer-events-none"></div>
                  {grade}
              </div>
              
              {/* Trend Indicator */}
              <div className="flex flex-col">
                  <span className="text-[10px] text-gray-400 font-medium">上期对比</span>
                  <div className={`flex items-center text-xs font-bold ${trendColor}`}>
                      <TrendIcon size={12} className="mr-0.5" />
                      {Math.abs(lastScore - prevScore).toFixed(1)}
                  </div>
              </div>
          </div>
      );
  };

  const renderAssessmentTable = () => (
      <div className="bg-white border border-gray-200 shadow-sm flex-1 overflow-auto custom-scrollbar rounded-t-lg">
          <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                      <th className="p-3 border-b border-gray-200 w-10 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 cursor-pointer text-blue-600 focus:ring-blue-500"
                            onChange={handleSelectAll}
                            checked={selectedIds.size === MOCK_ASSESSMENTS.length && MOCK_ASSESSMENTS.length > 0}
                          />
                      </th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">员工姓名/角色</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">员工状态</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">当前阶段</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">状态</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">当前处理人</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">考核组</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">模板</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">指标模板</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">最终得分</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">绩效等级</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600 text-right min-w-[150px]">操作</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {MOCK_ASSESSMENTS.map((item) => (
                      <tr key={item.id} className={`hover:bg-blue-50/50 transition-colors ${selectedIds.has(item.id) ? 'bg-blue-50/30' : ''}`}>
                          <td className="p-3 text-center">
                              <input 
                                type="checkbox" 
                                className="rounded border-gray-300 cursor-pointer text-blue-600 focus:ring-blue-500"
                                checked={selectedIds.has(item.id)}
                                onChange={() => handleCheckboxChange(item.id)}
                              />
                          </td>
                          <td className="p-3">
                              <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-500 flex items-center justify-center text-xs mr-2">
                                      <User size={16} />
                                  </div>
                                  <div>
                                      <div className="text-gray-900 font-medium">{item.employeeName}</div>
                                      <div className="text-xs text-gray-500">{item.role}</div>
                                  </div>
                              </div>
                          </td>
                          <td className="p-3 text-gray-600">{item.employeeStatus}</td>
                          <td className="p-3 text-gray-600">{item.currentStage}</td>
                          <td className="p-3 text-gray-600">{item.processStatus}</td>
                          <td className="p-3 text-gray-600">{item.handler}</td>
                          <td className="p-3 text-gray-600">{item.group}</td>
                          <td className="p-3 text-gray-600">{item.templateName}</td>
                          <td className="p-3 text-gray-600">{item.indicatorTemplate}</td>
                          <td className="p-3 text-gray-900 font-medium">{item.score.toFixed(2)}</td>
                          <td className="p-3">
                              {renderLiquidGrade(item.grade, item.employeeId)}
                          </td>
                          <td className="p-3 text-right">
                              <div className="flex justify-end space-x-3 text-blue-600 text-xs">
                                  <button className="hover:underline">考核关系</button>
                                  <button className="hover:underline">调整结果</button>
                                  <button className="text-gray-400 hover:text-gray-600"><MoreHorizontal size={16} /></button>
                              </div>
                          </td>
                      </tr>
                  ))}
              </tbody>
          </table>
      </div>
  );

  const renderInterviewTable = () => {
      if (contextSessions.length === 0) {
          return (
              <div className="flex flex-col items-center justify-center py-20 bg-white border border-gray-200 rounded-lg shadow-sm h-full">
                  <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 animate-in fade-in zoom-in">
                      <MessageSquarePlus size={32} className="text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">暂无面谈数据</h3>
                  <p className="text-sm text-gray-500 max-w-md text-center leading-relaxed mb-6">
                      当前尚未发起任何绩效面谈任务。<br/>请前往【考核管理】标签页，勾选需要面谈的员工并点击“发起面谈”按钮。
                  </p>
                  <button 
                    onClick={() => setActiveTab('assessment')} 
                    className="px-6 py-2.5 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 shadow-sm transition-all hover:shadow-md flex items-center"
                  >
                      前往考核管理 <ChevronDown className="ml-2 transform -rotate-90" size={16} />
                  </button>
              </div>
          );
      }

      return (
        <div className="bg-white border border-gray-200 shadow-sm flex-1 overflow-auto custom-scrollbar rounded-t-lg pb-32">
          <table className="w-full text-left border-collapse text-sm">
              <thead className="bg-gray-50 sticky top-0 z-10 shadow-sm">
                  <tr>
                      <th className="p-3 border-b border-gray-200 w-10 text-center">
                          <input 
                            type="checkbox" 
                            className="rounded border-gray-300 cursor-pointer text-blue-600 focus:ring-blue-500"
                            onChange={handleInterviewSelectAll}
                            checked={contextSessions.length > 0 && interviewSelectedIds.size === contextSessions.length}
                          />
                      </th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">被面谈人</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">部门/职位</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">最近绩效结果</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">面谈状态</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">面谈时间/截止</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">面谈方式</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600">面谈官</th>
                      <th className="p-3 border-b border-gray-200 font-medium text-gray-600 text-right min-w-[140px]">操作</th>
                  </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                  {contextSessions.map((session) => {
                      // Lookup auxiliary info
                      const employee = MOCK_EMPLOYEES.find(e => e.id === session.employeeId);
                      const assessment = MOCK_ASSESSMENTS.find(a => a.employeeId === session.employeeId);
                      const grade = session.gradeTag || assessment?.grade || '-';
                      const department = session.department || employee?.department || '-';
                      const role = employee?.role || assessment?.role || '-';

                      // Calculate urgency/date display
                      let dateDisplay = '-';
                      let urgencyTag = null;
                      if (session.date) {
                          dateDisplay = session.date;
                      } else if (session.deadline) {
                          dateDisplay = session.deadline;
                          const deadlineDate = new Date(session.deadline);
                          const today = new Date();
                          const diffTime = deadlineDate.getTime() - today.getTime();
                          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                          
                          if (diffDays < 0) {
                              urgencyTag = <span className="text-red-500 text-[10px] ml-2 flex items-center bg-red-50 px-1 rounded"><AlertCircle size={10} className="mr-0.5"/> 逾期</span>;
                          } else if (diffDays <= 3) {
                              urgencyTag = <span className="text-orange-500 text-[10px] ml-2 flex items-center bg-orange-50 px-1 rounded"><Clock size={10} className="mr-0.5"/> 剩{diffDays}天</span>;
                          }
                      } else {
                          dateDisplay = '待定';
                      }

                      return (
                          <tr key={session.id} className={`hover:bg-blue-50/50 transition-colors relative group ${interviewSelectedIds.has(session.id) ? 'bg-blue-50/30' : ''}`}>
                              <td className="p-3 text-center">
                                  <input 
                                    type="checkbox" 
                                    className="rounded border-gray-300 cursor-pointer text-blue-600 focus:ring-blue-500"
                                    checked={interviewSelectedIds.has(session.id)}
                                    onChange={() => handleInterviewCheckboxChange(session.id)}
                                  />
                              </td>
                              <td className="p-3">
                                  <div className="flex items-center">
                                      <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs mr-2 font-bold">
                                          {session.employeeName.charAt(0)}
                                      </div>
                                      <div>
                                          <div className="text-gray-900 font-medium">{session.employeeName}</div>
                                          <div className="text-xs text-gray-500">{session.employeeId}</div>
                                      </div>
                                  </div>
                              </td>
                              <td className="p-3">
                                   <div className="text-gray-900">{department}</div>
                                   <div className="text-xs text-gray-500">{role}</div>
                              </td>
                              <td className="p-3">
                                  {renderLiquidGrade(grade, session.employeeId)}
                              </td>
                              <td className="p-3">
                                  <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium 
                                      ${session.status === Status.Completed ? 'bg-green-100 text-green-700' : 
                                        session.status === Status.InProgress ? 'bg-blue-100 text-blue-700' : 
                                        'bg-gray-100 text-gray-700'}`}>
                                      {session.status}
                                  </span>
                              </td>
                              <td className="p-3 text-gray-600">
                                  <div className="flex items-center">
                                      {session.date ? <Clock size={12} className="mr-1 text-gray-400" /> : <AlertCircle size={12} className="mr-1 text-gray-400" />}
                                      <span className={session.date ? "text-gray-900" : "text-gray-500 text-xs"}>
                                         {session.date ? dateDisplay : `截止: ${dateDisplay}`}
                                      </span>
                                      {urgencyTag}
                                  </div>
                              </td>
                              <td className="p-3 text-gray-600">
                                  {session.method === 'appointment' ? '预约面谈' : session.method === 'direct' ? '直接反馈' : '-'}
                              </td>
                              <td className="p-3 text-gray-600">
                                  {session.managerName || '-'}
                              </td>
                              <td className="p-3 text-right">
                                     <div className="flex items-center justify-end space-x-2">
                                        
                                        {/* Remind Button for Pending States */}
                                        {(session.status === Status.NotStarted || session.status === Status.PendingConfirmation) && (
                                            <button 
                                                onClick={(e) => handleRemind(e, session)}
                                                className="p-1.5 rounded-md hover:bg-orange-50 text-gray-400 hover:text-orange-500 transition-colors"
                                                title="催办"
                                            >
                                                <Bell size={16} />
                                            </button>
                                        )}

                                        {/* Primary Action Button */}
                                        {session.status === Status.NotStarted ? (
                                            <button 
                                                onClick={() => onScheduleSession(session)}
                                                className="text-emerald-600 hover:text-emerald-800 font-medium text-sm border border-emerald-200 bg-emerald-50 px-2 py-1 rounded hover:bg-emerald-100 transition-colors whitespace-nowrap"
                                            >
                                                预约会议
                                            </button>
                                        ) : (
                                            <button 
                                                onClick={() => onSelectSession(session)}
                                                className="text-blue-600 hover:text-blue-800 font-medium text-sm hover:underline whitespace-nowrap"
                                            >
                                                查看详情
                                            </button>
                                        )}

                                        {/* Dropdown Menu */}
                                        <div className="relative">
                                            <button 
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setOpenActionId(openActionId === session.id ? null : session.id);
                                                }}
                                                className={`p-1.5 rounded-md hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-colors ${openActionId === session.id ? 'bg-gray-100 text-gray-600' : ''}`}
                                            >
                                                <MoreHorizontal size={16} />
                                            </button>

                                            {openActionId === session.id && (
                                                <>
                                                    <div className="fixed inset-0 z-40" onClick={() => setOpenActionId(null)}></div>
                                                    <div className="absolute right-0 top-full mt-1 w-32 bg-white rounded-lg shadow-xl border border-gray-100 z-50 py-1 text-sm text-gray-700 animate-in fade-in zoom-in-95 duration-100 origin-top-right">
                                                        {session.status === Status.NotStarted && (
                                                            <>
                                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition-colors">
                                                                    <Calendar size={14} className="mr-2 text-gray-400" /> 修改
                                                                </button>
                                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition-colors">
                                                                    <Trash2 size={14} className="mr-2 text-red-400" /> 取消
                                                                </button>
                                                            </>
                                                        )}
                                                        {session.status === Status.InProgress && (
                                                            <>
                                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition-colors">
                                                                    <Video size={14} className="mr-2 text-gray-400" /> 入会
                                                                </button>
                                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition-colors">
                                                                    <FileText size={14} className="mr-2 text-gray-400" /> 记录
                                                                </button>
                                                            </>
                                                        )}
                                                        {session.status === Status.Completed && (
                                                            <>
                                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition-colors">
                                                                    <Download size={14} className="mr-2 text-gray-400" /> 导出
                                                                </button>
                                                                <button className="w-full text-left px-4 py-2 hover:bg-gray-50 flex items-center transition-colors">
                                                                    <Archive size={14} className="mr-2 text-gray-400" /> 归档
                                                                </button>
                                                            </>
                                                        )}
                                                    </div>
                                                </>
                                            )}
                                        </div>
                                     </div>
                              </td>
                          </tr>
                      );
                  })}
              </tbody>
          </table>
        </div>
      );
  }

  // Component for Statistics Card
  const StatCard = ({ label, value, color, icon: Icon }: { label: string, value: number, color: 'blue' | 'green' | 'orange' | 'gray', icon?: any }) => {
      const colors = {
          blue: 'bg-blue-50 text-blue-600 border-blue-100',
          green: 'bg-green-50 text-green-600 border-green-100',
          orange: 'bg-orange-50 text-orange-600 border-orange-100',
          gray: 'bg-gray-100 text-gray-600 border-gray-200'
      };
      return (
          <div className={`flex items-center justify-between p-4 rounded-xl border ${colors[color]} relative overflow-hidden group`}>
              <div>
                  <div className="text-xs font-medium opacity-80 mb-1">{label}</div>
                  <div className="text-2xl font-bold">{value}</div>
              </div>
              <div className="absolute -right-3 -bottom-3 opacity-10 transform rotate-12 scale-150">
                  {Icon ? <Icon size={64} fill="currentColor" /> : <Users size={64} fill="currentColor" />}
              </div>
          </div>
      );
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 overflow-hidden">
      {/* Header Info */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center space-x-3 mb-4">
           <h1 className="text-xl font-bold text-gray-800">业绩考核5月</h1>
           <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded border border-green-200">进行中</span>
           <span className="px-2 py-0.5 bg-orange-100 text-orange-700 text-xs rounded border border-orange-200">需要关注问题[3项]</span>
        </div>

        {/* Tab Navigation */}
        <div className="flex space-x-6 border-b border-gray-100">
           <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700">进度管理</button>
           <button 
                onClick={() => setActiveTab('assessment')}
                className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'assessment' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
                考核管理
            </button>
           <button className="pb-3 text-sm font-medium text-gray-500 hover:text-gray-700">结果校准</button>
           <button 
                onClick={() => setActiveTab('interview')}
                className={`pb-3 text-sm font-medium transition-colors ${activeTab === 'interview' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
           >
                绩效面谈
           </button>
        </div>
      </div>
      
      {/* Process Timeline - Only visible in Assessment Tab */}
      {activeTab === 'assessment' && (
        <div className="bg-white px-6 py-6 border-b border-gray-200 mb-4 shadow-sm overflow-x-auto">
            <div className="flex items-start justify-between min-w-[800px]">
                {steps.map((step, index) => (
                    <div key={index} className="flex-1 flex flex-col items-center relative group">
                        {/* Line */}
                        {index < steps.length - 1 && (
                            <div className={`absolute top-3 left-1/2 w-full h-0.5 ${step.status === 'completed' ? 'bg-green-400' : 'bg-gray-200'} -z-10`}></div>
                        )}
                        
                        {/* Circle */}
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs border-2 mb-2 z-10 
                            ${step.status === 'completed' ? 'bg-white border-green-500 text-green-500' : 
                            step.status === 'current' ? 'bg-green-500 border-green-500 text-white' : 'bg-white border-gray-300 text-gray-300'}`}>
                            {step.status === 'completed' ? <CheckCircle2 size={14} /> : (index + 1)}
                        </div>
                        
                        {/* Label */}
                        <div className={`text-xs font-medium ${step.status === 'current' ? 'text-green-600' : 'text-gray-500'}`}>{step.label}</div>
                        
                        {/* Pending Badge */}
                        {step.pending && (
                            <div className="mt-1 px-2 py-0.5 bg-red-100 text-red-600 text-[10px] rounded-full">未完成 {step.pending}人</div>
                        )}
                    </div>
                ))}
                <div className="ml-4 text-xs text-gray-400 self-center">全部 359人</div>
            </div>
        </div>
      )}

      {/* Interview Statistics - Only visible in Interview Tab when there is data */}
      {activeTab === 'interview' && contextSessions.length > 0 && (
          <div className="bg-white px-6 py-4 border-b border-gray-200 mb-4 shadow-sm grid grid-cols-4 gap-4">
              <StatCard label="应面谈人数" value={stats.total} color="blue" icon={Users} />
              <StatCard label="已完成" value={stats.completed} color="green" icon={CheckCircle2} />
              <StatCard label="进行中" value={stats.inProgress} color="orange" icon={TrendingUp} />
              <StatCard label="未开始" value={stats.notStarted} color="gray" icon={Clock} />
          </div>
      )}

      {/* Main Content Area */}
      <div className="flex-1 px-6 pb-6 overflow-hidden flex flex-col">
          {/* Controls */}
          {activeTab === 'assessment' && (
            <div className="flex justify-between items-center mb-4">
                <div className="flex items-center space-x-2">
                    {selectedIds.size > 0 && (
                        <button 
                            onClick={() => handleInitiateClick()}
                            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded shadow-sm hover:bg-blue-700 flex items-center transition-all animate-in fade-in"
                        >
                            <MessageSquarePlus size={16} className="mr-2" />
                            发起面谈 ({selectedIds.size})
                        </button>
                    )}
                </div>
                <div className="flex items-center space-x-2">
                    <button className="px-3 py-1.5 bg-white border border-blue-300 text-blue-600 text-sm rounded hover:bg-blue-50 flex items-center">
                        添加被考核对象 <ChevronDown size={14} className="ml-1" />
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-blue-300 text-blue-600 text-sm rounded hover:bg-blue-50 flex items-center">
                        流程干预 <ChevronDown size={14} className="ml-1" />
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-blue-300 text-blue-600 text-sm rounded hover:bg-blue-50 flex items-center">
                        更多操作 <ChevronDown size={14} className="ml-1" />
                    </button>
                </div>
            </div>
          )}

          {activeTab === 'interview' && contextSessions.length > 0 && (
             <div className="flex justify-between items-center mb-4">
                <div className="flex items-center text-sm text-gray-500">
                    <span className="bg-blue-50 text-blue-700 px-2 py-0.5 rounded mr-2 font-bold">小贴士</span>
                    面谈数据将自动同步至【待办-绩效面谈】列表中，相关人员可前往处理。
                </div>
                 <div className="flex items-center space-x-2">
                    {/* Batch Remind Button */}
                    {interviewSelectedIds.size > 0 && (
                        <button 
                            onClick={handleBatchRemind}
                            className="px-3 py-1.5 bg-white border border-orange-200 text-orange-600 text-sm rounded hover:bg-orange-50 flex items-center transition-all animate-in fade-in"
                        >
                            <Bell size={14} className="mr-1.5" /> 批量催办 ({interviewSelectedIds.size})
                        </button>
                    )}
                    <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50 flex items-center">
                        <Calendar size={14} className="mr-1.5" /> 批量修改时间
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50 flex items-center">
                        <User size={14} className="mr-1.5" /> 批量更换面谈官
                    </button>
                </div>
             </div>
          )}

          {/* Table Container */}
          {activeTab === 'assessment' ? renderAssessmentTable() : renderInterviewTable()}
          
          {/* Pagination */}
          {!(activeTab === 'interview' && contextSessions.length === 0) && (
            <div className="bg-white border-t border-gray-200 px-4 py-3 flex items-center justify-end space-x-2 mt-auto rounded-b-lg">
               <button className="px-2 py-1 border rounded text-xs text-gray-600 hover:bg-gray-50">&lt;</button>
               <button className="px-2 py-1 bg-blue-600 text-white text-xs rounded border border-blue-600">1</button>
               <button className="px-2 py-1 border rounded text-xs text-gray-600 hover:bg-gray-50">2</button>
               <button className="px-2 py-1 border rounded text-xs text-gray-600 hover:bg-gray-50">3</button>
               <span className="text-xs text-gray-400">...</span>
               <button className="px-2 py-1 border rounded text-xs text-gray-600 hover:bg-gray-50">36</button>
               <button className="px-2 py-1 border rounded text-xs text-gray-600 hover:bg-gray-50">&gt;</button>
               <select className="border border-gray-300 rounded text-xs px-1 py-1">
                   <option>10 条/页</option>
               </select>
               <span className="text-xs text-gray-500">跳至</span>
               <input type="text" className="w-10 border border-gray-300 rounded text-xs px-1 py-1 text-center" />
               <span className="text-xs text-gray-500">页</span>
            </div>
          )}
      </div>
    </div>
  );
};

export default AssessmentList;
