
import React, { useState } from 'react';
import { 
  ArrowLeft, CheckCircle2, Sparkles, FileText, 
  Info, BookOpen, Video, Send, X, ShieldCheck, 
  AlertTriangle, PenLine, FileSignature, Edit3, ChevronRight
} from 'lucide-react';
import { InterviewSession, ShareConfig, Status } from '../types';
import { MOCK_TEMPLATES, MOCK_ASSESSMENT_DETAILS } from '../constants';
import AssessmentDetailTable from './AssessmentDetailTable';

interface InterviewConfirmationViewProps {
  session: InterviewSession;
  onBack: () => void;
  onConfirm: () => void;
}

const InterviewConfirmationView: React.FC<InterviewConfirmationViewProps> = ({ session, onBack, onConfirm }) => {
  // Use session's shareConfig or fallback to defaults
  const config = session.shareConfig || {
    items: { summary: true, form: true, info: false, ref: false, replay: false },
    formPermission: 'read'
  };

  const [activeTab, setActiveTab] = useState<string>(() => {
    if (config.items.summary) return 'summary';
    if (config.items.form) return 'form';
    return 'info';
  });

  const [employeeFeedback, setEmployeeFeedback] = useState('');
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const template = MOCK_TEMPLATES.find(t => t.id === session.templateId) || MOCK_TEMPLATES[0];
  const assessmentDetail = MOCK_ASSESSMENT_DETAILS[session.employeeId] || MOCK_ASSESSMENT_DETAILS['default'];

  const tabs = [
    { id: 'summary', label: '智能纪要', icon: Sparkles, visible: config.items.summary },
    { id: 'form', label: '绩效面谈表', icon: FileText, visible: config.items.form },
    { id: 'info', label: '个人基本信息', icon: Info, visible: config.items.info },
    { id: 'ref', label: '考核参考资料', icon: BookOpen, visible: config.items.ref },
    { id: 'replay', label: '面谈回放', icon: Video, visible: config.items.replay },
  ].filter(t => t.visible);

  const handleConfirmAction = () => {
    if (session.signatureType === 'confirmation') {
      onConfirm();
    } else {
      setShowSignatureModal(true);
    }
  };

  const handleSignatureSubmit = () => {
    setShowSignatureModal(false);
    onConfirm();
  };

  const handleReject = () => {
    if (!rejectReason) return alert('请输入退回理由');
    alert('任务已退回给面谈官：' + rejectReason);
    onBack();
  };

  return (
    <div className="flex flex-col h-full bg-[#F8FAFC] overflow-hidden relative">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 h-16 flex justify-between items-center shrink-0 z-20">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4 p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-lg font-bold text-gray-900">{session.period} - 结果确认</h1>
            <p className="text-xs text-gray-500">面谈官：{session.managerName} · 发起日期：{session.date.split(' ')[0]}</p>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <button 
            onClick={() => setIsRejecting(true)}
            className="px-4 py-2 text-gray-600 hover:text-red-600 text-sm font-medium hover:bg-red-50 rounded-lg transition-colors"
          >
            退回修正
          </button>
          <button 
            onClick={handleConfirmAction}
            className="px-6 py-2 bg-primary text-white rounded-lg text-sm font-bold shadow-lg shadow-primary/20 hover:bg-primary-600 transition-all flex items-center"
          >
            <CheckCircle2 size={16} className="mr-2" /> 确认结果
          </button>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Nav */}
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col p-4 space-y-2 shrink-0">
          <div className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-3 mb-2">面谈反馈维度</div>
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-3 py-2.5 rounded-xl transition-all ${activeTab === tab.id ? 'bg-primary-50 text-primary-600 font-bold shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              <tab.icon size={18} className="mr-3" />
              <span className="text-sm">{tab.label}</span>
              {activeTab === tab.id && <ChevronRight size={14} className="ml-auto" />}
            </button>
          ))}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'summary' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
                  <div className="flex items-center mb-6">
                    <div className="p-2 bg-purple-100 text-purple-600 rounded-lg mr-3">
                      <Sparkles size={24} />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900">AI 智能面谈纪要</h3>
                  </div>
                  <div className="prose prose-blue max-w-none text-gray-600 leading-relaxed space-y-4">
                    <p>本次绩效面谈于 {session.date} 进行，整体氛围积极建设性。核心讨论点如下：</p>
                    <div className="bg-blue-50/50 rounded-xl p-5 border border-blue-100">
                      <h4 className="font-bold text-blue-900 mb-3 flex items-center"><CheckCircle2 size={16} className="mr-2"/> 达成共识事项</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-blue-800/80">
                        <li>确认 Q4 绩效等级为 A，核心项目 A10 表现优异获得认可。</li>
                        <li>针对“跨部门协作”中的认知偏差达成了一致改进方案。</li>
                        <li>下个周期的重点将向“新产品孵化”倾斜，权重调整为 40%。</li>
                      </ul>
                    </div>
                    <div className="bg-orange-50/50 rounded-xl p-5 border border-orange-100">
                      <h4 className="font-bold text-orange-900 mb-3 flex items-center"><PenLine size={16} className="mr-2"/> 后续行动计划</h4>
                      <ul className="list-disc list-inside space-y-2 text-sm text-orange-800/80">
                        <li>员工：在下周五前输出团队沟通 SOP 初稿。</li>
                        <li>经理：协助协调资源，提供跨部门流程优化的支持。</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'form' && (
              <div className="animate-in fade-in slide-in-from-bottom-2 space-y-6">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-8 py-5 border-b border-gray-100 flex justify-between items-center bg-gray-50/30">
                    <h3 className="text-lg font-bold text-gray-800">绩效面谈反馈记录</h3>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold border ${config.formPermission === 'edit' ? 'bg-blue-50 text-blue-600 border-blue-100' : 'bg-gray-100 text-gray-500 border-gray-200'}`}>
                      {config.formPermission === 'edit' ? '允许补充/说明' : '只读视图'}
                    </span>
                  </div>
                  <div className="p-8 space-y-8">
                    {template.sections.map(section => (
                      <div key={section.id}>
                        <h4 className="text-sm font-bold text-gray-900 mb-4 flex items-center">
                          <div className="w-1 h-3 bg-primary rounded-full mr-2"></div> {section.title}
                        </h4>
                        <div className="space-y-4">
                          {section.fields.map(field => (
                            <div key={field.id} className="bg-gray-50/50 p-4 rounded-xl border border-gray-100">
                              <label className="text-xs font-bold text-gray-400 block mb-2">{field.label}</label>
                              <div className="text-sm text-gray-700 leading-relaxed italic">
                                {session.content?.[field.id] || '[面谈官未填写]'}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}

                    {config.formPermission === 'edit' && (
                      <div className="pt-6 border-t border-gray-100">
                        <label className="text-sm font-bold text-gray-900 block mb-3 flex items-center">
                          <Edit3 size={16} className="mr-2 text-primary" /> 员工个人总结与确认说明
                        </label>
                        <textarea
                          value={employeeFeedback}
                          onChange={(e) => setEmployeeFeedback(e.target.value)}
                          className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-primary outline-none min-h-[120px] transition-all bg-gray-50/30 hover:bg-white"
                          placeholder="针对以上面谈结果，如有任何补充说明请在此输入..."
                        ></textarea>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'info' && (
              <div className="p-0 h-full"><div className="bg-white p-8 rounded-2xl border">正在加载员工基本信息...</div></div>
            )}

            {activeTab === 'ref' && (
              <div className="h-full">
                <AssessmentDetailTable detail={assessmentDetail} period={session.assessmentCycle || '当前周期'} />
              </div>
            )}

            {activeTab === 'replay' && (
              <div className="bg-black rounded-2xl aspect-video flex items-center justify-center text-white text-sm font-medium">
                面谈视频回放已就绪，仅限本人查看
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      {showSignatureModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-gray-900">请完成确认签名</h3>
              <button onClick={() => setShowSignatureModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <div className="p-8">
              {session.signatureType === 'handwritten' ? (
                <div className="space-y-4">
                  <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl h-64 flex items-center justify-center text-gray-400 cursor-crosshair">
                    在此处手写签名
                  </div>
                  <p className="text-xs text-gray-500 text-center">签署即视为本人确认并同意上述绩效面谈结果</p>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="flex items-start space-x-4 p-4 bg-blue-50 rounded-xl border border-blue-100">
                    <ShieldCheck size={24} className="text-blue-600 shrink-0 mt-1" />
                    <div>
                      <h4 className="font-bold text-blue-900 text-sm">电子签章认证</h4>
                      <p className="text-xs text-blue-800/70 mt-1 leading-relaxed">
                        您将使用企业级电子签章完成本次确认，法律效力等同于纸质签名。系统将记录签署时的 IP 地址与时间戳。
                      </p>
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-500">签署人</span>
                      <span className="font-bold text-gray-900">{session.employeeName}</span>
                    </div>
                    <div className="flex justify-between text-sm py-2 border-b">
                      <span className="text-gray-500">签署时间</span>
                      <span className="font-mono text-gray-900">{new Date().toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="px-6 py-5 bg-gray-50 border-t border-gray-100 flex justify-end space-x-3">
              <button onClick={() => setShowSignatureModal(false)} className="px-5 py-2 text-gray-600 font-medium hover:underline">取消</button>
              <button 
                onClick={handleSignatureSubmit}
                className="px-8 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg shadow-gray-200"
              >
                确认签署并提交
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reject Modal */}
      {isRejecting && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-4 text-red-600">
                <AlertTriangle size={24} />
                <h3 className="text-lg font-bold">确定要退回修正吗？</h3>
              </div>
              <textarea
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-4 text-sm focus:ring-2 focus:ring-red-500 outline-none min-h-[100px]"
                placeholder="请输入退回修正的理由..."
              ></textarea>
              <p className="text-xs text-gray-500 mt-4 leading-relaxed">退回后，任务状态将变更为“进行中”，面谈官将收到通知进行重新反馈。</p>
            </div>
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3 border-t">
              <button onClick={() => setIsRejecting(false)} className="px-4 py-2 text-gray-600 font-medium">取消</button>
              <button onClick={handleReject} className="px-6 py-2 bg-red-600 text-white rounded-xl text-sm font-bold hover:bg-red-700">确认退回</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InterviewConfirmationView;
