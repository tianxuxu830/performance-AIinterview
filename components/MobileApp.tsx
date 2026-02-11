
import React, { useState, useEffect } from 'react';
import { 
    ChevronLeft, MoreHorizontal, Filter, Clock, ChevronRight, 
    User, Calendar, FileText, CheckCircle2, Star, Mic, Camera, 
    Send, LayoutGrid, Users, Briefcase, Search, Bell, Video, Edit3,
    MapPin, AlignLeft, BarChart2, Info, Sparkles, Target, Activity,
    ChevronDown, AlertTriangle, TrendingUp, Eye, ThumbsUp, Minus, X
} from 'lucide-react';
import { InterviewSession, Status } from '../types';
import { MOCK_TEMPLATES, MOCK_AI_OUTLINE } from '../constants';

interface MobileAppProps {
  sessions: InterviewSession[];
  onClose: () => void;
}

const MobileApp: React.FC<MobileAppProps> = ({ sessions, onClose }) => {
  const [localSessions, setLocalSessions] = useState<InterviewSession[]>(sessions);
  const [activeTab, setActiveTab] = useState<'workbench' | 'team' | 'me'>('workbench');
  const [workbenchView, setWorkbenchView] = useState<'dashboard' | 'interviewList' | 'schedule' | 'feedback' | 'prepare'>('dashboard');
  const [interviewListTab, setInterviewListTab] = useState<'schedule' | 'start' | 'feedback' | 'confirm' | 'done'>('schedule');
  const [teamTab, setTeamTab] = useState<'subordinate' | 'org'>('subordinate');
  const [meTab, setMeTab] = useState<'active' | 'completed'>('active');
  const [prepareTab, setPrepareTab] = useState<'analysis' | 'outline' | 'info'>('analysis');
  const [feedbackTab, setFeedbackTab] = useState<'form' | 'analysis'>('form');
  
  const [selectedSession, setSelectedSession] = useState<InterviewSession | null>(null);
  
  // Submit Confirmation Modal State
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [submitPermission, setSubmitPermission] = useState<'read' | 'edit'>('read');
  
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: false }));
    };
    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  // Determine if Bottom Bar should be visible
  const showBottomBar = activeTab !== 'workbench' || (workbenchView === 'dashboard' || workbenchView === 'interviewList');

  // --- Data Filtering ---
  const pendingInterviews = localSessions.filter(s => 
    s.status === Status.NotStarted || 
    s.status === Status.InProgress || 
    s.status === Status.PendingConfirmation
  );

  // Filter logic for the interview list tabs
  const getMobileTabCount = (tab: string) => {
      return localSessions.filter(session => {
          if (tab === 'schedule') return session.status === Status.NotStarted && (session.schedulingStatus === 'pending' || !session.schedulingStatus);
          if (tab === 'start') return session.status === Status.NotStarted && session.schedulingStatus === 'scheduled';
          if (tab === 'feedback') return session.status === Status.InProgress;
          if (tab === 'confirm') return session.status === Status.PendingConfirmation;
          if (tab === 'done') return session.status === Status.Completed;
          return false;
      }).length;
  };

  const mobileFilteredSessions = localSessions.filter(session => {
      if (interviewListTab === 'schedule') return session.status === Status.NotStarted && (session.schedulingStatus === 'pending' || !session.schedulingStatus);
      if (interviewListTab === 'start') return session.status === Status.NotStarted && session.schedulingStatus === 'scheduled';
      if (interviewListTab === 'feedback') return session.status === Status.InProgress;
      if (interviewListTab === 'confirm') return session.status === Status.PendingConfirmation;
      if (interviewListTab === 'done') return session.status === Status.Completed;
      return false;
  });

  // Mock Team Data (Updated to match the new card design)
  const teamMembers = [
      { 
          id: 't1', 
          name: '张珊珊', 
          employeeId: '200034',
          department: '产品部',
          role: '产品经理', 
          avatar: 'https://picsum.photos/id/64/100/100',
          latestCycle: '2023年11月',
          latestScoreTag: '90-S',
          latestGradeTag: 'A',
          totalAssessments: 99
      },
      { 
          id: 't2', 
          name: '李思思', 
          employeeId: '200033',
          department: '产品部',
          role: '产品经理', 
          avatar: 'https://picsum.photos/id/338/100/100',
          latestCycle: '2023年11月',
          latestScoreTag: '90-S',
          latestGradeTag: 'A',
          totalAssessments: 99
      },
      { 
          id: 't3', 
          name: '王强', 
          employeeId: '200035',
          department: '技术部',
          role: '技术专家', 
          avatar: 'https://picsum.photos/id/12/100/100',
          latestCycle: '2023年11月',
          latestScoreTag: '95-S',
          latestGradeTag: 'S',
          totalAssessments: 85
      },
  ];

  // Mock My Assessments
  const myAssessments = [
      { id: 'm1', name: '2025 Q4 绩效考核', status: '自评中', deadline: '2025-12-31' },
      { id: 'm2', name: '2025 360互评', status: '待评价', deadline: '2025-12-25' },
  ];

  // --- Renderers ---

  const renderSchedule = () => {
      if (!selectedSession) return null;
      
      return (
        <div className="flex-1 bg-white flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 relative z-20">
            {/* Header */}
            <div className="bg-white px-4 pt-12 pb-3 flex items-center shadow-sm shrink-0 z-10 border-b border-gray-100">
                <ChevronLeft size={24} className="text-gray-600 cursor-pointer mr-2" onClick={() => setWorkbenchView('interviewList')} />
                <span className="text-base font-bold text-gray-800">预约面谈</span>
            </div>

            <div className="flex-1 overflow-y-auto p-5 custom-scrollbar pb-32">
                <div className="bg-blue-50/50 p-4 rounded-xl border border-blue-100 mb-6 flex items-center">
                    <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-bold text-blue-600 text-sm shadow-sm border border-blue-100 mr-3">
                        {selectedSession.employeeName.charAt(0)}
                    </div>
                    <div>
                        <div className="text-sm font-bold text-gray-900">{selectedSession.employeeName}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{selectedSession.period}</div>
                    </div>
                </div>

                <div className="space-y-5">
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">面谈主题</label>
                        <input 
                            type="text" 
                            defaultValue={selectedSession.period}
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-blue-500 transition-colors"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">日期</label>
                            <div className="relative">
                                <input 
                                    type="date" 
                                    defaultValue={new Date().toISOString().split('T')[0]}
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-blue-500 transition-colors appearance-none"
                                />
                            </div>
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-gray-500 mb-2">时间</label>
                            <div className="relative">
                                <input 
                                    type="time" 
                                    defaultValue="10:00"
                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-blue-500 transition-colors appearance-none"
                                />
                            </div>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">预计时长</label>
                        <div className="flex space-x-3">
                            <button className="flex-1 py-2 bg-blue-50 border border-blue-200 text-blue-700 rounded-lg text-xs font-bold">30 分钟</button>
                            <button className="flex-1 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium">60 分钟</button>
                            <button className="flex-1 py-2 bg-gray-50 border border-gray-200 text-gray-600 rounded-lg text-xs font-medium">90 分钟</button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">面谈方式</label>
                        <div className="bg-white border border-gray-200 rounded-lg p-3 flex items-center shadow-sm">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 mr-3">
                                <Video size={16} />
                            </div>
                            <div className="flex-1">
                                <div className="text-sm font-bold text-gray-800">腾讯会议</div>
                                <div className="text-xs text-gray-400">自动生成会议链接</div>
                            </div>
                            <CheckCircle2 size={18} className="text-blue-500" />
                        </div>
                    </div>
                    
                    <div>
                        <label className="block text-xs font-bold text-gray-500 mb-2">备注信息</label>
                        <textarea 
                            className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-blue-500 transition-colors h-24 resize-none"
                            placeholder="填写备注..."
                        ></textarea>
                    </div>
                </div>
            </div>

            <div className="p-4 border-t border-gray-100 bg-white pb-8 absolute bottom-0 left-0 right-0 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <button 
                    onClick={() => {
                        // Simulate scheduling success and data flow
                        const updatedSession = { 
                            ...selectedSession, 
                            schedulingStatus: 'scheduled' as const, 
                            date: new Date().toISOString().split('T')[0] + ' 10:00' 
                        };
                        setLocalSessions(prev => prev.map(s => s.id === updatedSession.id ? updatedSession : s));
                        setSelectedSession(updatedSession);
                        
                        // Jump to Prepare View
                        setWorkbenchView('prepare');
                        setPrepareTab('analysis');
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                >
                    确认预约
                </button>
            </div>
        </div>
      );
  };

  const renderPrepare = () => {
      // ... (Prepare logic remains unchanged)
      if (!selectedSession) return null;

      // Mock Data for Analysis View (Matching PC)
      const analysisData = {
          score: '88.5',
          grade: 'A',
          achievement: '95%',
          highlights: [
              { id: 'h1', title: '出勤率', self: 100, manager: 100, tag: '业绩亮点', type: 'highlight' }
          ],
          improvements: [
              { id: 'i1', title: '核心业务指标完成度', self: 80, manager: 70, tag: '待改进', type: 'improvement' }
          ],
          conflicts: [
              { 
                  id: 'c1', 
                  title: '评价冲突', 
                  self: 100, 
                  manager: 100, 
                  tag: '重点沟通', 
                  type: 'conflict',
                  quote: '“本季度主要在摸索阶段，产出有限”，但自评分数：100分。',
                  diff: 25 
              }
          ]
      };

      const renderTag = (type: string, tag: string, diff?: number) => {
          let styles = '';
          let icon = null;
          if (type === 'conflict') {
              styles = 'bg-purple-50 text-purple-700 border-purple-100';
              icon = <AlertTriangle size={10} className="mr-1" />;
          } else if (type === 'improvement') {
              styles = 'bg-orange-50 text-orange-700 border-orange-100';
              icon = <TrendingUp size={10} className="mr-1" />;
          } else {
              styles = 'bg-green-50 text-green-700 border-green-100';
              icon = <ThumbsUp size={10} className="mr-1" />;
          }

          return (
              <div className="flex items-center">
                  <span className={`flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${styles}`}>
                      {icon} {tag}
                  </span>
                  {type === 'conflict' && (
                      <span className="ml-2 text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-bold border border-red-100">分差 {diff || 0}</span>
                  )}
              </div>
          );
      };

      return (
        <div className="flex-1 bg-[#F5F6F8] flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 relative z-20">
            {/* Header */}
            <div className="bg-white px-4 pt-12 pb-3 flex items-center shadow-sm shrink-0 z-10 border-b border-gray-100">
                <ChevronLeft size={24} className="text-gray-600 cursor-pointer mr-2" onClick={() => {
                    setWorkbenchView('interviewList');
                    setInterviewListTab('start'); // Go to "To Start" list
                }} />
                <span className="text-base font-bold text-gray-800">面谈准备</span>
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto custom-scrollbar pb-6">
                
                {/* Prepare View Tabs */}
                <div className="bg-white px-4 border-b border-gray-100 flex space-x-6 sticky top-0 z-10 shadow-sm">
                    <button 
                        onClick={() => setPrepareTab('analysis')}
                        className={`pb-3 pt-3 text-sm font-medium border-b-2 transition-colors ${prepareTab === 'analysis' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                    >
                        绩效分析
                    </button>
                    <button 
                        onClick={() => setPrepareTab('outline')}
                        className={`pb-3 pt-3 text-sm font-medium border-b-2 transition-colors ${prepareTab === 'outline' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                    >
                        智能大纲
                    </button>
                    <button 
                        onClick={() => setPrepareTab('info')}
                        className={`pb-3 pt-3 text-sm font-medium border-b-2 transition-colors ${prepareTab === 'info' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                    >
                        基本信息
                    </button>
                </div>

                {/* Tab Content */}
                <div className="p-4">
                    {prepareTab === 'analysis' && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
                            
                            {/* User Info Header */}
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex items-center">
                                    <div className="relative">
                                        <img src="https://picsum.photos/id/338/100/100" className="w-10 h-10 rounded-full border border-gray-200 shadow-sm" alt=""/>
                                        <div className="absolute -bottom-0.5 -right-0.5 bg-green-500 w-2.5 h-2.5 rounded-full border-2 border-white"></div>
                                    </div>
                                    <div className="ml-3">
                                        <h3 className="text-sm font-bold text-gray-900">{selectedSession.employeeName}</h3>
                                        <div className="text-xs text-gray-500">云演示组 · 工程师</div>
                                    </div>
                                </div>
                                <div className="bg-white border border-gray-200 rounded-lg px-2 py-1 flex items-center shadow-sm">
                                    <span className="text-xs font-medium text-gray-700 mr-1">2025 Q4</span>
                                    <ChevronDown size={12} className="text-gray-400" />
                                </div>
                            </div>

                            {/* Overall Score Card */}
                            <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                                <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                                    <div>
                                        <div className="text-xs text-gray-500 mb-1">综合评分</div>
                                        <div className="flex items-baseline">
                                            <span className="text-3xl font-bold text-gray-900">{analysisData.score}</span>
                                            <span className="ml-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">等级 {analysisData.grade}</span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs text-gray-500 mb-1">整体目标达成率</div>
                                        <div className="text-lg font-bold text-blue-600">{analysisData.achievement}</div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    <div className="flex items-center text-xs font-bold text-blue-600">
                                        <Target size={14} className="mr-1.5" /> 本周期重点
                                    </div>

                                    {/* 1. Conflict Card */}
                                    {analysisData.conflicts.map(item => (
                                        <div key={item.id} className="bg-purple-50 border border-purple-100 rounded-xl p-3 relative">
                                            <div className="flex justify-between items-start mb-2">
                                                {renderTag('conflict', item.tag, 0)} 
                                            </div>
                                            <h4 className="font-bold text-xs text-purple-900 mb-2">{item.title}</h4>
                                            <div className="flex justify-between text-[10px] text-gray-600 mb-2 bg-white/60 p-1.5 rounded">
                                                <span>自评: <span className="font-bold text-gray-800">{item.self}</span></span>
                                                <span>他评: <span className="font-bold text-gray-800">{item.manager}</span></span>
                                            </div>
                                            <p className="text-[10px] text-gray-500 italic mb-2 leading-relaxed">
                                                {item.quote}
                                            </p>
                                            <button className="flex items-center justify-center w-full py-1.5 bg-white border border-purple-100 rounded text-[10px] font-medium text-purple-600 hover:bg-purple-50">
                                                <Eye size={10} className="mr-1.5" /> 查看冲突对比
                                            </button>
                                        </div>
                                    ))}

                                    {/* 2. Improvement Card */}
                                    {analysisData.improvements.map(item => (
                                        <div key={item.id} className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                {renderTag('improvement', item.tag)}
                                            </div>
                                            <h4 className="font-bold text-xs text-orange-900 mb-2">{item.title}</h4>
                                            <div className="flex justify-between text-[10px] text-gray-600 bg-white/60 p-1.5 rounded">
                                                <span>自评: <span className="font-bold text-gray-800">{item.self}</span></span>
                                                <span>他评: <span className="font-bold text-gray-800">{item.manager}</span></span>
                                            </div>
                                        </div>
                                    ))}

                                    {/* 3. Highlight Card */}
                                    {analysisData.highlights.map(item => (
                                        <div key={item.id} className="bg-green-50 border border-green-100 rounded-xl p-3">
                                            <div className="flex justify-between items-start mb-2">
                                                {renderTag('highlight', item.tag)}
                                            </div>
                                            <h4 className="font-bold text-xs text-green-900 mb-2">{item.title}</h4>
                                            <div className="flex justify-between text-[10px] text-gray-600 bg-white/60 p-1.5 rounded">
                                                <span>自评: <span className="font-bold text-gray-800">{item.self}</span></span>
                                                <span>他评: <span className="font-bold text-gray-800">{item.manager}</span></span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* AI Summary */}
                                <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs leading-relaxed text-gray-600">
                                    <div className="flex items-center font-bold text-gray-800 mb-1">
                                        <Sparkles size={12} className="mr-1.5 text-purple-500" /> AI 总结：
                                    </div>
                                    整体表现稳健，执行力与协作力表现突出。主要矛盾集中在KPI认定规则的理解上，建议面谈时优先解决。
                                </div>
                            </div>

                            {/* History Trend */}
                            <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                                <div className="flex items-center text-xs font-bold text-gray-800 mb-4">
                                    <Clock size={14} className="mr-1.5 text-blue-600" /> 历史趋势
                                </div>
                                <div className="h-24 w-full flex items-end justify-between px-2 text-[10px] text-gray-400">
                                    {[75, 78, 76, 78].map((val, i) => (
                                        <div key={i} className="flex flex-col items-center group w-full">
                                            <div className="relative w-full flex justify-center h-20 items-end">
                                                <div className="w-1.5 bg-blue-100 rounded-t group-hover:bg-blue-300 transition-colors" style={{ height: `${val}%` }}></div>
                                                <div className="absolute -top-6 bg-gray-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">{val}</div>
                                            </div>
                                            <div className="mt-2 border-t border-gray-100 w-full text-center pt-1">
                                                Q{i+1}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}

                    {prepareTab === 'outline' && (
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2">
                            <div className="flex items-center mb-3 text-purple-600">
                                <Sparkles size={16} className="mr-2" />
                                <span className="text-sm font-bold">AI 智能面谈大纲</span>
                            </div>
                            <div className="prose prose-sm max-w-none text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
                                {MOCK_AI_OUTLINE.replace(/#/g, '')}
                            </div>
                        </div>
                    )}

                    {prepareTab === 'info' && (
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm animate-in fade-in slide-in-from-bottom-2 space-y-4">
                            <div className="flex items-center text-gray-800 text-sm font-bold mb-2">
                                <Info size={16} className="mr-2 text-blue-600" /> 面谈信息
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <div className="text-gray-400 mb-1">面谈对象</div>
                                    <div className="text-gray-800 font-medium">{selectedSession.employeeName}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 mb-1">面谈官</div>
                                    <div className="text-gray-800 font-medium">{selectedSession.managerName}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 mb-1">关联周期</div>
                                    <div className="text-gray-800 font-medium">{selectedSession.assessmentCycle || '2025 Q4'}</div>
                                </div>
                                <div>
                                    <div className="text-gray-400 mb-1">面谈模板</div>
                                    <div className="text-gray-800 font-medium">标准绩效面谈模板</div>
                                </div>
                            </div>
                            <div className="pt-3 border-t border-gray-100">
                                <div className="text-gray-400 text-xs mb-1">面谈备注</div>
                                <div className="text-gray-600 text-xs bg-gray-50 p-2 rounded">
                                    请重点沟通下季度的OKR设定思路，以及针对跨部门协作问题的解决方案。
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            
            {/* Enter Meeting Button - Only on Prepare View */}
            {prepareTab && (
                <div className="p-4 bg-white border-t border-gray-100 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] z-30">
                    <button className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center">
                        <Video size={18} className="mr-2" /> 进入面谈会议
                    </button>
                </div>
            )}
        </div>
      );
  };

  const renderSubmitModal = () => {
      if (!isSubmitModalOpen || !selectedSession) return null;

      return (
          <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
              <div className="bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl animate-in zoom-in-95">
                  <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center">
                      <h3 className="font-bold text-gray-900 text-lg">确认同步内容</h3>
                      <button onClick={() => setIsSubmitModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                          <X size={20} />
                      </button>
                  </div>
                  
                  <div className="p-5">
                      <p className="text-sm text-gray-500 mb-4">即将发送给 <span className="font-bold text-gray-800">{selectedSession.employeeName}</span> 确认</p>
                      
                      <div className="bg-blue-50/50 rounded-xl border border-blue-100 p-4">
                          <div className="flex items-center justify-between mb-3">
                              <div className="flex items-center">
                                  <div className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mr-3">
                                      <FileText size={16} />
                                  </div>
                                  <span className="text-sm font-bold text-gray-800">绩效面谈记录表</span>
                              </div>
                              <CheckCircle2 size={18} className="text-blue-600" />
                          </div>
                          
                          <div className="bg-white rounded-lg p-2 border border-blue-100 flex items-center justify-between">
                              <span className="text-xs text-gray-500 ml-1">员工权限:</span>
                              <div className="flex bg-gray-100 rounded p-0.5">
                                  <button 
                                      onClick={() => setSubmitPermission('read')}
                                      className={`px-2 py-1 rounded text-[10px] font-medium transition-all flex items-center ${submitPermission === 'read' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                                  >
                                      <Eye size={10} className="mr-1" /> 仅查看
                                  </button>
                                  <button 
                                      onClick={() => setSubmitPermission('edit')}
                                      className={`px-2 py-1 rounded text-[10px] font-medium transition-all flex items-center ${submitPermission === 'edit' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500'}`}
                                  >
                                      <Edit3 size={10} className="mr-1" /> 允许修改
                                  </button>
                              </div>
                          </div>
                      </div>
                  </div>

                  <div className="px-5 py-4 border-t border-gray-100 flex space-x-3">
                      <button 
                          onClick={() => setIsSubmitModalOpen(false)}
                          className="flex-1 py-2.5 bg-gray-100 text-gray-600 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors"
                      >
                          取消
                      </button>
                      <button 
                          onClick={() => {
                              setIsSubmitModalOpen(false);
                              alert("已发送给员工确认！");
                              setWorkbenchView('interviewList');
                          }}
                          className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-black transition-colors flex items-center justify-center"
                      >
                          <Send size={14} className="mr-1.5" /> 确认并发送
                      </button>
                  </div>
              </div>
          </div>
      );
  };

  const renderFeedback = () => {
      if (!selectedSession) return null;
      const template = MOCK_TEMPLATES.find(t => t.id === selectedSession.templateId) || MOCK_TEMPLATES[0];

      // Reuse Analysis Data Logic
      const analysisData = {
          score: '88.5',
          grade: 'A',
          achievement: '95%',
          highlights: [
              { id: 'h1', title: '出勤率', self: 100, manager: 100, tag: '业绩亮点', type: 'highlight' }
          ],
          improvements: [
              { id: 'i1', title: '核心业务指标完成度', self: 80, manager: 70, tag: '待改进', type: 'improvement' }
          ],
          conflicts: [
              { 
                  id: 'c1', 
                  title: '评价冲突', 
                  self: 100, 
                  manager: 100, 
                  tag: '重点沟通', 
                  type: 'conflict',
                  quote: '“本季度主要在摸索阶段，产出有限”，但自评分数：100分。',
                  diff: 25 
              }
          ]
      };

      const renderTag = (type: string, tag: string, diff?: number) => {
          let styles = '';
          let icon = null;
          if (type === 'conflict') {
              styles = 'bg-purple-50 text-purple-700 border-purple-100';
              icon = <AlertTriangle size={10} className="mr-1" />;
          } else if (type === 'improvement') {
              styles = 'bg-orange-50 text-orange-700 border-orange-100';
              icon = <TrendingUp size={10} className="mr-1" />;
          } else {
              styles = 'bg-green-50 text-green-700 border-green-100';
              icon = <ThumbsUp size={10} className="mr-1" />;
          }

          return (
              <div className="flex items-center">
                  <span className={`flex items-center px-1.5 py-0.5 rounded text-[10px] font-bold border ${styles}`}>
                      {icon} {tag}
                  </span>
                  {type === 'conflict' && (
                      <span className="ml-2 text-[10px] bg-red-50 text-red-500 px-1.5 py-0.5 rounded font-bold border border-red-100">分差 {diff || 0}</span>
                  )}
              </div>
          );
      };

      return (
        <div className="flex-1 bg-gray-50 flex flex-col overflow-hidden animate-in slide-in-from-right duration-300 relative z-20">
            {/* Header */}
            <div className="bg-white px-4 pt-12 pb-3 flex items-center shadow-sm shrink-0 z-10 border-b border-gray-100">
                <ChevronLeft size={24} className="text-gray-600 cursor-pointer mr-2" onClick={() => setWorkbenchView('interviewList')} />
                <span className="text-base font-bold text-gray-800">面谈反馈</span>
            </div>

            {/* Tabs */}
            <div className="bg-white px-4 border-b border-gray-100 flex space-x-6 sticky top-0 z-10 shadow-sm">
                <button 
                    onClick={() => setFeedbackTab('form')}
                    className={`pb-3 pt-3 text-sm font-medium border-b-2 transition-colors ${feedbackTab === 'form' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                >
                    绩效反馈表
                </button>
                <button 
                    onClick={() => setFeedbackTab('analysis')}
                    className={`pb-3 pt-3 text-sm font-medium border-b-2 transition-colors ${feedbackTab === 'analysis' ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'}`}
                >
                    考核总结分析
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 custom-scrollbar pb-20">
                {/* Employee Info Card (Visible in both tabs or just one? Let's keep it in both for context or move it inside tabs if needed. The prompt implies tabs for content. I'll put it above content if appropriate, but the design shows tabs. Let's put content inside.) */}
                
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-4">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-0.5 rounded">正在反馈</span>
                        <span className="text-xs font-bold text-gray-400">{new Date().toISOString().split('T')[0]}</span>
                    </div>
                    <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-sm mr-3 border border-purple-100">
                            {selectedSession.employeeName.charAt(0)}
                        </div>
                        <div>
                            <div className="text-sm font-bold text-gray-900">{selectedSession.employeeName}</div>
                            <div className="text-xs text-gray-500 mt-0.5">{selectedSession.period}</div>
                        </div>
                    </div>
                </div>

                {feedbackTab === 'form' && (
                    <div className="space-y-4 pb-4 animate-in fade-in">
                        {template.sections.map((section, idx) => (
                            <div key={section.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                                <div className="flex items-center mb-3">
                                    <div className="w-1 h-3 bg-blue-500 rounded-full mr-2"></div>
                                    <h4 className="font-bold text-sm text-gray-800">{section.title}</h4>
                                </div>
                                
                                <div className="space-y-4">
                                    {section.fields.map(field => (
                                        <div key={field.id}>
                                            <label className="block text-xs font-bold text-gray-500 mb-2">
                                                {field.label} {field.required && <span className="text-red-500">*</span>}
                                            </label>
                                            {field.type === 'textarea' ? (
                                                <textarea 
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 transition-colors h-24 resize-none"
                                                    placeholder={field.placeholder || "请输入..."}
                                                ></textarea>
                                            ) : field.type === 'rating' ? (
                                                <div className="flex space-x-2">
                                                    {[1,2,3,4,5].map(i => (
                                                        <Star key={i} size={24} className="text-gray-300 hover:text-yellow-400 cursor-pointer fill-gray-100" />
                                                    ))}
                                                </div>
                                            ) : (
                                                <input 
                                                    type="text" 
                                                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-800 outline-none focus:border-blue-500 transition-colors"
                                                    placeholder={field.placeholder}
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {feedbackTab === 'analysis' && (
                    <div className="space-y-4 animate-in fade-in">
                        {/* Overall Score Card */}
                        <div className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm">
                            <div className="flex justify-between items-start mb-4 border-b border-gray-50 pb-4">
                                <div>
                                    <div className="text-xs text-gray-500 mb-1">综合评分</div>
                                    <div className="flex items-baseline">
                                        <span className="text-3xl font-bold text-gray-900">{analysisData.score}</span>
                                        <span className="ml-2 text-xs font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">等级 {analysisData.grade}</span>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-gray-500 mb-1">整体目标达成率</div>
                                    <div className="text-lg font-bold text-blue-600">{analysisData.achievement}</div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="flex items-center text-xs font-bold text-blue-600">
                                    <Target size={14} className="mr-1.5" /> 本周期重点
                                </div>

                                {/* Conflict Card */}
                                {analysisData.conflicts.map(item => (
                                    <div key={item.id} className="bg-purple-50 border border-purple-100 rounded-xl p-3 relative">
                                        <div className="flex justify-between items-start mb-2">
                                            {renderTag('conflict', item.tag, 0)} 
                                        </div>
                                        <h4 className="font-bold text-xs text-purple-900 mb-2">{item.title}</h4>
                                        <div className="flex justify-between text-[10px] text-gray-600 mb-2 bg-white/60 p-1.5 rounded">
                                            <span>自评: <span className="font-bold text-gray-800">{item.self}</span></span>
                                            <span>他评: <span className="font-bold text-gray-800">{item.manager}</span></span>
                                        </div>
                                        <p className="text-[10px] text-gray-500 italic mb-2 leading-relaxed">
                                            {item.quote}
                                        </p>
                                        <button className="flex items-center justify-center w-full py-1.5 bg-white border border-purple-100 rounded text-[10px] font-medium text-purple-600 hover:bg-purple-50">
                                            <Eye size={10} className="mr-1.5" /> 查看冲突对比
                                        </button>
                                    </div>
                                ))}

                                {/* Improvement Card */}
                                {analysisData.improvements.map(item => (
                                    <div key={item.id} className="bg-orange-50 border border-orange-100 rounded-xl p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            {renderTag('improvement', item.tag)}
                                        </div>
                                        <h4 className="font-bold text-xs text-orange-900 mb-2">{item.title}</h4>
                                        <div className="flex justify-between text-[10px] text-gray-600 bg-white/60 p-1.5 rounded">
                                            <span>自评: <span className="font-bold text-gray-800">{item.self}</span></span>
                                            <span>他评: <span className="font-bold text-gray-800">{item.manager}</span></span>
                                        </div>
                                    </div>
                                ))}

                                {/* Highlight Card */}
                                {analysisData.highlights.map(item => (
                                    <div key={item.id} className="bg-green-50 border border-green-100 rounded-xl p-3">
                                        <div className="flex justify-between items-start mb-2">
                                            {renderTag('highlight', item.tag)}
                                        </div>
                                        <h4 className="font-bold text-xs text-green-900 mb-2">{item.title}</h4>
                                        <div className="flex justify-between text-[10px] text-gray-600 bg-white/60 p-1.5 rounded">
                                            <span>自评: <span className="font-bold text-gray-800">{item.self}</span></span>
                                            <span>他评: <span className="font-bold text-gray-800">{item.manager}</span></span>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* AI Summary */}
                            <div className="mt-4 bg-gray-50 border border-gray-100 rounded-lg p-3 text-xs leading-relaxed text-gray-600">
                                <div className="flex items-center font-bold text-gray-800 mb-1">
                                    <Sparkles size={12} className="mr-1.5 text-purple-500" /> AI 总结：
                                </div>
                                整体表现稳健，执行力与协作力表现突出。主要矛盾集中在KPI认定规则的理解上，建议面谈时优先解决。
                            </div>
                        </div>

                        {/* History Trend */}
                        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
                            <div className="flex items-center text-xs font-bold text-gray-800 mb-4">
                                <Clock size={14} className="mr-1.5 text-blue-600" /> 历史趋势
                            </div>
                            <div className="h-24 w-full flex items-end justify-between px-2 text-[10px] text-gray-400">
                                {[75, 78, 76, 78].map((val, i) => (
                                    <div key={i} className="flex flex-col items-center group w-full">
                                        <div className="relative w-full flex justify-center h-20 items-end">
                                            <div className="w-1.5 bg-blue-100 rounded-t group-hover:bg-blue-300 transition-colors" style={{ height: `${val}%` }}></div>
                                            <div className="absolute -top-6 bg-gray-800 text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">{val}</div>
                                        </div>
                                        <div className="mt-2 border-t border-gray-100 w-full text-center pt-1">
                                            Q{i+1}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 border-t border-gray-100 bg-white pb-8 absolute bottom-0 left-0 right-0 z-30 shadow-[0_-4px_10px_rgba(0,0,0,0.05)]">
                <button 
                    onClick={() => {
                        setIsSubmitModalOpen(true);
                    }}
                    className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold shadow-lg shadow-blue-200 transition-all active:scale-95 flex items-center justify-center"
                >
                    <Send size={16} className="mr-2" /> 发送给员工确认
                </button>
            </div>
        </div>
      );
  };

  const renderWorkbench = () => {
      if (workbenchView === 'dashboard') {
          return (
            <div className="flex-1 bg-[#F5F6F8] flex flex-col overflow-hidden animate-in fade-in">
                {/* Header */}
                <div className="bg-white px-4 pt-12 pb-3 flex justify-between items-center shadow-sm shrink-0 z-10">
                    <ChevronLeft className="text-gray-800" onClick={onClose} />
                    <span className="text-lg font-bold text-gray-900">考核</span>
                    <MoreHorizontal className="text-gray-800" />
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                    {/* Todo Card */}
                    <div className="bg-white rounded-xl p-5 shadow-sm mb-4">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-900">待处理</h3>
                            <span className="text-xs text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full flex items-center">
                                <Clock size={10} className="mr-1" /> 即将到期
                            </span>
                        </div>

                        <div className="grid grid-cols-3 gap-y-8 text-center">
                            <div className="flex flex-col items-center opacity-60">
                                <span className="text-2xl font-bold text-gray-900 mb-1 font-sans">13</span>
                                <span className="text-xs text-gray-500 flex items-center">计划制定</span>
                            </div>
                            <div className="flex flex-col items-center opacity-60">
                                <span className="text-2xl font-bold text-gray-900 mb-1 font-sans">1</span>
                                <span className="text-xs text-gray-500">计划审批</span>
                            </div>
                            <div className="flex flex-col items-center opacity-60">
                                <span className="text-2xl font-bold text-gray-900 mb-1 font-sans">0</span>
                                <span className="text-xs text-gray-500">完成值录入</span>
                            </div>
                            <div className="flex flex-col items-center opacity-60">
                                <span className="text-2xl font-bold text-gray-900 mb-1 font-sans">5</span>
                                <span className="text-xs text-gray-500">考核评分</span>
                            </div>
                            <div className="flex flex-col items-center opacity-60">
                                <span className="text-2xl font-bold text-gray-900 mb-1 font-sans">0</span>
                                <span className="text-xs text-gray-500">结果审核</span>
                            </div>
                            {/* Performance Interview Entry */}
                            <div 
                                className="flex flex-col items-center cursor-pointer relative group"
                                onClick={() => setWorkbenchView('interviewList')}
                            >
                                <span className="text-2xl font-bold text-blue-600 mb-1 font-sans group-hover:scale-110 transition-transform">{pendingInterviews.length}</span>
                                <span className="text-xs text-blue-600 font-bold">绩效面谈</span>
                                {pendingInterviews.length > 0 && (
                                    <span className="absolute top-0 right-4 w-2 h-2 bg-red-500 rounded-full border border-white"></span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    {/* Banner / Ads */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-4 text-white shadow-lg mb-4 flex items-center justify-between">
                        <div>
                            <div className="font-bold text-sm">2025 年度绩效启动</div>
                            <div className="text-[10px] opacity-80 mt-1">请各部门主管关注时间节点</div>
                        </div>
                        <div className="bg-white/20 p-2 rounded-lg">
                            <FileText size={20} className="text-white" />
                        </div>
                    </div>

                    {/* Watermark */}
                    <div className="mt-12 flex justify-center opacity-5">
                        <div className="text-5xl font-black text-gray-400 transform -rotate-12 select-none">
                            SmartPerf
                        </div>
                    </div>
                </div>
            </div>
          );
      } else if (workbenchView === 'interviewList') {
          // Interview List View
          return (
            <div className="flex-1 bg-[#F5F6F8] flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
                {/* Header */}
                <div className="bg-white px-4 pt-12 pb-2 flex items-center justify-between shadow-sm shrink-0 z-10 border-b border-gray-100">
                    <ChevronLeft size={24} className="text-gray-600 cursor-pointer" onClick={() => setWorkbenchView('dashboard')} />
                    <span className="text-base font-bold text-gray-800">绩效面谈 ({pendingInterviews.length})</span>
                    <Filter size={20} className="text-gray-600" />
                </div>

                {/* Tabs */}
                <div className="bg-white px-4 pt-1 pb-0 flex items-center space-x-6 border-b border-gray-100 overflow-x-auto shrink-0 z-10 scrollbar-hide">
                    {['schedule', 'start', 'feedback', 'confirm', 'done'].map(tabKey => {
                        const labels: Record<string, string> = {
                            schedule: '待排期',
                            start: '待开始',
                            feedback: '待反馈',
                            confirm: '待确认',
                            done: '已完成'
                        };
                        const isActive = interviewListTab === tabKey;
                        const count = getMobileTabCount(tabKey);
                        return (
                            <button
                                key={tabKey}
                                onClick={() => setInterviewListTab(tabKey as any)}
                                className={`whitespace-nowrap pb-2 text-sm font-medium border-b-2 transition-colors flex items-center shrink-0 ${
                                    isActive ? 'border-blue-600 text-blue-600' : 'border-transparent text-gray-500'
                                }`}
                            >
                                {labels[tabKey]} 
                                {count > 0 && <span className={`ml-1 text-[10px] px-1.5 py-0.5 rounded-full ${isActive ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500'}`}>{count}</span>}
                            </button>
                        )
                    })}
                </div>

                {/* Content */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar">
                    {mobileFilteredSessions.map(session => (
                        <div key={session.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                            <div className="flex justify-between items-start mb-3">
                                <div className="flex items-center">
                                    <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm mr-3 border border-blue-100">
                                        {session.employeeName.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-gray-900 text-sm">{session.employeeName}</h4>
                                        <p className="text-xs text-gray-500 mt-0.5 font-medium">{session.period}</p>
                                    </div>
                                </div>
                                <span className={`text-[10px] px-2 py-0.5 rounded border ${
                                    session.status === Status.Completed ? 'bg-green-50 text-green-600 border-green-200' :
                                    session.status === Status.InProgress ? 'bg-blue-50 text-blue-600 border-blue-200' :
                                    'bg-gray-50 text-gray-600 border-gray-200'
                                }`}>
                                    {session.status}
                                </span>
                            </div>
                            
                            <div className="flex items-center text-xs text-gray-500 mb-4 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                                {interviewListTab === 'schedule' || interviewListTab === 'start' ? (
                                    <>
                                        <Clock size={12} className="mr-1.5 text-orange-400" />
                                        <span className="mr-auto">
                                            {session.date ? `时间：${session.date}` : `截止：${session.deadline || '未设置'}`}
                                        </span>
                                    </>
                                ) : (
                                    <>
                                        <Calendar size={12} className="mr-1.5 text-gray-400" />
                                        <span className="mr-auto">考核周期：{session.assessmentCycle || '2025 Q4'}</span>
                                    </>
                                )}
                            </div>

                            {interviewListTab !== 'done' ? (
                                <div className="grid grid-cols-2 gap-3 pt-1">
                                    {interviewListTab === 'schedule' && (
                                        <>
                                            <button 
                                                onClick={() => {
                                                    setSelectedSession(session);
                                                    setWorkbenchView('schedule');
                                                }}
                                                className="flex items-center justify-center px-2 py-2 text-xs font-bold text-blue-600 bg-blue-50 border border-blue-200 rounded-lg active:scale-95 transition-transform"
                                            >
                                                <Video size={14} className="mr-1.5" /> 预约面谈
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    setSelectedSession(session);
                                                    setWorkbenchView('feedback');
                                                }}
                                                className="flex items-center justify-center px-2 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg shadow-sm shadow-blue-200 active:scale-95 transition-transform"
                                            >
                                                <Edit3 size={14} className="mr-1.5" /> 直接反馈
                                            </button>
                                        </>
                                    )}
                                    {interviewListTab === 'start' && (
                                        <button 
                                            onClick={() => {
                                                setSelectedSession(session);
                                                setWorkbenchView('prepare');
                                            }}
                                            className="col-span-2 flex items-center justify-center px-2 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg shadow-sm shadow-blue-200 active:scale-95 transition-transform"
                                        >
                                            <FileText size={14} className="mr-1.5" /> 查看详情
                                        </button>
                                    )}
                                    {interviewListTab === 'feedback' && (
                                        <button 
                                            onClick={() => {
                                                setSelectedSession(session);
                                                setWorkbenchView('feedback');
                                            }}
                                            className="col-span-2 flex items-center justify-center px-2 py-2 text-xs font-bold text-white bg-blue-600 rounded-lg shadow-sm shadow-blue-200 active:scale-95 transition-transform"
                                        >
                                            <Edit3 size={14} className="mr-1.5" /> 填写反馈
                                        </button>
                                    )}
                                    {interviewListTab === 'confirm' && (
                                        <button 
                                            className="col-span-2 flex items-center justify-center px-2 py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-lg cursor-not-allowed"
                                            disabled
                                        >
                                            等待员工确认
                                        </button>
                                    )}
                                </div>
                            ) : (
                                <button 
                                    className="w-full flex items-center justify-center px-2 py-2 text-xs font-bold text-blue-600 bg-white border border-blue-200 rounded-lg active:scale-95 transition-transform"
                                >
                                    查看详情
                                </button>
                            )}
                        </div>
                    ))}
                    {mobileFilteredSessions.length === 0 && (
                        <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <CheckCircle2 size={24} className="opacity-20" />
                            </div>
                            <p className="text-xs">暂无{
                                interviewListTab === 'schedule' ? '待排期' :
                                interviewListTab === 'start' ? '待开始' :
                                interviewListTab === 'feedback' ? '待反馈' :
                                interviewListTab === 'confirm' ? '待确认' : '已完成'
                            }任务</p>
                        </div>
                    )}
                </div>
            </div>
          );
      } else if (workbenchView === 'schedule') {
          return renderSchedule();
      } else if (workbenchView === 'feedback') {
          return renderFeedback();
      } else if (workbenchView === 'prepare') {
          return renderPrepare();
      }
      return null;
  };

  const renderTeam = () => (
      <div className="flex-1 bg-[#F5F6F8] flex flex-col overflow-hidden animate-in fade-in">
          {/* Header */}
          <div className="bg-white px-4 pt-12 pb-3 flex justify-between items-center shadow-sm shrink-0 z-10">
               <div className="w-6"></div>
               <span className="text-lg font-bold text-gray-900">团队绩效</span>
               <Search className="text-gray-800" size={20} />
          </div>

          {/* Tabs */}
          <div className="bg-white px-4 pt-1 flex justify-center space-x-12 text-sm text-gray-500 shrink-0 border-b border-gray-100 shadow-sm z-0">
              <button 
                onClick={() => setTeamTab('subordinate')}
                className={`pb-2 px-1 transition-colors ${teamTab === 'subordinate' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''}`}
              >
                  下属绩效
              </button>
              <button 
                onClick={() => setTeamTab('org')}
                className={`pb-2 px-1 transition-colors ${teamTab === 'org' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''}`}
              >
                  组织绩效
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {teamTab === 'subordinate' ? (
                  <div className="space-y-3">
                      {teamMembers.map(member => (
                          <div key={member.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 mb-3">
                              {/* Header: Avatar, Name, ID, Dept/Role */}
                              <div className="flex items-start mb-3 pb-3 border-b border-gray-50 border-dashed">
                                  <img src={member.avatar} alt="" className="w-10 h-10 rounded-full border border-gray-100 mr-3 mt-1" />
                                  <div>
                                      <div className="flex items-center mb-1">
                                          <span className="font-bold text-gray-900 text-sm mr-2">{member.name}</span>
                                          <span className="text-xs text-gray-400">工号: {member.employeeId}</span>
                                      </div>
                                      <div className="text-xs text-gray-500">{member.department}/{member.role}</div>
                                  </div>
                              </div>
                              
                              {/* Details Section */}
                              <div className="space-y-2 pl-1">
                                  <div className="flex items-center text-xs">
                                      <span className="text-gray-400 w-28">最近一次考核周期:</span>
                                      <span className="text-gray-600">{member.latestCycle}</span>
                                  </div>
                                  <div className="flex items-center text-xs">
                                      <span className="text-gray-400 w-28">最近一次考核结束:</span>
                                      <div className="flex space-x-1">
                                          <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] border border-blue-100">{member.latestScoreTag}</span>
                                          <span className="bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded text-[10px] border border-blue-100">{member.latestGradeTag}</span>
                                      </div>
                                  </div>
                                  <div className="flex items-center text-xs">
                                      <span className="text-gray-400 w-28">总计参与考核数:</span>
                                      <span className="text-gray-600">{member.totalAssessments}</span>
                                  </div>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="text-center text-gray-400 py-10 text-xs">
                      组织绩效数据加载中...
                  </div>
              )}
          </div>
      </div>
  );

  const renderMe = () => (
      <div className="flex-1 bg-[#F5F6F8] flex flex-col overflow-hidden animate-in fade-in">
          {/* Header */}
          <div className="bg-white px-4 pt-12 pb-3 flex justify-between items-center shadow-sm shrink-0 z-10">
               <div className="w-6"></div>
               <span className="text-lg font-bold text-gray-900">我的绩效</span>
               <Bell className="text-gray-800" size={20} />
          </div>

          {/* Tabs */}
          <div className="bg-white px-4 pt-1 flex justify-center space-x-12 text-sm text-gray-500 shrink-0 border-b border-gray-100 shadow-sm z-0">
              <button 
                onClick={() => setMeTab('active')}
                className={`pb-2 px-1 transition-colors ${meTab === 'active' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''}`}
              >
                  进行中
              </button>
              <button 
                onClick={() => setMeTab('completed')}
                className={`pb-2 px-1 transition-colors ${meTab === 'completed' ? 'text-blue-600 font-bold border-b-2 border-blue-600' : ''}`}
              >
                  已完成
              </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
              {meTab === 'active' ? (
                  <div className="space-y-3">
                      {myAssessments.map(item => (
                          <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden">
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500"></div>
                              <div className="flex justify-between items-start mb-2 pl-2">
                                  <h4 className="font-bold text-gray-900 text-sm">{item.name}</h4>
                                  <span className="text-xs text-blue-600 bg-blue-50 px-2 py-0.5 rounded">{item.status}</span>
                              </div>
                              <div className="pl-2 text-xs text-gray-500 flex items-center">
                                  <Clock size={12} className="mr-1" /> 截止: {item.deadline}
                              </div>
                              <div className="mt-3 pl-2 pt-3 border-t border-gray-50 flex justify-end">
                                  <button className="text-xs bg-blue-600 text-white px-3 py-1.5 rounded-lg">去处理</button>
                              </div>
                          </div>
                      ))}
                  </div>
              ) : (
                  <div className="space-y-3">
                      <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 opacity-80">
                          <div className="flex justify-between items-center">
                              <h4 className="font-bold text-gray-900 text-sm">2025 Q3 绩效考核</h4>
                              <span className="text-xl font-bold text-gray-900">A</span>
                          </div>
                          <div className="text-xs text-gray-500 mt-1">2025-10-15 归档</div>
                      </div>
                  </div>
              )}
          </div>
      </div>
  );

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-md animate-in fade-in duration-300">
        <div className="w-[375px] h-[750px] bg-[#F5F6F8] rounded-[2.5rem] overflow-hidden flex flex-col relative border-[8px] border-gray-900 shadow-2xl scale-95 lg:scale-100 transition-all">
            {/* Status Bar Mock */}
            <div className="h-11 bg-white flex justify-between items-end px-6 pb-2 shrink-0 select-none z-20">
                <span className="text-xs font-bold text-gray-900">{currentTime}</span>
                <div className="flex space-x-1.5 items-center">
                    <div className="h-2.5 w-2.5 bg-gray-900 rounded-full opacity-20"></div>
                    <div className="h-2.5 w-2.5 bg-gray-900 rounded-full opacity-20"></div>
                    <div className="w-5 h-3 bg-gray-900 rounded-[2px] opacity-20 relative">
                        <div className="absolute right-[-2px] top-[3px] h-1.5 w-[2px] bg-gray-900 rounded-r-[1px]"></div>
                    </div>
                </div>
            </div>

            {/* View Content */}
            {activeTab === 'workbench' && renderWorkbench()}
            {activeTab === 'team' && renderTeam()}
            {activeTab === 'me' && renderMe()}

            {/* Bottom Bar - Persistent */}
            {showBottomBar && (
            <div className="h-20 bg-white border-t border-gray-200 flex justify-around items-center shrink-0 pb-6 z-20 absolute bottom-0 left-0 right-0 shadow-[0_-2px_10px_rgba(0,0,0,0.02)]">
                <div 
                    className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'workbench' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => setActiveTab('workbench')}
                >
                    <div className="w-6 h-6 mb-0.5 flex items-center justify-center">
                        <LayoutGrid size={22} className={activeTab === 'workbench' ? 'fill-blue-600' : ''} />
                    </div>
                    <span className="text-[10px] font-bold">工作台</span>
                </div>
                <div 
                    className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'team' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => setActiveTab('team')}
                >
                    <div className="w-6 h-6 mb-0.5 flex items-center justify-center">
                        <Users size={22} className={activeTab === 'team' ? 'fill-blue-600' : ''} />
                    </div>
                    <span className="text-[10px] font-bold">团队</span>
                </div>
                <div 
                    className={`flex flex-col items-center cursor-pointer transition-colors ${activeTab === 'me' ? 'text-blue-600' : 'text-gray-400 hover:text-gray-600'}`}
                    onClick={() => setActiveTab('me')}
                >
                    <div className="w-6 h-6 mb-0.5 flex items-center justify-center">
                        <User size={22} className={activeTab === 'me' ? 'fill-blue-600' : ''} />
                    </div>
                    <span className="text-[10px] font-bold">我的</span>
                </div>
            </div>
            )}
            
            {/* Modal Layer */}
            {renderSubmitModal()}

            {/* Home Indicator */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-gray-900 rounded-full z-30 pointer-events-none opacity-20"></div>
        </div>
        
        {/* Exit Button */}
        <button 
            onClick={onClose}
            className="absolute top-6 right-6 text-white/80 hover:text-white transition-colors bg-white/10 px-4 py-2 rounded-full backdrop-blur-md flex items-center space-x-2 text-sm font-medium border border-white/20"
        >
            <span>退出模拟</span>
            <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-[10px]">✕</span>
            </div>
        </button>
    </div>
  );
};

export default MobileApp;
