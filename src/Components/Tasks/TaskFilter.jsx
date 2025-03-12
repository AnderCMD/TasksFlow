import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { setFilter, selectActiveFilter } from '@/Features/Tasks/tasksSlice';

const TaskFilter = () => {
	const dispatch = useDispatch();
	const activeFilter = useSelector(selectActiveFilter);

	const handleFilterChange = (filter) => {
		dispatch(setFilter(filter));
	};

	const filters = [
		{ id: 'all', label: 'Todas', icon: 'fa-list-check' },
		{ id: 'active', label: 'Activas', icon: 'fa-circle-play' },
		{ id: 'completed', label: 'Completadas', icon: 'fa-circle-check' },
	];

	return (
		<div className='flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg shadow-sm'>
			{filters.map((filter) => (
				<motion.button
					key={filter.id}
					onClick={() => handleFilterChange(filter.id)}
					whileHover={{ scale: activeFilter !== filter.id ? 1.05 : 1 }}
					whileTap={{ scale: 0.95 }}
					className={`px-3 py-1.5 text-sm rounded-md transition-all ${
						activeFilter === filter.id
							? 'bg-indigo-600 text-white font-medium shadow-sm'
							: 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
					}`}>
					<span className='flex items-center gap-1.5'>
						<i className={`fas ${filter.icon} text-xs`}></i>
						<span>{filter.label}</span>
					</span>
				</motion.button>
			))}
		</div>
	);
};

export default TaskFilter;
