import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { selectAllTasks, selectTaskCounts } from '@/Features/Tasks/tasksSlice';

const PRIORITY_CONFIG = {
	high: { label: 'Alta', barClass: 'bg-red-500' },
	medium: { label: 'Media', barClass: 'bg-amber-500' },
	low: { label: 'Baja', barClass: 'bg-green-500' },
};

const DAY_LABEL_FORMATTER = new Intl.DateTimeFormat('es-MX', { weekday: 'short' });

const buildLastSevenDays = (tasks) => {
	const days = [];
	for (let i = 6; i >= 0; i--) {
		const date = new Date();
		date.setDate(date.getDate() - i);
		const key = date.toDateString();
		days.push({ key, date, count: 0 });
	}

	const countsByKey = new Map(days.map((day) => [day.key, 0]));
	tasks
		.filter((task) => task?.createdAt)
		.forEach((task) => {
			const key = new Date(task.createdAt).toDateString();
			if (countsByKey.has(key)) {
				countsByKey.set(key, countsByKey.get(key) + 1);
			}
		});

	return days.map((day) => ({ ...day, count: countsByKey.get(day.key) }));
};

const StatCard = ({ icon, iconClass, label, value }) => (
	<motion.div
		whileHover={{ y: -4 }}
		transition={{ type: 'spring', stiffness: 400, damping: 10 }}
		className='bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-700 dark:to-gray-800 p-4 rounded-xl shadow-sm'>
		<div className='flex justify-between items-center gap-2 mb-2'>
			<p className='text-xs font-medium text-gray-600 dark:text-gray-400'>{label}</p>
			<div className={`p-2 rounded-full flex items-center justify-center ${iconClass}`}>
				<i className={`${icon} text-xs`}></i>
			</div>
		</div>
		<p className='text-2xl font-bold text-gray-800 dark:text-white'>{value}</p>
	</motion.div>
);

const Statistics = () => {
	const tasks = useSelector(selectAllTasks) || [];
	const counts = useSelector(selectTaskCounts);
	const validTasks = tasks.filter((task) => task !== null && task !== undefined);

	const completionRate = counts.all > 0 ? Math.round((counts.completed / counts.all) * 100) : 0;
	const overdueTasks = useMemo(() => {
		const now = new Date();
		return validTasks.filter((task) => !task.completed && task.dueDate && new Date(task.dueDate) < now).length;
	}, [validTasks]);

	const priorityData = ['high', 'medium', 'low'].map((priority) => ({
		priority,
		...PRIORITY_CONFIG[priority],
		count: counts[priority] || 0,
		percentage: counts.all > 0 ? Math.round(((counts[priority] || 0) / counts.all) * 100) : 0,
	}));

	const lastSevenDays = useMemo(() => buildLastSevenDays(validTasks), [validTasks]);
	const maxDayCount = Math.max(1, ...lastSevenDays.map((day) => day.count));

	return (
		<div className='space-y-6'>
			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors duration-300'>
				<h1 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-white mb-6'>
					Estadísticas
				</h1>

				<div className='grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8'>
					<StatCard
						icon='fa-solid fa-list-check text-blue-500 dark:text-blue-400'
						iconClass='bg-blue-100 dark:bg-blue-900/20'
						label='Total de tareas'
						value={counts.all}
					/>
					<StatCard
						icon='fa-solid fa-check text-green-500 dark:text-green-400'
						iconClass='bg-green-100 dark:bg-green-900/20'
						label='Completadas'
						value={counts.completed}
					/>
					<StatCard
						icon='fa-solid fa-clock text-amber-500 dark:text-amber-400'
						iconClass='bg-amber-100 dark:bg-amber-900/20'
						label='Pendientes'
						value={counts.active}
					/>
					<StatCard
						icon='fa-solid fa-triangle-exclamation text-red-500 dark:text-red-400'
						iconClass='bg-red-100 dark:bg-red-900/20'
						label='Atrasadas'
						value={overdueTasks}
					/>
				</div>

				<div className='grid grid-cols-1 lg:grid-cols-2 gap-8'>
					{/* Completion rate */}
					<div className='flex flex-col items-center justify-center'>
						<h2 className='self-start font-semibold text-gray-800 dark:text-white mb-4'>
							Tasa de finalización
						</h2>
						<div
							className='relative w-40 h-40 rounded-full flex items-center justify-center'
							style={{
								background: `conic-gradient(#6366f1 ${completionRate * 3.6}deg, rgb(229 231 235) 0deg)`,
							}}>
							<div className='absolute inset-2 bg-white dark:bg-gray-800 rounded-full flex flex-col items-center justify-center'>
								<span className='text-3xl font-bold text-indigo-600 dark:text-indigo-400'>
									{completionRate}%
								</span>
								<span className='text-xs text-gray-500 dark:text-gray-400'>completado</span>
							</div>
						</div>
					</div>

					{/* Priority distribution */}
					<div>
						<h2 className='font-semibold text-gray-800 dark:text-white mb-4'>Por prioridad</h2>
						<div className='space-y-4'>
							{priorityData.map((item) => (
								<div key={item.priority}>
									<div className='flex justify-between text-sm mb-1'>
										<span className='text-gray-600 dark:text-gray-400'>{item.label}</span>
										<span className='font-medium text-gray-800 dark:text-white'>
											{item.count}
										</span>
									</div>
									<div className='w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5'>
										<motion.div
											className={`h-2.5 rounded-full ${item.barClass}`}
											initial={{ width: 0 }}
											animate={{ width: `${item.percentage}%` }}
											transition={{ duration: 0.6, ease: 'easeOut' }}
										/>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>

			<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors duration-300'>
				<h2 className='font-semibold text-gray-800 dark:text-white mb-4'>Tareas creadas (últimos 7 días)</h2>
				<div className='flex items-end justify-between gap-2 h-40'>
					{lastSevenDays.map((day) => (
						<div key={day.key} className='flex-1 flex flex-col items-center gap-2 h-full justify-end'>
							<motion.div
								className='w-full max-w-8 bg-gradient-to-t from-indigo-500 to-purple-500 rounded-t-md'
								initial={{ height: 0 }}
								animate={{ height: `${(day.count / maxDayCount) * 100}%` }}
								transition={{ duration: 0.5, ease: 'easeOut' }}
								style={{ minHeight: day.count > 0 ? 6 : 0 }}
							/>
							<span className='text-xs text-gray-500 dark:text-gray-400 capitalize'>
								{DAY_LABEL_FORMATTER.format(day.date)}
							</span>
						</div>
					))}
				</div>
			</div>
		</div>
	);
};

export default Statistics;
