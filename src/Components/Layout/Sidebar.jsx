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

	// Opciones de navegación con iconos modernos de FontAwesome 6
	const navOptions = [
		{ icon: 'fa-house', label: 'Inicio', active: true },
		{ icon: 'fa-calendar-days', label: 'Calendario', active: false },
		{ icon: 'fa-chart-column', label: 'Estadísticas', active: false },
		{ icon: 'fa-sliders', label: 'Configuración', active: false },
	];

	return (
		<>
			{/* Botón de menú para móvil */}
			<div className='md:hidden fixed bottom-4 right-4 z-10'>
				<motion.button
					whileHover={{ scale: 1.05 }}
					whileTap={{ scale: 0.95 }}
					onClick={() => setIsOpen(!isOpen)}
					className='bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-4 rounded-full shadow-lg'>
					<i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
				</motion.button>
			</div>

			{/* Sidebar para móvil */}
			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ x: '100%', opacity: 0 }}
						animate={{ x: 0, opacity: 1 }}
						exit={{ x: '100%', opacity: 0 }}
						transition={{ duration: 0.3, type: 'spring', stiffness: 300, damping: 30 }}
						className='fixed inset-y-0 right-0 w-72 bg-white dark:bg-gray-800 shadow-2xl z-20 md:hidden p-6 overflow-y-auto'>
						<button
							onClick={() => setIsOpen(false)}
							className='absolute top-4 right-4 bg-gray-100 dark:bg-gray-700 rounded-full p-2 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
							<i className='fa-solid fa-xmark'></i>
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
			<aside className='hidden md:block w-72 bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 transition-all duration-300 self-start sticky top-4 hover:shadow-lg'>
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
		<div className='space-y-8'>
			<div className='text-center border-b border-gray-200 dark:border-gray-700 pb-6'>
				<motion.div
					whileHover={{ scale: 1.05 }}
					className='relative w-24 h-24 mx-auto bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 rounded-full p-1 shadow-lg'>
					<div className='absolute inset-0 bg-white dark:bg-gray-800 rounded-full flex items-center justify-center m-0.5'>
						<i className='fa-solid fa-user-astronaut text-3xl text-transparent bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 bg-clip-text'></i>
					</div>
				</motion.div>
				<h2 className='mt-3 font-bold text-gray-800 dark:text-white text-xl'>Usuario</h2>
				<p className='text-sm text-gray-500 dark:text-gray-400'>Bienvenido a TasksFlow</p>
			</div>

			<nav className='px-2'>
				<ul className='space-y-1'>
					{navOptions.map((option, index) => (
						<motion.li
							key={index}
							whileHover={{ x: 4 }}
							transition={{ type: 'spring', stiffness: 400, damping: 10 }}>
							<a
								href='#'
								className={`flex items-center px-4 py-3 rounded-xl transition-all ${
									option.active
										? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium shadow-md'
										: 'text-gray-700 dark:text-gray-300 hover:bg-indigo-50 dark:hover:bg-gray-700'
								}`}>
								<i
									className={`fa-solid ${option.icon} text-lg ${
										option.active ? '' : 'text-indigo-500 dark:text-indigo-400'
									}`}></i>
								<span className='ml-4'>{option.label}</span>
								{option.active && (
									<div className='ml-auto'>
										<i className='fa-solid fa-chevron-right text-xs opacity-70'></i>
									</div>
								)}
							</a>
						</motion.li>
					))}
				</ul>
			</nav>

			<div className='border-t border-gray-200 dark:border-gray-700 pt-6'>
				<h3 className='font-bold text-gray-800 dark:text-white text-lg mb-4 flex items-center gap-2'>
					<i className='fa-solid fa-chart-pie text-indigo-500 dark:text-indigo-400'></i>
					Resumen de Tareas
				</h3>

				<div className='space-y-5'>
					<div>
						<div className='flex justify-between text-sm mb-2'>
							<span className='text-gray-600 dark:text-gray-400 font-medium'>Progreso</span>
							<motion.span
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								key={completionRate}
								className='font-bold text-indigo-600 dark:text-indigo-400'>
								{completionRate}%
							</motion.span>
						</div>
						<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
							<motion.div
								className='bg-gradient-to-r from-indigo-500 to-purple-600 h-2.5 rounded-full'
								initial={{ width: 0 }}
								animate={{ width: `${completionRate}%` }}
								transition={{ duration: 0.8, ease: 'easeOut' }}></motion.div>
						</div>
					</div>

					<div className='grid grid-cols-2 gap-3'>
						<motion.div
							whileHover={{ y: -4 }}
							transition={{ type: 'spring', stiffness: 400, damping: 10 }}
							className='bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm'>
							<div className='flex justify-between items-start'>
								<p className='text-xs font-medium text-gray-600 dark:text-gray-400'>Completadas</p>
								<div className='h-6 w-6 rounded-full flex items-center justify-center bg-green-100 dark:bg-green-900/20'>
									<i className='fa-solid fa-check text-xs text-green-500 dark:text-green-400'></i>
								</div>
							</div>
							<p className='text-2xl font-bold text-indigo-600 dark:text-indigo-400 mt-2'>
								{completedTasks}
							</p>
						</motion.div>
						<motion.div
							whileHover={{ y: -4 }}
							transition={{ type: 'spring', stiffness: 400, damping: 10 }}
							className='bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm'>
							<div className='flex justify-between items-start'>
								<p className='text-xs font-medium text-gray-600 dark:text-gray-400'>Pendientes</p>
								<div className='h-6 w-6 rounded-full flex items-center justify-center bg-amber-100 dark:bg-amber-900/20'>
									<i className='fa-solid fa-clock text-xs text-amber-500 dark:text-amber-400'></i>
								</div>
							</div>
							<p className='text-2xl font-bold text-amber-600 dark:text-amber-400 mt-2'>{pendingTasks}</p>
						</motion.div>
					</div>

					<motion.div
						whileHover={{ y: -4 }}
						transition={{ type: 'spring', stiffness: 400, damping: 10 }}
						className='bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm'>
						<div className='flex justify-between items-start'>
							<p className='text-xs font-medium text-gray-600 dark:text-gray-400'>Total de tareas</p>
							<div className='h-6 w-6 rounded-full flex items-center justify-center bg-blue-100 dark:bg-blue-900/20'>
								<i className='fa-solid fa-list-check text-xs text-blue-500 dark:text-blue-400'></i>
							</div>
						</div>
						<p className='text-2xl font-bold text-gray-800 dark:text-white mt-2'>{totalTasks}</p>
					</motion.div>
				</div>
			</div>
		</div>
	);
};

export default Sidebar;
