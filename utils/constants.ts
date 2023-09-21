export const MIN_CONSECUTIVE_HOURS = 4 as const; // Make it dynamic?
export const MINUTE = 1000 * 60; // can't be as const :(
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const CIRCLE_360 = 360 as const;

export const CARDINAL_POINTS = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"] as const;
export const CARDINAL_SYMBOLS = ["⮝", "⬈", "⮞", "⬊", "⮟", "⬋", "⮜", "⬉"] as const;
export const STRENGTH_SYMBOLS = ["🟩", "🟨", "🟧", "🟥"] as const;
