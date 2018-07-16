import HeightField from "./heightfield";


function rand(min = null, max = null) {
	if (min === null && max === null) {
		return Math.random();
	}
	if (min === null) {
		min = 0;
	}

	if (max === null) {
		max = 10;
	}

	return Math.random() * max + min;
}


export default function hillGenerator(width, min = 0, max = 10, numHills = 2, flattening = 1) {
	var field = new HeightField(width);
	let valMin = null, valMax = null;

	const addHill = () => {
		const radius = Math.round(rand(min, max));
		let x, y, distSq, height, xMin, xMax, yMin, yMax,
			radiusSq = radius * radius;

		x = Math.round(rand(-radius, width + radius));
		y = Math.round(rand(-radius, width + radius));

		xMin = x - radius - 1;
		xMax = x + radius + 1;
		if(xMin < 0) xMin = 0;
		if(xMax >= width) xMax = width - 1;

		yMin = y - radius - 1;
		yMax = y + radius + 1;
		if(yMin < 0) yMin = 0;
		if(yMax >= width) yMax = width - 1;

		for(var i = xMin; i <= xMax; ++i) {
			for(var j = yMin; j <= yMax; ++j) {
				distSq = (x - i) * (x - i) + (y - j) * (y - j);
				height = radiusSq - distSq;
				if(height > 0){
					let v = field.get(i, j) + height;
					if(valMin === null || v < valMin) {
						valMin = v;
					}
					if(valMax === null || v > valMax) {
						valMax = v;
					}
					field.set(i, j, v);
				}
			}
		}
	};

	const normalizeHills = () => {
		if (valMin === null) {
			valMin = 0;
		}
		if (valMax === null) {
			valMax == 0;
		}
		for( let x = 0; x < width; ++x ) {
			for( let y = 0; y < width; ++y ) {
				field.set( x, y, Math.round(10*(( field.get( x, y ) - valMin ) / ( valMax - valMin )) ));
			}
		}
	};

	const flatten = () => {
		if( flattening > 1 ) {
			for( let x = 0; x < width; ++x ) {
				for( let y = 0; y < width; ++y ) {
					let flat = 1.0;
					let original = field.get( x, y );

					// flatten as many times as desired
					for( let i = 0; i < flattening; ++i ) {
						flat *= original;
					}

					// put it back into the cell
					field.set( x, y, flat );
				}
			}
		}
	};

	for(var h = 0; h < numHills; h++) {
		addHill();
	}
	normalizeHills();
	flatten();

	return field;
}
