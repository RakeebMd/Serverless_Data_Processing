export default function ChatMessage({currentUser, message}) {
    const { text, sentBy } = message;
    let messageClass = ''
    if(sentBy === 'restaurant') {
        //Reference: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Conditional_Operator
        messageClass = currentUser.role?.toLowerCase() === 'owner'  ? "sent" : "received";
    } else {
        messageClass = sentBy === currentUser.email ? "sent" : "received";
    }

    return (
        <>
        <div className={`message ${messageClass}`}>
            <p>{text}</p>
        </div>
        </>
    );
}
