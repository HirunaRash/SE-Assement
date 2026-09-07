import type { Metadata, Viewport } from 'next';
import './globals.css';
import LayoutClient from './layout-client';
import type { ReactNode } from 'react';

export const metadata: Metadata = {
	title: 'Weekly Reports - Team Dashboard',
	description: 'Team weekly reporting system with manager review workflow',
};

export const viewport: Viewport = {
	width: 'device-width',
	initialScale: 1,
	themeColor: '#0f0f0f',
};

export default function RootLayout({ children }: { children: ReactNode }) {
	return (
		<html lang="en">
			<head></head>
			<body className="bg-black">
				<LayoutClient>{children}</LayoutClient>
			</body>
		</html>
	);
}
