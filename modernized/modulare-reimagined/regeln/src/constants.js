// Spielregeln, die für alle Apps gleich gelten. Die Werte stammen aus der Legacy-App
// (profile.js, rounds.js, quiz.js). Änderungen wirken auf alle Apps und brauchen angepasste Tests.

/** Tagesziel in XP (profile.js:5). */
export const DAILY_GOAL_XP = 30;

/** Tagesziele, aus denen die Lernenden wählen. Alles andere im Profil gilt als nicht gesetzt (dailyGoal). */
export const GOAL_CHOICES = Object.freeze([20, 30, 50]);

/** Nach so vielen Tagen ohne Übung ist eine Seite zum Auffrischen fällig (profile.js:12). */
export const DUE_DAYS = 3;

/**
 * Seiten, die zuletzt mit mindestens REFRESH_STRONG_ACCURACY gelöst wurden, sitzen fester:
 * sie sind erst nach so vielen Tagen zum Auffrischen fällig (Spec Gamification: Lernwirkung,
 * Auffrischen nach Genauigkeit). Ohne gespeicherte Genauigkeit gilt weiter DUE_DAYS.
 */
export const DUE_DAYS_STRONG = 7;

/**
 * Abstände in Tagen, wenn eine Seite beim Auffrischen sitzt. Jede gelungene Auffrischung rückt eine Stufe weiter,
 * sonst wäre eine fertige Seite für immer alle paar Tage fällig. Die ersten zwei Stufen sind DUE_DAYS und DUE_DAYS_STRONG.
 */
export const REVIEW_STEPS = Object.freeze([DUE_DAYS, DUE_DAYS_STRONG, 14, 30, 60]);

/** Untergrenzen der Trefferquote für 3 bzw. 2 Sterne (profile.js:76). */
export const STAR_THRESHOLDS = Object.freeze({ three: 0.9, two: 0.7 });

/** Ab dieser letzten Genauigkeit gilt die längere Frist DUE_DAYS_STRONG. Gekoppelt an die 3-Sterne-Schwelle. */
export const REFRESH_STRONG_ACCURACY = STAR_THRESHOLDS.three;

/**
 * Höchstens so viele Kalendertage dürfen zwischen zwei Übungstagen liegen, damit die Serie
 * bleibt. Der eine ausgelassene Tag ist der Gnadentag (profile.js:39-41).
 */
export const STREAK_MAX_GAP_DAYS = 2;

/** Je so vielen richtigen Antworten in Folge steigt der Combo-Faktor um eins (profile.js:73). */
export const COMBO_STEP = 3;

/** Der Combo-Faktor wird nie größer als dieser Wert (profile.js:73). */
export const MAX_MULTIPLIER = 4;

/** Bonus für eine fällige Seite, die wieder geübt wird (rounds.js:21). */
export const REFRESH_BONUS_XP = 10;

/** Bonus für einen gewonnenen Endgegner (rounds.js:34). */
export const BOSS_BONUS_XP = 50;

/** Eine knapp richtige Antwort zählt halb bei der Trefferquote (quiz.js:149). */
export const ALMOST_WEIGHT = 0.5;

/** Seiten unter dieser Genauigkeit gelten als Übungsbedarf (profile.js:92). */
export const WEAK_ACCURACY = 0.9;

/** Ab so vielen Sternen gilt eine Seite als abgeschlossen (profile.js:92). */
export const MAX_STARS = 3;

/** Belohnung je erfüllter Wochenmission, einmal pro Woche und Mission (Spec Gamification: Lernwirkung, 5.7). */
export const MISSION_REWARD_XP = 20;
