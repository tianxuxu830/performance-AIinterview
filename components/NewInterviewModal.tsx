
import React, { useState, useEffect, useRef } from 'react';
import { X, Calendar, User, ChevronRight, Users, Clock, FileText, Grip, Layers } from 'lucide-react';
import { MOCK_EMPLOYEES, MOCK_TEMPLATES } from '../constants';
import EmployeeSelectorModal from './EmployeeSelectorModal';

interface NewInterviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialEmployeeIds?: string[];
  defaultTopic?: string;
}

const NewInterviewModal: React.FC<NewInterviewModalProps> = ({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialEmployeeIds = [],
  defaultTopic = '绩效面谈'
}) => {
  const [selectedEmployeeIds, setSelectedEmployeeIds] = useState<string[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(MOCK_TEMPLATES[0].id);
  const [deadline, setDeadline] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]);
  const [topic, setTopic] = useState(defaultTopic);
  const [assessmentCycle, setAssessmentCycle] = useState('2025 Q4');
  const [interviewerRole, setInterviewerRole] = useState('manager');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  // Resize State
  const [dimensions, setDimensions] = useState({ width: 1000, height: 720 });
  const isResizing = useRef(false);
  const startPos = useRef({ x: 0, y: 0, w: 0, h: 0 });
  const modalRef = useRef<HTMLDivElement>(null);

  const INTERVIEWER_ROLES = [
    { value: 'manager', label: '直属上级' },
    { value: 'hrbp', label: 'HRBP' },
    { value: 'dept_head', label: '部门负责人' },
    { value: 'skip_manager', label: '隔级上级' }
  ];

  const ASSESSMENT_CYCLES = [
      '2025 Q4',
      '2025 Q3',
      '2025 Q2',
      '2025 Q1',
      '试用期评估'
  ];

  useEffect(() => {
    if (isOpen) {
      setSelectedEmployeeIds(initialEmployeeIds);
      setTopic(defaultTopic);
      setInterviewerRole('manager');
      setAssessmentCycle('2025 Q4');
    } 
  }, [isOpen, initialEmployeeIds, defaultTopic]);

  // Resize Logic
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isResizing.current) return;
      
      const deltaX = e.clientX - startPos.current.x;
      const deltaY = e.clientY - startPos.current.y;
      
      // Since it is centered, we multiply delta by 2 to keep the cursor on the handle roughly
      setDimensions({
          width: Math.max(600, startPos.current.w + deltaX * 2),
          height: Math.max(500, startPos.current.h + deltaY * 2)
      });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };

    if (isOpen) {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isOpen]);

  const startResize = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      isResizing.current = true;
      startPos.current = {
          x: e.clientX,
          y: e.clientY,
          w: dimensions.width,
          h: dimensions.height
      };
      document.body.style.cursor = 'nwse-resize';
      document.body.style.userSelect = 'none';
  };

  const isBatch = selectedEmployeeIds.length > 1;
  const singleEmployee = selectedEmployeeIds.length === 1 ? MOCK_EMPLOYEES.find(e => e.id === selectedEmployeeIds[0]) : null;

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center backdrop-blur-sm p-4">
        <div 
          ref={modalRef}
          className="bg-white rounded-xl shadow-xl flex flex-col relative overflow-hidden transition-all duration-75 ease-out"
          style={{ 
              width: dimensions.width, 
              height: dimensions.height,
              maxWidth: '95vw',
              maxHeight: '95vh'
          }}
        >
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50/50 shrink-0">
            <h2 className="text-lg font-bold text-gray-800">
                {isBatch ? '批量发起绩效面谈' : '发起绩效面谈'}
            </h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 p-6 overflow-y-auto custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                  {/* Employee Selection - Full Width */}
                  <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">面谈对象</label>
                      <div 
                        onClick={() => setIsSelectorOpen(true)}
                        className="w-full border border-gray-300 rounded-lg p-3 cursor-pointer hover:border-blue-400 hover:bg-blue-50/30 transition-all group bg-white"
                      >
                        {isBatch ? (
                          <div className="flex items-center justify-between">
                              <div className="flex items-center text-blue-700">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    <Users size={20} />
                                </div>
                                <div>
                                    <div className="text-sm font-bold">已选择 {selectedEmployeeIds.length} 名员工</div>
                                    <div className="text-xs text-blue-500 mt-0.5">点击修改人员名单</div>
                                </div>
                              </div>
                              <div className="flex -space-x-2 overflow-hidden">
                                  {selectedEmployeeIds.slice(0, 4).map(id => {
                                      const emp = MOCK_EMPLOYEES.find(e => e.id === id);
                                      return emp ? (
                                          <img key={id} src={emp.avatar} className="inline-block h-8 w-8 rounded-full ring-2 ring-white" alt=""/>
                                      ) : null;
                                  })}
                              </div>
                          </div>
                        ) : singleEmployee ? (
                          <div className="flex items-center justify-between">
                              <div className="flex items-center">
                                <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden mr-3">
                                    <img src={singleEmployee.avatar} alt="" className="w-full h-full object-cover"/>
                                </div>
                                <div>
                                    <div className="text-sm font-bold text-gray-900">{singleEmployee.name}</div>
                                    <div className="text-xs text-gray-500">{singleEmployee.department} • {singleEmployee.role}</div>
                                </div>
                              </div>
                              <ChevronRight size={16} className="text-gray-400" />
                          </div>
                        ) : (
                          <div className="flex items-center text-gray-400 py-1">
                              <User size={18} className="mr-2" />
                              <span className="text-sm">点击选择员工...</span>
                              <ChevronRight size={16} className="ml-auto opacity-50" />
                          </div>
                        )}
                      </div>
                  </div>

                  {/* Topic Input - Full Width */}
                  <div className="md:col-span-2">
                      <label className="block text-sm font-bold text-gray-700 mb-2">面谈主题</label>
                      <div className="relative">
                          <input 
                              type="text" 
                              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                              value={topic}
                              onChange={(e) => setTopic(e.target.value)}
                              placeholder="请输入面谈主题"
                          />
                          <FileText className="absolute left-3 top-2.5 text-gray-400" size={16} />
                      </div>
                  </div>

                  {/* Assessment Cycle Selection - Half Width */}
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">关联考核周期</label>
                      <div className="relative">
                        <select 
                            className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                            value={assessmentCycle}
                            onChange={(e) => setAssessmentCycle(e.target.value)}
                        >
                            {ASSESSMENT_CYCLES.map(cycle => (
                                <option key={cycle} value={cycle}>{cycle}</option>
                            ))}
                        </select>
                        <Layers className="absolute left-3 top-2.5 text-gray-400" size={16} />
                      </div>
                  </div>

                  {/* Template Selection - Half Width */}
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">评估模板</label>
                      <select 
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                          value={selectedTemplate}
                          onChange={(e) => setSelectedTemplate(e.target.value)}
                      >
                          {MOCK_TEMPLATES.map(t => (
                              <option key={t.id} value={t.id}>{t.name}</option>
                          ))}
                      </select>
                  </div>

                  {/* Interviewer Selection - Half Width */}
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">面谈官</label>
                      <select 
                          className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
                          value={interviewerRole}
                          onChange={(e) => setInterviewerRole(e.target.value)}
                      >
                          {INTERVIEWER_ROLES.map(role => (
                              <option key={role.value} value={role.value}>{role.label}</option>
                          ))}
                      </select>
                  </div>

                  {/* Deadline - Half Width */}
                  <div>
                      <label className="block text-sm font-bold text-gray-700 mb-2">面谈截止时间</label>
                      <div className="relative">
                          <input 
                              type="date" 
                              className="w-full pl-9 pr-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                              value={deadline}
                              onChange={(e) => setDeadline(e.target.value)}
                          />
                          <Clock className="absolute left-3 top-2.5 text-gray-400" size={16} />
                      </div>
                  </div>
                  
                  {/* Info Box - Full Width */}
                  <div className="md:col-span-2">
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 flex items-start text-sm text-blue-700 leading-relaxed">
                        <span className="mr-2 text-lg">📢</span>
                        <p>
                            任务发起后，将通知面谈官。面谈官可根据情况选择<strong>“预约在线会议”</strong>或<strong>“直接填写反馈”</strong>。
                        </p>
                    </div>
                  </div>
              </div>
          </div>

          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50/50 flex justify-end space-x-3 shrink-0">
            <button 
              onClick={onClose}
              className="px-5 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
            >
              取消
            </button>
            <button 
              onClick={() => {
                  onSubmit({ 
                      employeeIds: selectedEmployeeIds, 
                      templateId: selectedTemplate, 
                      deadline, 
                      topic,
                      assessmentCycle,
                      interviewerRole,
                      status: 'NotStarted',
                      schedulingStatus: 'pending' // Defaults to pending
                  });
                  onClose();
              }}
              disabled={selectedEmployeeIds.length === 0 || !deadline || !topic}
              className="px-5 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed shadow-sm transition-colors"
            >
              {isBatch ? `批量发起 (${selectedEmployeeIds.length})` : '发起任务'}
            </button>
          </div>

          {/* Resize Handle */}
          <div 
            className="absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize flex items-center justify-center z-50 text-gray-400 hover:text-blue-600"
            onMouseDown={startResize}
          >
             <Grip size={16} className="transform rotate-90" />
          </div>
        </div>
      </div>
      
      <EmployeeSelectorModal 
        isOpen={isSelectorOpen}
        onClose={() => setIsSelectorOpen(false)}
        onSelect={(ids) => {
            setSelectedEmployeeIds(ids);
            setIsSelectorOpen(false);
        }}
        initialSelectedIds={selectedEmployeeIds}
      />
    </>
  );
};

export default NewInterviewModal;
