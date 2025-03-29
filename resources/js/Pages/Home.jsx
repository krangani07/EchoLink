import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import ChatLayout from "@/Layouts/ChatLayout";
import { Head } from "@inertiajs/react";
import { Children, useEffect, useState, useRef, useCallback } from "react";
import { ChatBubbleLeftRightIcon } from "@heroicons/react/24/outline";
import ConversationHeader from "@/Components/App/ConversationHeader";
import MessageItem from "@/Components/App/Messageitem";
import MessageInput from "@/Components/App/MessageInput";
import { useEventBus } from "@/Eventbus";
import axios from "axios"; // Correct import for axios
import AttachmentPreviewModal from "@/Components/App/AttachmentPreviewModal";

function Home({ selectedConversation = null, messages = null }) {
    const [localMessages, setLocalMessages] = useState([]);
    const [noMoreMessages, setNoMoreMessages] = useState(false);
    const [scrollFromBottom, setScrollFromBottom] = useState(0);
    const messagesCtrRef = useRef(null);
    const loadMoreIntersect = useRef(null);
    const [showAttachmentPreview, setShowAttachmentPreview] = useState(false);
    const [previewAttachment, setpreviewAttachment] = useState({});
    const { on } = useEventBus();
    const messageCreated = (message) => {
        if (
            selectedConversation &&
            selectedConversation.is_group &&
            selectedConversation.id == message.group_id
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
            // Scroll to bottom after new message
            setTimeout(() => {
                if (messagesCtrRef.current) {
                    messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
                }
            }, 100);
        }
        if (
            (selectedConversation &&
                selectedConversation.is_user &&
                selectedConversation.id == message.sender_id) ||
            selectedConversation.id == message.receiver_id
        ) {
            setLocalMessages((prevMessages) => [...prevMessages, message]);
            // Scroll to bottom after new message
            setTimeout(() => {
                if (messagesCtrRef.current) {
                    messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
                }
            }, 100);
        }
    };

    // Remove the duplicate useEffect and simplify the messageDeleted function
    const messageDeleted = (messageId) => {
        console.log("Message deleted event received with ID:", messageId);
        
        // Filter out the deleted message by ID
        setLocalMessages((prevMessages) => {
            console.log("Filtering messages, current count:", prevMessages.length);
            const filteredMessages = prevMessages.filter((m) => m.id !== messageId);
            console.log("Messages after filtering:", filteredMessages.length);
            return filteredMessages;
        });
    }

    // Keep only one useEffect for event listeners and remove the duplicate
    useEffect(() => {
        if (!messagesCtrRef.current) return;
        setTimeout(() => {
            messagesCtrRef.current.scrollTop =
                messagesCtrRef.current.scrollHeight;
        }, 10);
        messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
    
        console.log("Setting up event listeners");
        const offCreated = on("message.created", messageCreated);
        const offDeleted = on("messageDeleted", messageDeleted);
        
        setScrollFromBottom(0);
        setNoMoreMessages(false);
    
        return () => {
            console.log("Cleaning up event listeners");
            offCreated();
            offDeleted();
        };
    }, [selectedConversation]);
    
    // Remove this duplicate useEffect (lines ~115-135)
    // useEffect(() => {
    //     if (!messagesCtrRef.current) return;
    //     setTimeout(() => {
    //         messagesCtrRef.current.scrollTop =
    //             messagesCtrRef.current.scrollHeight;
    //     }, 10);
    //     messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
    // 
    //     const offCreated = on("message.created", messageCreated);
    //     // Make sure this matches the event name in MessageOptionsDropdown
    //     const offDeleted = on("messageDeleted", messageDeleted);
    // 
    //     setScrollFromBottom(0);
    //     setNoMoreMessages(false);
    // 
    //     return () => {
    //         offCreated();
    //         offDeleted();
    //     };
    // }, [selectedConversation]);

    const loadMoreMessages = useCallback(() => {
        if (noMoreMessages) {
            return;
        }

        const firstMessage = localMessages[0];
        axios // Use lowercase axios here
            .get(route("message.loadOlder", firstMessage.id))
            .then(({ data }) => {
                if (data.data.length === 0) {
                    setNoMoreMessages(true);
                    return;
                }
                // Calculate how much is scrolled from bottom and scroll to the same position from bottom after messages are loaded
                const scrollHeight = messagesCtrRef.current.scrollHeight;
                const scrollTop = messagesCtrRef.current.scrollTop;
                const clientHeight = messagesCtrRef.current.clientHeight;
                const tmpScrollFromBottom =
                    scrollHeight - scrollTop - clientHeight;
                console.log("tmpScrollFromBottom ", tmpScrollFromBottom);
                setScrollFromBottom(scrollHeight - scrollTop - clientHeight);

                setLocalMessages((prevMessages) => {
                    return [...data.data.reverse(), ...prevMessages];
                });
            });
    }, [localMessages, noMoreMessages]);

    const onAttachmentClick = (attachments, ind) => {
        setpreviewAttachment({
            attachments,
            ind,
        });
        // console.log("onAttachmentClick ", attachments);
        setShowAttachmentPreview(true);
    };
    // console.log("showAttachmentPreview", showAttachmentPreview);
    // console.log("previewAttachment", previewAttachment);
    useEffect(() => {
        if (!messagesCtrRef.current) return;
        setTimeout(() => {
            messagesCtrRef.current.scrollTop =
                messagesCtrRef.current.scrollHeight;
        }, 10);
        messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;

        const offCreated = on("message.created", messageCreated);
        // Make sure this matches the event name in MessageOptionsDropdown
        const offDeleted = on("messageDeleted", messageDeleted);

        setScrollFromBottom(0);
        setNoMoreMessages(false);

        return () => {
            offCreated();
            offDeleted();
        };
    }, [selectedConversation]);

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    useEffect(() => {
        // Recover scroll from bottom after messages are loaded
        if (messagesCtrRef.current && scrollFromBottom !== null) {
            messagesCtrRef.current.scrollTop =
                messagesCtrRef.current.scrollHeight -
                messagesCtrRef.current.offsetHeight -
                scrollFromBottom;
        }

        if (noMoreMessages) {
            return;
        }
        const observer = new IntersectionObserver(
            (entries) =>
                entries.forEach(
                    (entry) => entry.isIntersecting && loadMoreMessages()
                ),
            {
                rootMargin: "0px 0px 250px 0px",
            }
        );

        if (loadMoreIntersect.current) {
            setTimeout(() => {
                observer.observe(loadMoreIntersect.current);
            }, 100);
        }
        return () => {
            observer.disconnect();
        };
    }, [localMessages]);

    return (
        <>
            {!messages && (
                <div className="flex flex-col gap-8 justify-center items-center text-center h-full opacity-35">
                    <div className="text-2xl md:text-4xl p-16 text-slate-200">
                        Please select conversation to see messages
                    </div>
                    <ChatBubbleLeftRightIcon className="w-32 h-32 inline-block" />
                </div>
            )}
            {messages && (
                <>
                    <ConversationHeader
                        selectedConversation={selectedConversation}
                    />
                    <div
                        ref={messagesCtrRef}
                        className="flex-1 overflow-y-auto p-5"
                    >
                        {/* Messages */}
                        {localMessages.length === 0 && (
                            <div className="flex justify-center items-center h-full">
                                <div className="text-lg text-slate-200">
                                    No messages found
                                </div>
                            </div>
                        )}
                        {localMessages.length > 0 && (
                            <div className="flex-1 flex flex-col">
                                <div
                                    ref={loadMoreIntersect}
                                    className="h-1 w-full"
                                ></div>
                                {localMessages.map((message) => (
                                    <MessageItem
                                        key={`message-${message.id}`} // Add a prefix to ensure uniqueness
                                        message={message}
                                        attachmentClick={onAttachmentClick}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                    <MessageInput conversation={selectedConversation} />
                </>
            )}
            {previewAttachment.attachments && (
                <AttachmentPreviewModal
                    attachments={previewAttachment.attachments}
                    index={previewAttachment.ind}
                    show={showAttachmentPreview}
                    onClose={() => setShowAttachmentPreview(false)}
                />
            )}
        </>
    );
  
}

Home.layout = (page) => {
    return (
        <AuthenticatedLayout user={page.props.auth.user}>
            <ChatLayout children={page} />
        </AuthenticatedLayout>
    );
};

export default Home;
