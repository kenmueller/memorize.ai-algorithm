import { PerformanceRating, Input } from '../types'

const data: Input[] = [
	{
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
	}
]

export default data
