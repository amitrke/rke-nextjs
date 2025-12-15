import probe from 'probe-image-size';

export type ProbedImageSize = {
    width: number;
    height: number;
};

export async function probeRemoteImage(url: string): Promise<ProbedImageSize> {
    const { width, height } = await probe(url);
    return { width, height };
}
