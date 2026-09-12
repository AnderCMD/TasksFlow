import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Routes, Route } from 'react-router-dom';

import Header from '@/Components/Layout/Header';
import Sidebar from '@/Components/Layout/Sidebar';

import Home from '@/Pages/Home';
import Calendar from '@/Pages/Calendar';
import Statistics from '@/Pages/Statistics';
import Settings from '@/Pages/Settings';

import { selectTheme } from '@/Features/Theme/themeSlice';
import { cleanupTasks } from '@/Features/Tasks/tasksSlice';

export default function App() {
	const theme = useSelector(selectTheme);
	const dispatch = useDispatch();

	// Apply the theme class to <html> on load and whenever it changes.
	useEffect(() => {
		document.documentElement.classList.toggle('dark', theme === 'dark');
	}, [theme]);

	// Drop any malformed tasks that may have slipped into storage on startup.
	useEffect(() => {
		dispatch(cleanupTasks());
	}, [dispatch]);

	return (
		<div className='min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300'>
			<Header />
			<div className='container mx-auto px-4 py-8 flex flex-col md:flex-row gap-6 max-w-7xl'>
				<Sidebar />
				<main className='flex-1 min-w-0'>
					<Routes>
						<Route path='/' element={<Home />} />
						<Route path='/calendar' element={<Calendar />} />
						<Route path='/statistics' element={<Statistics />} />
						<Route path='/settings' element={<Settings />} />
					</Routes>
				</main>
			</div>
		</div>
	);
}
