import { env } from '$env/dynamic/private';
import type { LeaderboardResponse } from '$lib/types';
import { fail } from '@sveltejs/kit';

async function fetchLeaderboard(leaderboardCode: string, sessionCookie: string) {
	const apiUrl = `https://adventofcode.com/2025/leaderboard/private/view/${leaderboardCode}.json`;
	const response = await fetch(apiUrl, {
		headers: {
			'Cookie': `session=${sessionCookie}`,
			'User-Agent': 'github.com/yourusername/aoc-leaderboard'
		}
	});

	if (!response.ok) {
		throw new Error('auth');
	}

	const text = await response.text();
	
	if (text.includes("You don't have permission")) {
		throw new Error('permission');
	}

	return JSON.parse(text) as LeaderboardResponse;
}

/**
 * Server-side load function that fetches leaderboard data
 */
export async function load({ cookies }) {
	const leaderboardCode = env.AOC_LEADERBOARD_CODE || '';
	const joinCode = env.AOC_JOIN_CODE || '';
	
	// Try to get session cookie from: 1) user's cookie, 2) env variable
	const userCookie = cookies.get('aoc_session');
	const sessionCookie = userCookie || env.AOC_SESSION_COOKIE || '';

	if (!leaderboardCode) {
		return {
			leaderboardCode,
			joinCode,
			showCookieInput: !sessionCookie,
			error: {
				type: 'config',
				message: 'AOC_LEADERBOARD_CODE environment variable is not set.'
			}
		};
	}

	if (!sessionCookie) {
		return {
			leaderboardCode,
			joinCode,
			showCookieInput: true
		};
	}

	// Fetch leaderboard with the session cookie
	try {
		const leaderboardData = await fetchLeaderboard(leaderboardCode, sessionCookie);
		
		return {
			leaderboardCode,
			joinCode,
			leaderboardData,
			showCookieInput: false
		};
	} catch (err) {
		const errorMessage = err instanceof Error ? err.message : 'unknown';
		
		if (errorMessage === 'permission') {
			return {
				leaderboardCode,
				joinCode,
				showCookieInput: true,
				error: {
					type: 'auth',
					message: `You don't have permission to view this private leaderboard.${joinCode ? ` Join using code: ${joinCode}` : ''}`
				}
			};
		}
		
		return {
			leaderboardCode,
			joinCode,
			showCookieInput: true,
			error: {
				type: 'auth',
				message: 'Failed to fetch leaderboard. Please check your session cookie.'
			}
		};
	}
}

/**
 * Form action to submit session cookie
 */
export const actions = {
	setCookie: async ({ request, cookies }) => {
		const data = await request.formData();
		const sessionCookie = data.get('sessionCookie')?.toString() || '';
		const leaderboardCode = env.AOC_LEADERBOARD_CODE || '';
		const joinCode = env.AOC_JOIN_CODE || '';

		if (!sessionCookie.trim()) {
			return fail(400, { 
				error: 'Please enter a session cookie',
				leaderboardCode,
				joinCode
			});
		}

		if (!leaderboardCode) {
			return fail(400, { 
				error: 'AOC_LEADERBOARD_CODE is not configured',
				leaderboardCode,
				joinCode
			});
		}

		// Try to fetch with the provided cookie
		try {
			await fetchLeaderboard(leaderboardCode, sessionCookie);
			
			// If successful, store the cookie
			cookies.set('aoc_session', sessionCookie, {
				path: '/',
				httpOnly: true,
				secure: false,
				sameSite: 'lax',
				maxAge: 60 * 60 * 24 * 30 // 30 days
			});

			return { success: true };
		} catch (err) {
			const errorMessage = err instanceof Error ? err.message : 'unknown';
			
			if (errorMessage === 'permission') {
				return fail(403, { 
					error: `You don't have permission to view this leaderboard.${joinCode ? ` Join using code: ${joinCode}` : ''}`,
					leaderboardCode,
					joinCode
				});
			}
			
			return fail(401, { 
				error: 'Invalid session cookie or unable to fetch leaderboard',
				leaderboardCode,
				joinCode
			});
		}
	},

	clearCookie: async ({ cookies }) => {
		cookies.delete('aoc_session', { path: '/' });
		return { success: true };
	}
};
