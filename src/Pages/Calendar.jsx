import { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

import { selectAllTasks } from '@/Features/Tasks/tasksSlice';

const WEEKDAY_LABELS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
const MONTH_FORMATTER = new Intl.DateTimeFormat('es-MX', { month: 'long', year: 'numeric' });

const PRIORITY_DOT_CLASS = {
	high: 'bg-red-500',
	medium: 'bg-amber-500',
	low: 'bg-green-500',
};

// Keys a due date by its calendar day in the America/Mexico_City timezone,
// matching how tasksSlice stores due dates (noon Mexico City time).
const dateKey = (isoDate) => {
	const date = new Date(isoDate);
	return date.toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' }); // YYYY-MM-DD
};

const buildMonthGrid = (year, month) => {
	const firstOfMonth = new Date(year, month, 1);
	const startOffset = firstOfMonth.getDay();
	const daysInMonth = new Date(year, month + 1, 0).getDate();

	const cells = [];
	for (let i = 0; i < startOffset; i++) {
		cells.push(null);
	}
	for (let day = 1; day <= daysInMonth; day++) {
		cells.push(new Date(year, month, day));
	}
	while (cells.length % 7 !== 0) {
		cells.push(null);
	}
	return cells;
};

const Calendar = () => {
	const tasks = useSelector(selectAllTasks);
	const [viewDate, setViewDate] = useState(() => new Date());
	const [selectedKey, setSelectedKey] = useState(null);

	const tasksByDay = useMemo(() => {
		const map = new Map();
		(tasks || [])
			.filter((task) => task !== null && task?.dueDate)
			.forEach((task) => {
				const key = dateKey(task.dueDate);
				if (!map.has(key)) map.set(key, []);
				map.get(key).push(task);
			});
		return map;
	}, [tasks]);

	const year = viewDate.getFullYear();
	const month = viewDate.getMonth();
	const cells = useMemo(() => buildMonthGrid(year, month), [year, month]);

	const todayKey = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Mexico_City' });
	const selectedTasks = selectedKey ? tasksByDay.get(selectedKey) || [] : [];

	const goToPreviousMonth = () => setViewDate(new Date(year, month - 1, 1));
	const goToNextMonth = () => setViewDate(new Date(year, month + 1, 1));
	const goToToday = () => {
		setViewDate(new Date());
		setSelectedKey(todayKey);
	};

	return (
		<div className='bg-white dark:bg-gray-800 rounded-lg shadow-md p-4 sm:p-6 transition-colors duration-300'>
			<div className='flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6'>
				<h1 className='text-lg sm:text-xl font-semibold text-gray-800 dark:text-white capitalize'>
					{MONTH_FORMATTER.format(viewDate)}
				</h1>
				<div className='flex items-center gap-2'>
					<button
						onClick={goToPreviousMonth}
						aria-label='Mes anterior'
						className='w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
						<i className='fa-solid fa-chevron-left'></i>
					</button>
					<button
						onClick={goToToday}
						className='px-3 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors text-sm font-medium'>
						Hoy
					</button>
					<button
						onClick={goToNextMonth}
						aria-label='Mes siguiente'
						className='w-9 h-9 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'>
						<i className='fa-solid fa-chevron-right'></i>
					</button>
				</div>
			</div>

			<div className='grid grid-cols-7 gap-1 sm:gap-2 mb-2'>
				{WEEKDAY_LABELS.map((label) => (
					<div
						key={label}
						className='text-center text-xs font-medium text-gray-500 dark:text-gray-400 py-1'>
						{label}
					</div>
				))}
			</div>

			<div className='grid grid-cols-7 gap-1 sm:gap-2'>
				{cells.map((date, index) => {
					if (!date) {
						return <div key={`empty-${index}`} className='aspect-square' />;
					}

					const key = date.toLocaleDateString('en-CA');
					const dayTasks = tasksByDay.get(key) || [];
					const isToday = key === todayKey;
					const isSelected = key === selectedKey;
					const priorities = [...new Set(dayTasks.map((task) => task.priority))];

					return (
						<motion.button
							key={key}
							whileHover={{ scale: 1.05 }}
							onClick={() => setSelectedKey(isSelected ? null : key)}
							className={`aspect-square rounded-lg flex flex-col items-center justify-center gap-1 text-sm transition-colors relative
								${isSelected ? 'bg-indigo-500 text-white' : isToday ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-300 font-semibold' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
							<span>{date.getDate()}</span>
							{dayTasks.length > 0 && (
								<div className='flex gap-0.5'>
									{priorities.slice(0, 3).map((priority) => (
										<span
											key={priority}
											className={`w-1.5 h-1.5 rounded-full ${PRIORITY_DOT_CLASS[priority] || 'bg-gray-400'} ${
												isSelected ? 'opacity-90' : ''
											}`}
										/>
									))}
								</div>
							)}
						</motion.button>
					);
				})}
			</div>

			<div className='mt-6 border-t border-gray-200 dark:border-gray-700 pt-4'>
				{selectedKey ? (
					<>
						<h2 className='font-semibold text-gray-800 dark:text-white mb-3'>
							Tareas del{' '}
							{new Date(`${selectedKey}T12:00:00`).toLocaleDateString('es-MX', {
								day: 'numeric',
								month: 'long',
								year: 'numeric',
							})}
						</h2>
						{selectedTasks.length === 0 ? (
							<p className='text-gray-500 dark:text-gray-400 text-sm'>
								No hay tareas con fecha límite este día.
							</p>
						) : (
							<ul className='space-y-2'>
								{selectedTasks.map((task) => (
									<li
										key={task.id}
										className='flex items-center gap-3 p-3 rounded-lg bg-gray-50 dark:bg-gray-700/50'>
										<span
											className={`w-2 h-2 rounded-full flex-none ${
												PRIORITY_DOT_CLASS[task.priority] || 'bg-gray-400'
											}`}
										/>
										<span
											className={`flex-1 min-w-0 truncate text-sm text-gray-800 dark:text-white ${
												task.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''
											}`}>
											{task.title}
										</span>
										{task.completed && (
											<i className='fa-solid fa-check-circle text-green-500 dark:text-green-400 text-sm'></i>
										)}
									</li>
								))}
							</ul>
						)}
					</>
				) : (
					<p className='text-gray-500 dark:text-gray-400 text-sm'>
						Selecciona un día para ver sus tareas con fecha límite.
					</p>
				)}
			</div>
		</div>
	);
};

export default Calendar;
