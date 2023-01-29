// import {Api} from "./api";
//
// type FromTo = {
//     from: number;
//     to: number;
// };
//
// export type Versions = Record<string, FromTo>;
//
// const updateVersions = (
//     versions: Versions,
//     version: string,
//     blockNumber: number
// ): void => {
//     if (!versions[version]) {
//         versions[version] = { from: blockNumber, to: blockNumber };
//
//         return;
//     }
//
//     if (versions[version].from > blockNumber) {
//         versions[version].from = blockNumber;
//     }
//
//     if (versions[version].to < blockNumber) {
//         versions[version].to = blockNumber;
//     }
// };
//
// export async function getVersionRanges(
//     api: Api,
//     from: number,
//     to: number,
//     versions: Versions
// ): Promise<void> {
//     const [fromVersion, toVersion] = await Promise.all([
//         await api.getVersionAt(from),
//         await api.getVersionAt(to),
//     ]);
//
//     updateVersions(versions, fromVersion, from);
//     updateVersions(versions, toVersion, to);
//
//     if (fromVersion === toVersion) return;
//     if (to - from <= 1) return;
//
//     const middle = Math.floor((to + from) / 2);
//
//     await getVersionRanges(api, from, middle, versions);
//     await getVersionRanges(api, middle, to, versions);
// }