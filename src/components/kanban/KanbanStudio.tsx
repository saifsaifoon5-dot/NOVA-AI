import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { KanbanTask } from '../../types';
import {
  KanbanSquare,
  Plus,
  Clock,
  MessageSquare,
} from 'lucide-react';

const COLUMNS: { id: KanbanTask['status']; titleEn: string; titleAr: string }[] = [
  { id: 'backlog', titleEn: 'Backlog', titleAr: 'المؤجلات' },
  { id: 'todo', titleEn: 'To Do', titleAr: 'المهام القادمة' },
  { id: 'in-progress', titleEn: 'In Progress', titleAr: 'قيد التنفيذ' },
  { id: 'review', titleEn: 'In Review', titleAr: 'المراجعة' },
  { id: 'done', titleEn: 'Done', titleAr: 'المنجزة' },
];

export const KanbanStudio: React.FC = () => {
  const { lang, tasks, setTasks, addToast } = useApp();

  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [selectedCol, setSelectedCol] = useState<KanbanTask['status']>('todo');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateTask = () => {
    if (!newTaskTitle.trim()) return;

    const newTask: KanbanTask = {
      id: `tsk-${Date.now()}`,
      title: newTaskTitle.trim(),
      description: 'Task created via Kanban workflow',
      status: selectedCol,
      priority: 'high',
      assignee: {
        name: 'Saif (Lead)',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop&crop=faces',
      },
      dueDate: '2026-10-18',
      timeSpentHours: 0,
      commentsCount: 0,
    };

    setTasks((prev) => [newTask, ...prev]);
    setNewTaskTitle('');
    setIsModalOpen(false);
    addToast(lang === 'ar' ? 'تمت إضافة المهمة' : 'Task added successfully', 'success');
  };

  const handleMoveTask = (taskId: string, newStatus: KanbanTask['status']) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status: newStatus } : t))
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-zinc-950 text-zinc-100">
      {/* Header */}
      <div className="h-12 border-b border-zinc-800/80 bg-zinc-950 px-4 flex items-center justify-between shrink-0 select-none">
        <div className="flex items-center gap-2.5">
          <KanbanSquare className="w-4 h-4 text-zinc-400" />
          <h2 className="text-xs font-semibold text-zinc-100">
            {lang === 'ar' ? 'إدارة المهام والعمل الجماعي (Kanban)' : 'Kanban & Team Workflow'}
          </h2>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className="px-3 py-1.5 rounded-lg bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold flex items-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>{lang === 'ar' ? 'مهمة جديدة' : 'New Task'}</span>
        </button>
      </div>

      {/* Kanban Board Columns */}
      <div className="flex-1 overflow-x-auto p-4 sm:p-6 flex gap-3.5">
        {COLUMNS.map((col) => {
          const colTasks = tasks.filter((t) => t.status === col.id);

          return (
            <div
              key={col.id}
              className="w-72 shrink-0 rounded-xl bg-zinc-900/60 border border-zinc-800 flex flex-col max-h-full"
            >
              {/* Column Header */}
              <div className="p-3 border-b border-zinc-800 flex items-center justify-between select-none">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-zinc-200">
                    {lang === 'ar' ? col.titleAr : col.titleEn}
                  </span>
                  <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-zinc-800 text-zinc-400">
                    {colTasks.length}
                  </span>
                </div>
              </div>

              {/* Task Cards Container */}
              <div className="p-2 flex-1 overflow-y-auto space-y-2">
                {colTasks.map((task) => (
                  <div
                    key={task.id}
                    className="p-3 rounded-lg bg-zinc-950 border border-zinc-800/80 hover:border-zinc-700 transition space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <span
                        className={`text-[9px] font-mono uppercase px-1.5 py-0.5 rounded ${
                          task.priority === 'urgent'
                            ? 'text-rose-400 bg-zinc-900 border border-zinc-800'
                            : task.priority === 'high'
                            ? 'text-amber-400 bg-zinc-900 border border-zinc-800'
                            : 'text-zinc-400 bg-zinc-900'
                        }`}
                      >
                        {lang === 'ar'
                          ? task.priority === 'urgent'
                            ? 'عاجل'
                            : task.priority === 'high'
                            ? 'مرتفع'
                            : 'عادي'
                          : task.priority}
                      </span>

                      {/* Quick Move drop */}
                      <select
                        value={task.status}
                        onChange={(e) => handleMoveTask(task.id, e.target.value as any)}
                        className="bg-zinc-900 text-[10px] text-zinc-300 rounded px-1.5 py-0.5 border border-zinc-800 hover:border-zinc-700 outline-none cursor-pointer"
                      >
                        {COLUMNS.map((c) => (
                          <option key={c.id} value={c.id}>
                            {lang === 'ar' ? c.titleAr : c.titleEn}
                          </option>
                        ))}
                      </select>
                    </div>

                    <h4 className="text-xs font-medium text-zinc-200 leading-snug">{task.title}</h4>
                    <p className="text-[11px] text-zinc-400 line-clamp-2">{task.description}</p>

                    <div className="pt-2 border-t border-zinc-900 flex items-center justify-between text-[11px] text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <img
                          src={task.assignee.avatar}
                          alt={task.assignee.name}
                          className="w-4 h-4 rounded-full object-cover"
                        />
                        <span className="truncate max-w-[80px]">{task.assignee.name.split(' ')[0]}</span>
                      </div>

                      <div className="flex items-center gap-2 font-mono text-[10px]">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          {task.timeSpentHours}h
                        </span>
                        <span className="flex items-center gap-1">
                          <MessageSquare className="w-3 h-3 text-zinc-500" />
                          {task.commentsCount}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}

                {colTasks.length === 0 && (
                  <div className="p-6 text-center text-xs text-zinc-600 italic">
                    {lang === 'ar' ? 'لا توجد مهام' : 'Empty'}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* New Task Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-xl p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-semibold text-white">{lang === 'ar' ? 'مهمة جديدة' : 'Add Task'}</h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder={lang === 'ar' ? 'عنوان المهمة...' : 'Task title...'}
                value={newTaskTitle}
                onChange={(e) => setNewTaskTitle(e.target.value)}
                className="w-full p-2.5 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-100 outline-none"
              />
              <select
                value={selectedCol}
                onChange={(e) => setSelectedCol(e.target.value as any)}
                className="w-full p-2 rounded bg-zinc-950 border border-zinc-800 text-xs text-zinc-200 outline-none"
              >
                {COLUMNS.map((c) => (
                  <option key={c.id} value={c.id}>
                    {lang === 'ar' ? c.titleAr : c.titleEn}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-3 py-1.5 rounded bg-zinc-800 text-zinc-300 text-xs font-medium"
              >
                {lang === 'ar' ? 'إلغاء' : 'Cancel'}
              </button>
              <button
                onClick={handleCreateTask}
                className="px-3.5 py-1.5 rounded bg-zinc-100 hover:bg-white text-zinc-950 text-xs font-semibold"
              >
                {lang === 'ar' ? 'حفظ' : 'Save Task'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
