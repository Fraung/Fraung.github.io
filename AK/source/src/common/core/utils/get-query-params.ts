export function getQueryParams(url: string): {[key: string]: string} {
    const params = new URL(url).searchParams;

    const final = {};
    params.forEach((value, key) => {
        final[key] = value;
    });

    return final;
}
