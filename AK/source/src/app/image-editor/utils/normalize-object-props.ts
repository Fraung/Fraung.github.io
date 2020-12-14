import {ITextOptions, Shadow} from 'fabric/fabric-impl';

export function normalizeObjectProps(obj: ITextOptions): ITextOptions {
    const copy = {...obj};
    // no need to apply shadow, if it won't be visible
    if (copy.shadow && (copy.shadow as Shadow).offsetX === -1) {
        delete copy.shadow;
    }

    return copy;
}
