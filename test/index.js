const getCars = async () =>
	(await (await fetch('https://storage.googleapis.com/tfjs-tutorials/carsData.json')).json())
		.map(car => ({
			mpg: car.Miles_per_Gallon,
			horsepower: car.Horsepower
		}))
		.filter(({ mpg, horsepower }) => mpg && horsepower)

const createModel = () => {
	const model = tf.sequential()
	
	model.add(tf.layers.dense({ inputShape: [1], units: 1, useBias: true }))
	model.add(tf.layers.dense({ units: 1 }))
	
	return model
}

const convertToTensor = cars =>
	tf.tidy(() => {
		tf.util.shuffle(cars)
		
		const inputs = cars.map(car => car.horsepower)
		const labels = cars.map(car => car.mpg)
		
		const inputTensor = tf.tensor2d(inputs, [inputs.length, 1])
		const labelTensor = tf.tensor2d(labels, [labels.length, 1])
		
		const inputMax = inputTensor.max()
		const inputMin = inputTensor.min()
		const labelMax = labelTensor.max()
		const labelMin = labelTensor.min()
		
		const normalizedInputs = inputTensor.sub(inputMin).div(inputMax.sub(inputMin))
		const normalizedLabels = labelTensor.sub(labelMin).div(labelMax.sub(labelMin))
		
		return {
			inputs: normalizedInputs,
			labels: normalizedLabels,
			inputMax,
			inputMin,
			labelMax,
			labelMin
		}
	})

const trainModel = (model, inputs, labels) => {
	model.compile({
		optimizer: tf.train.adam(),
		loss: tf.losses.meanSquaredError,
		metrics: ['mse']
	})
	
	return model.fit(inputs, labels, {
		batchSize: 32,
		epochs: 50,
		callbacks: tfvis.show.fitCallbacks(
			{ name: 'Training performance' },
			['loss', 'mse'],
			{ height: 200, callbacks: ['onEpochEnd'] }
		)
	})
}

const testModel = (model, cars, normalizedData) => {
	const { inputMax, inputMin, labelMax, labelMin } = normalizedData
	
	const [xs, predictions] = tf.tidy(() => {
		const xs = tf.linspace(0, 1, 100)
		const predictions = model.predict(xs.reshape([100, 1]))
		
		const unNormXs = xs.mul(inputMax.sub(inputMin)).add(inputMin)
		const unNormPredictions = predictions.mul(labelMax.sub(labelMin)).add(labelMin)
		
		return [unNormXs.dataSync(), unNormPredictions.dataSync()]
	})
	
	const predictedPoints = [...xs].map((x, i) => ({ x, y: predictions[i] }))
	const originalPoints = cars.map(car => ({
		x: car.horsepower,
		y: car.mpg
	}))
	
	tfvis.render.scatterplot(
		{ name: 'Model predictions vs Original data' },
		{
			values: [originalPoints, predictedPoints],
			series: ['original', 'predicted']
		},
		{
			xLabel: 'Horsepower',
			yLabel: 'MPG',
			height: 300
		}
	)
}

const run = async () => {
	const cars = await getCars()
	const values = cars.map(car => ({
		x: car.horsepower,
		y: car.mpg
	}))
	
	tfvis.render.scatterplot(
		{ name: 'Horsepower vs MPG' },
		{ values },
		{
			xLabel: 'Horsepower',
			yLabel: 'MPG',
			height: 300
		}
	)
	
	const model = createModel()
	
	tfvis.show.modelSummary({ name: 'Model summary' }, model)
	
	const tensorData = convertToTensor(cars)
	const { inputs, labels } = tensorData
	
	console.time('train')
	
	await trainModel(model, inputs, labels)
	
	console.timeEnd('train')
	
	testModel(model, cars, tensorData)
}

run()
