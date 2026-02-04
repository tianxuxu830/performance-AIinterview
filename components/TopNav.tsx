
import React from 'react';
import { Search, Bell, HelpCircle, Grid, Mail, RefreshCw } from 'lucide-react';

interface TopNavProps {
  currentRole: 'HR' | 'Employee';
  onRoleChange: (role: 'HR' | 'Employee') => void;
}

const TopNav: React.FC<TopNavProps> = ({ currentRole, onRoleChange }) => {
  return (
    <div className="h-14 bg-white border-b border-gray-300 flex items-center justify-between px-6 shadow-sm z-10 sticky top-0">
        {/* Breadcrumb / Title Area */}
        <div className="flex items-center text-sm">
             <span className="text-gray-500">智能绩效</span>
             <span className="mx-2 text-gray-300">/</span>
             <span className="text-gray-500">绩效管理</span>
             <span className="mx-2 text-gray-300">/</span>
             <span className="text-gray-800 font-bold">{currentRole === 'HR' ? 'HR 管理后台' : '员工工作台'}</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-5">
            {/* Role Switcher */}
            <div className="bg-gray-100 p-1 rounded-lg flex items-center shadow-inner mr-2">
                <button
                    onClick={() => onRoleChange('Employee')}
                    className={`px-3 py-1 text-xs rounded-md transition-all flex items-center ${
                        currentRole === 'Employee' 
                        ? 'bg-white text-primary-600 shadow-sm font-bold' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <span className="mr-1">👨‍💻</span> 员工端
                </button>
                <button
                    onClick={() => onRoleChange('HR')}
                    className={`px-3 py-1 text-xs rounded-md transition-all flex items-center ${
                        currentRole === 'HR' 
                        ? 'bg-white text-primary-600 shadow-sm font-bold' 
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    <span className="mr-1">👔</span> HR端
                </button>
            </div>

            <div className="h-5 w-px bg-gray-300"></div>

            <div className="relative">
                <input 
                    type="text" 
                    placeholder="搜索..." 
                    className="pl-9 pr-4 py-1.5 border border-gray-300 rounded text-sm focus:outline-none focus:ring-1 focus:ring-primary w-48 transition-all bg-gray-50 hover:bg-white placeholder-gray-400"
                />
                <Search className="absolute left-3 top-2 text-gray-400" size={16} />
            </div>

            <div className="flex items-center space-x-4">
                <button className="text-gray-500 hover:text-primary transition-colors"><Mail size={18} /></button>
                <button className="text-gray-500 hover:text-primary transition-colors relative">
                    <Bell size={18} />
                    <span className="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center border-2 border-white">3</span>
                </button>
                <button className="text-gray-500 hover:text-primary transition-colors"><HelpCircle size={18} /></button>
            </div>
            
            <div className="flex items-center cursor-pointer pl-2">
                <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 font-bold border border-white shadow-sm text-xs">
                    {currentRole === 'HR' ? 'HR' : 'L'}
                </div>
            </div>
        </div>
    </div>
  );
};

export default TopNav;
