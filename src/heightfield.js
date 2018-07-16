import * as THREE from "three";

export default class HeightField {
	constructor(width) {
		this.w = width;
		this.l = this.w * this.w;
		this.f = new Array(width * width);
	}
	get(x, y = null) {
		let p;
		if(y === null) {
			// if y is null, then we're doing it based on array index position rather than xy so conversion isn't necessary.
			p = x;
		} else {
			p = x * this.w + y;
		}

		if(p >= this.l) {
			throw new Error(`Index out of bounds - calculated index ${p} is beyond size of height field ${this.l}`);
		}
		if(typeof this.f[p] != "number") {
			return 0;
		}
		return this.f[p];
	}
	indexToXY(ind) {
		const x = ind % this.w;
		const y = (ind - x) / this.w;
		return [x, y];
	}
	set(x, y, v) {
		const p = x * this.w + y;
		if(p >= this.l) {
			throw new Error(`Index out of bounds - calculated index ${p} is beyond size of height field ${this.l}`);
		}
		if(typeof this.f[p] != "number") {
			this.f[p] = v;
		}
	}
	/**
	 * returns list of coordinates that haven't been set
	 */
	getUnset() {
		let u = [];
		for(let p = 0, l = this.w; p < l; p++) {
			if(typeof this.f[p] != "number") {
				u.push(p);
			}
		}
		return u;
	}
	toString() {
		let s = "";
		for(let x = 0, l = this.w; x < l; x++) {
			for(let y = 0, l = this.w; y < l; y++) {
				s += this.get(x, y) + " ";
			}
			s = s.trim() + "\n";
		}
		return s.trim();
	}
	/**
	 * returns a Three.js geometry object representing the heightfield.
	 */
	geometry(minHeight=0, maxHeight=1) {
		let geo = new THREE.Geometry();

		for(let i = 0; i < this.l; i++) {
			//set up vertices
			let xy = this.indexToXY(i);
			let z = this.get(i) * (maxHeight - minHeight) + minHeight;
			// geo.vertices.push(new THREE.Vector3( xy[0] - this.w / 2, z, xy[1] - this.w / 2 ));
			let n = i * 8;
			geo.vertices.push(new THREE.Vector3( (xy[0] - 0.5) - (this.w / 2), minHeight, (xy[1] - 0.5) - (this.w / 2) ));	// 0,0,0 (0)
			geo.vertices.push(new THREE.Vector3( (xy[0] + 0.5) - (this.w / 2), minHeight, (xy[1] - 0.5) - (this.w / 2) ));	// 1,0,0 (1)
			geo.vertices.push(new THREE.Vector3( (xy[0] - 0.5) - (this.w / 2), z, (xy[1] - 0.5) - (this.w / 2) ));	// 0,0,1 (2)
			geo.vertices.push(new THREE.Vector3( (xy[0] + 0.5) - (this.w / 2), z, (xy[1] - 0.5) - (this.w / 2) ));	// 1,0,1 (3)

			geo.vertices.push(new THREE.Vector3( (xy[0] - 0.5) - (this.w / 2), minHeight, (xy[1] + 0.5) - (this.w / 2) ));	// 0,1,0 (4)
			geo.vertices.push(new THREE.Vector3( (xy[0] + 0.5) - (this.w / 2), minHeight, (xy[1] + 0.5) - (this.w / 2) ));	// 1,1,0 (5)
			geo.vertices.push(new THREE.Vector3( (xy[0] - 0.5) - (this.w / 2), z, (xy[1] + 0.5) - (this.w / 2) ));	// 0,1,1 (6)
			geo.vertices.push(new THREE.Vector3( (xy[0] + 0.5) - (this.w / 2), z, (xy[1] + 0.5) - (this.w / 2) ));	// 1,1,1 (7)


			let norm = new THREE.Vector3(0, -1, 0);
			geo.faces.push( new THREE.Face3( n, n + 2, n + 3, norm ) );
			geo.faces.push( new THREE.Face3( n, n + 3, n + 1, norm ) );
			norm = new THREE.Vector3(0, 1, 0);
			geo.faces.push( new THREE.Face3( n + 4, n + 7, n + 6, norm ) );
			geo.faces.push( new THREE.Face3( n + 4, n + 5, n + 7, norm ) );
			norm = new THREE.Vector3(1, 0, 0);
			geo.faces.push( new THREE.Face3( n + 5, n + 1, n + 7, norm ) );
			geo.faces.push( new THREE.Face3( n + 1, n + 3, n + 7, norm ) );
			norm = new THREE.Vector3(-1, 0, 0);
			geo.faces.push( new THREE.Face3( n, n + 4, n + 6, norm ) );
			geo.faces.push( new THREE.Face3( n, n + 6, n + 2, norm ) );
			norm = new THREE.Vector3(0, 0, 1);
			geo.faces.push( new THREE.Face3( n + 7, n + 3, n + 2, norm ) );
			geo.faces.push( new THREE.Face3( n + 7, n + 2, n + 6, norm ) );


		}
		// for(let n = 0, i = 0; i < this.l; i++, n++) {
		// 	//set up the triangles.
		// 	if((n + 1) % this.w === 0){	//don't get the right edge
		// 		n++;
		// 	}

		// 	geo.faces.push( new THREE.Face3( n, n + this.w, n + this.w + 1 ) );
		// 	geo.faces.push( new THREE.Face3( n, n + this.w + 1, n + 1 ) );
		// }
		return geo;
	}
}
