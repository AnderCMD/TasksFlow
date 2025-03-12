import { useDispatch, useSelector } from 'react-redux';
import { setFilter, selectActiveFilter } from '@/Features/Tasks/tasksSlice';

const TaskFilter = () => {
	const dispatch = useDispatch();
	const activeFilter = useSelector(selectActiveFilter);

	const handleFilterChange = (filter) => {
		dispatch(setFilter(filter));
	};

	return (
		<div className='flex space-x-1 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg'>
			<button
				onClick={() => handleFilterChange('all')}
				className={`px-3 py-1 text-sm rounded-md transition-colors ${
					activeFilter === 'all'
						? 'bg-indigo-600 text-white'
						: 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
				}`}>
				Todas
			</button>
			<button
				onClick={() => handleFilterChange('active')}
				className={`px-3 py-1 text-sm rounded-md transition-colors ${
					activeFilter === 'active'
						? 'bg-indigo-600 text-white'
						: 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
				}`}>
				Activas
			</button>
			<button
				onClick={() => handleFilterChange('completed')}
				className={`px-3 py-1 text-sm rounded-md transition-colors ${
					activeFilter === 'completed'
						? 'bg-indigo-600 text-white'
						: 'text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
				}`}>
				Completadas
			</button>
		</div>
	);
};

export default TaskFilter;
