import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { AnimatePresence, motion } from 'framer-motion';

// Componentes
import TasksList from '@/Components/Tasks/TasksList';
import TaskForm from '@/Components/Tasks/TaskForm';
import Header from '@/Components/Layout/Header';
import Sidebar from '@/Components/Layout/Sidebar';
import TaskFilter from '@/Components/Tasks/TaskFilter';

// Features
import { selectTheme } from '@/Features/Theme/themeSlice';
import { cleanTasks } from '@/Features/Tasks/tasksSlice';

function App() {
	const theme = useSelector(selectTheme);
	const dispatch = useDispatch();

	// Aplicar tema al cargar la app
	useEffect(() => {
		if (theme === 'dark') {
			document.documentElement.classList.add('dark');
		} else {
			document.documentElement.classList.remove('dark');
		}
	}, [theme]);

	// Limpiar tareas inválidas al iniciar la aplicación
	useEffect(() => {
		dispatch(cleanTasks());
	}, [dispatch]);

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
			<Header />
			<div className='container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 max-w-7xl'>
				<Sidebar />
				<main className='flex-1 min-w-0'>
					{' '}
					{/* Añadido min-w-0 para evitar desbordamiento */}
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 mb-6 transition-colors duration-300'>
						<h1 className='text-xl sm:text-2xl font-bold mb-6 text-gray-800 dark:text-white'>
							Gestión de Tareas
						</h1>
						<div className='flex flex-col'>
							<div className='flex items-center justify-between mb-4'>
								<h2 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-white'>
									Añadir Nueva Tarea
								</h2>
							</div>
							<TaskForm />
						</div>
					</div>
					<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors duration-300'>
						<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
							<h2 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-white'>
								Mis Tareas
							</h2>
						</div>
						<AnimatePresence>
							<motion.div
								initial={{ opacity: 0, y: 15 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0 }}
								transition={{ duration: 0.3 }}>
								<TaskFilter />
							</motion.div>
						</AnimatePresence>
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
