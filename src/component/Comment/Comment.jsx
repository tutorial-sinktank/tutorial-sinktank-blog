import React, {useEffect, useRef, useState} from 'react'

const Comment = () => {
    const [status, setStatus] = useState('pending');
    const commentsElements = useRef();

    useEffect(() => {
        const scriptEl = document.createElement('script');
        scriptEl.onload = () => setStatus('success' );
        scriptEl.onerror = () => setStatus('failed' );
        scriptEl.async = true
        scriptEl.src = 'https://utteranc.es/client.js'
        scriptEl.setAttribute('repo', 'tutorial-sinktank/tutorial-sinktank-blog')
        scriptEl.setAttribute('issue-term', 'title')
        scriptEl.setAttribute('theme', 'github-light')
        scriptEl.setAttribute('crossorigin', 'anonymous')
        commentsElements.current.appendChild(scriptEl)
    }, [])

    return (
        <div className="comments-wrapper">
            {status === 'failed' && <div>Error. Please try again.</div>}
            {status === 'pending' && <div>Loading script...</div>}
            <div ref={commentsElements} />
        </div>
    );
}

export default Comment