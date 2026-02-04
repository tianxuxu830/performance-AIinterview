
import React from 'react';
import { ChevronUp, Plus, FileText, ChevronDown, PenLine, Trash2 } from 'lucide-react';
import { AssessmentDetail } from '../types';

interface AssessmentDetailTableProps {
  detail: AssessmentDetail;
  period: string;
}

const AssessmentDetailTable: React.FC<AssessmentDetailTableProps> = ({ detail, period }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden h-full flex flex-col">
      <div className="p-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
          <div className="flex items-center space-x-2">
              <div className="bg-blue-600 w-1 h-4 rounded-full"></div>
              <h3 className="font-bold text-gray-800">考核内容</h3>
          </div>
          <div className="flex items-center space-x-2">
              <span className="text-sm text-blue-600 font-medium cursor-pointer hover:underline">显示完整信息</span>
              <div className="w-8 h-4 bg-blue-600 rounded-full relative cursor-pointer">
                  <div className="absolute right-0.5 top-0.5 bg-white w-3 h-3 rounded-full shadow-sm"></div>
              </div>
          </div>
      </div>
      
      <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-8 bg-gray-50/50">
          
          {/* Header Description */}
          <div className="bg-white p-4 rounded-lg border border-gray-200">
             <div className="flex justify-between items-center mb-2">
                 <div className="flex items-center space-x-2">
                     <div className="w-1 h-3 bg-blue-500 rounded-full"></div>
                     <span className="font-bold text-gray-800 text-sm">考核说明</span>
                     <ChevronUp size={16} className="text-blue-500" />
                 </div>
             </div>
             <p className="text-sm text-gray-600 pl-3">
                 {detail.description}
             </p>
          </div>

          {/* OKR Section */}
          <div>
              <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                      <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
                      <span className="font-bold text-gray-800 text-sm">OKR</span>
                      <ChevronUp size={16} className="text-blue-500" />
                  </div>
                  <div className="text-xs text-gray-500">
                      (项目权重：{detail.okrWeight || 0}%，指标权重：70%，剩余可输入权重 <span className="text-orange-500">0</span>)
                  </div>
                  <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-xs rounded hover:bg-blue-50">新增</button>
                      <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-xs rounded hover:bg-blue-50">导入</button>
                      <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-xs rounded hover:bg-blue-50">从指标库引用</button>
                      <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-xs rounded hover:bg-blue-50">从其他周期导入</button>
                  </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
                      <div className="col-span-1 p-3 text-center border-r border-gray-100">序号</div>
                      <div className="col-span-3 p-3 border-r border-gray-100"><span className="text-red-500 mr-1">*</span>目标名称 (O)</div>
                      <div className="col-span-1 p-3 border-r border-gray-100 text-center"><span className="text-red-500 mr-1">*</span>权重(%)</div>
                      <div className="col-span-2 p-3 border-r border-gray-100"><span className="text-red-500 mr-1">*</span>KR1</div>
                      <div className="col-span-2 p-3 border-r border-gray-100"><span className="text-red-500 mr-1">*</span>KR2</div>
                      <div className="col-span-2 p-3 border-r border-gray-100"><span className="text-red-500 mr-1">*</span>KR3</div>
                      <div className="col-span-1 p-3 text-center">操作</div>
                  </div>
                  
                  {detail.okrs?.map((okr, index) => (
                      <div key={okr.id} className="grid grid-cols-12 text-sm border-b border-gray-100 last:border-0 hover:bg-blue-50/20 transition-colors">
                          <div className="col-span-1 p-3 text-center text-gray-500 border-r border-gray-100 flex items-center justify-center bg-gray-50/30">
                              {okr.sequence}
                          </div>
                          <div className="col-span-3 p-3 border-r border-gray-100 text-blue-600 hover:underline cursor-pointer flex items-start">
                              {okr.name}
                          </div>
                          <div className="col-span-1 p-3 border-r border-gray-100 text-center flex items-center justify-center">
                              <div className="border border-gray-300 rounded px-2 py-1 bg-white text-xs w-12 flex justify-between items-center">
                                  {okr.weight} <span>%</span>
                              </div>
                          </div>
                          <div className="col-span-2 p-3 border-r border-gray-100 text-gray-700 text-xs leading-relaxed">
                              {okr.krs[0]?.content || '-'}
                          </div>
                          <div className="col-span-2 p-3 border-r border-gray-100 text-gray-700 text-xs leading-relaxed">
                              {okr.krs[1]?.content || '-'}
                          </div>
                          <div className="col-span-2 p-3 border-r border-gray-100 text-gray-700 text-xs leading-relaxed">
                              {okr.krs[2]?.content || '-'}
                          </div>
                          <div className="col-span-1 p-3 flex items-center justify-center space-x-2 text-blue-500">
                               <button className="p-1 hover:bg-blue-100 rounded"><PenLine size={14} /></button>
                               <button className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded"><Trash2 size={14} /></button>
                          </div>
                      </div>
                  ))}
                  {(!detail.okrs || detail.okrs.length === 0) && (
                      <div className="p-4 text-center text-xs text-gray-400 bg-gray-50/20">暂无 OKR 数据</div>
                  )}
              </div>
          </div>

          {/* KPI Section */}
          <div>
              <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center space-x-2">
                      <div className="w-1 h-3 bg-blue-600 rounded-full"></div>
                      <span className="font-bold text-gray-800 text-sm">KPI</span>
                      <ChevronUp size={16} className="text-blue-500" />
                  </div>
                  <div className="text-xs text-gray-500">
                      (项目权重：{detail.kpiWeight || 0}%，指标权重：10%，剩余可输入权重 <span className="text-orange-500">20%</span>)
                  </div>
                  <div className="flex space-x-2">
                      <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-xs rounded hover:bg-blue-50">新增</button>
                      <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-xs rounded hover:bg-blue-50">导入</button>
                      <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-xs rounded hover:bg-blue-50">从指标库引用</button>
                      <button className="px-3 py-1 bg-white border border-blue-200 text-blue-600 text-xs rounded hover:bg-blue-50">从其他周期导入</button>
                  </div>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                  <div className="grid grid-cols-12 bg-gray-50 border-b border-gray-200 text-xs font-medium text-gray-500">
                      <div className="col-span-1 p-3 text-center border-r border-gray-100">序号</div>
                      <div className="col-span-2 p-3 border-r border-gray-100"><span className="text-red-500 mr-1">*</span>指标名称</div>
                      <div className="col-span-3 p-3 border-r border-gray-100"><span className="text-red-500 mr-1">*</span>指标说明</div>
                      <div className="col-span-3 p-3 border-r border-gray-100"><span className="text-red-500 mr-1">*</span>评分说明</div>
                      <div className="col-span-1 p-3 border-r border-gray-100 text-center"><span className="text-red-500 mr-1">*</span>权重(%)</div>
                      <div className="col-span-1 p-3 border-r border-gray-100"><span className="text-red-500 mr-1">*</span>目标值</div>
                       <div className="col-span-1 p-3 text-center">操作</div>
                  </div>
                  
                  {detail.kpis?.map((kpi, index) => (
                      <div key={kpi.id} className="grid grid-cols-12 text-sm border-b border-gray-100 last:border-0 hover:bg-blue-50/20 transition-colors">
                          <div className="col-span-1 p-3 text-center text-gray-500 border-r border-gray-100 flex items-center justify-center bg-gray-50/30">
                              {kpi.sequence}
                          </div>
                          <div className="col-span-2 p-3 border-r border-gray-100 text-blue-600 hover:underline cursor-pointer">
                              {kpi.name}
                          </div>
                          <div className="col-span-3 p-3 border-r border-gray-100 text-gray-700 text-xs">
                              {kpi.description}
                          </div>
                          <div className="col-span-3 p-3 border-r border-gray-100 text-gray-700 text-xs">
                              {kpi.evaluationMethod}
                          </div>
                          <div className="col-span-1 p-3 border-r border-gray-100 text-center flex items-center justify-center">
                              <div className="border border-gray-300 rounded px-2 py-1 bg-white text-xs w-12 flex justify-between items-center">
                                  {kpi.weight} <span>%</span>
                              </div>
                          </div>
                           <div className="col-span-1 p-3 border-r border-gray-100 text-gray-700 text-xs flex items-center">
                              {kpi.targetValue}
                          </div>
                          <div className="col-span-1 p-3 flex items-center justify-center space-x-2 text-blue-500">
                               <button className="p-1 hover:bg-blue-100 rounded"><PenLine size={14} /></button>
                               <button className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded"><Trash2 size={14} /></button>
                          </div>
                      </div>
                  ))}
                  
                   {/* Empty Input Row Mock */}
                  <div className="grid grid-cols-12 text-sm bg-blue-50/10">
                       <div className="col-span-1 p-3 border-r border-gray-100"></div>
                       <div className="col-span-10 p-2 border-r border-gray-100">
                           <div className="border border-red-300 rounded px-2 py-1.5 text-xs text-red-400 bg-white w-1/3">
                               需填写必填项
                           </div>
                       </div>
                        <div className="col-span-1 p-3 flex items-center justify-center space-x-2 text-blue-500">
                             <button className="p-1 hover:bg-blue-100 rounded"><PenLine size={14} /></button>
                             <button className="p-1 hover:bg-red-100 text-gray-400 hover:text-red-500 rounded"><Trash2 size={14} /></button>
                        </div>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
};

export default AssessmentDetailTable;
