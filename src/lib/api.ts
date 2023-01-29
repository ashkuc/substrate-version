import { ApiPromise, WsProvider } from "@polkadot/api";

export class Api {
  calls = 0;

  versionCache: Map<number, string> = new Map();

  constructor(private readonly apiPromise: ApiPromise) {}

  async getLastBlock(): Promise<number> {
    this.calls += 1;

    const header = await this.apiPromise.rpc.chain.getHeader();

    return header.number.toNumber();
  }

  async getVersionAt(blockNumber: number): Promise<string> {
    if (this.versionCache.has(blockNumber)) {
      return this.versionCache.get(blockNumber)!;
    }

    this.calls += 1;

    const blockHash = await this.apiPromise.rpc.chain.getBlockHash(blockNumber);

    const { specName, specVersion } =
      await this.apiPromise.rpc.state.getRuntimeVersion(blockHash);

    const version = `${specName.toString()}/${specVersion.toString()}`;

    this.versionCache.set(blockNumber, version);

    console.log(`${blockNumber}:${version}`);

    return version;
  }

  static async create(url: string): Promise<Api> {
    const provider = new WsProvider(url);
    const apiPromise = await ApiPromise.create({ provider });

    return new Api(apiPromise);
  }
}
