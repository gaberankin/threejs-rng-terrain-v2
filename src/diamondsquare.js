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

	return Math.floor(Math.random() * max) + min;
}

function diamondSquare(width, roughness=0.2) {
	var field = new HeightField(width);

	const diamond = (x1, y1, x2, y2) => {
		const w = x2 - x1;
		if(w <= 1) {
			// do nothing if width is small.
			return;
		}
		// set corners
		field.set(x1, y1, rand());
		field.set(x1, y2, rand());
		field.set(x2, y1, rand());
		field.set(x2, y2, rand());

		// get corner value average
		const avg = (field.get(x1, y1) + field.get(x1, y2) + field.get(x2, y1) + field.get(x2, y2)) / 4;

		//find center
		const xC = Math.floor((x2 - x1) / 2) + x1,
			yC = Math.floor((y2 - y1) / 2) + y1;
		field.set(xC, yC, (rand() * roughness) + avg);

		// now do square :)
		square(x1, y1, x2, y2);
		return;
	};

	const square = (x1, y1, x2, y2) => {
		const w = x2 - x1;
		if(w <= 1) {
			// do nothing if width is small.
			return;
		}

		// get center points to use in edge assignment
		const xC = Math.floor((x2 - x1) / 2) + x1,
			yC = Math.floor((y2 - y1) / 2) + y1;

		// get edge averages based on adjacent corners and center
		const avgT = (field.get(x1, y1) + field.get(x1, y2) + field.get(xC, yC)) / 3,
			avgL = (field.get(x2, y1) + field.get(x2, y2) + field.get(xC, yC)) / 3,
			avgB = (field.get(x1, y2) + field.get(x2, y2) + field.get(xC, yC)) / 3,
			avgR = (field.get(x1, y1) + field.get(x2, y1) + field.get(xC, yC)) / 3;

		// set edge values
		field.set(xC, y1, (rand() * roughness) + avgT);	// TOP
		field.set(x2, yC, (rand() * roughness) + avgL);	// LEFT
		field.set(xC, y2, (rand() * roughness) + avgB);	// BOTTOM
		field.set(x1, yC, (rand() * roughness) + avgR);	// RIGHT


		// now subdivide and do diamond for each subdivision, but only if necessary (if the width of the subdivision has changed from original width)
		if (xC - x1 < w) {
			// console.log(`left: (${xC} - ${x1} = ${xC - x1}) < ${w}`);
			diamond(x1, y1, xC, yC);	// TOP LEFT
			diamond(x1, yC, xC, y2);	// BOTTOM LEFT
		}
		if (x2 - xC < w) {
			// console.log(`left: (${x2} - ${xC} = ${x2 - xC}) < ${w}`);
			diamond(xC, y1, x2, yC);	// TOP RIGHT
			diamond(xC, yC, x2, y2);	// BOTTOM RIGHT
		}
		
		return;
	};

	diamond(0, 0, width - 1, width - 1);
	return field;
}

export default diamondSquare;

// let f = diamondSquare(11);
// console.log(`${f}`);
// console.log(`${f.getUnset()}`);