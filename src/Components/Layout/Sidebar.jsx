import { useState } from 'react';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { selectAllTasks } from '@/Features/Tasks/tasksSlice';

const Sidebar = () => {
	const tasks = useSelector(selectAllTasks) || [];
	const [isOpen, setIsOpen] = useState(false);

	// Filtrar tareas válidas para evitar errores con elementos nulos
	const validTasks = tasks.filter((task) => task !== null && task !== undefined);

	// Calcular estadísticas
	const totalTasks = validTasks.length;
	const completedTasks = validTasks.filter((task) => task.completed).length;
	const pendingTasks = totalTasks - completedTasks;
	const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

	// Opciones de navegación
	const navOptions = [
		{ icon: 'fa-home', label: 'Inicio', active: true },
		{ icon: 'fa-calendar', label: 'Calendario', active: false },
		{ icon: 'fa-chart-simple', label: 'Estadísticas', active: false },
		{ icon: 'fa-gear', label: 'Configuración', active: false },
	];

	return (
		<>
			{/* Botón de menú para móvil */}
			<div className='md:hidden fixed bottom-4 right-4 z-10'>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setIsOpen(!isOpen)}
					className='bg-indigo-600 text-white p-4 rounded-full shadow-lg'>
					<i className={`fas ${isOpen ? 'fa-times' : 'fa-bars'}`}></i>
				</motion.button>
			</div>

			{/* Sidebar para móvil */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ x: '100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: '100%', opacity: 0 }}
						transition={{ duration: 0.3 }}
						className='fixed inset-y-0 right-0 w-64 bg-white dark:bg-gray-800 shadow-lg z-20 md:hidden p-4'>
						<button
							onClick={() => setIsOpen(false)}
							className='absolute top-4 right-4 text-gray-600 dark:text-gray-300'>
							<i className='fas fa-times'></i>
						</button>
						<SidebarContent
							totalTasks={totalTasks}
							completedTasks={completedTasks}
							pendingTasks={pendingTasks}
							completionRate={completionRate}
							navOptions={navOptions}
						/>
					</motion.div>
				)}
			</AnimatePresence>

			{/* Sidebar para escritorio */}
			<aside className='hidden md:block w-64 bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 transition-colors duration-300 self-start sticky top-4'>
				<SidebarContent
					totalTasks={totalTasks}
					completedTasks={completedTasks}
					pendingTasks={pendingTasks}
					completionRate={completionRate}
					navOptions={navOptions}
				/>
			</aside>
		</>
	);
};

// Componente para el contenido del sidebar
const SidebarContent = ({ totalTasks, completedTasks, pendingTasks, completionRate, navOptions }) => {
	return (
		<div className='space-y-6'>
			<div className='text-center border-b border-gray-200 dark:border-gray-700 pb-6'>
				<div className='w-20 h-20 mx-auto rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center'>
					<i className='fas fa-user text-2xl text-indigo-600 dark:text-indigo-400'></i>
				</div>
				<h2 className='mt-2 font-semibold text-gray-800 dark:text-white'>Usuario</h2>
				<p className='text-sm text-gray-500 dark:text-gray-400'>Bienvenido a TasksFlow</p>
			</div>

			<nav>
				<ul className='space-y-2'>
					{navOptions.map((option, index) => (
						<li key={index}>
							<a
								href='#'
								className={`flex items-center px-3 py-2 rounded-md transition-colors ${
									option.active
										? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/50 dark:text-indigo-400'
										: 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
								}`}>
								<i className={`fas ${option.icon} w-5`}></i>
								<span className='ml-2'>{option.label}</span>
							</a>
						</li>
					))}
				</ul>
			</nav>

			<div className='border-t border-gray-200 dark:border-gray-700 pt-4'>
				<h3 className='font-medium text-gray-800 dark:text-white mb-4'>Resumen de Tareas</h3>

				<div className='space-y-3'>
					<div>
						<div className='flex justify-between text-sm mb-1'>
							<span className='text-gray-600 dark:text-gray-400'>Progreso</span>
							<span className='text-gray-800 dark:text-gray-200'>{completionRate}%</span>
						</div>
						<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2'>
							<motion.div
								className='bg-indigo-600 h-2 rounded-full'
								initial={{ width: 0 }}
								animate={{ width: `${completionRate}%` }}
								transition={{ duration: 0.5 }}></motion.div>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-2'>
						<div className='bg-indigo-50 dark:bg-gray-700 p-3 rounded-lg text-center'>
							<p className='text-xs text-gray-600 dark:text-gray-400'>Completadas</p>
							<p className='text-lg font-semibold text-indigo-600 dark:text-indigo-400'>
								{completedTasks}
							</p>
						</div>
						<div className='bg-indigo-50 dark:bg-gray-700 p-3 rounded-lg text-center'>
							<p className='text-xs text-gray-600 dark:text-gray-400'>Pendientes</p>
							<p className='text-lg font-semibold text-amber-600 dark:text-amber-400'>{pendingTasks}</p>
						</div>
					</div>

					<div className='bg-indigo-50 dark:bg-gray-700 p-3 rounded-lg text-center'>
						<p className='text-xs text-gray-600 dark:text-gray-400'>Total</p>
						<p className='text-lg font-semibold text-gray-800 dark:text-white'>{totalTasks}</p>
					</div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
