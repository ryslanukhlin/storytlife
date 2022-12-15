export const hidingLargeText = (txt: string) => {
    let hidderStr = txt.substring(0, 200);
    hidderStr += '...';
    return hidderStr;
};
