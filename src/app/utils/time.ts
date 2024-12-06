

export function goDurationToMs(dur: number): number {
    const res = Math.floor(dur / 1_000_000);
    console.log(`converted go dur ${dur} to ms : ${res}`)
    return res
}