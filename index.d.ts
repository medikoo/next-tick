export interface INextTick {
    (callback: () => void): void;
}

declare const nextTick: INextTick;
export default nextTick;
