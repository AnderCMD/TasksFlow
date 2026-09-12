import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

import { store } from '@/App/store';

import '@/index.css';
import '@/Assets/FontAwesome/css/all.min.css';

import App from '@/App.jsx';
import ErrorBoundary from '@/Components/UI/ErrorBoundary';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ErrorBoundary>
			<Provider store={store}>
				<BrowserRouter>
					<App />
				</BrowserRouter>
			</Provider>
		</ErrorBoundary>
	</React.StrictMode>
);
