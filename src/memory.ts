/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { takeNodeMinimalHeap, config, IHeapSnapshot } from "@memlab/core";
import { filesize } from "filesize";

async function main() {
    let memoryUsage!: NodeJS.MemoryUsage;
    let heap!: IHeapSnapshot;

    config.muteConsole = true;
    const arrayBuffer = new ArrayBuffer(1024 * 1024 * 4); // 4 MiB
    const arrayOfObjects = new Array(1024).fill(0).map(() => ({}));
    const arrayOfClosures = new Array(1024).fill(0).map(() => () => {});
    const arrayOfStrings = new Array(1024 * 4)
        .fill(0)
        .map((_, i) =>
            new Array(1024).fill(String.fromCharCode(i % 255)).join()
        );

    // force garbage collection
    global.gc && global.gc();

    memoryUsage = process.memoryUsage();
    heap = await takeNodeMinimalHeap();

    let heapDumpSize = 0;
    const heapSizeByType: Record<string, number> = {};
    heap.nodes.forEach((node) => {
        heapDumpSize += node.self_size;
        if (!heapSizeByType[node.type]) {
            heapSizeByType[node.type] = node.self_size;
        } else {
            heapSizeByType[node.type] += node.self_size;
        }
    });

    console.log(`heapDumpSize from heap snapshot: ${filesize(heapDumpSize)}`);
    for (const [type, size] of Object.entries(heapSizeByType)) {
        console.log(`    ${type}: ${filesize(size)}`);
    }
    console.log();
    console.log(`process.memoryUsage():`);
    for (const [type, size] of Object.entries(memoryUsage)) {
        console.log(`    ${type}: ${filesize(size)}`);
    }
    console.log(
        `    heapUsed + arrayBuffers: ${filesize(
            memoryUsage.heapUsed + memoryUsage.arrayBuffers
        )}`
    );
    console.log(
        `    heapDumpSize - heapUsed - arrayBuffers: ${filesize(
            heapDumpSize - memoryUsage.heapUsed - memoryUsage.arrayBuffers
        )}`
    );
}

void main();
