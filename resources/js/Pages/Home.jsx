// import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import AuthenticatedLayout from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';
import { Head } from '@inertiajs/react';
import { Children, useEffect, useState, useRef } from 'react';
import { ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline';
import ConversationHeader from '@/Components/App/ConversationHeader';
import MessageItem from '@/Components/App/Messageitem';
import MessageInput from '@/Components/App/MessageInput';

function Home({ selectedConversation = null, messages = null}) {
    const [localMessages, setLocalMessages] = useState([]);
    const messagesCtrRef = useRef(null);

    useEffect(()=>{
        if(!messagesCtrRef.current) return;
        setTimeout(() => {
            messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
        }, 10);
        messagesCtrRef.current.scrollTop = messagesCtrRef.current.scrollHeight;
    },[selectedConversation])

    useEffect(() => {
        setLocalMessages(messages ? messages.data.reverse() : []);
    }, [messages]);

    return <>
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
                            {localMessages.map((message) => (
                                <MessageItem 
                                    key={message.id}
                                    message={message}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <MessageInput conversation={selectedConversation} />
            </>
        )}
    </>;
        // <ChatLayout
            // header={
            //     <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
            //         Dashboard
            //     </h2>
            // }
        // >
            /* <Head title="Dashboard" /> */

            /* <div className="py-12">
                <div className="mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg dark:bg-gray-800">
                        <div className="p-6 text-gray-900 dark:text-gray-100">
                            You're logged in!
                        </div>
                    </div>
                </div>
            </div> */
            // Messages
        // </ChatLayout>
    
}

Home.layout = (page) =>{
    return(
    <AuthenticatedLayout user={page.props.auth.user}> 
        <ChatLayout children={page} />
    </AuthenticatedLayout>
    );
}

export default Home;
