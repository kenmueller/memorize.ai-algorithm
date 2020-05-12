/**
 * memorize.ai Algorithm
 *
 * See types.ts for data types
 * Inputs an array of past `Attempt`s, and the current `Attempt`
 * Outputs a `number` - The offset, in seconds, of the next due date
 *
 * Input type: `Input`
 * Label type: `number`
 */

import predict from './predict'

import trainingData from './data/training'
import testingData from './data/testing'

predict(trainingData, testingData[0])
	.then(console.log)
	.catch(console.error)
