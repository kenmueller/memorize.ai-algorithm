import * as tf from '@tensorflow/tfjs-node'

import { TrainingDatum, Input } from './types'

const createModel = async (trainingData: TrainingDatum[]) => {
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
		metrics: ['mse'],
	})
	
	await model.fit(inputs, labels, { epochs: 50 })
	
	return model
}

export default async (trainingData: TrainingDatum[], input: Input) => {
	const model = await createModel(trainingData)
	
	return 0 // TODO: Predict based on `input`
}
