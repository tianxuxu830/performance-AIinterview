
import { Employee, InterviewSession, InterviewTemplate, Status, InterviewType, PerformanceRecord, AssessmentItem, AssessmentDetail, PerformanceTrend, HistoricalRecord } from './types';

export const MOCK_EMPLOYEES: Employee[] = [
  { id: '1', name: '李莎', department: '产品部', role: '高级产品经理', avatar: 'https://picsum.photos/id/64/100/100' },
  { id: '2', name: '王森', department: '销售部', role: '销售总监', avatar: 'https://picsum.photos/id/91/100/100' },
  { id: '3', name: '张妮', department: '人力资源部', role: 'HRBP', avatar: 'https://picsum.photos/id/177/100/100' },
  { id: '4', name: '陈飞', department: '云演示组', role: '工程师', avatar: 'https://picsum.photos/id/338/100/100' },
];

export const MOCK_TEMPLATES: InterviewTemplate[] = [
  {
    id: 't_gap',
    name: '差距及改进 (Gap Analysis)',
    description: '通过对比目标与实际情况，分析原因并制定改进计划。',
    status: 'active',
    sections: [
        {
            id: 's1',
            title: '差距分析',
            description: '表格视图',
            viewType: 'table',
            columns: 1,
            fields: [
                { id: 'f1_1', label: '绩效目标', type: 'textarea', required: true, width: 'one-third', placeholder: '请输入目标' },
                { id: 'f1_2', label: '实际完成情况', type: 'textarea', required: true, width: 'one-third', placeholder: '请输入完成情况' },
                { id: 'f1_3', label: '原因分析', type: 'textarea', required: false, width: 'one-third', placeholder: '请输入原因' },
            ]
        },
        {
            id: 's2',
            title: '改进计划',
            description: '表单视图 (3列)',
            viewType: 'form',
            columns: 3,
            fields: [
                { id: 'f2_1', label: '改进计划', type: 'textarea', required: true, width: 'one-third', placeholder: '请输入计划' },
                { id: 'f2_2', label: '完成标准与时间', type: 'textarea', required: true, width: 'one-third', placeholder: '请输入标准与时间' },
                { id: 'f2_3', label: '所需资源', type: 'textarea', required: false, width: 'one-third', placeholder: '请输入资源' },
            ]
        },
        {
            id: 's3',
            title: '备注',
            viewType: 'form',
            columns: 1,
            fields: [
                { id: 'f3_1', label: '备注信息', type: 'textarea', required: false, width: 'full', placeholder: '请输入' }
            ]
        },
        {
            id: 's4',
            title: '附件',
            viewType: 'form',
            columns: 1,
            fields: [
                { id: 'f4_1', label: '上传附件', type: 'attachment', required: false, width: 'full' }
            ]
        }
    ]
  },
  {
    id: 't_hamburger',
    name: '汉堡法则 (Hamburger Method)',
    description: '采用"表扬-指出不足-鼓励"的沟通方式，更易于员工接受。',
    status: 'active',
    sections: [
        {
            id: 's1',
            title: '工作优异之处',
            viewType: 'form',
            columns: 1,
            fields: [
                { id: 'f1', label: '工作优异之处', type: 'textarea', required: true, width: 'full', placeholder: '员工在达成目标过程中表现出来的优势和能力' },
            ]
        },
        {
            id: 's2',
            title: '存在的不足',
            viewType: 'form',
            columns: 1,
            fields: [
                { id: 'f2', label: '存在的不足', type: 'textarea', required: true, width: 'full', placeholder: '帮助员工分析工作中存在的不足和亟待提升的能力' },
            ]
        },
        {
            id: 's3',
            title: '改进建议与期望',
            viewType: 'form',
            columns: 1,
            fields: [
                { id: 'f3', label: '改进建议与期望', type: 'textarea', required: true, width: 'full', placeholder: '了解员工的个人发展需求，提出对于员工的改进与发展建议，与员工共同确定能力提升计划' },
            ]
        },
        {
            id: 's4',
            title: '附件',
            viewType: 'form',
            columns: 1,
            fields: [
                { id: 'f4', label: '上传附件', type: 'attachment', required: false, width: 'full' }
            ]
        }
    ]
  },
  {
    id: 't1',
    name: '季度绩效面谈 (标准版)',
    description: '用于季度回顾的标准模板，重点关注 OKR 完成情况和核心价值观。',
    status: 'active',
    sections: [
        {
            id: 's1',
            title: '绩效回顾',
            viewType: 'form',
            columns: 2,
            fields: [
                { id: 'f1', label: '绩效综述', type: 'textarea', required: true, width: 'full', placeholder: '请简述员工本季度的整体表现...' },
                { id: 'f2', label: '主要成就', type: 'textarea', required: true, width: 'half', placeholder: '列举 1-3 项关键产出...' },
                { id: 'f3', label: '待改进领域', type: 'textarea', required: true, width: 'half', placeholder: '指出需要提升的能力或行为...' },
            ]
        },
        {
            id: 's2',
            title: '未来规划',
            viewType: 'form',
            columns: 1,
            fields: [
                { id: 'f4', label: '下季度目标', type: 'textarea', required: true, width: 'full', placeholder: '初步设定的核心目标...' },
            ]
        }
    ]
  },
  {
    id: 't2',
    name: '试用期转正评估',
    description: '针对新员工试用期结束时的综合评估。',
    status: 'active',
    sections: [
        {
            id: 's1',
            title: '评估内容',
            viewType: 'form',
            columns: 2,
            fields: [
                { id: 'p1', label: '文化契合度', type: 'rating', required: true, width: 'half' },
                { id: 'p2', label: '岗位胜任力', type: 'textarea', required: true, width: 'full' },
            ]
        }
    ]
  }
];

export const MOCK_PERFORMANCE_RECORDS: PerformanceRecord[] = [
  {
    id: 'perf_001',
    employeeId: '1', // 李莎
    period: '2025 Q4',
    overallScore: 88.5,
    grade: 'A',
    status: Status.Completed,
    kpiScore: 92,
    okrScore: 85
  },
  {
    id: 'perf_002',
    employeeId: '2', // 王森
    period: '2025 Q4',
    overallScore: 95.0,
    grade: 'S',
    status: Status.Completed,
    kpiScore: 98,
    okrScore: 92
  },
  {
    id: 'perf_003',
    employeeId: '3', // 张妮
    period: '2025 Q4',
    overallScore: 78.0,
    grade: 'B',
    status: Status.Completed,
    kpiScore: 80,
    okrScore: 76
  },
  {
    id: 'perf_004',
    employeeId: '4', // 陈飞
    period: '2025 Q4',
    overallScore: 58.0,
    grade: 'C',
    status: Status.Completed,
    kpiScore: 60,
    okrScore: 55
  }
];

export const MOCK_SESSIONS: InterviewSession[] = [
  {
    id: 'int_003',
    employeeId: '4',
    employeeName: '陈飞',
    managerName: '刘工',
    date: '2026-01-09 09:00', // Set to Jan 2026
    period: '转正评估',
    status: Status.NotStarted,
    type: InterviewType.Probation,
    method: 'appointment',
    templateId: 't2',
    linkedAssessmentId: 'perf_003',
    assessmentCycle: '试用期评估',
    schedulingStatus: 'scheduled',
    gradeTag: 'C',
    department: '云演示组',
    riskTag: 'high_risk'
  },
  {
    id: 'int_006',
    employeeId: '4',
    employeeName: '陈飞',
    managerName: '刘工',
    date: '2026-01-09 10:00',
    period: '项目复盘',
    status: Status.NotStarted,
    type: InterviewType.Regular,
    method: 'appointment',
    templateId: 't1',
    schedulingStatus: 'scheduled',
    gradeTag: '',
    department: '云演示组',
    riskTag: 'normal'
  },
  {
    id: 'int_001',
    employeeId: '1',
    employeeName: '李莎',
    managerName: '张伟',
    date: '2026-01-15 10:00',
    period: '2025 Q4 绩效考核',
    status: Status.Completed,
    type: InterviewType.Regular,
    method: 'appointment',
    templateId: 't_gap', 
    linkedAssessmentId: 'perf_001',
    assessmentCycle: '2025 Q4',
    schedulingStatus: 'scheduled',
    gradeTag: 'A',
    department: '产品部',
    riskTag: 'normal'
  },
  {
    id: 'int_002',
    employeeId: '2',
    employeeName: '王森',
    managerName: '王总',
    date: '2026-01-18 14:30',
    period: '2025 Q4 绩效考核',
    status: Status.InProgress,
    type: InterviewType.Regular,
    method: 'direct', // Direct feedback type
    templateId: 't_hamburger',
    linkedAssessmentId: 'perf_002',
    assessmentCycle: '2025 Q4',
    schedulingStatus: 'scheduled',
    gradeTag: 'S',
    department: '销售部',
    riskTag: 'normal'
  },
  {
    id: 'int_004',
    employeeId: '4',
    employeeName: '陈飞',
    managerName: '刘工',
    date: '',
    period: 'PIP 改进沟通',
    status: Status.NotStarted,
    type: InterviewType.PIP,
    method: 'appointment',
    templateId: 't1',
    schedulingStatus: 'pending',
    deadline: '2026-01-25',
    gradeTag: 'C',
    assessmentCycle: '2025 Q4',
    department: '云演示组',
    riskTag: 'high_risk'
  },
  {
    id: 'int_005',
    employeeId: '3',
    employeeName: '张妮',
    managerName: 'Lisa',
    date: '',
    period: '2025 Q4 绩效考核',
    status: Status.NotStarted,
    type: InterviewType.Regular,
    method: 'direct',
    templateId: 't1',
    linkedAssessmentId: 'perf_003',
    assessmentCycle: '2025 Q4',
    schedulingStatus: 'pending',
    deadline: '2026-01-12',
    gradeTag: 'B',
    department: '人力资源部',
    riskTag: 'controversial'
  }
];

export const MOCK_ASSESSMENTS: AssessmentItem[] = [
  {
    id: 'a1',
    employeeId: 'u1',
    employeeName: '熊静',
    role: '经理',
    employeeStatus: '在职',
    currentStage: '自评',
    processStatus: '进行中',
    handler: '熊静',
    group: 'tests',
    templateName: '员工PBC',
    indicatorTemplate: '默认指标模板',
    score: 0.00,
    grade: 'D'
  },
  {
    id: 'a5',
    employeeId: '1',
    employeeName: '李莎',
    role: '高级产品经理',
    employeeStatus: '在职',
    currentStage: '结果校准',
    processStatus: '进行中',
    handler: '刘老师, 李艳红',
    group: 'tests',
    templateName: '员工PBC',
    indicatorTemplate: '默认指标模板',
    score: 88.50,
    grade: 'A'
  },
];

// Expanded for new insight features
export interface ExtendedAssessmentDetail extends AssessmentDetail {
  clarifications?: { id: string; content: string }[];
  trend?: string; // e.g., 'up', 'down', 'stable'
  benchmark?: number; // Percentile
}

export const MOCK_ASSESSMENT_DETAILS: Record<string, ExtendedAssessmentDetail> = {
  '1': { 
    id: 'ad_1',
    description: '本年度的绩效考核分为两个部分：OKR（70%）和 KPI（30%）。',
    highlights: [
        { id: 'h1', name: '提升品牌知名度 (OKR)', selfScore: 100, managerScore: 98, weight: 20 },
        { id: 'h2', name: '客户满意度 (KPI)', selfScore: 4.8, managerScore: 4.9, weight: 10, description: '客户反馈评分' }
    ],
    improvements: [
        { id: 'i1', name: '优化生产供应链效率 (OKR)', selfScore: 80, managerScore: 75, weight: 20 }
    ],
    controversies: [
        { id: 'c1', name: '累计签单 (KPI)', selfScore: 100, managerScore: 75, weight: 30, description: '自评认为已达成，但部分回款未到账' }
    ],
    clarifications: [
        { id: 'cl1', content: '关于【团队协作】：经理评价提到“响应速度慢”，员工自评提到“多次即使响应紧急需求”。存在事实认定分歧。' }
    ],
    trend: 'down',
    benchmark: 82,
    attachments: [
        { id: 'att1', name: 'Q3_项目总结报告.pdf', type: 'pdf', url: '#', size: '2.4MB' },
        { id: 'att2', name: '客户好评截图.img', type: 'img', url: '#', size: '450KB' }
    ],
    okrWeight: 70,
    kpiWeight: 30,
    okrs: [
        {
            id: 'okr1', sequence: 1, name: '提升品牌知名度', weight: 40,
            krs: [{ content: '全渠道曝光量达到 1000w' }, { content: '品牌搜索指数提升 20%' }, { content: '完成 3 次大型公关活动' }]
        },
        {
            id: 'okr2', sequence: 2, name: '优化生产供应链效率', weight: 30,
            krs: [{ content: '库存周转率提升至 5.0' }, { content: '供应链响应时间缩短 10%' }, { content: '-' }]
        }
    ],
    kpis: [
        {
            id: 'kpi1', sequence: 1, name: '累计签单额', description: 'Q3 累计完成销售合同签订金额', evaluationMethod: '达成率 * 权重', weight: 20, targetValue: '500w'
        },
        {
             id: 'kpi2', sequence: 2, name: '客户满意度', description: '客户满意度调研评分平均值', evaluationMethod: '直接评分', weight: 10, targetValue: '4.8分'
        }
    ]
  },
  'default': {
    id: 'ad_default',
    description: '常规绩效考核周期，重点考察业务产出与团队协作。',
    highlights: [
        { id: 'h1', name: '出勤率', selfScore: 100, managerScore: 100, weight: 10 }
    ],
    improvements: [
        { id: 'i1', name: '核心业务指标完成度', selfScore: 80, managerScore: 70, weight: 60 }
    ],
    controversies: [
        { id: 'c1', name: '评价冲突', selfScore: 100, managerScore: 100, weight: 0, description: '自评语：“本季度主要在摸索阶段，产出有限”，但自评分数：100分。' }
    ],
    clarifications: [
        { id: 'cl1', content: '关于【主动性】：自评中提到发起了3个新项目，但经理评价中未体现。' }
    ],
    trend: 'stable',
    benchmark: 60,
    attachments: [],
    okrWeight: 60,
    kpiWeight: 40,
    okrs: [],
    kpis: []
  }
};

export const MOCK_PERFORMANCE_TRENDS: Record<string, PerformanceTrend[]> = {
    '1': [
        { period: '2025 Q1', score: 82, grade: 'B+' },
        { period: '2025 Q2', score: 85, grade: 'A' },
        { period: '2025 Q3', score: 87, grade: 'A' },
        { period: '2025 Q4', score: 88.5, grade: 'A' },
    ],
    '2': [
        { period: '2025 Q1', score: 90, grade: 'S' },
        { period: '2025 Q2', score: 92, grade: 'S' },
        { period: '2025 Q3', score: 94, grade: 'S' },
        { period: '2025 Q4', score: 95, grade: 'S' },
    ],
    'default': [
        { period: '2025 Q1', score: 75, grade: 'B' },
        { period: '2025 Q2', score: 78, grade: 'B+' },
        { period: '2025 Q3', score: 76, grade: 'B' },
        { period: '2025 Q4', score: 78, grade: 'B' },
    ]
};

export const MOCK_HISTORY_RECORDS: Record<string, HistoricalRecord[]> = {
    '1': [
        { id: 'h1', date: '2025-10-10', type: '季度绩效面谈', manager: '管理员', summary: '表现稳定，重点讨论了Q4的产品规划，对于团队协作方面提出了更高的要求。' },
        { id: 'h2', date: '2025-07-12', type: '季度绩效面谈', manager: '管理员', summary: 'Q3目标达成率100%，建议加强跨部门沟通。' },
    ],
    'default': []
};

export const MOCK_PERFORMANCE_RECORD = MOCK_PERFORMANCE_RECORDS[0];

export const MOCK_AI_OUTLINE = `
# 访谈开场
您好，非常感谢您抽出时间参与我们这次的访谈。我们这次访谈主要是想了解一下您在 Q4 季度工作中的一些体验和感受，整个访谈大概会持续 60 分钟左右。

# 访谈背景
- 重点回顾核心业务指标的达成情况（目前得分 88.5，等级 A）。
- 讨论关于“累计签单”指标的评分差异（自评 100 vs 他评 75）。

# 访谈纪要与建议
**1. 业绩亮点确认**
- 肯定员工在【提升品牌知名度】上的优异表现 (OKR 得分 98)。
- 询问：*“在提升品牌知名度项目中，你觉得最关键的成功因素是什么？”*

**2. 差距分析与澄清**
- **针对【累计签单】的分歧**：
  > 话术建议：“我注意到关于累计签单这一项，我们有 25 分的分差。您的自评提到已达成，但我这边考虑到回款未到账的情况。我们可以具体对齐一下回款周期的问题吗？”

- **针对【团队协作】的反馈**：
  > 话术建议：“关于响应速度，这中间是否存在信息同步不及时的情况？能举一个具体的例子吗？”

**3. 未来规划**
- 下季度重点关注：优化生产供应链效率（目前权重 20%）。
- 设定初步目标：将供应链响应时间缩短 15%。

# 建议总结
*(此处将在面谈结束后自动生成总结...)*
`;
