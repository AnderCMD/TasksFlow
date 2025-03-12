import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

// Componentes
import TasksList from '@/Components/Tasks/TasksList';
import TaskForm from '@/Components/Tasks/TaskForm';
import Header from '@/Components/Layout/Header';
import Sidebar from '@/Components/Layout/Sidebar';
import TaskFilter from '@/Components/Tasks/TaskFilter';

// Features
import { cleanTasks } from '@/Features/Tasks/tasksSlice';

function App() {
	const dispatch = useDispatch();

	// Limpiar tareas inválidas al iniciar la aplicación
	useEffect(() => {
		dispatch(cleanTasks());
	}, [dispatch]);

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
			<Header />

			<div className='container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6'>
				<Sidebar />

				<main className='flex-1'>
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6 transition-colors duration-300'>
						<h1 className='text-2xl font-bold mb-6 text-gray-800 dark:text-white'>Gestión de Tareas</h1>

						<TaskForm />
					</div>

					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300'>
						<div className='flex justify-between items-center mb-6'>
							<h2 className='text-xl font-semibold text-gray-800 dark:text-white'>Mis Tareas</h2>
							<TaskFilter />
						</div>

						<AnimatePresence>
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}>
								<TasksList />
							</motion.div>
						</AnimatePresence>
					</div>
				</main>
			</div>
		</div>
	);
}

export default App;
