import _, { find, intersection } from "lodash";
import { BufferGeometry, DoubleSide, Intersection, Mesh, MeshStandardMaterial, Object3D, Raycaster, TriangleFanDrawMode, Vector3 } from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader";
import { mergeVertices, toTrianglesDrawMode } from "three/examples/jsm/utils/BufferGeometryUtils";
import { Order, Material } from "./types";
import { CUBIC_MM_IN_CUBIC_M } from "./constants";


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

export const findMatch = (value: number, pairs: [number, number][]) => {
    const pair = _.findLast(pairs, ([cutoff,]) => value >= cutoff) ?? _.last(pairs);
    if (pair == undefined) throw "Cannot find any values that match";
    const [, output] = pair;

    return output;
}


// Finds an exact match for the value or returns the default value
const findExactMatch = (value: number, pairs: [number, number][], defaultVal: number) => {
    const pair = find(pairs, ([key]) => key == value);
    if (!pair) return defaultVal;
    const [, output] = pair;
    return output;
}



export const getOrderPrice = (
    orderCost: number, markup: number,
    valueDiscounts: [number, number][]
) => {
    const price = orderCost * markup;

    const valueDiscount = findMatch(price, valueDiscounts);
    return price * (1 - valueDiscount);
}


export const estimateLeadTime = async (
    order: Order, materials: Material[],
    metricCache: Map<string, [number, number, number]> = new Map(),
    cutoffAngle: number = 0.959931, //55Deg
    wallThickness: number = 1.2,
    samples: number = 40,
    supportInfill: number = 0.15,
) => {

    const material = materials.find(m => m.name == order.settings.material);
    if (!material) throw "Cannot find required material from list of materials";

    let totalDays = 0;


    for (const part of order.parts) {
        const { file, quantity, settings } = part;
        const { infill } = settings;
        const geom = await stlToGeom(file);
        const metrics = metricCache.get(file.name) ?? computeGeometryMetrics(geom, samples, cutoffAngle, wallThickness);
        const [vol, supportVol, surfaceArea] = metrics;

        if (!metricCache.has(file.name)) {
            metricCache.set(file.name, metrics);
        }

        const totalVol = computeVolume(
            vol, supportVol, surfaceArea,
            infill, supportInfill, wallThickness
        );

        const volInMetersCubed = totalVol / CUBIC_MM_IN_CUBIC_M;
        totalDays += volInMetersCubed * material.daysPerCubicMeter * quantity;
    }

    return Math.ceil(totalDays);
}

export const estimateOrderCost = async (
    order: Order, materials: Material[],
    metricCache: Map<string, [number, number, number]> = new Map(),
    quantityDiscounts: [number, number][],
    resolutionPriceMultipliers: [number, number][],
    infillPriceMultipliers: [number, number][],
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



        const geom = await stlToGeom(file);
        const metrics = metricCache.get(file.name) ?? computeGeometryMetrics(geom, samples, cutoffAngle, wallThickness);
        const [vol, supportVol, surfaceArea] = metrics;

        if (!metricCache.has(file.name)) {
            metricCache.set(file.name, metrics);
        }

        // Look for a matching multiplier or return 1 (no resolution change)
        const resolutionFactor = findExactMatch(resolution, resolutionPriceMultipliers, 1);
        const unitPrice = computePrice(vol, supportVol, surfaceArea, pricePerKg, density, infill, supportInfill, wallThickness);
        const quantityDiscount = findMatch(quantity, quantityDiscounts);
        const infillFactor = findMatch(infill, infillPriceMultipliers);
        totalSum += unitPrice * quantity * resolutionFactor * infillFactor * (1 - quantityDiscount);
    }

    return totalSum;
}

export const scaleNormals = (inputGeometry: BufferGeometry, ratio: number): BufferGeometry => {
    const noNormalGeom = inputGeometry.clone();
    noNormalGeom.deleteAttribute('normal');
    const geometry = mergeVertices(noNormalGeom, 0.000001);
    geometry.computeVertexNormals();
    geometry.normalizeNormals();


    if (!geometry.isBufferGeometry) {
        console.log("'geometry' must be an indexed or non-indexed buffer geometry");
        return geometry;
    }
    var isIndexed = geometry.index !== null;
    let position = geometry.attributes.position;
    let normal = geometry.attributes.normal;
    let tempVert = new Vector3(),
        tempNormal = new Vector3();
    let vertices = position.count;
    for (let i = 0; i < vertices; i++) {
        tempVert.fromBufferAttribute(position, i);
        tempNormal.fromBufferAttribute(normal, i);
        tempNormal.normalize();

        tempNormal.multiplyScalar(ratio);
        tempVert.add(tempNormal);
        const { x, y, z } = tempVert;
        geometry.attributes.position.setXYZ(i, x, y, z);
    }


    return geometry;
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
    const mass = volume / CUBIC_MM_IN_CUBIC_M * density;
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
export const computeGeometryMetrics = (
    geometry: BufferGeometry, samples: number = 10, cutoffAngle: number = 1.04,
    wallThickness: number = 1.2, filteringDecimalPlaces = 8): [number, number, number] => {

    geometry.computeBoundingBox();

    if (!geometry.boundingBox) throw "Could not compute geometry's bounding box";

    const { min, max } = geometry.boundingBox;
    const xRange = max.x - min.x;
    const yRange = max.y - min.y;

    const ray = new Raycaster();
    ray.far = yRange + 1;
    const material = new MeshStandardMaterial();

    material.side = DoubleSide;

    const internalGeometry = scaleNormals(geometry, -wallThickness);

    const mesh = new Mesh(internalGeometry, material);

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