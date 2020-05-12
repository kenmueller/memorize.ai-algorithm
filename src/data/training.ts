import { PerformanceRating, TrainingDatum } from '../types'

const data: TrainingDatum[] = [
	{
		input: {
			attempts: [],
			attempt: {
				rating: PerformanceRating.Forgot,
				elapsed: 0
			}
		},
		label: 86400
	},
	{
		input: {
			attempts: [
				{
					rating: PerformanceRating.Forgot,
					elapsed: 0
				}
			],
			attempt: {
				rating: PerformanceRating.Struggled,
				elapsed: 86400
			}
		},
		label: 259200
	},
	{
		input: {
			attempts: [
				{
					rating: PerformanceRating.Forgot,
					elapsed: 0
				},
				{
					rating: PerformanceRating.Struggled,
					elapsed: 86400
				}
			],
			attempt: {
				rating: PerformanceRating.Easy,
				elapsed: 259200
			}
		},
		label: 604800
	}
]

export default data
