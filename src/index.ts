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

import * as tf from '@tensorflow/tfjs-node'

import trainingData from './data/training'

(async () => {

const model = tf.sequential()

model.add(tf.layers.dense({ inputShape: [2], units: 1 })) // Input layer
model.add(tf.layers.dense({ units: 1 })) // Output layer

const { inputs, labels } = tf.tidy(() => {
	tf.util.shuffle(trainingData)
	
	const inputs = trainingData.map(d => d.input)
	const labels = trainingData.map(d => d.label)
	
	const inputTensor = tf.tensor2d([], [inputs.length, 1])
	const labelTensor = tf.tensor2d([], [labels.length, 1])
	
	return {
		inputs: inputTensor,
		labels: labelTensor
	}
})

model.compile({
	optimizer: tf.train.adam(),
	loss: tf.losses.meanSquaredError,
	metrics: ['mse']
})

await model.fit(inputs, labels, { epochs: 50 })

})()
