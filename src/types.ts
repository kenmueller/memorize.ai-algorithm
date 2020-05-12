/**
 * A user-inputted performance rating
 */
export enum PerformanceRating {
	Forgot,
	Struggled,
	Easy
}

/**
 * A review attempt
 * 
 * @property rating The user's performance rating
 * @property elapsed The number of seconds since the previous attempt
 */
export interface Attempt {
	rating: PerformanceRating
	elapsed: number
}

/**
 * The input to the model
 * 
 * @property attempts All the previous attempts for this card
 * @property attempt The current attempt that you want to predict the due date for
 */
export interface Input {
	attempts: Attempt[]
	attempt: Attempt
}

/**
 * A single data piece used to train the model
 * 
 * @property input The input to the model
 * @property label The correct output of the model - the number of seconds to the next due date
 */
export interface TrainingDatum {
	input: Input
	label: number
}
