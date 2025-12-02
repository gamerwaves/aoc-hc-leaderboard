/**
 * Star information for a specific puzzle completion
 */
export interface StarInfo {
	get_star_ts: number;
	star_index: number;
}

/**
 * Completion data structure for a member
 * Maps day number to star completion info (1 or 2 stars per day)
 */
export type CompletionDayLevel = Record<string, Record<string, StarInfo>>;

/**
 * Member data from the Advent of Code leaderboard
 */
export interface Member {
	id: number;
	name: string | null;
	stars: number;
	local_score: number;
	last_star_ts: number;
	completion_day_level: CompletionDayLevel;
}

/**
 * Raw API response structure from Advent of Code
 */
export interface LeaderboardResponse {
	members: Record<string, Member>;
	owner_id: number;
	event: string;
}

/**
 * Error information for different error states
 */
export interface ErrorInfo {
	type: 'auth' | 'network' | 'config';
	message: string;
}

/**
 * Page data passed from server load function to page component
 */
export interface PageData {
	members: Member[] | null;
	error: ErrorInfo | null;
	leaderboardCode: string;
}
