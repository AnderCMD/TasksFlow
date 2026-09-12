import { Component } from 'react';
import PropTypes from 'prop-types';

// Catches render errors anywhere below it in the tree so a single broken
// component can't take down the whole app with a blank white screen.
class ErrorBoundary extends Component {
	constructor(props) {
		super(props);
		this.state = { hasError: false };
	}

	static getDerivedStateFromError() {
		return { hasError: true };
	}

	componentDidCatch(error, errorInfo) {
		console.error('Unhandled error caught by ErrorBoundary:', error, errorInfo);
	}

	handleReload = () => {
		this.setState({ hasError: false });
		window.location.reload();
	};

	render() {
		if (this.state.hasError) {
			return (
				<div className='min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4'>
					<div className='max-w-md w-full text-center bg-white dark:bg-gray-800 rounded-xl shadow-md p-8'>
						<div className='inline-flex items-center justify-center w-16 h-16 mb-4 bg-red-100 dark:bg-red-900/20 rounded-full'>
							<i className='fa-solid fa-triangle-exclamation text-2xl text-red-500 dark:text-red-400'></i>
						</div>
						<h1 className='text-xl font-semibold text-gray-800 dark:text-white mb-2'>
							Algo salió mal
						</h1>
						<p className='text-gray-500 dark:text-gray-400 mb-6'>
							Ocurrió un error inesperado. Puedes intentar recargar la página.
						</p>
						<button
							onClick={this.handleReload}
							className='px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white rounded-lg shadow-md hover:shadow-lg transition-shadow font-medium'>
							Recargar
						</button>
					</div>
				</div>
			);
		}

		return this.props.children;
	}
}

ErrorBoundary.propTypes = {
	children: PropTypes.node.isRequired,
};

export default ErrorBoundary;
