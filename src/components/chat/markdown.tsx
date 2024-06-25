import React from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';


interface IMarkdown {
    message: string
}
const MarkdownRenderer = ({ message }: IMarkdown) => {

    return (
        <>
            <ReactMarkdown rehypePlugins={[rehypeRaw]} remarkPlugins={[remarkGfm]}>
                {message}
            </ReactMarkdown>
        </>
    );
};

export default MarkdownRenderer;