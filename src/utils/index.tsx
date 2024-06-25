export const streamToBuffer = async (stream: { getReader: () => any; }) => {
    const reader = stream.getReader();
    const chunks = [];
    let done, value;

    while (!done) {
        ({ done, value } = await reader.read());
        if (value) {
            chunks.push(value);
        }
    }

    return Buffer.concat(chunks);
};