import _, { intersection } from "lodash";
import { BufferGeometry, DoubleSide, Intersection, Mesh, MeshStandardMaterial, Object3D, Raycaster, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { Material } from "./materialUtils";
import { Order } from "./types";


export const stlToGeom = async (file: File) => {
    const fileUrl = URL.createObjectURL(file);

    const bufferGeom = await new STLLoader().loadAsync(fileUrl)
    return bufferGeom;
}

export const getSurfaceArea = (geometry: BufferGeometry) => {

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
            sum += surfaceAreaOfTriangle(p1, p2, p3);
        }
    }
    else {
        let index = geometry.index!;
        let faces = index.count / 3;
        for (let i = 0; i < faces; i++) {
            p1.fromBufferAttribute(position, index.array[i * 3 + 0]);
            p2.fromBufferAttribute(position, index.array[i * 3 + 1]);
            p3.fromBufferAttribute(position, index.array[i * 3 + 2]);
            sum += surfaceAreaOfTriangle(p1, p2, p3);
        }
    }
    return sum;
}

const getResolutionMultiplier = (resolution: number) => {
    switch (resolution) {
        case 100:
            return 1.15
        case 300:
            return 0.9;
    }

    return 1;
}

export const estimateOrderPrice = async (
    order: Order, materials: Material[],
    metricCache: Map<string, [number, number, number]> = new Map(),
    cutoffAngle: number = 0.959931, //55Deg
    wallThickness: number = 1.2,
    samples: number = 40,
    supportInfill: number = 0.15,
) => {
    let totalSum = 0;
    const material = materials.find(m => m.name == order.settings.material);
    if (!material) throw "Cannot find required material from list of materials";
    const { pricePerKg, density } = material;
    for (const part of order.parts) {
        const { file, quantity, settings } = part;
        const { infill, resolution } = settings;

        const resolutionFactor = getResolutionMultiplier(resolution);


        const geom = await stlToGeom(file);



        const metrics = metricCache.get(file.name) ?? computeGeometryMetrics(geom, samples, cutoffAngle);
        const [vol, supportVol, surfaceArea] = metrics;

        if (!metricCache.has(file.name)) {
            metricCache.set(file.name, metrics);
        }

        const unitPrice = computePrice(vol, supportVol, surfaceArea, pricePerKg, density, infill, supportInfill, wallThickness);
        totalSum += unitPrice * quantity * resolutionFactor;
    }

    return totalSum;
}

export const estimatePrice = (
    geometry: BufferGeometry, samples: number = 10,
    pricePerKg: number, density: number,
    infill: number, supportInfill: number, wallThickness: number = 1.2,
    cutoffAngle: number = 1.04, filteringDecimalPlaces: number = 8,
) => {
    const [volume, supportVolume, surfaceArea] = computeGeometryMetrics(geometry, samples, cutoffAngle, filteringDecimalPlaces);
    return computePrice(
        volume, supportVolume, surfaceArea,
        pricePerKg, density, infill, supportInfill, wallThickness);
}

// Density in kg/m^3
// volumes in mm^3
export const computePrice = (
    internalVolume: number, supportVolume: number, surfaceArea: number,
    pricePerKg: number, density: number,
    infill: number, supportInfill: number, wallThickness: number) => {
    const volume = computeVolume(
        internalVolume, supportVolume, surfaceArea,
        infill, supportInfill, wallThickness
    );
    const cubicMilisInMeters = 1000000000;
    const mass = volume / cubicMilisInMeters * density;
    return mass * pricePerKg;
}

export const computeVolume = (
    internalVolume: number, supportVolume: number, surfaceArea: number,
    infill: number, supportInfill: number, wallThickness: number
) => {
    const saComponent = wallThickness * surfaceArea;
    const volumeComponent = infill * internalVolume + supportVolume * supportInfill;
    return saComponent + volumeComponent;
}
/// Returns [internalVolume, supportVolume, surfaceArea]
export const computeGeometryMetrics = (geometry: BufferGeometry, samples: number = 10, cutoffAngle: number = 1.04, filteringDecimalPlaces = 8): [number, number, number] => {

    geometry.computeBoundingBox();

    if (!geometry.boundingBox) throw "Could not compute geometry's bounding box";

    const { min, max } = geometry.boundingBox;
    const xRange = max.x - min.x;
    const yRange = max.y - min.y;

    const ray = new Raycaster();
    ray.far = yRange + 1;
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


            const rawIntersections = ray
                .intersectObject(mesh)
                .map<[Intersection, number, boolean]>(x => [x, +x.distance.toFixed(filteringDecimalPlaces), x.face!.normal.angleTo(down) > 1.5708]);


            // Make points unique based on both location and whether the point is incoming or outgoing 
            // This means that even 0 thickness areas will be accounted for
            const intersections = _.uniqWith(rawIntersections,
                ([, aDist, aEnter], [, bDist, bEnter]) =>
                    +aDist.toFixed(filteringDecimalPlaces) == +bDist.toFixed(filteringDecimalPlaces) &&
                    aEnter == bEnter)
                .map(([x]) => x);

            for (let pair = 0; pair < Math.floor(intersections.length / 2); pair++) {
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
    const modelSurfaceArea = getSurfaceArea(geometry);

    return [internal * sampleSurfaceArea, support * sampleSurfaceArea, modelSurfaceArea];
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

// Warning: This mutates p1 and p2
const surfaceAreaOfTriangle = (p1: Vector3, p2: Vector3, p3: Vector3) => {
    p1.sub(p3);
    p2.sub(p3);
    const cross = p1.cross(p2);
    return cross.length() / 2;
}