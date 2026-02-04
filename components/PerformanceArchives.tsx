
import React, { useState } from 'react';
import { 
    Search, Filter, ChevronRight, Download, Eye, 
    User, Settings, ChevronDown, MoreHorizontal,
    Maximize2, SlidersHorizontal, ChevronLeft, AlertCircle,
    CheckCircle2, Clock, FileText, Building2
} from 'lucide-react';
import { MOCK_EMPLOYEES } from '../constants';

const PerformanceArchives: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'tasks' | 'objects'>('tasks');
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());

    // --- Mock Data ---

    // Mock Data for "By Assessment Object" (按考核对象 - Employee Assessment Records)
    // Updated to match the new column specification
    const objectData = [
        { 
            id: 'r1', 
            name: '李莎', 
            empId: 'GH00027', 
            deptPath: '产研中心/产品部/B端产品组', 
            position: '高级产品经理', 
            cycle: '2025-06', 
            taskName: '2025 Q2 产研中心绩效考核', 
            score: '92.5', 
            grade: 'A', 
            interviewStatus: 'completed', 
            interviewCount: 1, 
            lastInterviewDate: '2025-07-10', 
            isOrgAssessment: false 
        },
        { 
            id: 'r2', 
            name: '王森', 
            empId: 'GH00035', 
            deptPath: '营销中心/销售部/华南大区', 
            position: '销售总监', 
            cycle: '2025-06', 
            taskName: '2025 Q2 销售业绩冲刺考核', 
            score: '98.0', 
            grade: 'S', 
            interviewStatus: 'completed', 
            interviewCount: 2, 
            lastInterviewDate: '2025-07-12', 
            isOrgAssessment: false 
        },
        { 
            id: 'r3', 
            name: '张妮', 
            empId: 'GH00102', 
            deptPath: '职能中心/人力资源部', 
            position: 'HRBP', 
            cycle: '2025-06', 
            taskName: '2025 Q2 职能部门绩效', 
            score: '85.0', 
            grade: 'B+', 
            interviewStatus: 'pending', 
            interviewCount: 0, 
            lastInterviewDate: '-', 
            isOrgAssessment: false 
        },
        { 
            id: 'r4', 
            name: '陈飞', 
            empId: 'GH00338', 
            deptPath: '产研中心/云演示组', 
            position: '工程师', 
            cycle: '2025-06', 
            taskName: '2025 Q2 产研中心绩效考核', 
            score: '72.0', 
            grade: 'C', 
            interviewStatus: 'completed', 
            interviewCount: 1, 
            lastInterviewDate: '2025-07-15', 
            isOrgAssessment: false 
        },
        { 
            id: 'r5', 
            name: '深圳直营办事处', 
            empId: 'ORG001', 
            deptPath: '营销中心/直营体系', 
            position: '-', 
            cycle: '2025-06', 
            taskName: '2025 Q2 组织效能评估', 
            score: '88.0', 
            grade: 'B', 
            interviewStatus: 'not_required', 
            interviewCount: 0, 
            lastInterviewDate: '-', 
            isOrgAssessment: true 
        },
        { 
            id: 'r6', 
            name: '李莎', 
            empId: 'GH00027', 
            deptPath: '产研中心/产品部/B端产品组', 
            position: '高级产品经理', 
            cycle: '2025-03', 
            taskName: '2025 Q1 产研中心绩效考核', 
            score: '89.0', 
            grade: 'A', 
            interviewStatus: 'completed', 
            interviewCount: 1, 
            lastInterviewDate: '2025-04-10', 
            isOrgAssessment: false 
        },
        { 
            id: 'r7', 
            name: '赵小云', 
            empId: 'GH00451', 
            deptPath: '产研中心/设计部', 
            position: 'UI设计师', 
            cycle: '2025-06', 
            taskName: '2025 试用期转正评估', 
            score: '90.5', 
            grade: 'A', 
            interviewStatus: 'completed', 
            interviewCount: 1, 
            lastInterviewDate: '2025-06-20', 
            isOrgAssessment: false 
        },
        { 
            id: 'r8', 
            name: '刘强', 
            empId: 'GH00156', 
            deptPath: '营销中心/市场部', 
            position: '市场经理', 
            cycle: '2025-06', 
            taskName: '2025 Q2 市场推广专项考核', 
            score: '60.0', 
            grade: 'D', 
            interviewStatus: 'pending', 
            interviewCount: 0, 
            lastInterviewDate: '-', 
            isOrgAssessment: false 
        },
    ];

    // Mock Data for "By Task" (按考核任务 - Task View Aggregated)
    const taskData = [
        { 
            id: 't1', 
            taskName: '2025 Q4 绩效考核', 
            cycle: '2025-10-01 ~ 2025-12-31', 
            coveredCount: 359, 
            ratedCount: 350, 
            requiredInterviewCount: 359, 
            completedInterviewCount: 45, 
            abnormalCount: 2, 
            status: '执行中' 
        },
        { 
            id: 't2', 
            taskName: '2025 Q3 绩效考核', 
            cycle: '2025-07-01 ~ 2025-09-30', 
            coveredCount: 340, 
            ratedCount: 340, 
            requiredInterviewCount: 300, 
            completedInterviewCount: 300, 
            abnormalCount: 0, 
            status: '已归档' 
        },
        { 
            id: 't3', 
            taskName: '销售部专项激励考核 (8月)', 
            cycle: '2025-08', 
            coveredCount: 120, 
            ratedCount: 118, 
            requiredInterviewCount: 120, 
            completedInterviewCount: 110, 
            abnormalCount: 5, 
            status: '执行中' 
        },
        { 
            id: 't4', 
            taskName: '2025 试用期转正评估', 
            cycle: '2025 年度', 
            coveredCount: 45, 
            ratedCount: 40, 
            requiredInterviewCount: 45, 
            completedInterviewCount: 38, 
            abnormalCount: 1, 
            status: '执行中' 
        },
        { 
            id: 't5', 
            taskName: '研发中心 Q2 项目考核', 
            cycle: '2025 Q2', 
            coveredCount: 80, 
            ratedCount: 80, 
            requiredInterviewCount: 80, 
            completedInterviewCount: 80, 
            abnormalCount: 0, 
            status: '已归档' 
        },
        { 
            id: 't6', 
            taskName: '2024 年度综合绩效', 
            cycle: '2024-01-01 ~ 2024-12-31', 
            coveredCount: 320, 
            ratedCount: 320, 
            requiredInterviewCount: 320, 
            completedInterviewCount: 315, 
            abnormalCount: 0, 
            status: '已归档' 
        }
    ];

    const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.checked) {
            const allIds = activeTab === 'tasks' ? taskData.map(t => t.id) : objectData.map(o => o.id);
            setSelectedIds(new Set(allIds));
        } else {
            setSelectedIds(new Set());
        }
    };

    const handleCheckboxChange = (id: string) => {
        const newSelected = new Set(selectedIds);
        if (newSelected.has(id)) newSelected.delete(id);
        else newSelected.add(id);
        setSelectedIds(newSelected);
    };

    // Helper: Render Grade Tag
    const renderGradeTag = (grade: string) => {
        let style = "bg-gray-100 text-gray-600 border-gray-200";
        if (['S', 'A', 'A+'].includes(grade)) style = "bg-green-50 text-green-700 border-green-200";
        if (['B+', 'B'].includes(grade)) style = "bg-blue-50 text-blue-700 border-blue-200";
        if (['C', 'D'].includes(grade)) style = "bg-orange-50 text-orange-700 border-orange-200";
        
        return <span className={`px-2 py-0.5 rounded text-xs font-bold border ${style}`}>{grade}</span>;
    };

    // Helper: Render Status Tag
    const renderStatusTag = (status: string) => {
        const map: Record<string, any> = {
            'completed': { label: '已完成', style: 'text-green-600 bg-green-50' },
            'pending': { label: '待面谈', style: 'text-orange-600 bg-orange-50' },
            'not_required': { label: '无需面谈', style: 'text-gray-400 bg-gray-100' }
        };
        const config = map[status] || map['not_required'];
        return <span className={`px-2 py-0.5 rounded text-xs font-medium ${config.style}`}>{config.label}</span>;
    };

    // Render Table Content
    const renderTable = () => {
        if (activeTab === 'objects') {
            return (
                <table className="w-full text-left border-collapse text-sm">
                    <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                        <tr>
                            <th className="p-3 w-12 text-center">
                                <input type="checkbox" className="rounded text-primary focus:ring-primary cursor-pointer" onChange={handleSelectAll} />
                            </th>
                            <th className="p-3 font-medium">员工姓名</th>
                            <th className="p-3 font-medium">部门全路径</th>
                            <th className="p-3 font-medium">职位</th>
                            <th className="p-3 font-medium">绩效周期</th>
                            <th className="p-3 font-medium">考核任务</th>
                            <th className="p-3 font-medium">最终得分</th>
                            <th className="p-3 font-medium">绩效等级</th>
                            <th className="p-3 font-medium">面谈状态</th>
                            <th className="p-3 font-medium text-center">面谈次数</th>
                            <th className="p-3 font-medium">最近面谈时间</th>
                            <th className="p-3 font-medium">组织考核标识</th>
                            <th className="p-3 font-medium text-right">操作</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 bg-white">
                        {objectData.map((item) => (
                            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group cursor-pointer">
                                <td className="p-3 text-center">
                                    <input type="checkbox" className="rounded text-primary focus:ring-primary cursor-pointer" checked={selectedIds.has(item.id)} onChange={() => handleCheckboxChange(item.id)} />
                                </td>
                                <td className="p-3">
                                    <div className="flex flex-col">
                                        <span className="text-gray-900 font-medium">{item.name}</span>
                                        <span className="text-[10px] text-gray-400 font-mono">{item.empId}</span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    <div className="text-gray-600 truncate max-w-[180px]" title={item.deptPath}>{item.deptPath}</div>
                                </td>
                                <td className="p-3 text-gray-700">{item.position}</td>
                                <td className="p-3 text-gray-700 font-medium">{item.cycle}</td>
                                <td className="p-3">
                                    <div className="text-gray-700 truncate max-w-[150px]" title={item.taskName}>{item.taskName}</div>
                                </td>
                                <td className="p-3 text-gray-900 font-bold">{item.score}</td>
                                <td className="p-3">
                                    {renderGradeTag(item.grade)}
                                </td>
                                <td className="p-3">
                                    {renderStatusTag(item.interviewStatus)}
                                </td>
                                <td className="p-3 text-center">
                                    {item.interviewCount > 0 ? (
                                        <span className="text-blue-600 font-medium cursor-pointer hover:underline">{item.interviewCount}</span>
                                    ) : (
                                        <span className="text-gray-300">-</span>
                                    )}
                                </td>
                                <td className="p-3 text-gray-500 text-xs">{item.lastInterviewDate}</td>
                                <td className="p-3">
                                    {item.isOrgAssessment ? (
                                        <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] bg-purple-50 text-purple-700 border border-purple-100">
                                            <Building2 size={10} className="mr-1" /> 是
                                        </span>
                                    ) : (
                                        <span className="text-gray-300 text-xs">否</span>
                                    )}
                                </td>
                                <td className="p-3 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline">
                                        查看
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            );
        }

        // Tasks Table (Aggregated View)
        return (
            <table className="w-full text-left border-collapse text-sm">
                <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-200">
                    <tr>
                        <th className="p-3 w-12 text-center">
                            <input type="checkbox" className="rounded text-primary focus:ring-primary cursor-pointer" onChange={handleSelectAll} />
                        </th>
                        <th className="p-3 font-medium">考核任务名称</th>
                        <th className="p-3 font-medium">考核周期</th>
                        <th className="p-3 font-medium">覆盖人数</th>
                        <th className="p-3 font-medium">已评分人数</th>
                        <th className="p-3 font-medium font-bold text-gray-900">需面谈人数</th>
                        <th className="p-3 font-medium font-bold text-gray-900">已完成面谈</th>
                        <th className="p-3 font-medium font-bold text-gray-900 w-48">面谈完成率</th>
                        <th className="p-3 font-medium">异常面谈</th>
                        <th className="p-3 font-medium">当前状态</th>
                        <th className="p-3 font-medium text-right">操作</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 bg-white">
                    {taskData.map((item) => {
                        const completionRate = Math.round((item.completedInterviewCount / (item.requiredInterviewCount || 1)) * 100);
                        return (
                            <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                                <td className="p-3 text-center">
                                    <input type="checkbox" className="rounded text-primary focus:ring-primary cursor-pointer" checked={selectedIds.has(item.id)} onChange={() => handleCheckboxChange(item.id)} />
                                </td>
                                <td className="p-3">
                                    <span className="text-blue-600 font-medium hover:underline cursor-pointer">{item.taskName}</span>
                                </td>
                                <td className="p-3 text-gray-600 text-xs">{item.cycle}</td>
                                <td className="p-3 text-gray-700">{item.coveredCount}</td>
                                <td className="p-3 text-gray-700">{item.ratedCount}</td>
                                <td className="p-3 text-gray-900 font-bold">{item.requiredInterviewCount}</td>
                                <td className="p-3">
                                    <span className="text-blue-600 hover:underline cursor-pointer font-bold">{item.completedInterviewCount}</span>
                                </td>
                                <td className="p-3">
                                    <div className="flex items-center">
                                        <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden mr-2">
                                            <div 
                                                className={`h-full rounded-full transition-all duration-500 ${completionRate >= 100 ? 'bg-green-500' : 'bg-blue-500'}`} 
                                                style={{ width: `${Math.min(100, completionRate)}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-xs text-gray-600 w-8 text-right font-medium">{completionRate}%</span>
                                    </div>
                                </td>
                                <td className="p-3">
                                    {item.abnormalCount > 0 ? (
                                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-50 text-red-600 border border-red-100">
                                            <AlertCircle size={10} className="mr-1" />
                                            {item.abnormalCount} 异常
                                        </span>
                                    ) : (
                                        <span className="text-gray-400">-</span>
                                    )}
                                </td>
                                <td className="p-3">
                                    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border ${
                                        item.status === '执行中' 
                                        ? 'bg-blue-50 text-blue-600 border-blue-100' 
                                        : 'bg-gray-100 text-gray-500 border-gray-200'
                                    }`}>
                                        {item.status}
                                    </span>
                                </td>
                                <td className="p-3 text-right">
                                    <button className="text-blue-600 hover:text-blue-800 text-xs font-medium hover:underline">
                                        进入
                                    </button>
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        );
    };

    return (
        <div className="flex flex-col h-full bg-white">
            {/* Top Navigation Bar */}
            <div className="h-12 border-b border-gray-200 flex items-center px-4 space-x-6">
                <button 
                    onClick={() => setActiveTab('tasks')}
                    className={`h-full text-sm font-medium px-2 border-b-2 transition-colors ${activeTab === 'tasks' ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
                >
                    按任务
                </button>
                <button 
                    onClick={() => setActiveTab('objects')}
                    className={`h-full text-sm font-medium px-2 border-b-2 transition-colors ${activeTab === 'objects' ? 'border-primary text-primary' : 'border-transparent text-gray-600 hover:text-gray-800'}`}
                >
                    按考核对象
                </button>
            </div>

            {/* Filter & Action Bar */}
            <div className="px-4 py-3 border-b border-gray-200 flex justify-between items-center bg-gray-50/30">
                <div className="flex space-x-2">
                    <button className="px-3 py-1.5 bg-white border border-primary text-primary text-sm rounded hover:bg-primary-50 transition-colors shadow-sm">
                        员工考核
                    </button>
                    <button className="px-3 py-1.5 bg-white border border-gray-300 text-gray-600 text-sm rounded hover:bg-gray-50 transition-colors shadow-sm">
                        组织考核
                    </button>
                </div>

                <div className="flex items-center space-x-3">
                    <button className="px-3 py-1.5 bg-white border border-green-200 text-green-600 text-sm rounded hover:bg-green-50 transition-colors shadow-sm flex items-center">
                        <Download size={14} className="mr-1.5" /> 导出
                    </button>
                    <button className="p-1.5 bg-white border border-gray-300 text-gray-500 rounded hover:bg-gray-50 transition-colors shadow-sm">
                        <Filter size={16} />
                    </button>
                    <button className="p-1.5 bg-white border border-gray-300 text-gray-500 rounded hover:bg-gray-50 transition-colors shadow-sm">
                        <Settings size={16} />
                    </button>
                    <button className="p-1.5 bg-white border border-gray-300 text-gray-500 rounded hover:bg-gray-50 transition-colors shadow-sm">
                        <Maximize2 size={16} />
                    </button>
                </div>
            </div>

            {/* Secondary Filter Bar (Search) */}
            <div className="px-4 py-2 border-b border-gray-200 flex justify-end items-center bg-white">
                <div className="flex items-center space-x-2">
                    <div className="relative">
                        <select className="appearance-none pl-3 pr-8 py-1.5 bg-white border border-gray-300 rounded text-sm text-gray-600 focus:outline-none focus:border-primary hover:border-gray-400 transition-colors cursor-pointer">
                            <option>{activeTab === 'tasks' ? '考核周期' : '绩效周期'}</option>
                            <option>{activeTab === 'tasks' ? '任务状态' : '职位'}</option>
                            <option>部门</option>
                        </select>
                        <ChevronDown className="absolute right-2 top-2.5 text-gray-400 pointer-events-none" size={14} />
                    </div>
                    <div className="relative">
                        <input 
                            type="text" 
                            placeholder={activeTab === 'tasks' ? "搜索考核任务名称" : "搜索员工、工号、部门"}
                            className="pl-3 pr-8 py-1.5 border border-gray-300 rounded text-sm w-64 focus:outline-none focus:border-primary hover:border-gray-400 transition-colors"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                        <Search className="absolute right-2.5 top-2.5 text-gray-400" size={14} />
                    </div>
                </div>
            </div>

            {/* Table Content */}
            <div className="flex-1 overflow-auto custom-scrollbar">
                {renderTable()}
            </div>

            {/* Pagination Footer */}
            <div className="px-4 py-3 border-t border-gray-200 flex justify-end items-center space-x-2 bg-white text-xs text-gray-600">
                <button className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50 disabled:opacity-50">
                    <ChevronLeft size={14} />
                </button>
                <button className="w-7 h-7 flex items-center justify-center border border-primary text-primary bg-primary-50 rounded">1</button>
                <button className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">2</button>
                <button className="w-7 h-7 flex items-center justify-center border border-gray-300 rounded hover:bg-gray-50">
                    <ChevronRight size={14} />
                </button>
                <select className="border border-gray-300 rounded py-1 px-2 focus:outline-none">
                    <option>100 条/页</option>
                    <option>50 条/页</option>
                    <option>20 条/页</option>
                </select>
                <span>跳至</span>
                <input type="text" className="w-10 border border-gray-300 rounded py-1 px-1 text-center" />
                <span>页</span>
            </div>
        </div>
    );
};

export default PerformanceArchives;
