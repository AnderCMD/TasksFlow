import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { selectTaskCounts, selectActiveFilter, setFilter } from '@/Features/Tasks/tasksSlice';

const TaskFilter = ({ filters = {}, onFilterChange }) => {
	const dispatch = useDispatch();
	const activeFilter = useSelector(selectActiveFilter);
	const taskCounts = useSelector(selectTaskCounts);
	const [searchTerm, setSearchTerm] = useState('');
	const [isOpen, setIsOpen] = useState(false);

	// Opciones de filtro con sus iconos
	const filterOptions = [
		{ id: 'all', label: 'Todas', icon: 'fa-border-all' },
		{ id: 'active', label: 'Pendientes', icon: 'fa-hourglass-half' },
		{ id: 'completed', label: 'Completadas', icon: 'fa-check-circle' },
		// Opciones adicionales de prioridad
		{ id: 'high', label: 'Prioridad alta', icon: 'fa-arrow-up' },
		{ id: 'medium', label: 'Prioridad media', icon: 'fa-equals' },
		{ id: 'low', label: 'Prioridad baja', icon: 'fa-arrow-down' },
	];

	const handleFilterChange = (filterId) => {
		dispatch(setFilter(filterId));
		if (onFilterChange) {
			onFilterChange({ ...filters, status: filterId });
		}
	};

	const handleSearchChange = (e) => {
		const value = e.target.value;
		setSearchTerm(value);
		if (onFilterChange) {
			onFilterChange({ ...filters, search: value });
		}
	};

	const handleSortChange = (e) => {
		const value = e.target.value;
		if (onFilterChange) {
			onFilterChange({ ...filters, sortBy: value });
		}
	};

	return (
		<div className='mb-6'>
			<div className='bg-white dark:bg-gray-800 rounded-xl shadow-md p-5 transition-all duration-300'>
				<div className='flex flex-col lg:flex-row justify-between gap-4'>
					{/* Búsqueda */}
					<div className='relative flex-1'>
						<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500'>
							<i className='fa-solid fa-search'></i>
						</div>
						<input
							type='text'
							value={searchTerm}
							onChange={handleSearchChange}
							placeholder='Buscar tareas...'
							className='w-full pl-10 pr-4 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-800 dark:text-white'
						/>
					</div>

					{/* Ordenar */}
					<div className='relative flex-initial'>
						<div className='absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none text-gray-400 dark:text-gray-500'>
							<i className='fa-solid fa-sort'></i>
						</div>
						<select
							onChange={handleSortChange}
							defaultValue='createdAt:desc'
							className='w-full md:w-48 pl-10 pr-10 py-2.5 rounded-lg bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-700 outline-none focus:ring-2 focus:ring-indigo-500 dark:focus:ring-indigo-400 focus:border-transparent transition-colors text-gray-800 dark:text-white appearance-none cursor-pointer'>
							<option value='createdAt:desc'>Más recientes</option>
							<option value='createdAt:asc'>Más antiguas</option>
							<option value='dueDate:asc'>Fecha límite ↑</option>
							<option value='dueDate:desc'>Fecha límite ↓</option>
							<option value='priority:asc'>Prioridad ↑</option>
							<option value='priority:desc'>Prioridad ↓</option>
						</select>
						<div className='absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none text-gray-400 dark:text-gray-500'>
							<i className='fa-solid fa-chevron-down'></i>
						</div>
					</div>
				</div>

				{/* Filtros de pestañas */}
				<div className='mt-5 relative'>
					{/* Versión móvil - Menú desplegable */}
					<div className='md:hidden'>
						<button
							onClick={() => setIsOpen(!isOpen)}
							className='w-full flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'>
							<div className='flex items-center gap-2'>
								<i
									className={`fa-solid ${
										filterOptions.find((opt) => opt.id === activeFilter)?.icon
									}`}></i>
								<span>{filterOptions.find((opt) => opt.id === activeFilter)?.label}</span>
							</div>
							<i
								className={`fa-solid ${
									isOpen ? 'fa-chevron-up' : 'fa-chevron-down'
								} text-sm opacity-70`}></i>
						</button>

						{isOpen && (
							<motion.div
								initial={{ opacity: 0, y: -10 }}
								animate={{ opacity: 1, y: 0 }}
								className='absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden'>
								{filterOptions.map((option) => (
									<button
										key={option.id}
										onClick={() => {
											handleFilterChange(option.id);
											setIsOpen(false);
										}}
										className={`w-full text-left p-3 flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors
											${
												activeFilter === option.id
													? 'bg-indigo-50 dark:bg-indigo-900/20 text-indigo-600 dark:text-indigo-400 font-medium'
													: 'text-gray-700 dark:text-gray-300'
											}`}>
										<i className={`fa-solid ${option.icon}`}></i>
										<span>{option.label}</span>
										<span className='ml-auto inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'>
											{taskCounts[option.id] || 0}
										</span>
									</button>
								))}
							</motion.div>
						)}
					</div>

					{/* Versión escritorio - Pestañas horizontales */}
					<div className='hidden md:flex items-center border-b border-gray-200 dark:border-gray-700 overflow-x-auto'>
						{filterOptions.map((option) => (
							<motion.button
								key={option.id}
								onClick={() => handleFilterChange(option.id)}
								className={`px-4 py-3 flex items-center gap-2 whitespace-nowrap font-medium transition-colors border-b-2 -mb-px
									${
										activeFilter === option.id
											? 'border-indigo-500 text-indigo-600 dark:text-indigo-400'
											: 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
									}`}
								whileHover={{ y: -2 }}
								whileTap={{ y: 0 }}>
								<i className={`fa-solid ${option.icon}`}></i>
								<span>{option.label}</span>
								<motion.span
									className='ml-2 inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none rounded-full bg-indigo-100 dark:bg-indigo-900/30 text-indigo-800 dark:text-indigo-300'
									initial={{ scale: 0 }}
									animate={{ scale: 1 }}
									transition={{ type: 'spring', stiffness: 500, damping: 10 }}>
									{taskCounts[option.id] || 0}
								</motion.span>
							</motion.button>
						))}
					</div>
				</div>
			</div>
		</div>
	);
};

export default TaskFilter;
