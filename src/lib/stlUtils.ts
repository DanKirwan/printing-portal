import _, { intersection } from "lodash";
import { BufferGeometry, DoubleSide, Mesh, MeshStandardMaterial, Raycaster, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";


export const stlToGeom = async (file: File) => {
    const fileUrl = URL.createObjectURL(file);

    const bufferGeom = await new STLLoader().loadAsync(fileUrl)
    return bufferGeom;
}


/// Returns the internal volume and support material volume for an object
export const estimateVolume = (geometry: BufferGeometry, samples: number = 10, cutoffAngle: number = 1.04): [number, number] => {

    geometry.computeBoundingBox();

    if (!geometry.boundingBox) throw "Could not compute geometry's bounding box";

    const { min, max } = geometry.boundingBox;
    const xRange = max.x - min.x;
    const yRange = max.y - min.y;

    const ray = new Raycaster();
    const material = new MeshStandardMaterial();

    material.side = DoubleSide;

    const mesh = new Mesh(geometry, material);

    const origin = new Vector3();
    const up = new Vector3(0, 0, 1);
    const down = new Vector3(0, 0, -1);


    let support = 0;
    let internal = 0;

    for (let i = 0; i < samples; i++) {
        for (let j = 0; j < samples; j++) {
            const x = min.x + (i / samples) * xRange;
            const y = min.y + (j / samples) * yRange;
            origin.set(x, y, min.z);
            ray.set(origin, up);

            let prevHeight = 0;


            const intersections = _.uniqBy(ray.intersectObject(mesh), x => x.distance);

            for (let pair = 0; pair < intersections.length / 2; pair++) {
                const enterIntersection = intersections[pair * 2];
                const leaveIntersection = intersections[pair * 2 + 1];

                internal += (leaveIntersection.distance - enterIntersection.distance);
                const intersectionAngle = enterIntersection.face!.normal.angleTo(down);
                if (intersectionAngle < cutoffAngle) {
                    support += (enterIntersection.distance - prevHeight);
                }

                prevHeight = leaveIntersection.distance;
            }
            57
        }
    }

    const sampleSurfaceArea = (xRange / samples) * (yRange / samples);

    return [internal * sampleSurfaceArea, support * sampleSurfaceArea];
}

export const getVolume = (geometry: BufferGeometry) => {
    if (!geometry.isBufferGeometry) {
        console.log("'geometry' must be an indexed or non-indexed buffer geometry");
        return 0;
    }
    var isIndexed = geometry.index !== null;
    let position = geometry.attributes.position;
    let sum = 0;
    let p1 = new Vector3(),
        p2 = new Vector3(),
        p3 = new Vector3();
    if (!isIndexed) {
        let faces = position.count / 3;
        for (let i = 0; i < faces; i++) {
            p1.fromBufferAttribute(position, i * 3 + 0);
            p2.fromBufferAttribute(position, i * 3 + 1);
            p3.fromBufferAttribute(position, i * 3 + 2);
            sum += signedVolumeOfTriangle(p1, p2, p3);
        }
    }
    else {
        let index = geometry.index!;
        let faces = index.count / 3;
        for (let i = 0; i < faces; i++) {
            p1.fromBufferAttribute(position, index.array[i * 3 + 0]);
            p2.fromBufferAttribute(position, index.array[i * 3 + 1]);
            p3.fromBufferAttribute(position, index.array[i * 3 + 2]);
            sum += signedVolumeOfTriangle(p1, p2, p3);
        }
    }
    return sum;
}

const signedVolumeOfTriangle = (p1: Vector3, p2: Vector3, p3: Vector3) => p1.dot(p2.cross(p3)) / 6.0;