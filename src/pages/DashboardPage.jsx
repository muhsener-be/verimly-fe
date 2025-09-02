import React, { useState, useEffect, useCallback } from 'react';
import Header from '../components/layout/Header';
import TaskList from '../components/dashboard/TaskList';
import TaskDetailSidebar from '../components/dashboard/TaskDetailSidebar';
import { listFolders, listTasksByFolder, getTaskDetails, createFolder } from '../services/api';
import Dialog from '../components/ui/Dialog';
import CreateFolderForm from '../components/dashboard/CreateFolderForm';
import CreateTaskForm from '../components/dashboard/CreateTaskForm';
import Button from '../components/ui/Button';
import { Plus } from 'lucide-react';
import FolderSidebar from '../components/dashboard/FolderSidebar';

const DashboardPage = () => {
    const [folders, setFolders] = useState([]);
    const [foldersLoading, setFoldersLoading] = useState(true);
    const [selectedFolderId, setSelectedFolderId] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [tasksLoading, setTasksLoading] = useState(false);
    const [selectedTaskId, setSelectedTaskId] = useState(null);
    const [taskDetails, setTaskDetails] = useState(null);
    const [taskDetailLoading, setTaskDetailLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isFolderModalOpen, setIsFolderModalOpen] = useState(false);
    const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

    const fetchFolders = useCallback(async () => {
        try {
            setFoldersLoading(true);
            const response = await listFolders();
            setFolders(response.data);
            if (response.data.length > 0) {
                setSelectedFolderId(currentId => currentId || response.data[0].id);
            }
        } catch (err) {
            setError("Klasörler yüklenemedi.");
        } finally {
            setFoldersLoading(false);
        }
    }, []);

    const fetchTasks = useCallback(async (folderId) => {
        if (!folderId) return;
        try {
            setTasksLoading(true);
            setTasks([]);
            const response = await listTasksByFolder(folderId);
            setTasks(response.data);
        } catch (err) {
            setError("Görevler yüklenemedi.");
            setTasks([]);
        } finally {
            setTasksLoading(false);
        }
    }, []);

    const fetchTaskDetails = useCallback(async (taskId) => {
        if (!taskId) {
            setTaskDetails(null);
            return;
        };
        try {
            setTaskDetailLoading(true);
            const response = await getTaskDetails(taskId);
            setTaskDetails(response.data);
        } catch (err) {
            setError("Görev detayı yüklenemedi.");
            setTaskDetails(null);
        } finally {
            setTaskDetailLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchFolders();
    }, [fetchFolders]);

    useEffect(() => {
        fetchTasks(selectedFolderId);
    }, [selectedFolderId, fetchTasks]);

    useEffect(() => {
        fetchTaskDetails(selectedTaskId);
    }, [selectedTaskId, fetchTaskDetails]);


    if (foldersLoading) return <div>Yükleniyor...</div>;
    if (error) return <div>{error}</div>;

    return (
        <>
            <div className="h-screen flex flex-col">
                <Header />
                <main className="flex-1 flex flex-col overflow-hidden">
                    <div className="flex items-center border-b px-4 h-14 min-h-[56px]">
                        <div className="w-1/4 min-w-[250px] flex justify-between items-center pr-4">
                            <h2 className="text-lg font-semibold">Klasörler</h2>
                            <button onClick={() => setIsFolderModalOpen(true)} className="p-1 hover:bg-slate-200 rounded">
                                <Plus size={20} />
                            </button>
                        </div>
                        <div className="flex-1 flex justify-between items-center px-6">
                            <h1 className="text-lg font-semibold">Görevler</h1>
                            <Button
                                size="sm"
                                onClick={() => setIsTaskModalOpen(true)}
                                disabled={!selectedFolderId}
                            >
                                <Plus size={16} className="mr-2" />
                                Yeni Görev
                            </Button>
                        </div>
                        <div className="w-1/3 border-l px-6">
                            <h2 className="text-lg font-semibold">Görev Detayı</h2>
                        </div>
                    </div>

                    <div className="flex-1 flex overflow-hidden">
                        <FolderSidebar
                            folders={folders}
                            selectedFolderId={selectedFolderId}
                            onSelectFolder={setSelectedFolderId}
                        />

                        <TaskList
                            tasks={tasks}
                            loading={tasksLoading}
                            onSelectTask={setSelectedTaskId}
                        />

                        <TaskDetailSidebar
                            task={taskDetails}
                            loading={taskDetailLoading}
                            // onAction prop'unu ekliyoruz
                            onAction={() => fetchTaskDetails(selectedTaskId)}
                        />
                    </div>
                </main>
            </div>

            <Dialog isOpen={isFolderModalOpen} onClose={() => setIsFolderModalOpen(false)} title="Yeni Klasör Oluştur">
                <CreateFolderForm
                    onFolderCreated={() => {
                        fetchFolders();
                        setIsFolderModalOpen(false);
                    }}
                    onClose={() => setIsFolderModalOpen(false)}
                />
            </Dialog>

            <Dialog isOpen={isTaskModalOpen} onClose={() => setIsTaskModalOpen(false)} title="Yeni Görev Oluştur">
                <CreateTaskForm
                    folderId={selectedFolderId}
                    onClose={() => setIsTaskModalOpen(false)}
                    onTaskCreated={() => {
                        fetchTasks(selectedFolderId);
                        setIsTaskModalOpen(false);
                    }}
                />
            </Dialog>
        </>
    );
};

export default DashboardPage;